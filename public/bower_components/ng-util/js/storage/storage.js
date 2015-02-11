(function() {

    var canStorage = null;

    angular.module('storage', [])
        .factory('Storage', function() {
            if ( canStorage ) {
                return {
                    set: function(key, value) {
                        localStorage.setItem(key,value);
                    },
                    get: function(key,defaultValue) {
                        return localStorage.getItem(key)||defaultValue;
                    },
                    getInt: function(key, defaultValue) {
                        return parseInt(localStorage.getItem(key)||defaultValue);
                    },
                    remove: function(key) {
                        localStorage.removeItem(key);
                    }
                };
            } else {
                return new VolatileStorage();
            }
        })
        .run(function() {
            canStorage = typeof(Storage) !== "undefined";
        });

    var VolatileStorage = function() {
        var storage = {};

        this.set = function(key, value) {
            storage[key] = value.toString();
        };

        this.get = function(key) {
            return storage[key];
        };

        this.getInt = function(key) {
            return parseInt(this.get(key));
        };

        this.remove = function(key) {
            delete storage[key];
        };
    };
})();
