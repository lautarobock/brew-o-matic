
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
//mongodb://af_brew-o-matic-lautaromail:mngn0k588adkt5er4h758tp1im@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail
mongoose.connect(process.env.MONGOLAB_URI);
//mongoose.connect('mongodb://app:lac713@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail');


function filterAdmin(req,res,next){
    console.log("checking admin session");
    var s = req.session;

    if (s.user_isAdmin ) {
        console.log("sigue");
        next();
    } else {
        console.log("null");
        res.send(500,{error:'No tiene permisos para acceder a estos datos'});
    }
}

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
            //console.log(user);
            if (user) {
                var s = req.session;
                console.log("Set User_Id in session: " + user._id);
                //console.log(req);
                s.user_id = user._id;
                s.user_name = user.name;
                s.user_isAdmin = user.isAdmin;
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

var recipe = require("./routes/recipe.js");
var data = require("./routes/data.js");
var rating = require("./routes/rating.js");
var stats = require("./routes/stats.js");

app.get('/user/google_:google_id', user.getByGoogleId);
app.post('/user', user.add);
app.get('/user/id_:id', user.get);
app.put('/user/favorite_add',filter,user.addToFavorites);
app.put('/user/favorite_drop',filter,user.removeFromFavorites);
app.get('/user',filter,data.User.findAll);
app.put('/user/settings',filter,user.updateSettings);
app.get('/stats',filter,stats.all);
app.get('/recipe/public',filter,recipe.findPublic);
app.get('/recipe/public_count',filter,recipe.countPublic);
app.get('/recipe/public_styles',filter,recipe.publicStyles);
app.get('/recipe/collaborated',filter,recipe.findCollaborated);
app.put('/recipe/comment',filter,recipe.addComment);
app.get('/recipe/comment:id',recipe.getComments);
app.post('/recipe/publish_:id',filter,recipe.publish);
app.post('/recipe/state_:id',filter,recipe.updateState);
app.put('/recipe/remove_comment',filter,recipe.deleteComment);
app.get('/recipe/my_count',filter,recipe.countAll);
app.get('/recipe/my_tags',filter,recipe.myTags);
app.get('/recipe',filter,recipe.findAll);
app.get('/recipe/stats',filter,recipe.stats);
app.get('/recipe/by_user_:id',filter,recipe.findByUser);
app.get('/recipe/:id',recipe.get);
app.post('/recipe/:id',filter,recipe.save);
app.post('/recipe',filter,recipe.save);
app.delete('/recipe/:id',filter,recipe.remove);
app.get('/notification',filter,notifications.findAll);
app.get('/notification/news',filter,notifications.findNews);
app.post("/notification/:id",filter,notifications.update);
app.get('/rating/beers',rating.findBeers);

var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag','WaterReport','TempDevice','TempDeviceReport'];
for (s in services ) {
  app.get('/' + services[s].toLowerCase(),data[services[s]].findAll);
  app.get('/' + services[s].toLowerCase()+ "/:id", data[services[s]].findById);
  app.post('/' + services[s].toLowerCase() + "/:id",data[services[s]].save);
  app.post('/' + services[s].toLowerCase(),data[services[s]].save);
  app.delete('/' + services[s].toLowerCase()+ "/:id",data[services[s]].remove);
}

var admin = ['Recipe','User','Action'];
for (s in admin ) {
  app.get('/admin/' + admin[s].toLowerCase()+ "/count",[filter,filterAdmin],data[admin[s]].count);
  app.get('/admin/' + admin[s].toLowerCase(),[filter,filterAdmin],data[admin[s]].findAll);
  app.post('/admin/' + admin[s].toLowerCase() + "/:id",[filter,filterAdmin],data[admin[s]].save);
  app.post('/admin/' + admin[s].toLowerCase(),[filter,filterAdmin],data[admin[s]].save);
  app.delete('/admin/' + admin[s].toLowerCase()+ "/:id",[filter,filterAdmin],data[admin[s]].remove);
}

var scheduler = require("./util/scheduler");

scheduler.runEveryDay(notifications.removeOld,false);
scheduler.runEveryHour(recipe.fireFermentationNotification,true);
// scheduler.runEverySecond(recipe.fireFermentationNotification,true);


var server = http.createServer(app).listen(process.env.VCAP_APP_PORT || app.get('port'), function(){
  console.log('Express server listening on port ' + (process.env.VCAP_APP_PORT || app.get('port')));
});

var push = require("./routes/push.js");
push.initOn(server);


//mongoose.disconnect();
