var model = require('../domain/model.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
/*
 * GET users listing.
 */

var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag'];

//Aca van las que tiene customId
var customIds = ['Bottle'];

function createRest(exports,service) {
    exports[service] = {
        findAll: function(req, res) {
            console.log(service + " .findAll");
            model[service].find({}).exec(function(err,results) {
                res.send(results);
            });    
        },
        save: function(req, res) {
            delete req.body._id;
            var id;
            if ( customIds.indexOf(service) != -1 ) {
                id = req.params.id;
            } else {
                id = new mongoose.Types.ObjectId(req.params.id);
            }
            model[service].findByIdAndUpdate(id,req.body,{upsert:true}).exec(function(err,results) {
                res.send(results);
            });
        }
    };
}

for (s in services ) {
    var service = services[s];
    createRest(exports,service);
}
