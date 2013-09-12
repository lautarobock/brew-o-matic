var model = require('../domain/model.js');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  model.Person.find({}).exec(function(err,results) {
    console.log(results);
    res.send(results);
  });
};