
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Initialize Mongoose
mongoose.connect('localhost', 'brew-o-matic');

//app.get('/user/google_*', function(req,res,next){
//    
//    next();
//});

function filter (req,res,next){
    console.log("checking session");
    var s = req.session;
    console.log("user: " + s.user_id);
    if (s.user_id ) {
        console.log("sigue");
        next();
    } else {
        console.log("null");
        res.send(null);
    }
}

//app.all('/user*', filter);
//app.all('/recipe*', filter);
var recipe = require("./routes/recipe.js");

//app.get('/', routes.index);
app.get('/user/google_:google_id', user.getByGoogleId);
app.post('/user', user.add);
app.put('/user/favorite_add',user.addToFavorites,filter)
app.put('/user/favorite_drop',user.removeFromFavorites,filter)
app.get('/recipe/public',recipe.findPublic,filter)
app.get('/recipe',recipe.findAll,filter)
app.get('/recipe/:id',recipe.get)
app.post('/recipe',recipe.save,filter)
app.delete('/recipe/:id',recipe.remove,filter)

//app.get('/person/fb:id',person.findByFb);
//app.put('/person/fb:id',person.updateByFb);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//mongoose.disconnect();