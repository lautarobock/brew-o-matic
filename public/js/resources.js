(function() {
    
    var index = angular.module('index');
    
    index.factory('User',function($resource) {
        return $resource('user/:type:id',{}, {
            add: { method: 'POST', params: {}},
            getByGoogleId: {method: 'GET', params: {type:'google_'}, isArray:false}
        });
    });
    
    index.factory('Recipe',function($resource) {
        return $resource('recipe/:id',{}, {});
    });    
})();