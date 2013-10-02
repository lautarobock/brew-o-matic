(function() {

    var index = angular.module('index');

    index.filter("limitText", function() {
        return function(value, limit) {
            if ( value.length > limit ) {
                return value.substring(0,limit) + "...";
            } else {
                return value;
            }
        };
    });
    
    index.filter("filterFavorites",function() {
        return function(list, favorites) {
            var ret = [];
            if ( list && list.length !=0 && favorites && favorites.length != 0) {
                angular.forEach(list,function(recipe) {
                    if ( favorites.indexOf(recipe._id) != -1) {
                        ret.push(recipe);
                    }
                });     
            }
            return ret;
        }
    });
    
    index.controller("RecipeListCtrl", function ($scope,$rootScope,Recipe,User,$location) {

        $scope.publishedCount = 10;
    
        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        }];

        $rootScope.$watch('user',function() {
            $scope.recipes = Recipe.query();
            $scope.published = Recipe.findPublic();
        });
        
        $scope.findMore = function() {
            $scope.publishedCount+=10;
            $scope.published = Recipe.findPublic({limit:$scope.publishedCount});
        };
        
        $scope.removeRecipe = function(_id) {
            Recipe.remove({id:_id}, function() {
                $scope.recipes = Recipe.query();
            });
            
        };
        
        $scope.addFavorites = function(recipe) {
            User.addToFavorites(recipe,function(user) {
                console.log(user);
                $rootScope.user.favorites = user.favorites;
            });
        };
        
        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                console.log(user);
                $rootScope.user.favorites = user.favorites;
            });
        };
        
        $scope.sharedUrl = function(_id) {
            return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        };


        $scope.encodeName = function(name) {
            return encodeURIComponent(name);
        };
    });

})();
