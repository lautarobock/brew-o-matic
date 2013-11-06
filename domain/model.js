var mongoose = require('mongoose');
var Schema = mongoose.Schema;


exports.User = mongoose.model("User",new Schema({
    google_id: String,
    name: String,
    favorites: [String],
    singInDate: Date,
    lastLogin: Date,
    isAdmin: Boolean,
    settings: {
        defaultValues: {
            BATCH_SIZE: Number,
            EFFICIENCY: Number,
            BREWER: String,
            BOIL_TIME: Number,
            GrainTemp: Number,
            WatertoGrainRatio: Number,
            mashTemp: Number,
            lossMashTemp: Number,
            SpargeTempDesired: Number,
            SpargeDeadSpace: Number,
            GrainAbsorbtion: Number,
            PercentEvap: Number,
            TrubChillerLosses: Number,
            isPublic: Boolean
        }
    }
}));

exports.Recipe = mongoose.model("Recipe", new Schema({
    _id: String,
    code: String,
    owner: {type:String, ref:'User'},
    GrainCalcMethod: String,
    date: Date,
    modificationDate: Date,
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
                TYPE: String, //'Infusion' fijo por ahora
                INFUSE_AMOUNT: Number, //Agua agregada
                INFUSE_TEMP: Number,   //Temp agua agregada
                STEP_TIME: Number,     //Duracion
                STEP_TEMP: Number,     //Temperatura buscada (si pongo INFUSE se calcula sola, pero se puede pisar)
                END_TEMP: Number,      //Temp final de la etapa.
                DESCRIPTION: String,   //texto libre
                WATER_GRAIN_RATIO: Number, //relacion final (calculada, INFUSE_AMOUNT y DECOCTION_AMT)
                decoction: Boolean,
                DECOCTION_AMT: Number,  //cantidad sacada para decocction
                infuse: Boolean,        //Indica si agrega agua o no.
                recirculate: Boolean    //Si recircula o no
                //Others data not used yet
                //RAMP_TIME: Number,   //Este es redundante con END_TEMP
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
        sugar: {
            desiredVol: Number,
            temperature: Number,
            sugarType: String
        },
        must: {
            temperature: Number
        },
        co2: {
            desiredVol: Number,
            temperature: Number
        },
        bottles: [{
            bottleType: String,
            size: Number,
            amount: Number,
            subTotal: Number,
            carbonatationType: String,
            colour: String
        }]
    },
    log: {
       logs: [{
           time: Date,
           detail: String,
           delay: Number,
           delayUnit: String,
           logType: String,
           logRef: String
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
    publishDate: Date,
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
    lossMashTemp: Number,
    tags: [String]
},{ _id: false }));

exports.Bottle = mongoose.model("Bottle",new Schema({
    _id: String,
    name: String,
    size: Number,
    colour: String //'Ambar', 'Verde', 'Blanca'
},{ _id: false }));

exports.Grain = mongoose.model("Grain",new Schema({
    "name": String,
    "type": String,
    "colour": Number,
    "potential": Number
}));

exports.Misc = mongoose.model("Misc",new Schema({
    "name": String,
    "type": String,
    "use": String
}));

exports.Yeast = mongoose.model("Yeast",new Schema({
    "name": String,
    "aa": Number
}));

exports.Hop = mongoose.model("Hop",new Schema({
    "name": String,
    "alpha": Number
}));

exports.Style = mongoose.model("Style",new Schema({
    "name": String,
    "co2_min": Number,
    "co2_max": Number,
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
    "link": String,
    "related": String
}));

exports.Action = mongoose.model("Action",new Schema({
    "user_id": {type:String, ref:'User'},
    "date": Date,
    "actionType": String,
    "data": String
}));

exports.Notification = mongoose.model("Notification",new Schema({
    "user_id": {type:String, ref:'User'},
    "date": Date,
    "status": String, //new,unread,read
    "data": String,
    "link": String
}));

exports.Tag = mongoose.model("Tag",new Schema({
    "_id": String
},{ _id: false }));