var mongoose = require('mongoose');
var Schema = mongoose.Schema;


exports.User = mongoose.model("User",new Schema({
    google_id: String,
    name: String,
    favorites: [String]
}));

exports.Recipe = mongoose.model("Recipe", new Schema({
    _id: String,
    owner: {type:String, ref:'User'},
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
            ATTENUATION: Number,
            AMOUNT: Number
        }]
    },
    MISCS: {
        MISC: [{
            NAME: String,
            VERSION: String,
            TYPE: String,
            USE: String,
            TIME: Number,
            AMOUNT: Number
        }]
    },
    MASH: {
        MASH_STEPS: {
            MASH_STEP: [ {
                NAME: String,
                TYPE: String,
                INFUSE_AMOUNT: String,
                STEP_TIME: Number,
                STEP_TEMP: Number,
                DESCRIPTION: String,
                WATER_GRAIN_RATIO: Number,
                DECOCTION_AMT: Number
                //Others data not used yet
                //RAMP_TIME: Number,
                //END_TEMP: Number,
                //INFUSE_TEMP: Number,
                //DISPLAY_STEP_TEMP: Number,
                //DISPLAY_INFUSE_AMT: Number,
            }]
        }
    },
    fermentation: {
        view: String,
        estimateDate: Date,
        stages: [{
            title: String,
            duration: Number, //In days/hours
            durationMode: String, //'Dias' / 'Horas'
            transferring: Boolean, //In the end of stage
            losses: Number, //Litros perdidos
            temperature: Number,
            temperatureEnd: Number,
            action: String // 'Inoculacion', 'Dry-Hop', 'Otro'
        }]
    },
    bottling: {
        sugarType: String, 
        bottles: [{
            bottleType: String,
            size: Number,
            amount: Number,
            carbonatationType: String 
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
    SpargeDeadSpace: Number,
    GrainAbsorbtion: Number,
    WatertoGrainRatio: Number,
    SpargeTempDesired: Number,
    PercentEvap: Number,
    TrubChillerLosses: Number,
    TopUpWater: Number,
    calendarpressed: String,
    brewdayEnabled: String,
    yeastpitchEnabled: String,
    primaryEnabled: String,
    secondaryEnabled: String,
    keggingEnabled: String,
    serveEnabled: String,
    //Start own properties
    isPublic: Boolean,
    cloneFrom: {type:String, ref:'Recipe'},
    starredBy: [{_id:Schema.Types.ObjectId,name:String}],
    clonedBy: [{_id:Schema.Types.ObjectId,name:String,recipe_id:{type:String, ref:'Recipe'}}],
    comments:[{
        text: String,
        _id: String,
        user_id: Schema.Types.ObjectId,
        name: String,
        date: Date
    }],
    fixIngredients: String,
    mashTemp: Number,
    lossMashTemp: Number
    
},{ _id: false }));

exports.Grain = mongoose.model("Grain",new Schema({
    "name": String,
    "type": String,
    "colour": Number,
    "potential": Number
},{ _id: false }));

exports.Misc = mongoose.model("Misc",new Schema({
    "name": String,
    "type": String,
    "use": String
},{ _id: false }));

exports.Yeast = mongoose.model("Yeast",new Schema({
    "name": String,
    "aa": Number
},{ _id: false }));

exports.Hop = mongoose.model("Hop",new Schema({
    "name": String,
    "alpha": Number
},{ _id: false }));

exports.Style = mongoose.model("Style",new Schema({
    "name": String,
    "OG_Min": Number,
    "OG_Max": Number,
    "FG_Min": Number,
    "FG_Max": Number,
    "IBU_Min": Number,
    "IBU_Max": Number,
    "Colour_Min": Number,
    "Colour_Max": Number,
    "ABV_Min": Number,
    "ABV_Max": Number,
    "link": String
},{ _id: false }));