(function() {
    
    var res = angular.module('resources',[]);
    
    res.factory('User',function($resource) {
        return $resource('user/:type:id',{}, {
            add: { method: 'POST', params: {}},
            getByGoogleId: {method: 'GET', params: {type:'google_'}, isArray:false},
            addToFavorites: {method: 'PUT', params: {type:'favorite_add'}},
            removeFromFavorites: {method: 'PUT', params: {type:'favorite_drop'}}
        });
    });
    
    res.factory('Recipe',function($resource) {
        return $resource('recipe/:operation:id',{}, {
            findPublic: {method:'GET',params: {operation:'public'}, isArray:true },
            addComment: {method:'PUT',params: {operation:'comment'}, isArray:true }
        });
    });
    
    //res.factory('PublicRecipe',function($resource) {
    //    return $resource('recipe/public/:id',{}, {});
    //});
})();