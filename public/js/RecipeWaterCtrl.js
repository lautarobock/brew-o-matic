(function() {

    var module = angular.module('brew-o-module.controller');

    module.controller('RecipeWaterCtrl', function($scope, BrewCalc, WaterReport) {

        WaterReport.query(function(reports) {
            $scope.reports = reports;
        });

        $scope.ions = [
            {txt: 'Ca',sup:'+2',key:'ca',balance: 'Ca_balance',showLevel:true,wr:'calcium',type:'cations'},
            {txt: 'Mg',sup:'+2',key:'mg',balance: 'Mg_balance',showLevel:true,wr:'magnesium',type:'cations'},
            {txt: 'SO',sup:'-2',sub:'4',key:'so4',balance: 'SO4_balance',showLevel:true,wr:'sulfate',type:'anions'},
            {txt: 'Na',sup:'+',key:'na',balance: 'Na_balance',showLevel:true,wr:'sodium',type:'cations'},
            {txt: 'Cl',sup:'-',key:'cl',balance: 'Cl_balance',showLevel:true,wr:'chloride',type:'anions'},
            {txt: 'HCO',sup:'-',sub:'3',key:'hco3',balance: 'SO4Cl_balance',wr:'bicarbonate',type:'anions'},
            {txt: 'Alkalinity',key:'alc'}
        ];

        $scope.output = {
            diluted: new Array(6),
            diff: new Array(6),
            salts: new Array(6),
            result: new Array(6),
            adjusted: new Array(6)
        };

        $scope.updateSource = function() {
            var report = $scope.getReport($scope.recipe.water.selectedSource);
            if ( report ) {
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    $scope.recipe.water.source[ion.key] = report[ion.type][ion.wr];
                }
                $scope.onChange();
            }
        };

        $scope.sourceEqual = function() {
            var report = $scope.getReport($scope.recipe.water.selectedSource);
            if ( report ) {
                var ret = true;
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    ret = ret && ($scope.recipe.water.source[ion.key] === report[ion.type][ion.wr]);
                }
                return ret;
            } else {
                return false;
            }
        };

        $scope.updateTarget = function() {
            var report = $scope.getReport($scope.recipe.water.selectedTarget);
            if ( report ) {
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    $scope.recipe.water.target[ion.key] = report[ion.type][ion.wr];
                }
                $scope.onChange();
            }
        };

        $scope.targetEqual = function() {
            var report = $scope.getReport($scope.recipe.water.selectedTarget);
            if ( report ) {
                var ret = true;
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    ret = ret && ($scope.recipe.water.target[ion.key] === report[ion.type][ion.wr]);
                }
                return ret;
            } else {
                return false;
            }
        };

        $scope.getReport = function(id) {
            if ( $scope.reports ) {
                var ret = null;
                angular.forEach($scope.reports, function(report) {
                    if (report._id === id) {
                        ret = report;
                    }
                });
                return ret;
            }
        };

        $scope.getLiters = function() {
            var total = BrewCalc.calculateBoilSize($scope.recipe.BATCH_SIZE,
                                           $scope.recipe.TrubChillerLosses,
                                           $scope.recipe.BOIL_TIME,
                                           $scope.recipe.PercentEvap,
                                           $scope.recipe.TopUpWater)
                    +BrewCalc.actualMashVolume($scope.recipe.MASH.MASH_STEPS.MASH_STEP.length-1,
                                               0,
                                               $scope.recipe.MASH.MASH_STEPS.MASH_STEP)
                    +$scope.recipe.SpargeDeadSpace
                    +$scope.recipe.GrainAbsorbtion*$scope.recipe.totalAmountMash;
            $scope.recipe.water.liters = Math.round(total);
            $scope.onChange();
        };

        $scope.onChange = function() {
            var input = {
                dilution: $scope.recipe.water.dilution,
                mashvolume: $scope.recipe.water.liters,
                source: convertArray($scope.recipe.water.source),
                target: convertArray($scope.recipe.water.target),
                CaCO3: $scope.recipe.water.CaCO3,
                NaHCO3: $scope.recipe.water.NaHCO3,
                CaSO4: $scope.recipe.water.CaSO4,
                CaCl2: $scope.recipe.water.CaCl2,
                MgSO4: $scope.recipe.water.MgSO4,
                NaCl: $scope.recipe.water.NaCl
            };

            BrewCalc.waterCalculation(input, $scope.output);

            $scope.recipe.water.source.alc = input.source[6];
        };

        function convertArray(ions) {
            var ret = [];
            angular.forEach($scope.ions, function(ion) {
                ret.push(ions[ion.key]);
            })
            return ret;
        };

        $scope.onChange();


    })
    .filter('result', function() {
        return function(value) {
            if ( value > 0 ) {
                return '+ ' + value;
            } if ( value === 0 ) {
                return '0';
            } else {
                return '- '+(-value);
            }
        }
    });
})();
