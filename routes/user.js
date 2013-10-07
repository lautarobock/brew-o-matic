var model = require('../domain/model.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
/*
 * GET users listing.
 */

exports.add = function(req,res) {
    var user = new model.User();
    user.google_id = req.body.google_id;
    user.name = req.body.name
    model.User.create(user,function(err,newuser) {
        res.send(newuser);
    });
    
};

exports.findStats = function(req,res) {
    var stats = {};
    model.Recipe
        .find({
            $and:[
                {owner:req.session.user_id}
                //,{comments:{$ne:[]}}
                //,{comments:{$ne:null}}
            ]})
        //.populate('cloneFrom')
        .sort('-date')
        .exec(function(err,results) {
        
        //stats.commented = results;
        stats.commented = [];
        stats.cloned = [];
        stats.clones = [];
        stats.starredBy = [];
        
        for (var i=0; i<results.length; i++ ) {
            var recipe = results[i];
            if ( recipe.comments && recipe.comments.length > 0 ) {
                stats.commented.push(recipe);
            }
            if ( recipe.clonedBy && recipe.clonedBy.length > 0 ) {
                stats.cloned.push(recipe);
            }
            if ( recipe.cloneFrom ) {
                stats.clones.push(recipe);
            }
            if ( recipe.starredBy && recipe.starredBy.length != 0) {
                stats.starredBy.push(recipe);
            }
        }
        
        
        model.Recipe
            .find( { $and: [
                    { owner: {$ne:req.session.user_id} },
                    { comments: { $elemMatch:
                    { user_id: new mongoose.Types.ObjectId(req.session.user_id)  }
                }}
                ]})
            .populate('owner')
            .sort('-date')
            .exec(function(err,results) {
            
            stats.myCommented = results;
                
            res.send(stats);
            
        }); 
    });    
};

exports.getByGoogleId = function(req, res){
    console.log('getByGoogleId with id: ' + req.params.google_id);
    model.User.findOne({'google_id':req.params.google_id}).exec(function(err,user) {
        console.log(user);
        if (user) {
            var s = req.session;
            console.log("Set User_Id in session: " + user._id);
            //console.log(req);
            s.user_id = user._id;
            s.user_name = user.name;
        }
        res.send(user);
    });   
};

exports.addToFavorites = function(req,res) {
    model.User
            .findOne({_id: new mongoose.Types.ObjectId(req.session.user_id)})
            .exec(function(err,user) {
            user.favorites.push(req.body._id);

            //update recipe too (async)
            model.Recipe.findOne({_id:req.body._id},function(err,recipe) {
                recipe.starredBy.push({
                    _id:user._id,
                    name: user.name
                });
                recipe.save();
            });
            
            user.save(function(err,user) {
                res.send(user);
            });
    });
};

exports.removeFromFavorites = function(req,res) {
    model.User
            .findOne({_id: new mongoose.Types.ObjectId(req.session.user_id)})
            .exec(function(err,user) {
        
        var index = user.favorites.indexOf(req.body._id);
        if ( index > -1 ) {
            user.favorites.splice(index,1);
        }
        user.save(function(err,user) {
            res.send(user);
        });
        
        //update recipe too (async)
        model.Recipe.findOne({_id:req.body._id},function(err,recipe) {
            Arrays.remove(recipe.starredBy,user._id,function(userid,object){
                if ( object._id.toString() == userid.toString()) {
                    return 0;
                } else {
                    return -1;
                }
            });
            recipe.save();
        });
    });
};