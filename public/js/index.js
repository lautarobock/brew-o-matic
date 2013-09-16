(function() {

    var SRM = ['#FFFFFF','FFE699' , '#FFD878' , '#FFCA5A' , '#FFBF42' , '#FBB123' , '#F8A600' , '#F39C00' , '#EA8F00' , '#E58500' , '#DE7C00',
                '#D77200' , '#CF6900' , '#CB6200' , '#C35900' , '#BB5100' , '#B54C00' , '#B04500' , '#A63E00' , '#A13700' , '#9B3200',
                '#952D00' , '#8E2900' , '#882300' , '#821E00' , '#7B1A00' , '#771900' , '#701400' , '#6A0E00' , '#660D00' , '#5E0B00',
                '#5A0A02' , '#600903' , '#520907' , '#4C0505' , '#470606' , '#440607' , '#3F0708' , '#3B0607' , '#3A070B' , '#36080A'];
    
    var index = angular.module('index', ['ngResource']);
    
    index.controller("RecipeListCtrl", function ($scope) {
        
    });
 
    index.factory("BrewHelper",function() {
        return {
            toLbs: function(kg) {
                return kg / 0.45359;
            },
            toGal: function(liters) {
                return liters * 0.264172052637296;
            },
            toPpg: function(potential) {
                return potential * 1000 - 1000;
            },
            toPotential: function(ppg) {
                return this.round((ppg + 1000) / 1000,1000);
            },
            round: function (value, zeros) {
                return Math.round(value*zeros)/zeros;
            }
        };
    });
 
    index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/recipe', {templateUrl: 'partial/recipe-list.html',   controller: 'RecipeListCtrl'}).
                when('/recipe/id:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/new', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                otherwise({redirectTo: '/recipe'});
    }]);
    
    index.controller("MainController",function($scope,Person) {
        //$scope.$on('fbdata',function(event,args) {
        //    $scope.me = Person.findByFb({fb_id:args.id});
        //});
        $scope.me = {
            name: 'User'
        };
    });
    

    index.controller("RecipeDetailCtrl", function ($scope,BrewHelper) {
        
        $scope.recipe = {
            "GrainCalcMethod": "2",
            totalAmount: 7.2,
            totalHop: 0.041,
            CALCCOLOUR: 25.5,
            BATCH_SIZE: 20.8,
            EFFICIENCY: 56,
            OG: 1.059,
            "FERMENTABLES": {
                "FERMENTABLE": [
                  {
                    "NAME": "Pilsner",
                    "VERSION": "1",
                    "AMOUNT": 5.000,
                    "TYPE": "Grain",
                    "YIELD": "80.434782608695485",
                    "COLOR": 1.7,
                    "POTENTIAL": 1.037,
                    "PERCENTAGE": 69.44
                  },
                  {
                    "NAME": "Munich I",
                    "VERSION": "1",
                    "AMOUNT": 1.400,
                    "TYPE": "Grain",
                    "YIELD": "82.608695652173992",
                    "COLOR": 7.1,
                    "POTENTIAL": 1.038,
                    "PERCENTAGE": 19.44
                  },
                  {
                    "NAME": "Crystal 140",
                    "VERSION": "1",
                    "AMOUNT": 0.400,
                    "TYPE": "Grain",
                    "YIELD": "71.739130434782425",
                    "COLOR": 140,
                    "POTENTIAL": 1.033,
                    "PERCENTAGE": 5.56
                  },
                  {
                    "NAME": "Chocolate",
                    "VERSION": "1",
                    "AMOUNT": 0.200,
                    "TYPE": "Grain",
                    "YIELD": "63.043478260869378",
                    "COLOR": 350,
                    "POTENTIAL": 1.029,
                    "PERCENTAGE": 2.78
                  },
                  {
                    "NAME": "Crystal 60",
                    "VERSION": "1",
                    "AMOUNT": 0.200,
                    "TYPE": "Grain",
                    "YIELD": "73.913043478260931",
                    "COLOR": 60,
                    "POTENTIAL": 1.034,
                    "PERCENTAGE": 2.78
                  }
                ]
            },
            "HOPS": {
                "HOP": [
                  {
                    "NAME": "Magnum",
                    "VERSION": "1",
                    "ALPHA": 12,
                    "AMOUNT": 0.018,
                    "USE": "First Wort",
                    "TIME": 75,
                    "FORM": "Pellet"
                  },
                  {
                    "NAME": "East Kent Golding",
                    "VERSION": "1",
                    "ALPHA": 5,
                    "AMOUNT": 0.01,
                    "USE": "Boil",
                    "TIME": 30,
                    "FORM": "Pellet"
                  },
                  {
                    "NAME": "East Kent Golding",
                    "VERSION": "1",
                    "ALPHA": 5,
                    "AMOUNT": 0.013,
                    "USE": "Boil",
                    "TIME": 0,
                    "FORM": "Pellet"
                  }
                ]
            }
        };
        
        $scope.removeFermentable = function(fermentable) {
            var index = $scope.recipe["FERMENTABLES"]["FERMENTABLE"].indexOf(fermentable);
            $scope.recipe["FERMENTABLES"]["FERMENTABLE"].splice(index, 1);
            $scope.changeAmount();
        };
        
        $scope.addFermentable = function() {
            /*
             * Yield y Potential:
             * 82.608695652173992 -> 1.038
             * 
             */
            $scope.recipe["FERMENTABLES"]["FERMENTABLE"].push({
                "NAME": "Pilsner",
                "VERSION": "1",
                "AMOUNT": 1,
                "TYPE": "Grain",
                "YIELD": 0, 
                "COLOR": 1.7,
                "POTENTIAL": 1.037,
                "PERCENTAGE": 100
            });
            $scope.changeAmount();
        };
        
        $scope.changeAmount = function() {
            var amount = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                amount += f.AMOUNT;
            });
            $scope.recipe.totalAmount = amount;
            
            //Percetajes
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                f.PERCENTAGE = BrewHelper.round(f.AMOUNT/$scope.recipe.totalAmount*100,100);
            });
            
            //Color
            var colourMCU = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                colourMCU += ((f.AMOUNT / 0.45359) * f.COLOR) / ($scope.recipe.BATCH_SIZE*0.264172052637296);
            });
            $scope.recipe.CALCCOLOUR = 1.4922 * Math.pow(colourMCU,0.6859);
            
            //OG
            var og = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                og += BrewHelper.toLbs(f.AMOUNT) * BrewHelper.toPpg(f.POTENTIAL) * ($scope.recipe.EFFICIENCY/100)
                        / BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            });
            $scope.recipe.OG = BrewHelper.toPotential(og);
        };
        
        $scope.hopGramsPerLiter = function(hop,batchSize) {
            return hop.AMOUNT*1000/batchSize;
        };
        
        $scope.hopPercentage = function(hop,totalHop) {
            return hop.AMOUNT/totalHop*100;
        };
        
        $scope.hopIBU = function(hop,totalHop) {
            return 0;
        };
        
        $scope.removeHop = function(hop) {
            var index = $scope.recipe["HOPS"]["HOP"].indexOf(hop);
            $scope.recipe["HOPS"]["HOP"].splice(index, 1);
        };
        
        $scope.addHop = function() {
            $scope.recipe["HOPS"]["HOP"].push({
                "NAME": "East Kent Golding",
                "VERSION": "1",
                "ALPHA": 5,
                "AMOUNT": 0.01,
                "USE": "Boil",
                "TIME": 30,
                "FORM": "Pellet"
            });
        };
        
        $scope.changeHop = function() {
            var amount = 0;
            angular.forEach($scope.recipe.HOPS.HOP,function(hop) {
                amount += hop.AMOUNT;
            });
            $scope.recipe.totalHop = amount;
        };
        
        $scope.convertColor = function(srm) {
            if ( srm > 40 ) {
                return "black";
            } else if ( srm < 1 ) {
                return "white";
            } else {
                return SRM[Math.round(srm)];
            }
        };
        
    });
    
    index.factory('Person',function($resource) {
        return $resource('person/fb:fb_id',{fb_id:'@fb_id'}, {
            save: { method: 'PUT', params: {}},
            findByFb: {method: 'GET', params: {}, isArray:false}
        });
    });
})();