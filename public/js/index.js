(function() {


    var index = angular.module('index', ['ngResource','ngRoute','data','resources','helper','login','comments','googlechart']);

    index.constant("version",'0.7')
 
    index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/recipe', {templateUrl: 'partial/recipe-list.html',   controller: 'RecipeListCtrl'}).
                when('/recipe/edit/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/clone/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/new', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/stats', {templateUrl: 'partial/user/user-stats.html', controller: 'UserStatsCtrl'}).
                otherwise({redirectTo: '/recipe'});
    }]);

    index.controller("UserStatsCtrl",function($scope,User,$rootScope) {
        $scope.$watch('user',function() {
            $scope.stats = User.findStats();
        });
        
        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Estadisticas'
        }];
    });
    
    index.controller("ShareController", function($scope) {
        $scope.recipe = Recipe.get({id:$routeParams.recipeId});
    });

    index.controller("MainController",function($scope,$rootScope) {
        $rootScope.breadcrumbs = [];
        
        $scope.login = function() {
            var button = $($($("#signinButton").children()[0]).children()[0])
            button.click();
        };
    });
    
    


    
    index.run(function($rootScope,version,$filter,$location) {
        $rootScope.version = version;

        $rootScope.encodeName = function(name) {
            return encodeURIComponent(name);
        };
        
        $rootScope.sharedUrl = function(_id) {
            return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        };
        
        $rootScope.formatDate = function(date) {
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
    });

})();