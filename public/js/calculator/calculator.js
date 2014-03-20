(function() {

    var calculator = angular.module("calculator", ["helper"]);

    calculator.controller("CalculatorCtrl", function($scope,$rootScope) {

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Herramientas'
        }];

    });

    calculator.directive("calculatorAbv", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-abv.html',
            controller: function($scope, BrewCalc) {

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
                    $scope.alcohol.OGP = BrewCalc.toPlato($scope.alcohol.OG);
                    $scope.alcohol.FGP = BrewCalc.toPlato($scope.alcohol.FG);
                    updateABV();
                });

                $scope.updateOG = function() {
                    $scope.alcohol.OG = BrewCalc.fromPlato($scope.alcohol.OGP);
                };

                $scope.updateFG = function() {
                    $scope.alcohol.FG = BrewCalc.fromPlato($scope.alcohol.FGP);
                };
                
            }
        };
    });

    calculator.directive("calculatorHydro", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-hydro.html',
            controller: function($scope, BrewCalc) {

                $scope.hydrometer = {
                    gravity: 1.050,
                    reading: 25,
                    calibration: 15
                };

                function updateValue() {
                    $scope.hydrometer.value = BrewCalc.adjustHydrometer(
                        $scope.hydrometer.gravity,
                        $scope.hydrometer.reading,
                        $scope.hydrometer.calibration);
                    $scope.hydrometer.valueP = BrewCalc.toPlato($scope.hydrometer.value);
                };

                $scope.$watch("hydrometer.gravity+hydrometer.reading+hydrometer.calibration", function() {
                    $scope.hydrometer.gravityP = BrewCalc.toPlato($scope.hydrometer.gravity);
                    updateValue();
                    
                });

                $scope.updateGravity = function() {
                    $scope.hydrometer.gravity = BrewCalc.fromPlato($scope.hydrometer.gravityP);
                };
                
            }
        };
    });

    calculator.directive("calculatorRefract", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-refract.html',
            controller: function($scope, BrewCalc) {

                $scope.refractometer = {
                    OG: 1.050,
                    FG: 1.025,
                    correction: 1
                };

                function updateValue() {
                    $scope.refractometer.valueP = BrewCalc.adjustRefractometer(
                        $scope.refractometer.OGP,
                        $scope.refractometer.FGP,
                        $scope.refractometer.correction);
                    $scope.refractometer.value = BrewCalc.fromPlato($scope.refractometer.valueP);
                    $scope.refractometer.ABV = BrewCalc.calculateABV($scope.refractometer.OG, $scope.refractometer.value);
                };

                $scope.$watch("refractometer.OG+refractometer.FG+refractometer.correction", function() {
                    $scope.refractometer.OGP = BrewCalc.toPlato($scope.refractometer.OG);
                    $scope.refractometer.FGP = BrewCalc.toPlato($scope.refractometer.FG);
                    updateValue();
                });

                $scope.updateOG = function() {
                    $scope.refractometer.OG = BrewCalc.fromPlato($scope.refractometer.OGP);
                };

                $scope.updateFG = function() {
                    $scope.refractometer.FG = BrewCalc.fromPlato($scope.refractometer.FGP);
                };
                
            }
        };
    });

})();