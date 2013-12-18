(function() {

	var observer = angular.module("observer", []);

    observer.factory("pushListener", function($location) {
        var socket = io.connect('http://'+$location.host());
        return {
            on: function(id, callback) {
                socket.on(id, function (data) {
                    console.log("INFO", data);
                    callback(data);
                });
            },
            off: function(id) {
                socket.removeAllListeners(id);
            }
        };
    });


})();