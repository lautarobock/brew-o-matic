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
    VERSION: String,
    TYPE: String,
    STYLE: { NAME: String },
    BREWER: String,
    CALCCOLOUR: Number,
    BATCH_SIZE: Number,
    BOIL_SIZE: Number,
    BOIL_TIME: Number,
    ABV: Number,
    BV: Number,
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
    },
    PRIMARY_TEMP: Number,
    BIAB: String,
    IBUCalcMethod: String,
    StyleNaziMode: String,
    IsNoChill: String,
    GrainUnits: String,
    HopsUnits: String,
    VolumeUnits: String,
    TemperatureUnits: String,
    Colour: String,
    GrainTemp: Number,
    StrikeWater: Number,
    GrainAbsorbtion: Number,
    WatertoGrainRatio: Number,
    SpargeTempDesired: Number,
    PercentEvap: Number,
    TrubChillerLosses: Number,
    calendarpressed: String,
    brewdayEnabled: String,
    yeastpitchEnabled: String,
    primaryEnabled: String,
    secondaryEnabled: String,
    keggingEnabled: String,
    serveEnabled: String
    
},{ _id: false }));
