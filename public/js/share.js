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

        $scope.calulateBUGU = function(bu,gu) {
            return bu/(gu * 1000 - 1000);
        };

        $scope.hopGramsPerLiter = function(hop,batchSize) {
            return hop.AMOUNT*1000/batchSize;
        };

        $scope.hopPercentage = function(hop,totalHop) {
            return hop.AMOUNT/totalHop*100;
        };

//        $scope.hopIBU = function(hop) {
//            var U = BrewHelper.calculateU($scope.recipe.OG,hop.TIME);
//            return BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
//        };

    });

})();