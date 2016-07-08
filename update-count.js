
var model = require('./domain/model.js');
var mongoose = require('mongoose');
var fs = require('fs');

//Initialize Mongoose
//mongodb://af_brew-o-matic-lautaromail:mngn0k588adkt5er4h758tp1im@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail
mongoose.connect(process.env.MONGOLAB_URI);
//mongoose.connect('mongodb://app:lac713@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail');


// model.Recipe.find({},{NAME:1,starredBy:1,starredByCount:1}).exec(function(err,results) {
//     results.forEach(function(r) {
//         var count = r.starredBy ? r.starredBy.length :  0;
//         console.log('Updating ' + r.NAME + ' with ' + count);
//     });
//     // console.log('ERR', err);
//     // console.log('COUNT', results.length);
//     mongoose.disconnect();
// });

var saved = 0;
model.Recipe.find({}, {NAME:1,clonedBy:1,clonedByCount:1}).exec(function(err,results) {
    saved = results.length;
    results.forEach(function(r) {
        var count = r.clonedBy ? r.clonedBy.length :  0;
        console.log('Updating ' + JSON.stringify(r) + ' with ' + count);
        r.clonedByCount = count;
        r.save(function(err) {
            if ( err ) console.log('ERR', err);
            saved--;
            console.log('REST', saved);
            if ( saved === 0 ) {
                mongoose.disconnect();
            }
        })
    });
    // console.log(JSON.stringify(results[0],null,4));
    // //     var count = results[0].starredBy ? results[0].starredBy.length :  0;
    // //     console.log('Updating ' + results[0].NAME + ' with ' + count);
    // //     results[0].starredByCount = count;
    // //     results[0].save(function(err) {
    // //         console.log(err);mongoose.disconnect();
    // //     });
    // // console.log('ERR', err);
    // // console.log('COUNT', results.length);
    // // mongoose.disconnect();
});
