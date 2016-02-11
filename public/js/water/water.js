(function() {
    var water = angular.module('water',['helper']);

    water.directive("waterReport", function() {
      return {
          restrict:'AE',
          scope : {
              water: '&'
          },
          templateUrl: "partial/water/water-report.html",
          controller: function($scope, BrewCalc, $rootScope) {

            $scope.canEdit = function() {
                return $rootScope.user && $rootScope.user._id === $scope.water().owner;
            };

            $scope.BrewCalc = BrewCalc;
            // $scope.totalCations = BrewCalc.totalCations;
            // $scope.totalAnions = BrewCalc.totalAnions;
            // $scope.waterBalance = BrewCalc.waterBalance;

            $scope.report={};

            //Set rows for a water report
            $scope.report.rows = [{
               cation: {
                   caption: "Calcio(Ca)",
                   name: "calcium",
                   title: "Calcium content can vary depending on the water source.  Calcium content is sometimes reported (as CaCO3) and must be converted to (ppm) by multiplying by 0.401 for use in this program.  If hardness and calcium values are provided in the water report, check the Hardness results shown below and compare to the Hardness shown in the water report.  If they don't closely agree, there may be an error in the input units. Use the calculator below to try converting the calcium concentration to the proper ppm units.  "
               },
               anion: {
                   caption: "Bicarbonato (HCO3)",
                   name: "bicarbonate",
                   title: "Bicarbonate is typically the predominant Alkalinity producer at typical drinking water pH between 6.5 and 10.5.   Bicarbonate is frequently reported (as CaCO3) units.  This must be converted to (ppm) by multiplying by 1.22 for use in this program.   If the report does not balance, check the reporting units and convert as necessary.  Check the alkalinity result below and compare to the alkalinity from the water report.  If they don't match very well, there may be a units error.  Use the calculator below.  "
               }
            },{
               cation: {
                   caption: "Magnesio (Mg)",
                   name: "magnesium",
                   title: "Magnesium is typically low in most drinking water and is almost always at lower concentration than Calcium.  Magnesium is sometimes reported (as CaCo3) and must be converted to (ppm) by multiplying by 0.243 for use in this program.  If hardness and magnesium values are given in the water report, check the Hardness results shown below and compare to the Hardness shown in the water report.  If they don't closely agree, there may be an error in the input units.  Use the calculator below to try converting the magnesium concentration to proper ppm units."
               },
               anion: {
                   caption: "Carbonato (CO3)",
                   name: "carbonate",
                   title: "Most drinking water supplies typically have a pH of less than 9.  Carbonate ion does not exist in water with pH below 8 and is a minor component in water with its pH between 8 and 9.  Carbonate may be reported in (as CaCO3) units and must be converted to (ppm) by multiplying by 0.60 for use in this program.   If the water supply pH is below 9, Carbonate can be assumed to be Zero with little error.  This is a component that can be ignored if the concentration is unknown."
               }
            },{
               cation: {
                   caption: "Sodio (Na)",
                   name: "sodium",
                   title: "Sodium content in drinking water is highly variable.  Low to moderate sodium is an important factor in producing good beer.  This is a component that should not be ignored."
               },
               anion: {
                   caption: "Sulfato (SO4)",
                   name: "sulfate",
                   title: "Sulfate is an important flavor component in brewing water.  If the water report result is presented in (SO4-S) units, that value must be multiplied by 3 for use in this program.  Use the calculator."
               }
            },{
               cation: {
                   caption: "Potasion (K)",
                   name: "potassium",
                   title: "Potassium is typically low in most drinking water.  If the Potassium content is unknown, enter Zero.  This is a water component that can be ignored for most water sources."
               },
               anion: {
                   caption: "Cloruros (Cl)",
                   name: "chloride",
                   title: "Chloride is an important flavor component in brewing water.  It is not the same as Chlorine.  Do not enter Chlorine concentration here.  Chlorine is a common water disinfectant and typically ranges from about 1 to 3 ppm in most municipal water supplies.   Chloride concentration is typically much higher than that."
               }
            },{
               cation: {
                   caption: "Hierro (Fe)",
                   name: "iron",
                   title: 'Iron is typically at low concentration (<0.3 ppm) in good brewing water.  Iron greater than this concentration may be tasted in the water and beer.  If the Iron concentration is not known, enter Zero.  This is a water component that can be ignored in this input table if its concentration is not known.'
               },
               anion: {
                   caption: "Nitratos (NO3)",
                   name: "nitrate",
                   title: "Nitrate is typically low in most drinking water.  If the result is presented in (NO3-N) units, it must be multiplied by 4.43 for use in this program.  Enter Zero if this concentration is not known.  This is a component that can be ignored if its concentration is unknown. Nitrate should typically be less than 10 ppm for potable water."
               }
            },{
               cation: {},
               anion: {
                   caption: "Nitritos (NO2)",
                   name: "nitrite",
                   title: "Nitrite is typically low in most drinking water.  Enter Zero if this concentration is not known.  This is a component that can be ignored if its concentration is unknown."
               }
            },{
               cation: {},
               anion: {
                   caption: "Fluor (F)",
                   name: "fluoride",
                   title: "Fluoride is typically at low concentrations in drinking water.  Enter Zero if the concentration is not known.  This is a component that can be ignored if its concentration is unknown."
               }
            }];
          }
      };
    });
})();
