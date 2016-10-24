var actions = require('./actions.js');
var notifications = require('../util/notifications.js');
var model = require('../domain/model.js');
var observer = require("./observer");
var Arrays = require('../public/js/util/util.js').Arrays;
var stable = require('stable');

function processFilter(filter) {
    if ( filter && filter.searchCriteria ) {
        filter.$or = [
            {NAME: {"$regex": filter.searchCriteria,"$options": 'i'}},
            {code: {"$regex": filter.searchCriteria,"$options": 'i'}},
            {BREWER: {"$regex": filter.searchCriteria,"$options": 'i'}},
            {'STYLE.NAME': {"$regex": filter.searchCriteria,"$options": 'i'}},
            {tags: filter.searchCriteria}

        ];
        delete filter.searchCriteria;
    }
    return filter;
}

exports.findCollaborated = function (req, res) {
    model.Recipe.find({collaborators: { $in : [req.session.user_id] } }).populate('owner').limit(req.query.limit).exec(function(err,results) {
        res.send(results);
    });
};

// exports.findPublic = function (req, res) {
//     //where('owner').ne(req.session.user_id).
//     model.Recipe.find({isPublic:true}).populate('owner').sort('-publishDate').limit(req.query.limit).skip(req.query.skip).exec(function(err,results) {
//         res.send(results);
//     });
// };

exports.findPublic = function(req, res) {
    var filter = processFilter(req.query.filter);

    filter = filter||{};
    filter.isPublic = true;

    console.log("filter",JSON.stringify(filter));
    model.Recipe.find(filter,'NAME tags STYLE OG ABV CALCCOLOUR CALCIBU BATCH_SIZE BREWER owner publishDate starredByCount clonedByCount')
        .limit(req.query.limit)
        .skip(req.query.skip)
        .sort(req.query.sort)
        // .sort('-publishDate')
        .populate('owner','name _id')
        .exec(function(err,results) {
            res.send(results);
    });
};

exports.countPublic = function(req, res) {
    var filter = processFilter(req.query.filter);

    filter = filter||{};
    filter.isPublic = true;

    console.log("filter(count)", JSON.stringify(filter));
    model.Recipe.count(filter)
        .exec(function(err,results) {
            res.send({count:results});
    });
};

// exports.countPublic = function (req, res) {
//     //where('owner').ne(req.session.user_id).
//     model.Recipe.count({isPublic:true}).exec(function(err,results) {
//         res.send({count:results});
//     });
// };


exports.findByUser = function(req, res) {
    model.Recipe.find({owner:req.params.id,isPublic:true}).sort('-publishDate').exec(function(err,results) {
        res.send(results);
    });
};

// exports.findAll = function(req, res) {
//     model.Recipe.find({owner:req.session.user_id}).sort('-date').exec(function(err,results) {
//         res.send(results);
//     });
// };
exports.findAll = function(req, res) {
    var filter = processFilter(req.query.filter);

    filter = filter||{};
    filter.owner = req.session.user_id;

    console.log("filter",JSON.stringify(filter));
    model.Recipe.find(filter,'NAME code tags STYLE OG ABV CALCCOLOUR CALCIBU BATCH_SIZE BREWER fermentation owner publishDate state isPublic')
        .limit(req.query.limit)
        .skip(req.query.skip)
        .sort(req.query.sort)
        .populate('owner','name _id')
        .exec(function(err,results) {
            res.send(results);
    });
};

exports.exportRecipe = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).exec(function(err,results) {
        function userCompare(a, b) {
            return -(a.TIME - b.TIME);
        }
        if ( results && results.HOPS && results.HOPS.HOP ) {
            stable.inplace(results.HOPS.HOP, userCompare);
        }
        
        var csv = '';
        function add(value, last,isDate) {
            if ( value === undefined ) {
                csv += (last?'\n':';');
                return;
            }
            if ( isDate ) {
                value = new Date(value).toISOString().replace(/T/, ' ').replace(/\..+/, '');
            }
            if ( typeof value === 'string') {
                value = '\"' + value + '\"';
            }
            if ( typeof value === 'number') {
                value = value.toString().replace('.',',');
            }
            csv += value + (last?'\n':';');
        }
        
        add('Nombre');add(results.NAME, true)
        add('Batch');add(results.BATCH_SIZE);
        add('OG');add(results.OG);
        add('FG');add(results.FG);
        add('IBU');add(results.CALCIBU);
        // add('Eficiencia');add(results.EFFICIENCY);
        add('ABV');add(results.ABV, true);

        add('',true);
        add('Granos');add('Kg');add('%',true);
        for ( var i=0; i<results.FERMENTABLES.FERMENTABLE.length; i++ ) {
            var F = results.FERMENTABLES.FERMENTABLE[i];
            add(F.NAME);add(F.AMOUNT);add(F.PERCENTAGE,true);
        }

        add('',true);
        add('Lupulos');add('Gramos');add('Tiempo',true);
        for ( var i=0; i<results.HOPS.HOP.length; i++ ) {
            var L = results.HOPS.HOP[i];
            add(L.NAME);add(L.AMOUNT*1000);add(L.TIME,true);
        }
        
        add('', true);
        add('Levadura');add('Gramos',true);
        add(results.YEASTS.YEAST[0].NAME);add(results.YEASTS.YEAST[0].AMOUNT,true);

        add('',true);
        add('Sales');add('Gramos',true);
        if ( results.water.CaCO3 ) {add('CaCO3');add(results.water.CaCO3, true);} 
        if ( results.water.NaHCO3 ) {add('NaHCO3');add(results.water.NaHCO3, true);}
        if ( results.water.CaSO4 ) {add('CaSO4');add(results.water.CaSO4, true);}
        if ( results.water.CaCl2 ) {add('CaCl2');add(results.water.CaCl2, true);}
        if ( results.water.MgSO4 ) {add('MgSO4');add(results.water.MgSO4, true);}
        if ( results.water.NaCl ) {add('NaCl');add(results.water.NaCl, true);}
        
        add('',true);
        add('Macerado',true);
        add('Cantidad de agua');add(results.StrikeWater);
        add('Temperatura'); add(results.mashTemp);
        
        // var r = results;
        // add(r.NAME);
        // add(r.code);
        // add(r.tags);
        // add(r.STYLE.NAME);
        // add(r.OG);
        // add(r.ABV);
        // add(r.CALCCOLOUR);
        // add(r.CALCIBU);
        // add(r.BATCH_SIZE);
        // add(r.BREWER);
        // add(r.fermentation.estimateDate,null,true);
        // add(r.publishDate,null,true);
        // add(r.state);
        // if ( r.YEASTS.YEAST.length > 0 ) {
        //     add(r.YEASTS.YEAST[0].NAME);
        //     add(r.YEASTS.YEAST[0].ATTENUATION);
        //     add(r.YEASTS.YEAST[0].AMOUNT);
        //     add(r.YEASTS.YEAST[0].density);
        //     add(r.YEASTS.YEAST[0].packageSize);
        // } else {
        //     add("");add("");add("");add("");add("");
        // }
        // add(r.isPublic,true);
        res.setHeader('Content-disposition', 'attachment; filename=' + results.NAME + '.csv');
        res.set('Content-Type', 'application/octet-stream');
        res.send(csv);
    });
};

exports.exportAll = function(req, res) {

    model.Recipe.find(
        {owner: req.session.user_id},
        'NAME code tags STYLE OG ABV CALCCOLOUR CALCIBU BATCH_SIZE BREWER fermentation.estimateDate YEASTS publishDate state isPublic'
    )
    .exec(function(err,results) {
        var csv = 'NAME;code;tags;STYLE;OG;ABV;CALCCOLOUR;CALCIBU;BATCH_SIZE;BREWER;estimateDate;publishDate;state;YEAST_NAME;YEAST_ATTENUATION;YEAST_AMOUNT;YEAST_DENSITY;YEAST_PACKAGE_SIZE;isPublic\n';
        function add(value, last,isDate) {
            if ( value === undefined ) {
                csv += (last?'\n':';');
                return;
            }
            if ( isDate ) {
                value = new Date(value).toISOString().replace(/T/, ' ').replace(/\..+/, '');
            }
            if ( typeof value === 'string') {
                value = '\"' + value + '\"';
            }
            if ( typeof value === 'number') {
                value = value.toString().replace('.',',');
            }
            csv += value + (last?'\n':';');
        }
        for ( var i=0; i<results.length; i++ ) {
            var r = results[i];
            add(r.NAME);
            add(r.code);
            add(r.tags);
            add(r.STYLE.NAME);
            add(r.OG);
            add(r.ABV);
            add(r.CALCCOLOUR);
            add(r.CALCIBU);
            add(r.BATCH_SIZE);
            add(r.BREWER);
            add(r.fermentation.estimateDate,null,true);
            add(r.publishDate,null,true);
            add(r.state);
            if ( r.YEASTS.YEAST.length > 0 ) {
                add(r.YEASTS.YEAST[0].NAME);
                add(r.YEASTS.YEAST[0].ATTENUATION);
                add(r.YEASTS.YEAST[0].AMOUNT);
                add(r.YEASTS.YEAST[0].density);
                add(r.YEASTS.YEAST[0].packageSize);
            } else {
                add("");add("");add("");add("");add("");
            }
            add(r.isPublic,true);
        }
        res.setHeader('Content-disposition', 'attachment; filename=misrecetas.csv');
        res.set('Content-Type', 'application/octet-stream');
        res.send(csv);
    });
};

exports.countAll = function(req, res) {
    var filter = processFilter(req.query.filter);

    filter = filter||{};
    filter.owner = req.session.user_id;

    console.log("filter(count)", JSON.stringify(filter));
    model.Recipe.count(filter)
        .exec(function(err,results) {
            res.send({count:results});
    });
};

exports.myTags = function(req, res) {
    model.Recipe.aggregate(
        [
            {$match:{tags:{$exists:true},owner:req.session.user_id }},
            {$unwind:'$tags'},
            {$group:{_id:'$tags',total:{$sum:1}}},
            {$sort:{total:-1}}
        ],
        function(err, result) {
            if ( err ) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
};

exports.publicStyles = function(req, res) {
    model.Recipe.aggregate(
        [
            {
                $match: {
                    'STYLE.NAME': {
                        $exists: true,
                        $ne: ''
                    },
                    'isPublic': true
                }
            },
            {
                $group:{
                    _id: '$STYLE.NAME',
                    total: { $sum:1 }
                }
            },
            {
                $sort: { total:-1 }
            }
        ],
        function(err, result) {
            if ( err ) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        }
    );
};

exports.get = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).populate('collaborators').populate('owner').populate('cloneFrom').exec(function(err,results) {
        function userCompare(a, b) {
            return -(a.TIME - b.TIME);
        }
        if ( results && results.HOPS && results.HOPS.HOP ) {
            stable.inplace(results.HOPS.HOP, userCompare);
        }

        res.send(results);
    });
};

exports.getComments = function(req,res) {
    model.Recipe.findOne({_id:req.params.id}).exec(function(err,results) {
        res.send(results.comments);
    });
};

exports.remove= function(req, res) {
    model.Recipe.findByIdAndRemove(req.params.id,function(err,results) {
        res.send(results);
        actions.log(req.session.user_id, "REMOVE_RECIPE","NAME: '"+results.NAME+"'. recipe_id: "+results._id);
    });
};


function generateId(name,user_id) {
    return name.replace(/[^a-z0-9]/ig, '') + "-" + user_id + "-" + (new Date()).getTime();
}

exports.addComment = function(req,res) {
    model.Recipe.findOne({_id:req.body.recipe_id}).exec(function(err,recipe) {
        var newComment = {
            _id: req.session.user_id + "_" + new Date().getTime(),
            user_id: req.session.user_id,
            name: req.session.user_name,
            text: req.body.text,
            date: new Date()
        };
        recipe.comments.push(newComment);
        recipe.save(function() {
            res.send(recipe.comments);
            require("./push").emit("RECIPE_COMMENT_ADD_" + recipe._id,newComment);
        });


        //LOG action
        actions.log(req.session.user_id, "ADD_COMMENT","NAME: '"+recipe.NAME+"'. recipe_id: "+recipe._id);

        //Add Notification
        notifications.notifyCommentOnRecipe(
            recipe.owner,
            req.session.user_id,
            req.session.user_name ,
            recipe._id,
            recipe.NAME);
        notifications.notifyCommentOnFavorite(
            recipe,
            req.session.user_id,
            req.session.user_name);

        // observer.change("RECIPE_COMMENT_ADD_" + recipe._id);
    });
};

exports.deleteComment = function(req,res) {
    model.Recipe.findOne({_id:req.body.recipe_id}).exec(function(err,recipe) {
        Arrays.remove(recipe.comments,req.body.comment,function(comment,iter){
            return comment._id == iter._id ? 0 : -1;
        });
        recipe.save( function() {
            res.send(recipe.comments);
            require("./push").emit("RECIPE_COMMENT_REMOVE_" + recipe._id,req.body.comment);
        });

        actions.log(req.session.user_id, "REMOVE_COMMENT","NAME: '"+recipe.NAME+"'. recipe_id: "+recipe._id);
    });
};

exports.updateState = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).populate('owner').exec(function(err,recipe) {
        recipe.state = req.query.state;
        recipe.save(function(err) {
            if ( err ) {
                res.send(500,{error: 'Error al cambiar estado la receta'});
            } else {
                res.send(recipe);
            }
        });
    });
};

exports.save = function(req, res) {

    function callback(err,s){
        if (err) {
            console.log("error", err);
        }
        notifications.notifyUpdateFavorite(s);
        notifications.notifyUpdateCollaborators(s,req.session.user_id,req.session.user_name);

        function userCompare(a, b) {
            var aTime = a.TIME, bTime = b.TIME;
            if ( a.USE === 'Aroma' ) aTime = -aTime;
            if ( b.USE === 'Aroma' ) bTime = -bTime;
            return -(a.TIME - b.TIME);
        }
        stable.inplace(s.HOPS.HOP, userCompare);

        res.send(s);

        //Update tags
        for (var i=0; i<s.tags.length; i++) {
            var tag = new model.Tag({_id:s.tags[i]});
            tag.save();
        }
    }

    if (!req.body._id) {
        var recipe = new model.Recipe(req.body);
        var id = generateId(req.body.NAME,req.session.user_id);
        recipe._id = id;
        recipe.owner = req.session.user_id;
        if ( req.body.isPublic ) {
            recipe.publishDate = new Date();
        }
        recipe.version.push({
            number: 1,
            user_id: req.session.user_id,
            timeStamp: new Date(),
            user_name: req.session.user_name
        });
        recipe.save(callback);

        /**
         * Si la estoy clonando de otra, debo hacerle update para
         * poner que fue clonada por mi.
         */
        if (recipe.cloneFrom ) {
            model.Recipe.findOne({_id:recipe.cloneFrom}).exec(function(err,original){
                original.clonedBy.push({
                    _id: req.session.user_id,
                    name: req.session.user_name,
                    recipe_id: id
                });
                original.clonedByCount = original.clonedBy.length;
                original.save();
                notifications.notifyRecipeCloned(original.owner,recipe,req.session.user_id,req.session.user_name,original.NAME);
            });

        }
        actions.log(req.session.user_id, "ADD_RECIPE","NAME: '"+req.body.NAME+"'. recipe_id: "+id);
        if ( req.body.isPublic ) {
            notifications.notifyOnPublish(req.body.NAME,id,req.session.user_name,req.session.user_id);
        }
        notifications.notifyNewCollaborators(recipe,recipe.collaborators);
    } else {


        var id = req.body._id;
        delete req.body._id;
        req.body.owner = req.body.owner._id;
        for ( var i=0; i<req.body.collaborators.length; i++ ) {
            req.body.collaborators[i] = req.body.collaborators[i]._id;
        }
        if (req.body.cloneFrom) {
            req.body.cloneFrom = req.body.cloneFrom._id;
        }
        req.body.modificationDate = new Date();
        //console.log("UPDATE POST", req.body);
//        model.Recipe.findByIdAndUpdate(id,req.body).populate('owner').exec(callback);
        model.Recipe.findById(id).exec(function (err,old) {
            //Verifico los permisos de la receta contra la version guardada de la misma
            if ( old.owner != req.session.user_id ) {
                if ( old.collaborators.indexOf(req.session.user_id) == -1 ) {
                    res.send(500,{error: "No tiene permisos para modificar esta receta"});
                    return;
                }
            }

            var oldNumber = 0;
            var actualNumber = 0;
            if ( old.version.length != 0 ) {
                oldNumber = old.version[old.version.length-1].number;

            }
            if ( req.body.version.length != 0 ) {
                actualNumber = req.body.version[req.body.version.length-1].number;
            }


            if ( oldNumber != actualNumber ) {
                res.send(501,{
                    error: "La receta fue actualizada por " + old.version[old.version.length-1].user_name + ". debe actualizar (F5) antes de proseguir, perdera los cambios hechos.",
                    recipe: old
                });
                return;
            }

            req.body.version.push({
                number: oldNumber+1,
                user_id: req.session.user_id,
                timeStamp: new Date(),
                user_name: req.session.user_name
            });

            //The comments is not update in this operation, only add/remove in other operation. Justo take del commments of previous version.

            req.body.comments = old.comments;

            if ( !old.isPublic && req.body.isPublic ) {
                notifications.notifyOnPublish(req.body.NAME,id,req.session.user_name,req.session.user_id);
                req.body.publishDate = new Date();
            }

            //Compruebo los colaboradores nuevos
            var newCollaborators = [];
            for( var i=0; i<req.body.collaborators.length; i++ ) {
                var col_id = req.body.collaborators[i];
                if ( old.collaborators.indexOf(col_id) == -1 ) {
                    newCollaborators.push(col_id);
                }
            }
            notifications.notifyNewCollaborators(old,newCollaborators);


            model.Recipe.findByIdAndUpdate(id,req.body).populate('owner').populate('collaborators').populate('cloneFrom').exec(callback);
        });

        actions.log(req.session.user_id, "UPDATE_RECIPE","NAME: '"+req.body.NAME+"'. recipe_id: "+id);
    }

};

exports.publish = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).populate('owner').exec(function(err,recipe) {
        recipe.isPublic = req.query.isPublic;
        if (recipe.isPublic) {
            recipe.publishDate = new Date();
        }
        recipe.save(function(err) {
            if ( err ) {
                res.send(500,{error: 'Error al publicar la receta'});
            } else {
                notifications.notifyOnPublish(recipe.NAME,recipe._id,req.session.user_name,req.session.user_id);
                res.send(recipe);
            }
        });
    });
};


exports.stats = function(req, res) {

    var values = {
        publics: null,
        owns: null,
        collaborations: null
    };

    function complete() {
        if ( values.publics != null && values.owns != null && values.collaborations != null ) {
            res.send(values);
        }
    }

    model.Recipe.count({isPublic:true},function(err, publicCount) {
        values.publics = publicCount;
        complete();
    });

    model.Recipe.count({owner:req.session.user_id},function(err,ownCount) {
        values.owns = ownCount;
        complete();
    });

    model.Recipe.count({collaborators: { $in : [req.session.user_id] } },function(err,collabCount) {
        values.collaborations = collabCount;
        complete();
    });
};

exports.fireFermentationNotification = function() {
    model.Recipe.find({"fermentation.alertTime":{$exists:true}}).exec(function(err, recipes) {
        console.log("POSIBLES", recipes.length);
        var nowTime = new Date().getTime();

        for( var i=0; i<recipes.length; i++ ) {
            var recipe = recipes[i];

            //Solo si tiene fecha de inicio estimada
            if ( recipe.fermentation.estimateDate ) {
                console.log("estimateDate", recipe.fermentation.estimateDate);
                var timeFromEstimate = recipe.fermentation.estimateDate.getTime();

                var previousStage = null;
                for ( var j=0; j<recipe.fermentation.stages.length; j++ ) {
                    var stage = recipe.fermentation.stages[j];

                    if ( !stage.alertDone && timeFromEstimate<=nowTime ) {
                        console.log("ESTA VA:",recipe._id,stage);

                        stage.alertDone = true;

                        recipe.save();

                        notifications.notifyChangeFermentationStage(
                            recipe.owner,
                            recipe._id,
                            recipe.NAME,
                            previousStage,
                            stage);
                    }

                    if ( stage.durationMode && stage.duration ) {
                        if ( stage.durationMode == 'Horas' ) {
                            timeFromEstimate += stage.duration * 1000*60*60;
                        }  else {
                            timeFromEstimate += stage.duration * 1000*60*60*24;
                        }
                    }

                    previousStage = stage;
                }
            }
        }
    });
}
