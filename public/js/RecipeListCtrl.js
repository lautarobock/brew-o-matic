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
    
    index.controller("RecipeFavoriteCtrl", function ($scope,$rootScope,Recipe,User,sortData) {

        $scope.sort = sortData("NAME","");

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
    
    index.controller("RecipePublicCtrl", function ($scope,$rootScope,Recipe,User,sortData) {

        $scope.sort = sortData("publishDate","-");

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

    index.factory("sortData",function() {
        return function(startField, startAsc) {
            var data = {
                asc: startAsc,
                field: startField,
                orderStyle:{},
                orderBy: function() {
                    return this.asc+this.field;
                },
                resort: function(field) {
                    if ( field == this.field) {
                        if (this.asc == '-' ) {
                            this.asc = '';
                            this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
                        } else {
                            this.asc = '-';
                            this.orderStyle[field] = 'glyphicon glyphicon-chevron-down';
                        }
                    } else {
                        angular.forEach(this.orderStyle, function(style ,key) {
                            data.orderStyle[key] = '';
                        });
                        this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
                        this.field = field;
                        this.asc = '';
                    }
                }
            };
            if ( startAsc == '-') {
                data.orderStyle[startField] = 'glyphicon glyphicon-chevron-down';
            } else {
                data.orderStyle[startField] = 'glyphicon glyphicon-chevron-up';
            }

            return data;
        };
    });

    index.controller("RecipeListCtrl", function (
                $scope,
                $rootScope,
                Recipe,
                User,
                $location,
                $timeout,
                sortData) {

        $scope.sort = sortData("code","-");
        
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
