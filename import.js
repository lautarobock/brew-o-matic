
var model = require('./domain/model.js');
var mongoose = require('mongoose');
var csv = require('fast-csv');
var fs = require('fs');

//Initialize Mongoose
//mongodb://af_brew-o-matic-lautaromail:mngn0k588adkt5er4h758tp1im@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail
mongoose.connect(process.env.MONGOLAB_URI);
//mongoose.connect('mongodb://app:lac713@ds047948.mongolab.com:47948/af_brew-o-matic-lautaromail');

// var data = require("./routes/data.js");

var stream = fs.createReadStream("etc/2015_Guidelines.csv");

function convert(value, div) {
    if ( parseFloat(value) === NaN ) {
        return undefined;
    } else {
        if ( div ) {
            return parseFloat(value.replace(',','.'))/div;
        } else {
            return parseFloat(value.replace(',','.'))
        }
    }
}
var count = 0;
var toInsert = [];
var csvStream = csv.fromStream(stream, {objectMode:true,headers : true,delimiter:';',discardUnmappedColumns:true,quote:'"'})
    .on("data", function(data){
        count++;
        toInsert.push({
             "style": data.Styles,
             "name": data['#'] + ' - ' + data.Styles + ' (BJCP 2015)',
             "OG_Min": convert(data['OG min'],1000),
             "OG_Max": convert(data['OG max'],1000),
             "FG_Min": convert(data['FG min'],1000),
             "FG_Max": convert(data['FG max'],1000),
             "IBU_Min": convert(data['IBUs min']),
             "IBU_Max": convert(data['IBUs max']),
             "Colour_Min": convert(data['SRM min']),
             "Colour_Max": convert(data['SRM max']),
             "ABV_Min": convert(data['ABV min']),
             "ABV_Max": convert(data['ABV max']),
             "type": 'BJCP 2015',
             "code": data['#'],
             "category": data['BJCP Categories'],
             "family": data['Style Family'],
            //  "history": data['Style History'],
             "origin": data['Origin'],
             "overall": data['Overall Impression'],
             "aroma": data['Aroma'],
             "appearance": data['Appearance'],
             "flavor": data['Flavor'],
             "mouthfell": data['Mouthfell'],
             "comments": data['Comments'],
             "history": data['History'],
             "ingredients": data['Characteristic Ingredients'],
             "comparison": data['Style Comparison'],
             "examples": data['Commercial Examples'],
             "note": data['Notes']
         });
    })
    .on("end", function(){
         console.log("done", count);
         model.Style.collection.insert(toInsert, function(err) {
              console.log("INSERTED", err);
             mongoose.disconnect();
         });
    });

// stream.pipe(csvStream);


// new model.Style({
//     "name": String,
//     "co2_min": Number,
//     "co2_max": Number,
//     "OG_Min": Number,
//     "OG_Max": Number,
//     "FG_Min": Number,
//     "FG_Max": Number,
//     "IBU_Min": Number,
//     "IBU_Max": Number,
//     "Colour_Min": Number,
//     "Colour_Max": Number,
//     "ABV_Min": Number,
//     "ABV_Max": Number,
//     "link": String,
//     "related": String,
//     "type": 'BJCP 2015',
//     "code": String,
//     "category": String,
//     "family": String,
//     "history": String,
//     "origin": String,
//     "overall": String,
//     "aroma": String,
//     "appearance": String,
//     "flavor": String,
//     "mouthfell": String,
//     "comments": String,
//     "history": String,
//     "ingredients": String,
//     "comparison": String,
//     "examples": String,
//     "note": String
// }).save(function(err) {
//
// });

// model.Style.find().exec(function(err,results) {
//     results.forEach(function(r) {
//         console.log(JSON.stringify(r,null, 4));
//     });
//     mongoose.disconnect();
// });
