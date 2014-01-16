var actions = require('./actions.js');
var model = require('../domain/model.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
/*
 * GET users listing.
 */

var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag','Recipe','User','Action','WaterReport'];

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
        save: function(req, res) {
            delete req.body._id;
            var id;
            if ( customIds.indexOf(service) != -1 ) {
                id = req.params.id;
            } else {
                id = new mongoose.Types.ObjectId(req.params.id);
            }
            model[service].findByIdAndUpdate(id,req.body,{upsert:true}).exec(function(err,results) {
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
    model.WaterReport.find({owner:req.session.user_id}).exec(function(err,results) {
        res.send(results);
    });  
};