(function() {


    var share = angular.module('share', ['ngResource',
                                        'ngSanitize',
                                        'data',
                                        'resources',
                                        'helper',
                                        'login',
                                        'comments',
                                        'brew-o-module.controller',
                                        'ui.bootstrap',
                                        'googlechart',
                                        'settings',
                                        'water',
                                        'notification',
                                        'env',
                                        'observer']);

    share.run(function($rootScope,version,env,color,$location) {

        $rootScope.version = version;
        $rootScope.env = env;
        $rootScope.color = color;

        $rootScope.sharedUrl = function(_id) {
            return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        };

    });

    share.controller("ShareController", function(
                    $scope,
                    Recipe,
                    $location,
                    BrewHelper,
                    HopUse,
                    HopForm,
                    User,
                    $rootScope,
                    $filter,
                    BrewCalc) {



        $rootScope.BrewCalc = BrewCalc;

        $rootScope.BrewHelper = BrewHelper;

        $scope.formatDate = function(date) {
            date = new Date(date);
            //Fecha de hoy en segundos
            var today = new Date().getTime()/1000;
            //Fecha del comentario en segundos
            var dateSec = date.getTime()/1000;

            //Diferencia en segundos
            var diffSec = today-dateSec;

            if (diffSec<60) { // Si es menos de un minuto
                return "Hace menos de un minuto"
            } if (diffSec < (60*60)) { // Si es menos de una hora
                return "Hace " + Math.round(diffSec/60) + " minutos";
            } if (date.getDate() == new Date().getDate()) { //si aun es el mismo dia
                return "Hoy" + " hace " + Math.round(diffSec/60/60) + " horas";
            } if (date.getDate() == new Date().getDate()-1 ) { // Si fue durane el dia de ayer
                return "Ayer " + $filter('date')(date,'HH:mm');
            } else {
                return $filter('date')(date,'dd/MM/yyyy HH:mm');
            }
        };

        $scope.hopUses = HopUse.query();

        $scope.hopForms = HopForm.query();

        $scope.$on('$locationChangeSuccess', function(event) {
            console.log("cambio");
            $scope.notFound = false;
            $scope.recipe = Recipe.get({id:$location.path().substr(1,$location.path().length-1)},function() {
                if (!$scope.recipe._id) {
                    $scope.notFound = true;
                    console.log("Receta no encotrada");
                }
                BrewCalc.fixEmptyValues($scope.recipe);
            });
        });


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
