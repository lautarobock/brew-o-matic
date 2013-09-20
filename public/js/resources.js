(function() {
    
    var res = angular.module('resources',[]);
    
    res.factory('User',function($resource) {
        return $resource('user/:type:id',{}, {
            add: { method: 'POST', params: {}},
            getByGoogleId: {method: 'GET', params: {type:'google_'}, isArray:false}
        });
    });
    
    res.factory('Recipe',function($resource) {
        return $resource('recipe/:id',{}, {});
    });    
})();