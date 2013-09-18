var mongoose = require('mongoose');
var Schema = mongoose.Schema;


exports.User = mongoose.model("User",new Schema({
    google_id: String,
    name: String
}));

exports.Recipe = mongoose.model("Recipe", new Schema({
    _id: String,
    owner: String,
    GrainCalcMethod: String,
    date: Date,
    totalAmount: Number,
    totalHop: Number,
    NAME: String,
    TYPE: String,
    STYLE: { NAME: String },
    BREWER: String,
    CALCCOLOUR: Number,
    BATCH_SIZE: Number,
    ABV: Number,
    EFFICIENCY: Number,
    OG: Number,
    CALCIBU: Number,
    FG: Number,
    FERMENTABLES: {
        FERMENTABLE: [ {
            NAME: String,
            VERSION: String,
            AMOUNT: Number,
            TYPE: String,
            YIELD: Number,
            COLOR: Number,
            POTENTIAL: Number,
            PERCENTAGE: Number
        } ]
    },
    HOPS: {
        HOP: [{
            NAME: String,
            VERSION: String,
            ALPHA: Number,
            AMOUNT: Number,
            USE: String,
            TIME: Number,
            FORM: String
        }]
    },
    YEASTS: {
        YEAST: [{
            NAME: String,
            VERSION: String,
            ATTENUATION: Number
        }]
    }
},{ _id: false }));
///**
// * Person
// */
//exports.Person = mongoose.model("Person",new Schema({
//    name: String,
//    lastName: String,
//    bornDate: Date,
//    picture: String,
//    fb_id: String
//}));
//
//
///**
// * City
// */
//exports.City = mongoose.model("City",new Schema({
//    name: String
//}));
//
//
///**
// * Tour
// */
//exports.Tour = mongoose.model("Tout",new Schema({
//    name: String,
//    description: String,
//    owner: {type:Schema.Types.ObjectId, ref: 'Person'},
//    place: String,
//    time: Date
//}));