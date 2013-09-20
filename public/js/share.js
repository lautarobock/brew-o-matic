(function() {


    var share = angular.module('share', ['ngResource','data','resources','helper']);

    share.controller("ShareController", function($scope,Recipe,$location,BrewHelper) {
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

        $scope.convertColor = function(srm) {
            return BrewHelper.convertColor(srm);
        };

        
        $scope.hopIBU = function(hop) {
            var U = BrewHelper.calculateU($scope.recipe.OG,hop.TIME);
            return BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
        };

    });

})();