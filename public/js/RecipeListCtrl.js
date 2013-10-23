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
    
    index.controller("RecipeFavoriteCtrl", function ($scope,$rootScope,Recipe,User) {
        
        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Recetas Favoritas'
        }];
        
        $rootScope.$watch('user',function(user) {
            if ( user ) {
                $scope.published = Recipe.findPublic();
                $scope.stats = Recipe.stats();
            }
        });
        
        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };
        
    });
    
    index.controller("RecipePublicCtrl", function ($scope,$rootScope,Recipe,User) {
        $rootScope.$watch('user',function(user) {
            if ( user ) {
                $scope.published = Recipe.findPublic();
                $scope.stats = Recipe.stats();
            }
        });
        
        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Recetas Publicadas'
        }];
        
        $scope.addFavorites = function(recipe) {
            User.addToFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };
    });
    
    index.controller("RecipeListCtrl", function (
                $scope,
                $rootScope,
                Recipe,
                User,
                $location,
                $timeout) {

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        }];

        $rootScope.$watch('user',function(user) {
            if ( user ) {
                $scope.recipes = Recipe.query();
                $scope.stats = Recipe.stats();
            }
        });
        
        $scope.confirmationID = function(id) {
            return 'confirmation' + id.replace('(','_').replace(')','_');
        };
        
        $scope.removeRecipe = function(_id) {
            Recipe.remove({id:_id}, function() {
                $('#'+$scope.confirmationID(_id)).modal('hide');
                $timeout(function() {
                    $scope.recipes = Recipe.query();
                },500);
            });
            
        };
        
        $scope.publish = function(recipe) {
            recipe.$publish({isPublic: true});
        };
        
    });

})();
