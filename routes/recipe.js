var model = require('../domain/model.js');

exports.findAll = function(req, res) {
    model.Recipe.find({owner:req.session.user_id}).exec(function(err,results) {
        console.log(results);
        res.send(results);
    });    
};

exports.get = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).exec(function(err,results) {
        console.log(results);
        res.send(results);
    });    
};

exports.remove= function(req, res) {
    model.Recipe.findByIdAndRemove(req.params.id,function(err,results) {
        console.log(results);
        res.send(results);
    });    
};


function generateId(name,user_id) {
    return name.replace(" ", "").replace("#","Nro") + user_id + (new Date()).getTime();
}

exports.save = function(req, res) {
    var recipe = new model.Recipe(req.body);
    recipe._id = generateId(req.body.NAME,req.session.user_id);
    recipe.owner = req.session.user_id;
    recipe.save(function(err,s){
        console.log(s);
        res.send(s);
    });
};