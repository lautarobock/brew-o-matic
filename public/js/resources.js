(function() {
    
    var res = angular.module('resources',[]);
    
    res.factory('User',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('user/:type:id',{google_id:params}, {
            add: { method: 'POST', params: {}},
            getByGoogleId: {method: 'GET', params: {type:'google_'}, isArray:false},
            addToFavorites: {method: 'PUT', params: {type:'favorite_add'}},
            removeFromFavorites: {method: 'PUT', params: {type:'favorite_drop'}},
            findStats: {method: 'GET', params: {type:'stats'}},
            updateSettings: {method: 'PUT', params: {type:'settings'}}
        });
    });
    
    res.factory('Recipe',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('recipe/:operation:id',{google_id:params}, {
            findPublic: {method:'GET',params: {operation:'public'}, isArray:true },
            addComment: {
                method:'PUT',
                params: {operation:'comment'},
                isArray:true },
            removeComment: {
                method:'PUT',
                params: {operation:'remove_comment'},
                isArray:true }
        });
    });
    
    var services = ['Style','Grain','Hop','Yeast','Misc','Bottle'];
    angular.forEach(services,function(s) {
        res.factory(s,function($resource) {
            return $resource( s.toLowerCase() + '/:id',{}, {});
        });    
    });
    
})();