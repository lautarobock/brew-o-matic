
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var user = require('./routes/user');
var model = require('./domain/model.js');
var notifications = require('./util/notifications.js');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon("public/images/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Initialize Mongoose
//mongoose.connect('localhost', 'emarcialsys');
//mongodb://af_brew-o-matic-lautaromail:mngn0k588adkt5er4h758tp1im@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail
mongoose.connect(process.env.MONGOLAB_URI);


//app.get('/user/google_*', function(req,res,next){
//    
//    next();
//});

function filter (req,res,next){
    console.log("checking session");
    var s = req.session;
    console.log("user: " + s.user_id);
    console.log("google_id: " + req.query.google_id);
    if (s.user_id ) {
        console.log("sigue");
        next();
    } else if ( req.query.google_id ) {
        model.User.findOne({'google_id':req.query.google_id}).exec(function(err,user) {
            console.log(user);
            if (user) {
                var s = req.session;
                console.log("Set User_Id in session: " + user._id);
                //console.log(req);
                s.user_id = user._id;
                s.user_name = user.name;
                next();
            } else {
                console.log("null");
                res.send(500,{error:'Hubo un problema con la operacion, presion F5 y reintente'});              
            }
        });   
    } else {
        console.log("null");
        res.send(500,{error:'Hubo un problema con la operacion, presion F5 y reintente'});
    }
}

//app.all('/user*', filter);
//app.all('/recipe*', filter);
var recipe = require("./routes/recipe.js");
var data = require("./routes/data.js");

//app.get('/', routes.index);findStats
app.get('/user/google_:google_id', user.getByGoogleId);
app.post('/user', user.add);
app.get('/user/id_:id', user.get);
app.put('/user/favorite_add',filter,user.addToFavorites);
app.put('/user/favorite_drop',filter,user.removeFromFavorites);
//app.get('/user/stats',filter,user.findStats)
app.put('/user/settings',filter,user.updateSettings);
app.get('/recipe/public',filter,recipe.findPublic);
app.put('/recipe/comment',filter,recipe.addComment);
app.post('/recipe/publish_:id',filter,recipe.publish);
app.put('/recipe/remove_comment',filter,recipe.deleteComment);
app.get('/recipe',filter,recipe.findAll);
app.get('/recipe/stats',recipe.stats);
app.get('/recipe/by_user_:id',filter,recipe.findByUser);
app.get('/recipe/:id',recipe.get);
app.post('/recipe/:id',filter,recipe.save);
app.post('/recipe',filter,recipe.save);
app.delete('/recipe/:id',filter,recipe.remove);
app.get('/notification',filter,notifications.findAll);
app.get('/notification/news',filter,notifications.findNews);
app.post("/notification/:id",filter,notifications.update);


var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag'];
for (s in services ) {
  app.get('/' + services[s].toLowerCase(),data[services[s]].findAll);
  app.post('/' + services[s].toLowerCase() + "/:id",data[services[s]].save);
  app.post('/' + services[s].toLowerCase(),data[services[s]].save);
  app.delete('/' + services[s].toLowerCase()+ "/:id",data[services[s]].remove);
}

//setInterval(function() {
//    console.log("RUNNING SCHEDULE");
//    notifications.removeOld();
//},5000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//mongoose.disconnect();