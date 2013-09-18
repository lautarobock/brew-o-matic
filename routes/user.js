var model = require('../domain/model.js');
/*
 * GET users listing.
 */

exports.add = function(req,res) {
    var user = new model.User();
    user.google_id = req.body.google_id;
    user.name = req.body.name
    model.User.create(user,function(err,newuser) {
        console.log(newuser);
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