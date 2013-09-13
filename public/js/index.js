(function() {
    
    var SRM = ['#FFFFFF','#F3F993','#F5F75C','#F6F513','#EAE615','#E0D01B','#D5BC26','#CDAA37','#C1963C','#BE8C3A','#BE823A','#C17A37','#BF7138',
        '#BC6733','#B26033','#A85839','#985336','#8D4C32','#7C452D','#6B3A1E','#5D341A','#4E2A0C','#4A2727','#361F1B','#261716','#231716','#19100F',
        '#16100F','#120D0C','#100B0A','#050B0A'];
    
    var index = angular.module('index', ['ngResource']);
    
    index.controller("RecipeListCtrl", function ($scope) {
        
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
    

    index.controller("RecipeDetailCtrl", function ($scope) {
        
        $scope.recipe = {
            "GrainCalcMethod": "2",
            totalAmount: 7.2,
            CALCCOLOUR: 25.5,
            BATCH_SIZE: 20.8,
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
                f.PERCENTAGE = f.AMOUNT/$scope.recipe.totalAmount*100;
            });
            
            //Color
            var colourMCU = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                colourMCU += ((f.AMOUNT / 0.45359) * f.COLOR) / ($scope.recipe.BATCH_SIZE*0.264172052637296);
            });
            $scope.recipe.CALCCOLOUR = 1.4922 * Math.pow(colourMCU,0.6859);
        };
        
        $scope.convertColor = function(srm) {
            if ( srm > 30 ) {
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