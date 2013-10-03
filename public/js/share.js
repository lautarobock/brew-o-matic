(function() {


    var share = angular.module('share', ['ngResource','data','resources','helper','login','comments']);

    share.controller("ShareController", function($scope,Recipe,$location,BrewHelper,HopUse,HopForm,User,$rootScope) {
        
        $scope.hopUses = HopUse.query();
        
        $scope.hopForms = HopForm.query();
        
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

        function getUtilization(name,list) {
            var utilization = 1;
            angular.forEach(list, function(it) {
                if ( name === it.name ) {
                    utilization = it.utilization;
                }
            });
            return utilization;
        }
        
        $scope.hopIBU = function(hop) {
            var U = BrewHelper.calculateU($scope.recipe.OG,hop.TIME);
            var baseIBU = BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            //add or remove by utilization (ej: mash use 20%)
            return baseIBU * getUtilization(hop.USE,$scope.hopUses) * getUtilization(hop.FORM,$scope.hopForms);
        };
        
        $scope.gravityBarValue = function(grav,max) {
            return BrewHelper.toPpg(grav) / max * 100;
        }
        
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
        
        
        $scope.encodeName = function(name) {
            return encodeURIComponent(name);
        };

    });

})();