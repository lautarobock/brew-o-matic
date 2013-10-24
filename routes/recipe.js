var actions = require('./actions.js');
var notifications = require('../util/notifications.js');
var model = require('../domain/model.js');
var Arrays = require('../public/js/util/util.js').Arrays;

exports.findPublic = function (req, res) {
    //where('owner').ne(req.session.user_id).
    model.Recipe.find({isPublic:true}).populate('owner').sort('-publishDate').limit(req.query.limit).exec(function(err,results) {
        res.send(results);
    });
};

exports.findByUser = function(req, res) {
    model.Recipe.find({owner:req.params.id,isPublic:true}).sort('-publishDate').exec(function(err,results) {
        res.send(results);
    });        
};

exports.findAll = function(req, res) {
    model.Recipe.find({owner:req.session.user_id}).sort('-date').exec(function(err,results) {
        res.send(results);
    });    
};

exports.get = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).populate('owner').exec(function(err,results) {
        res.send(results);
    });    
};

exports.remove= function(req, res) {
    model.Recipe.findByIdAndRemove(req.params.id,function(err,results) {
        res.send(results);
        actions.log(req.session.user_id, "REMOVE_RECIPE","NAME: '"+results.NAME+"'. recipe_id: "+results._id);
    });    
};


function generateId(name,user_id) {
    return encodeURIComponent(name.replace(/ /g, "_")
                .replace(/#/g,"_Nro_")
                .replace(/%/g,"_Per_")
                .replace(/,/g,"_")
                + "-" + user_id + "-" + (new Date()).getTime());
}

exports.addComment = function(req,res) {
    model.Recipe.findOne({_id:req.body.recipe_id}).exec(function(err,recipe) {
        recipe.comments.push({
            _id: req.session.user_id + "_" + new Date().getTime(),
            user_id: req.session.user_id,
            name: req.session.user_name,
            text: req.body.text,
            date: new Date()
        });
        recipe.save();
        res.send(recipe.comments);
        
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
    });
};

exports.deleteComment = function(req,res) {
    model.Recipe.findOne({_id:req.body.recipe_id}).exec(function(err,recipe) {
        Arrays.remove(recipe.comments,req.body.comment,function(comment,iter){
            return comment._id == iter._id ? 0 : -1;
        });
        recipe.save();
        res.send(recipe.comments);
        actions.log(req.session.user_id, "REMOVE_COMMENT","NAME: '"+recipe.NAME+"'. recipe_id: "+recipe._id);
    });
};

exports.save = function(req, res) {
    
    function callback(err,s){
        if (err) {
            console.log("error", err);
        }
//        console.log("response bottling",s.bottling);
        notifications.notifyUpdateFavorite(s);
        res.send(s);
    }
    if (!req.body._id) {
        var recipe = new model.Recipe(req.body);
        var id = generateId(req.body.NAME,req.session.user_id);
        recipe._id = id;
        recipe.owner = req.session.user_id;
        if ( req.body.isPublic ) {
            recipe.publishDate = new Date();
        }
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
                original.save();
                notifications.notifyRecipeCloned(original.owner,recipe,req.session.user_id,req.session.user_name,original.NAME);
            });

        }
        actions.log(req.session.user_id, "ADD_RECIPE","NAME: '"+req.body.NAME+"'. recipe_id: "+id);
        if ( req.body.isPublic ) {
            notifications.notifyOnPublish(req.body.NAME,id,req.session.user_name,req.session.user_id);
        }
    } else {
        console.log("FERMENTABLES",req.body.FERMENTABLES);
        console.log("bottling",req.body.bottling);
        var id = req.body._id;
        delete req.body._id;
        req.body.owner = req.body.owner._id;
        req.body.modificationDate = new Date();
        //console.log("UPDATE POST", req.body);
//        model.Recipe.findByIdAndUpdate(id,req.body).populate('owner').exec(callback);
        model.Recipe.findById(id).exec(function (err,old) {
            if ( !old.isPublic && req.body.isPublic ) {
                notifications.notifyOnPublish(req.body.NAME,id,req.session.user_name,req.session.user_id);
                req.body.publishDate = new Date();
            }
            model.Recipe.findByIdAndUpdate(id,req.body).populate('owner').exec(callback);
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
    //,owner:{$ne:req.session.user_id}
    model.Recipe.count({isPublic:true},function(err, publicCount) {
        model.Recipe.count({owner:req.session.user_id},function(err,ownCount) {
            res.send({
                publics: publicCount,
                owns: ownCount
            });
        });
    });
};