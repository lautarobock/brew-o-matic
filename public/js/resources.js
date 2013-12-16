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
            get:{method:'GET',params: {type:'id_'}},
            //findStats: {method: 'GET', params: {type:'stats'}},
            updateSettings: {method: 'PUT', params: {type:'settings'}}
        });
    });
    
    res.factory('Recipe',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('recipe/:operation:id',{google_id:params,id:'@_id'}, {
            findPublic: {method:'GET',params: {operation:'public'}, isArray:true },
            findCollaborated: {method:'GET',params: {operation:'collaborated'}, isArray:true },
            publish: {method:'POST', params: {operation: 'publish_'}},
            findByUser: {method:'GET',params: {operation:'by_user_'},isArray:true},
            stats: {method:'GET',params: {operation:'stats'}},
            addComment: {
                method:'PUT',
                params: {operation:'comment'},
                isArray:true },
            getComments: {
                method:'GET',
                params: {operation:'comment'},
                isArray:true },
            removeComment: {
                method:'PUT',
                params: {operation:'remove_comment'},
                isArray:true }
        });
    });

    res.factory("Observer", function($resource) {
       return $resource("observer/:id",{id:"@id"});
    });
    
    res.factory('Notification',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('notification/:_id',{google_id:params,_id:"@_id"}, {
            findNews: {method:'GET',params:{_id:'news'},isArray:true}
        });
    });    
    
    var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag'];
    angular.forEach(services,function(s) {
        res.factory(s,function($resource) {
            return $resource( s[0].toLowerCase() + s.substr(1) + '/:_id',{_id:"@_id"}, {});
        });    
    });
    
    var admin = ['User','Recipe','Action'];
    angular.forEach(admin,function(s) {
        res.factory('Admin' + s,function($resource) {
            return $resource( 'admin/' + s.toLowerCase() + '/:_id',{_id:"@_id"}, {});
        });    
    });
    
})();