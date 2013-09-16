(function() {

    var SRM = ['#FFFFFF','FFE699' , '#FFD878' , '#FFCA5A' , '#FFBF42' , '#FBB123' , '#F8A600' , '#F39C00' , '#EA8F00' , '#E58500' , '#DE7C00',
                '#D77200' , '#CF6900' , '#CB6200' , '#C35900' , '#BB5100' , '#B54C00' , '#B04500' , '#A63E00' , '#A13700' , '#9B3200',
                '#952D00' , '#8E2900' , '#882300' , '#821E00' , '#7B1A00' , '#771900' , '#701400' , '#6A0E00' , '#660D00' , '#5E0B00',
                '#5A0A02' , '#600903' , '#520907' , '#4C0505' , '#470606' , '#440607' , '#3F0708' , '#3B0607' , '#3A070B' , '#36080A'];
    
    var U_time = [0,5,10,15,20,25,30,35,40,45,50,55,60,70,80,90,100,110,120];
    var U_gravity = [30,40,50,60,70,80,90,100,110,120];
    var U = {
        '0': {
            '30':0,
            '40':0,
            '50':0,
            '60':0,
            '70':0,
            '80':0,
            '90':0,
            '100':0,
            '110':0,
            '120':0
        },
        '5': {
            '30':0.055,
            '40':0.050,
            '50':0.046,
            '60':0.042,
            '70':0.038,
            '80':0.035,
            '90':0.032,
            '100':0.029,
            '110':0.027,
            '120':0.025
        },
        '10': {
            '30':0.100,
            '40':0.091,
            '50':0.084,
            '60':0.076,
            '70':0.070,
            '80':0.064,
            '90':0.058,
            '100':0.053,
            '110':0.049,
            '120':0.045
        },
        '15': {
            '30':0.137,
            '40':0.125,
            '50':0.114,
            '60':0.105,
            '70':0.096,
            '80':0.087,
            '90':0.080,
            '100':0.073,
            '110':0.067,
            '120':0.061
        },
        '20': {
            '30':0.167,
            '40':0.153,
            '50':0.140,
            '60':0.128,
            '70':0.117,
            '80':0.107,
            '90':0.098,
            '100':0.089,
            '110':0.081,
            '120':0.074
        },
        '25': {
            '30':0.192,
            '40':0.175,
            '50':0.160,
            '60':0.147,
            '70':0.134,
            '80':0.122,
            '90':0.112,
            '100':0.102,
            '110':0.094,
            '120':0.085
        },
        '30': {
            '30':0.212,
            '40':0.194,
            '50':0.177,
            '60':0.162,
            '70':0.148,
            '80':0.135,
            '90':0.124,
            '100':0.113,
            '110':0.103,
            '120':0.094
        },
        '35': {
            '30':0.229,
            '40':0.209,
            '50':0.191,
            '60':0.175,
            '70':0.160,
            '80':0.146,
            '90':0.133,
            '100':0.122,
            '110':0.111,
            '120':0.102
        },
        '40': {
            '30':0.242,
            '40':0.221,
            '50':0.202,
            '60':0.185,
            '70':0.169,
            '80':0.155,
            '90':0.141,
            '100':0.129,
            '110':0.118,
            '120':0.108
        },
        '45': {
            '30':0.253,
            '40':0.232,
            '50':0.212,
            '60':0.194,
            '70':0.177,
            '80':0.162,
            '90':0.148,
            '100':0.135,
            '110':0.123,
            '120':0.113
        },
        '50': {
            '30':0.263,
            '40':0.240,
            '50':0.219,
            '60':0.200,
            '70':0.183,
            '80':0.168,
            '90':0.153,
            '100':0.140,
            '110':0.128,
            '120':0.117
        },
        '55': {
            '30':0.270,
            '40':0.247,
            '50':0.226,
            '60':0.206,
            '70':0.188,
            '80':0.172,
            '90':0.157,
            '100':0.144,
            '110':0.132,
            '120':0.120
        },
        '60': {
            '30':0.276,
            '40':0.252,
            '50':0.231,
            '60':0.211,
            '70':0.193,
            '80':0.176,
            '90':0.161,
            '100':0.147,
            '110':0.135,
            '120':0.123
        },
        '70': {
            '30':0.285,
            '40':0.261,
            '50':0.238,
            '60':0.218,
            '70':0.199,
            '80':0.182,
            '90':0.166,
            '100':0.152,
            '110':0.139,
            '120':0.127
        },
        '80': {
            '30':0.291,
            '40':0.266,
            '50':0.243,
            '60':0.222,
            '70':0.203,
            '80':0.186,
            '90':0.170,
            '100':0.155,
            '110':0.142,
            '120':0.130
        },
        '90': {
            '30':0.295,
            '40':0.270,
            '50':0.247,
            '60':0.226,
            '70':0.206,
            '80':0.188,
            '90':0.172,
            '100':0.157,
            '110':0.144,
            '120':0.132
        },
        '100': {
            '30':0.298,
            '40':0.272,
            '50':0.249,
            '60':0.228,
            '70':0.208,
            '80':0.190,
            '90':0.174,
            '100':0.159,
            '110':0.145,
            '120':0.133
        },
        '110': {
            '30':0.300,
            '40':0.274,
            '50':0.251,
            '60':0.229,
            '70':0.209,
            '80':0.191,
            '90':0.175,
            '100':0.160,
            '110':0.146,
            '120':0.134
        },
        '120': {
            '30':0.301,
            '40':0.275,
            '50':0.252,
            '60':0.230,
            '70':0.210,
            '80':0.192,
            '90':0.176,
            '100':0.161,
            '110':0.147,
            '120':0.134
        }
    };
    
    var index = angular.module('index', ['ngResource','data']);
    
    index.controller("RecipeListCtrl", function ($scope) {
        
    });
 
    index.factory("BrewHelper",function() {
        return {
            toLbs: function(kg) {
                return kg / 0.45359;
            },
            toOz: function(kg) {
                return kg * 1000 * 0.035274;
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
            },
            calculateU: function(gravity,time) {
                var g = this.toPpg(gravity);
                var m = 30;
                var M = 120;
                for (var i=0; i<U_gravity.length; i++) {   
                    if (g < U_gravity[i]) {
                        M = U_gravity[i];
                        break;
                    } else {
                        m = U_gravity[i];
                    }
                }
                var diff = M-m;
                var p = (g-m)/diff; //proporcion
                
                var valm = U[time.toString()][m.toString()];
                var valM = U[time.toString()][M.toString()];
                var valDiff = valM-valm; //Diff de valores
                var valP = valDiff*p;
                return valm+valP;
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
    

    index.controller("RecipeDetailCtrl", function ($scope,BrewHelper,Grain) {
        
        //$scope.recipe = {
        //    "GrainCalcMethod": "2",
        //    totalAmount: 7.2,
        //    totalHop: 0.041,
        //    CALCCOLOUR: 25.5,
        //    BATCH_SIZE: 20.8,
        //    EFFICIENCY: 56,
        //    OG: 1.059,
        //    CALCIBU: 31.4,
        //    FG: 1.009,
        //    "FERMENTABLES": {
        //        "FERMENTABLE": [
        //          {
        //            "NAME": "Pilsner",
        //            "VERSION": "1",
        //            "AMOUNT": 5.000,
        //            "TYPE": "Grain",
        //            "YIELD": "80.434782608695485",
        //            "COLOR": 1.7,
        //            "POTENTIAL": 1.037,
        //            "PERCENTAGE": 69.44
        //          },
        //          {
        //            "NAME": "Munich I",
        //            "VERSION": "1",
        //            "AMOUNT": 1.400,
        //            "TYPE": "Grain",
        //            "YIELD": "82.608695652173992",
        //            "COLOR": 7.1,
        //            "POTENTIAL": 1.038,
        //            "PERCENTAGE": 19.44
        //          },
        //          {
        //            "NAME": "Crystal 140",
        //            "VERSION": "1",
        //            "AMOUNT": 0.400,
        //            "TYPE": "Grain",
        //            "YIELD": "71.739130434782425",
        //            "COLOR": 140,
        //            "POTENTIAL": 1.033,
        //            "PERCENTAGE": 5.56
        //          },
        //          {
        //            "NAME": "Chocolate",
        //            "VERSION": "1",
        //            "AMOUNT": 0.200,
        //            "TYPE": "Grain",
        //            "YIELD": "63.043478260869378",
        //            "COLOR": 350,
        //            "POTENTIAL": 1.029,
        //            "PERCENTAGE": 2.78
        //          },
        //          {
        //            "NAME": "Crystal 60",
        //            "VERSION": "1",
        //            "AMOUNT": 0.200,
        //            "TYPE": "Grain",
        //            "YIELD": "73.913043478260931",
        //            "COLOR": 60,
        //            "POTENTIAL": 1.034,
        //            "PERCENTAGE": 2.78
        //          }
        //        ]
        //    },
        //    "HOPS": {
        //        "HOP": [
        //          {
        //            "NAME": "Magnum",
        //            "VERSION": "1",
        //            "ALPHA": 12,
        //            "AMOUNT": 0.018,
        //            "USE": "First Wort",
        //            "TIME": 70,
        //            "FORM": "Pellet"
        //          },
        //          {
        //            "NAME": "East Kent Golding",
        //            "VERSION": "1",
        //            "ALPHA": 5,
        //            "AMOUNT": 0.01,
        //            "USE": "Boil",
        //            "TIME": 30,
        //            "FORM": "Pellet"
        //          },
        //          {
        //            "NAME": "East Kent Golding",
        //            "VERSION": "1",
        //            "ALPHA": 5,
        //            "AMOUNT": 0.013,
        //            "USE": "Boil",
        //            "TIME": 0,
        //            "FORM": "Pellet"
        //          }
        //        ]
        //    },
        //    "YEASTS": {
        //      "YEAST": [{
        //        "NAME": "Danstar Nottingham",
        //        "VERSION": "1",
        //        "ATTENUATION": 84
        //      }]
        //    },
        //};
        $scope.recipe = {
            "GrainCalcMethod": "2",
            totalAmount: 0,
            totalHop: 0,
            CALCCOLOUR: 0,
            BATCH_SIZE: 20,
            EFFICIENCY: 65,
            OG: 1,
            CALCIBU: 0,
            FG: 1,
            "FERMENTABLES": {
                "FERMENTABLE": []
            },
            "HOPS": {
                "HOP": []
            },
            "YEASTS": {
              "YEAST": [{
                "NAME": "",
                "VERSION": "1",
                "ATTENUATION": 75
              }]
            },
        };
        
        $scope.grains = Grain.query();
        
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
            
            $scope.changeHop();
            $scope.changeYeast();
        };
        
        $scope.hopGramsPerLiter = function(hop,batchSize) {
            return hop.AMOUNT*1000/batchSize;
        };
        
        $scope.hopPercentage = function(hop,totalHop) {
            return hop.AMOUNT/totalHop*100;
        };
        
        $scope.hopIBU = function(hop) {
            var U = BrewHelper.calculateU($scope.recipe.OG,hop.TIME);
            return BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
        };
        
        $scope.removeHop = function(hop) {
            var index = $scope.recipe["HOPS"]["HOP"].indexOf(hop);
            $scope.recipe["HOPS"]["HOP"].splice(index, 1);
            $scope.changeHop();
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
            $scope.changeHop();
        };
        
        $scope.changeHop = function() {
            var amount = 0;
            var ibu = 0;
            angular.forEach($scope.recipe.HOPS.HOP,function(hop) {
                amount += hop.AMOUNT;
                ibu += $scope.hopIBU(hop);
            });
            $scope.recipe.totalHop = amount;
            $scope.recipe.CALCIBU = BrewHelper.round(ibu,10);
            
        };
        
        $scope.changeYeast = function() {
            var OG = BrewHelper.toPpg($scope.recipe.OG);
            var FG = OG * (100-$scope.recipe.YEASTS.YEAST[0].ATTENUATION)/100;
            $scope.recipe.FG = BrewHelper.toPotential(FG);
            $scope.recipe.ABV = BrewHelper.round((OG-FG)*0.131,100);
            
            //Balance Value
            var AA = (OG-FG)/OG;
            
            var RTE = 0.82 * FG + 0.18 * OG;
            
            $scope.recipe.BV = BrewHelper.round(0.8 * $scope.recipe.CALCIBU / RTE,100);
        };
        $scope.changeYeast();
        
        $scope.convertColor = function(srm) {
            if ( srm > 40 ) {
                return "black";
            } else if ( srm < 1 ) {
                return "white";
            } else {
                return SRM[Math.round(srm)];
            }
        };
        
        $scope.calulateBUGU = function(bu,gu) {
            return bu/BrewHelper.toPpg(gu);
        };
        
        $scope.changeGrain = function(fermentable) {
            angular.forEach($scope.grains,function(grain) {
                if ( fermentable.NAME == grain.name) {
                    fermentable.POTENTIAL = grain.potential;
                    fermentable.COLOR = grain.colour;
                }
            });
        };
    });
    
    index.factory('Person',function($resource) {
        return $resource('person/fb:fb_id',{fb_id:'@fb_id'}, {
            save: { method: 'PUT', params: {}},
            findByFb: {method: 'GET', params: {}, isArray:false}
        });
    });
})();