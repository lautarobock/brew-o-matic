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
    return name.replace(/ /g, "_").replace(/#/g,"_Nro_") + "-" + user_id + "-" + (new Date()).getTime();
}

exports.save = function(req, res) {
    console.log("request");
    console.log(req.body);
    
    
    function callback(err,s){
        console.log("err: ");
        console.log(err);
        console.log("respuesta");
        console.log(s);
        res.send(s);
    }
    
    if (!req.body._id) {
        var recipe = new model.Recipe(req.body);
        recipe._id = generateId(req.body.NAME,req.session.user_id);
        recipe.owner = req.session.user_id;
        recipe.save(callback);
    } else {
        var id = req.body._id;
        delete req.body._id;
        model.Recipe.findByIdAndUpdate(id,req.body,callback);
    }
    
};