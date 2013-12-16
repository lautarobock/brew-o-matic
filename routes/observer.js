/**
 * Created by lautaro on 14/12/13.
 */

var util = require("../public/js/util/util.js");

var obs = [];

exports.when = function(name) {
    var observer = {
        name: name,
        _call: function () {
        },
        call: function (callback) {
            this._call = callback;
            return this;
        },
        cancel: function () {
            this._call = function () {
            };
            util.Arrays.remove(obs, this);
        }
    };
    obs.push(observer);
    return observer;
};


exports.change = function(name) {
    for ( var i=0; i<obs.length; i++ ) {
        if ( obs[i].name == name ) {
            obs[i]._call();
        }
    }
};

