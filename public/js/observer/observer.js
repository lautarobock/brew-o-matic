(function() {

	var observer = angular.module("observer", ['ngResource']);

	var listeners = {

	};

	observer.run(function(observable) {
		// observable.start();
	});

    observer.factory("Observer", function($resource) {
       return $resource("observer/:id",{id:"@id"});
    });

    observer.factory("observable",function($interval,Observer) {
    	return {
    		start: function(sleep) {
    			$interval(function() {
	    			Observer.query({}, function(updates) {
		                for ( var i=0; i<updates.length; i++ ) {
		                    var u = updates[i].value;
		                    if ( listeners[u] ) {
		                    	angular.forEach(listeners[u], function(c) {
		                    		c.call();
		                    	});
		                    }
		                }
		            });	
    			},sleep||5*1000);
    		},
    		register: function(id, callback) {
    			if ( !listeners[id] ) {
    				listeners[id] = [];
    				Observer.save({id:id});
    			}
    			var observable = {
    				id: id,
    				call: function() {
    					callback();
    				},
    				cancel: function() {
    				    util.Arrays.remove(listeners[this.id],this);
    				    if ( listeners[this.id].length == 0 ) {
    				    	delete listeners[this.id];
    				    	Observer.remove({id:this.id});
    				    }
    				}
    			};
    			listeners[id].push(observable);
    			return observable;
    		}
    	};
    });


})();