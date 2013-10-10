var model = require('../domain/model.js');
var Arrays = require('../public/js/util/util.js').Arrays;

exports.findPublic = function (req, res) {
    model.Recipe.find({isPublic:true}).where('owner').populate('owner').ne(req.session.user_id).sort('-date').limit(req.query.limit).exec(function(err,results) {
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
    });    
};


function generateId(name,user_id) {
    return name.replace(/ /g, "_").replace(/#/g,"_Nro_") + "-" + user_id + "-" + (new Date()).getTime();
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
    });
};

exports.deleteComment = function(req,res) {
    model.Recipe.findOne({_id:req.body.recipe_id}).exec(function(err,recipe) {
        Arrays.remove(recipe.comments,req.body.comment,function(comment,iter){
            return comment._id == iter._id ? 0 : -1;
        });
        recipe.save();
        res.send(recipe.comments);
    });
};

exports.save = function(req, res) {
    
    function callback(err,s){
        if (err) {
            console.log("error", err);
        }
        console.log("response bottling",s.bottling);
        res.send(s);
    }
    
    if (!req.body._id) {
        var recipe = new model.Recipe(req.body);
        var id = generateId(req.body.NAME,req.session.user_id);
        recipe._id = id;
        recipe.owner = req.session.user_id;
        recipe.save(callback);
        
        /**
         * Si la estoy clonando de otra, debo hacerle update para
         * poner que fue clonada por mi.
         */
        if (recipe.cloneFrom ) {
            model.Recipe.findOne({_id:recipe.cloneFrom}).exec(function(err,recipe){
                recipe.clonedBy.push({
                    _id: req.session.user_id,
                    name: req.session.user_name,
                    recipe_id: id
                });
                recipe.save();
            });
        }
    } else {
        console.log("FERMENTABLES",req.body.FERMENTABLES);
        console.log("bottling",req.body.bottling);
        var id = req.body._id;
        delete req.body._id;
        req.body.owner = req.body.owner._id;
        //console.log("UPDATE POST", req.body);
        model.Recipe.findByIdAndUpdate(id,req.body).populate('owner').exec(callback);
    }
    
};