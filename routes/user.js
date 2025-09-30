var notifications = require('../util/notifications.js');
var model = require('../domain/model.js');
var actions = require('./actions.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
/*
 * GET users listing.
 */
function code() {
    return getRandomInt(100000,999999).toString();
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function buildNewUser(google_id, name) {
    var user = new model.User();
    user.google_id = google_id;
    user.name = name;
    user.singInDate = new Date();
    user.lastLogin = new Date();
    user.accessCode = code();
    user.settings = {
        "defaultValues":{
            "BATCH_SIZE":20,
            "EFFICIENCY":70,
            "BREWER":name,
            "BOIL_TIME":90,
            "GrainTemp":25,
            "WatertoGrainRatio":3,
            "mashTemp":66,
            "lossMashTemp":0,
            "SpargeTempDesired":75,
            "SpargeDeadSpace":0,
            "GrainAbsorbtion":0.9,
            "PercentEvap":10,
            "TrubChillerLosses":0,
            "isPublic": false,
            "pitchRate": 0.75
        }
    };
    return user;
}
exports.add = function(req,res) {
    var name = req.body.name;
    var google_id = req.body.google_id;

    var user = buildNewUser(google_id, name);

    model.User.create(user,function(err,newuser) {
        res.send(newuser);
    });

};

exports.updateSettings = function(req,res) {
    console.log("update settings", req.session.user_id);
    model.User.findOne({_id: req.session.user_id},
                       function(err,user) {
        if ( err ) {
            console.log("err",err);
            res.send(500,{error:err});
        } else {
            user.settings = req.body.settings;
            user.name = req.body.name;

            user.save(function(err, resp) {
                console.log("err",err);
                console.log(resp);
                res.send(user);
                actions.log(req.session.user_id, "UPDATE_SETTINGS","User: " + user.name);
            });

        }
    });
};

exports.updatePassword = function(req,res) {
    model.User.findOne({_id: req.session.user_id}, function(err, user) {
        user.password = req.body.password;
        user.save(function(err,resp) {
            res.send(resp);
        });
    });
};

exports.get = function(req, res) {
    model.User.findOne({_id: req.params.id},
                       function(err,user) {
        if ( err ) {
            res.send(500,{error:err});
        } else {
            delete user.google_id;
            delete user.singInDate;
            delete user.lastLogin;
            delete user.settings;
            res.send(user);
        }
    });
};

exports.getByGoogleId = function(req, res){
    //console.log('getByGoogleId with id: ' + req.params.google_id);
    model.User.findOne({'google_id':req.params.google_id}).exec(function(err,user) {
        //console.log(user);
        if (user) {
            var s = req.session;
            console.log("Set User_Id in session: " + user._id);
            s.user_id = user._id;
            s.user_name = user.name;
            s.user_isAdmin = user.isAdmin;

            user.lastLogin = new Date();
            user.singInDate = user.singInDate || user.lastLogin;
            user.accessCode = user.accessCode || code();
            user.email = user.email || req.query.email;

            user.save();
            res.send(user);
            actions.log(req.session.user_id, "LOG_IN","User: " + req.query.name + " Email: " + req.query.email);
        } else {
            var newUser = buildNewUser(req.params.google_id,req.query.name);
            newUser.email = newUser.email || req.query.email;
            model.User.create(newUser,function(err,newuser) {
                res.send(newuser);
            });
            actions.log(req.session.user_id, "SING_IN","User: " + req.query.name + " Email: " + req.query.email);
        }

    });
};

exports.loginPassword = function(req, res) {

    model.User.findOne({ email: req.body.email, password: req.body.password }).exec(function(err, user) {
        if (user) {
            var s = req.session;
            console.log("Set User_Id in session: " + user._id);
            s.user_id = user._id;
            s.user_name = user.name;
            s.user_isAdmin = user.isAdmin;

            user.lastLogin = new Date();
            user.singInDate = user.singInDate || user.lastLogin;
            user.accessCode = user.accessCode || code();
            user.email = user.email || req.query.email;

            user.save();
            res.send(user);
            actions.log(req.session.user_id, "LOG_IN","User: " + req.query.name + " Email: " + req.query.email);
        } else {
            // return 404
            res.status(404).send({ error: 'User not found or invalid credentials' });
        }
    });
}

exports.getByAccessCode = function(req, res, next) {
    model.User.findOne({'accessCode':req.params.accessCode}, 'name accessCode google_id')
        .exec(function(err, user) { 
            if ( err ) {
                res.status(404).send()
            } else {
                res.send(user);
            }
        });
}

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
                recipe.starredByCount = recipe.starredBy.length;
                recipe.save();
                actions.log(req.session.user_id, "ADD_FAVORITES","El usuario '"+user.name+"' agrego la receta '"+recipe.NAME+"' de '"+recipe.BREWER+"'. recipe_id: "+req.body._id);
                notifications.notifyAddFavorite(recipe.owner,recipe,req.session.user_id,req.session.user_name);
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
            recipe.starredByCount = recipe.starredBy.length;
            recipe.save();
            actions.log(req.session.user_id, "REMOVE_FAVORITES","El usuario '"+user.name+"' removio la receta '"+recipe.NAME+"' de '"+recipe.BREWER+"'. recipe_id: "+req.body._id);
        });

    });
};
