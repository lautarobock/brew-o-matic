var model = require('../domain/model.js');


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
    model.Recipe.findOne({_id:req.body._id}).exec(function(err,recipe) {
        recipe.comments.push({
            _id: req.session.user_id,
            name: req.session.user_name,
            text: req.body.text,
            date: new Date()
        });
        recipe.save();
        res.send(recipe.comments);
    });
};

exports.save = function(req, res) {
    
    function callback(err,s){
        res.send(s);
    }
    
    if (!req.body._id) {
        var recipe = new model.Recipe(req.body);
        recipe._id = generateId(req.body.NAME,req.session.user_id);
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
                    name: req.session.user_name
                });
                recipe.save();
            });
        }
    } else {
        var id = req.body._id;
        delete req.body._id;
        model.Recipe.findByIdAndUpdate(id,req.body,callback);
    }
    
};