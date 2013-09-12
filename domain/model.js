var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Person
 */
exports.Person = mongoose.model("Person",new Schema({
    name: String,
    lastName: String,
    bornDate: Date,
    picture: String,
    fb_id: String
}));


/**
 * City
 */
exports.City = mongoose.model("City",new Schema({
    name: String
}));


/**
 * Tour
 */
exports.Tour = mongoose.model("Tout",new Schema({
    name: String,
    description: String,
    owner: {type:Schema.Types.ObjectId, ref: 'Person'},
    place: String,
    time: Date
}));