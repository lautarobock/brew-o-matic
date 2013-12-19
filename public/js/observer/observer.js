(function() {

	var observer = angular.module("observer", []);

    observer.run(function($location,pushListener) {
        pushListener.socket = io.connect('http://'+$location.host());
    });

    observer.factory("pushListener", function() {
        return {
            on: function(id, callback) {
                this.socket.on(id, function (data) {
                    console.log("INFO", data);
                    callback(data);
                });
            },
            off: function(id) {
                this.socket.removeAllListeners(id);
            }
        };
    });


})();