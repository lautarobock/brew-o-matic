var model = require('../domain/model.js');
var mongoose = require('mongoose');
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

exports.getByGoogleId = function(req, res){
    console.log('getByGoogleId with id: ' + req.params.google_id);
    model.User.findOne({'google_id':req.params.google_id}).exec(function(err,user) {
        console.log(user);
        if (user) {
            var s = req.session;
            console.log("Set User_Id in session: " + user._id);
            //console.log(req);
            s.user_id = user._id;
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
    });
};