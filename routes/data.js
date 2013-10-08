var model = require('../domain/model.js');
var mongoose = require('mongoose');
var Arrays = require("../public/js/util/util.js").Arrays;
/*
 * GET users listing.
 */

var services = ['Style','Grain','Hop','Yeast','Misc'];

for (s in services ) {
    var service = services[s];
    exports[service] = {
        findAll: function(req, res) {
            model[service].find({}).exec(function(err,results) {
                res.send(results);
            });    
        }    
    }; 
}
