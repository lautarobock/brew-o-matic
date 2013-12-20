
/**
 * Module dependencies.
 */

//var routes = require('./routes');
var model = require('./../../domain/model.js');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);

console.log("comenzando");
model.User.find({}).sort('name').exec(function(err,users) {
  var googleid="";
  var username = "";
  var _id = "";
  var repeated = {};
  console.log("users",users.length);
  for (var i=0; i<users.length; i++) {
    var user = users[i];
    //console.log("name",user.name);
    if ( user.google_id == googleid) {
      if ( !repeated[googleid] ) {
        repeated[googleid] = [_id];
      }
      repeated[googleid].push(user._id);
    } else {
      username = user.name;
      googleid = user.google_id;
      _id = user._id;
    }
  }
  
  console.log("Resultados");
  for (var name in repeated) {
    var repeat = repeated[name];
    console.log(name,repeat);
  }
});

//while (true) {
//  //code
//}