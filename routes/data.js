var actions = require('./actions.js');
var model = require('../domain/model.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
var push = require("./push");
/*
 * GET users listing.
 */

var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag','Recipe','User','Action','WaterReport','TempDevice','TempDeviceReport'];

//Aca van las que tiene customId
var customIds = ['Bottle','Recipe'];

function createRest(exports,service) {
    exports[service] = {
        findAll: function(req, res) {
            console.log(service + " .findAll");
            model[service].find().exec(function(err,results) {
                res.send(results);
            });
        },
        count: function(req, res) {
            console.log(service + " .count");
            model[service].count().exec(function(err,results) {
                res.send({count:results});
            });
        },
        save: function(req, res) {
            delete req.body._id;
            var id;
            if ( customIds.indexOf(service) != -1 ) {
                console.log("CUSTOM");
                id = req.params.id;
            } else {
                console.log("OBJECT");
                id = new mongoose.Types.ObjectId(req.params.id);
            }
            console.log('GUARDAR', id, JSON.stringify(req.body));
            model[service].findByIdAndUpdate(id,req.body,{upsert:true}).exec(function(err,results) {
                console.log('ERR',err);
                res.send(results);
            });
        },
        remove: function(req, res) {
            model[service].findByIdAndRemove(req.params.id,function(err,results) {
                res.send(results);
                actions.log(req.session.user_id, "REMOVE_" + service,JSON.stringify(results));
            });
        },
        findById: function(req, res) {
            model[service].findOne({_id:req.params.id},function(err,results) {
                res.send(results);
            });
        }
    };
}

for (s in services ) {
    var service = services[s];
    createRest(exports,service);
}

exports.Recipe.findAll = function(req, res) {
    model.Recipe
        .find({},{
            owner:1,
            NAME: 1,
            STYLE: 1,
            date: 1,
            modificationDate: 1,
            OG: 1,
            ABV: 1,
            CALCIBU: 1,
            isPublic: 1,
            BREWER: 1
        })
        .populate({path:'owner',select:'name'}).exec(function(err,results) {
            res.send(results);
    });
};

exports.Recipe.save = function(req, res) {
    delete req.body._id;
    var id = req.params.id;
    req.body.owner = req.body.owner._id;
    model.Recipe.findByIdAndUpdate(id,req.body,{upsert:true}).populate('owner').exec(function(err,results) {
        res.send(results);
    });
};

exports.WaterReport.findAll = function(req, res) {
    model.WaterReport
        .find({'$or':[{isPublic:true},{owner:req.session.user_id}]})
        .populate({path:'owner',select:'name'})
        .exec(function(err,results) {
            res.send(results);
    });
};

exports.User.findAll = function(req, res) {
    var filter = null;
    if ( req.query.name ) {
        filter = {name: {"$regex":  req.query.name,"$options": 'i'}};
    }
    model.User.find(filter).exec(function(err,results) {
        res.send(results);
    });
};

exports.TempDeviceReport.findAll = function(req, res) {
    var filter = null;
    if ( req.query.recipe_id ) {
        filter = {recipe_id: req.query.recipe_id};
    }
    model.TempDeviceReport.find(filter).exec(function(err,results) {
        res.send(results);
    });
}

exports.TempDeviceReport.save = function(req, res) {
    var temp = req.body;
    // console.log("ACA!!!!",temp);
    delete temp._id;

    if ( !temp.timestamp ) {
        temp.timestamp = new Date().getTime();
    }

    var id = new mongoose.Types.ObjectId(req.params.id);

    //Busco el dispositivo correspondiente y obtengo el ID de la receta que corresponde.
    model.TempDevice.find({code:temp.code}).exec(function(err, device) {

        //Solo guardo si existe el dispositivo y si el mismo esta vinculado a una receta
        if ( !err && device && device.length > 0 && device[0].recipe_id) {
            temp.recipe_id = device[0].recipe_id;

            model.TempDeviceReport.findByIdAndUpdate(id,temp,{upsert:true}).exec(function(err,results) {
                // console.log('err', err);
                // console.log('results', results);
                if ( temp.recipe_id ) {
                    push.emit("TEMP_DEVICE_REPORT_" + temp.recipe_id,results);
                }
                res.send(results);

                //Elimino posibles duplicados de valores
                model.TempDeviceReport.find({
                    recipe_id: device[0].recipe_id
                }).sort("timestamp").exec(function (err, duplicated) {
                    if ( duplicated.length > 2 ) {

                        var base = duplicated[duplicated.length-1];
                        var toRemove = null;

                        var finish = false;
                        var i = duplicated.length-2;
                        while ( !finish && i>=0 ) {
                            var actual = duplicated[i--];
                            if (
                                actual.source == base.source &&
                                actual.temperature == base.temperature &&
                                actual.temperatureExt == base.temperatureExt &&
                                actual.temperatureMax == base.temperatureMax &&
                                actual.temperatureMin == base.temperatureMin &&
                                actual.coldStatus == base.coldStatus &&
                                actual.heatStatus == base.heatStatus ) {
                                // actual.remove();
                                if ( toRemove ) toRemove.remove();
                                toRemove = actual;
                                console.log("ELIMIMAR");
                            } else {
                                console.log("FINiSH",actual,base);
                                finish = true;
                            }
                        }

                    }
                });
            });

        } else {
            res.send(500);
        }


    });



}
