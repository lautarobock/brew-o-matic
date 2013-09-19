(function() {


    var share = angular.module('index', ['ngResource','data']);


//    share.
//        config(['$routeProvider', function($routeProvider) {
//        $routeProvider.
//            when('/recipe/edit/:recipeId', {controller: 'RecipeDetailCtrl'}).
//            otherwise({redirectTo: '/recipe/edit/:recipeId'});
//    }]);

    share.controller("ShareController", function($scope,Recipe,$location) {
        $scope.recipe = Recipe.get({id:$location.path().substr(1,$location.path().length-1)});
    });

})();