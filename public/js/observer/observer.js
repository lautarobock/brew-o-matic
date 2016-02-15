(function() {

	var observer = angular.module("observer", []);

    observer.run(function($location,pushListener) {
        pushListener.socket = io.connect('http://'+$location.host());
    });

    observer.factory("pushListener", function() {
        return {
            on: function(id, callback) {
                // this.socket.on(id, function (data) {
                //     console.log("INFO", data);
                //     callback(data);
                // });
                this.socket.on(id, callback);
            },
            off: function(id, fn) {
                if ( fn ) {
                    this.socket.removeListener(id,fn);
                } else {
                    this.socket.removeAllListeners(id);
                }

            }
        };
    });


})();
