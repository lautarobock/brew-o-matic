var model = require('../domain/model.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
/*
 * GET users listing.
 */

var services = ['Style','Grain','Hop','Yeast','Misc'];

function createRest(exports,service) {
    exports[service] = {
        findAll: function(req, res) {
            console.log(service + " .findAll");
            model[service].find({}).exec(function(err,results) {
                res.send(results);
            });    
        }
    };
}

for (s in services ) {
    var service = services[s];
    createRest(exports,service);
}
