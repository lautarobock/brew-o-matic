(function() {

    var calculator = angular.module("calculator", ["helper"]);

    calculator.controller("CalculatorCtrl", function($scope, BrewCalc) {

        $scope.alcohol = {
            OG: 1.050,
            FG: 1.010,
            mode: 'ABV' 
        };

        function updateABV() {
            if ( $scope.alcohol.mode == 'ABV' ) {
                console.log("calculate ABV");
                $scope.alcohol.ABV = BrewCalc.calculateABV($scope.alcohol.OG,$scope.alcohol.FG);    
                
            } else if ( $scope.alcohol.mode == 'OG' ) {
                console.log("calculate OG");
                $scope.alcohol.OG = BrewCalc.calculateOG($scope.alcohol.FG,$scope.alcohol.ABV);
            } else if ( $scope.alcohol.mode == 'FG' ) {
                console.log("calculate FG");
                $scope.alcohol.FG = BrewCalc.calculateFG($scope.alcohol.OG,$scope.alcohol.ABV);
            }
            $scope.alcohol.attenuation = BrewCalc.attenuation($scope.alcohol.OG,$scope.alcohol.FG);
        }

        $scope.$watch("alcohol.OG+alcohol.FG+alcohol.ABV", function() {
            updateABV();
        });
        
    });

})();