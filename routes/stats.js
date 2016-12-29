var model = require('../domain/model.js');
var q = require('q');

var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365;
var ORIGIN = YEAR * 100;

function lastLogin(modelName,date,name,values,field) {
    var deferred = q.defer();

    var filter = {};
    filter[field] = { '$exists': true, '$gte': date };

    model[modelName].count(filter).exec(function(err,results) {
        if ( err ) {
            deferred.reject(err);
        } else {
            values[field][name] = results;
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function publicRecipes(date,name,values) {
    var deferred = q.defer();

    var filter = {};
    filter.publishDate = { '$exists': true, '$gte': date };
    filter.isPublic = true;

    model.Recipe.count(filter).exec(function(err,results) {
        if ( err ) {
            deferred.reject(err);
        } else {
            values.isPublic[name] = results;
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function recipesByUser(values) {
    var deferred = q.defer();

    model.Recipe.aggregate([{
        $group:{
            _id: '$owner',
            total: {$sum: 1}
        }
    },{
        $sort: {total:-1}}
    ],function (err, res) {
        if ( err ) {
            deferred.reject(err);
        } else {
            model.User.populate(res, {path: '_id'}, function(err, result) {
                values.recipesByUser = result;
                deferred.resolve();
            });
        }
    });

    return deferred.promise;
}

/**
Se mide por la cantidad de usuarios que crearon o modificaron alguna receteta
en el tiempo.
*/
function activeUsers(date,name,values) {
    var deferred = q.defer();

    var filter = {
        '$or':[
            {'date': {'$exists': true, '$gte': date }},
            {'modificationDate': {'$exists': true, '$gte': date }}
        ]
    };

    model.Recipe.find(filter,'owner').exec(function(err,results) {
        if ( err ) {
            deferred.reject(err);
        } else {
            var users = {};
            var r = [];
            for ( var i=0; i<results.length; i++ ) {
                users[results[i].owner] = results[i].owner;
            }
            var count = 0;
            for ( var u in users ) {
                count++;
            }
            values.active[name] = count;
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function newRecipesByPeriod(values) {
    var deferred = q.defer();
    model.Recipe.aggregate([
        { $match: { date: { '$exists': true }  } },
        { $group: {
            _id:{year: {$year:"$date"}, month: {$month:"$date"} },
            total: { $sum: 1 }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ], function(err, result) {
        if ( err ) {
            deferred.reject(err);
        } else {
            for ( var i=0; i<result.length; i++ ) {
                var r = result[i];
                r.date = new Date(r._id.year,r._id.month,0);
            }
            values.newRecipesByPeriod = result;
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function isStat(types,type) {
    return types.indexOf(type) !== -1;
}

exports.lastActions = function(req, res) {
    //db.actions.find({date: { $gt: new Date(new Date().getTime()-3600*1000*2) } }).sort({date:-1})
    var hours = parseInt(req.query.hours || 1);
    model.Action.find({
        date: { $gt: new Date(new Date().getTime()-3600*1000*hours) }
    })
    .populate('user_id','name')
    .sort('-date')
    .exec(function(err, result) {
        if ( err ) {
            console.log('ERROR in lastActions', err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    })
};

exports.all = function(req, res) {

    //fix QUERY
    var types = req.query.stats || [];
    if ( typeof(types) === 'string' ) {
        types = [types];
    }

    //Usuarios
    var now = new Date();
    var yesterday = new Date(now.getTime()-DAY);
    var week = new Date(now.getTime()-WEEK);
    var month = new Date(now.getTime()-MONTH);
    var year = new Date(now.getTime()-YEAR);
    var origin = new Date(now.getTime()-ORIGIN);

    var result = {
        // lastLogin: {},
        // singInDate: {},
        // date: {},
        // modificationDate: {},
        // isPublic: {},
        // active: {}
    };

    var stats = [];

    if ( isStat(types,'lastLogin') ) {
        result.lastLogin = {};
        stats.push(lastLogin('User',yesterday,'today',result,'lastLogin'));
        stats.push(lastLogin('User',week,'week',result,'lastLogin'));
        stats.push(lastLogin('User',month,'month',result,'lastLogin'));
        // stats.push(lastLogin('User',year,'year',result,'lastLogin'));
        // stats.push(lastLogin('User',origin,'origin',result,'lastLogin'));
    }

    if ( isStat(types,'singInDate') ) {
        result.singInDate = {};
        stats.push(lastLogin('User',yesterday,'today',result,'singInDate'));
        stats.push(lastLogin('User',week,'week',result,'singInDate'));
        stats.push(lastLogin('User',month,'month',result,'singInDate'));
        // stats.push(lastLogin('User',year,'year',result,'singInDate'));
        // stats.push(lastLogin('User',origin,'origin',result,'singInDate'));
    }

    if ( isStat(types,'date') ) {
        result.date = {};
        stats.push(lastLogin('Recipe',yesterday,'today',result,'date'));
        stats.push(lastLogin('Recipe',week,'week',result,'date'));
        stats.push(lastLogin('Recipe',month,'month',result,'date'));
        // stats.push(lastLogin('Recipe',year,'year',result,'date'));
        // stats.push(lastLogin('Recipe',origin,'origin',result,'date'));
    }

    if ( isStat(types,'modificationDate') ) {
        result.modificationDate = {};
        stats.push(lastLogin('Recipe',yesterday,'today',result,'modificationDate'));
        stats.push(lastLogin('Recipe',week,'week',result,'modificationDate'));
        stats.push(lastLogin('Recipe',month,'month',result,'modificationDate'));
        // stats.push(lastLogin('Recipe',year,'year',result,'modificationDate'));
        // stats.push(lastLogin('Recipe',origin,'origin',result,'modificationDate'));
    }

    if ( isStat(types,'isPublic') ) {
        result.isPublic = {};
        stats.push(publicRecipes(yesterday,'today',result));
        stats.push(publicRecipes(week,'week',result));
        stats.push(publicRecipes(month,'month',result));
        // stats.push(publicRecipes(year,'year',result));
        // stats.push(publicRecipes(origin,'origin',result));
    }

    if ( isStat(types,'recipesByUser') ) {
        result.recipesByUser = {};
        stats.push(recipesByUser(result));
    }

    if ( isStat(types,'active') ) {
        result.active = {};
        stats.push(activeUsers(yesterday,'today',result));
        // stats.push(activeUsers(week,'week',result));
        // stats.push(activeUsers(month,'month',result));
        // stats.push(activeUsers(year,'year',result));
        // stats.push(activeUsers(origin,'origin',result));
    }

    if ( types.indexOf('newRecipesByPeriod') !== -1 ) {
        result.newRecipesByPeriod = {};
        stats.push(newRecipesByPeriod(result));
    }

    q.all(stats).then(function(count) {
        res.send(result);
    });

};
