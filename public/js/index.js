(function() {


    var index = angular.module('index', [
                                'ngResource',
                                'ngRoute',
                                'ngSanitize',
                                'data',
                                'resources',
                                'helper',
                                'login',
                                'comments',
                                'googlechart',
                                'brew-o-module.controller',
                                'notification',
                                'abm',
                                'gt.abm',
                                'admin',
                                'ui.bootstrap',
                                'alerts',
                                'env']);

    index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/recipe', {templateUrl: 'partial/recipe-list.html',   controller: 'RecipeListCtrl'}).
                when('/favorites', {templateUrl: 'partial/recipe-favorite.html',   controller: 'RecipeFavoriteCtrl'}).
                when('/public', {templateUrl: 'partial/recipe-public.html',   controller: 'RecipePublicCtrl'}).
                when('/home/:userId', {templateUrl: 'partial/user/home.html',   controller: 'HomeCtrl'}).
                when('/recipe/edit/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/clone/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/new', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                //when('/stats', {templateUrl: 'partial/user/user-stats.html', controller: 'UserStatsCtrl'}).
                when('/settings', {templateUrl: 'partial/user/user-settings.html', controller: 'UserSettingsCtrl'}).
                when('/notification', {templateUrl: 'partial/user/user-notification.html', controller: 'NotificationsCtrl'}).
                when('/data/:entity', {templateUrl: 'partial/data/abm.html', controller: 'AbmCtrl'}).
                when('/admin/:entity', {templateUrl: 'partial/admin/admin.html', controller: 'AdminCtrl'}).
                otherwise({redirectTo: '/recipe'});
    }]);

    index.controller("HomeCtrl",function($scope,$rootScope,User,Recipe,$routeParams) {
        
        $scope.$watch('user',function() {
            //$scope.notifications = Notification.query($scope.updateCount);
            $scope.viewUser = User.get({id:$routeParams.userId},function() {
                $rootScope.breadcrumbs = [{
                    link: '#',
                    title: 'Home'
                },{
                    link: '#',
                    title: $scope.viewUser.name
                }];
            });
            
            $scope.recipes = Recipe.findByUser({id:$routeParams.userId});
        });
        
        $scope.addFavorites = function(recipe) {
            User.addToFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };        
        
    });    
    
    var notification = angular.module("notification",[]);
    
    notification.factory("notificationData", function() {
        return {
            listener: null,
            reset: function() {
                if ( this.listener ) {
                    this.listener();
                }
            }
        };
    });
    
    notification.controller("NotificationsCtrl",function($scope,Notification,$rootScope,notificationData) {
        
        notificationData.reset();
        
        $scope.updateCount = function(notifications) {
            $scope.countUnread = 0;
            $scope.countNew = 0;
            angular.forEach(notifications, function(not) {
                if ( not.status == 'new') {
                    $scope.countNew++;
                } else if ( not.status == 'unread') {
                    $scope.countUnread++;
                }
            });
        };

        $scope.$watch('user',function() {
            $scope.notifications = Notification.query($scope.updateCount);
        });


        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Notificaciones'
        }];
        
        $scope.markAsRead = function(notification) {
            if ( notification.status != 'read' ) {
                notification.status = 'read';
                notification.$save();
                $scope.updateCount($scope.notifications);
            }
        };
        
        $scope.statusClass = function(notification) {
            if ( notification.status == 'unread') { 
                return 'gt-notification-unread';
            } else if ( notification.status == 'new') {
                return 'gt-notification-new';
            }
            return '';
        };
        
        //$rootScope.notificationCount = 0;
        //$rootScope.notificationClass = '';
        
    });
    
    
    
    index.controller("UserSettingsCtrl",function($scope,User,$rootScope) {
        $scope.disconnectUser = function() {
            var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
                gapi.auth.getToken().access_token;
            // Realiza una solicitud GET asíncrona.
            $.ajax({
                type: 'GET',
                url: revokeUrl,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(nullResponse) {
                    //document.getElementById('signinButton').setAttribute('style', 'display: block');
                    $rootScope.user = undefined;
                    $scope.$apply();
                },
                error: function(e) {
                    // Gestiona el error
                    // console.log(e);
                    // Puedes indicar a los usuarios que se desconecten de forma manual si se produce un error
                    // https://plus.google.com/apps
                }
            });
        };

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Configuracion'
        }];
        
        $scope.notifications = [];
        $scope.save = function() {
            //$scope.user.settings.defaultValues = $scope.dv;      
            User.updateSettings($scope.user, function() {
                $scope.notifications.push({
                    type:'success',
                    title:'Configuracion guardada!',
                    text:'Tus cambios han sido guardados con exito!'
                });    
            });
            
        };
    });
    
    // index.controller("ShareController", function($scope) {
    //     $scope.recipe = Recipe.get({id:$routeParams.recipeId});
    // });

    index.controller("MainController",function($scope,$rootScope) {
        $rootScope.breadcrumbs = [];
        
        $scope.login = function() {
            var button = $($($("#signinButton").children()[0]).children()[0])
            button.click();
        };
    });
    

    var alerts = angular.module("alerts",[]);

    alerts.factory("alertFactory", function($rootScope) {
        var alerts = [];
        return {
            create: function(type,text,title) {
                alerts = [];
                var a = {
                    type:  type,
                    text: text,
                    title: title
                };
                alerts.push(a)
                setTimeout(function() {
                    util.Arrays.remove(alerts,a);
                    $rootScope.$apply();
                },5000)
            },
            getAlerts: function() {
                return alerts;
            }
        };
    });


    
    index.run(function($rootScope,version,$filter,$location,BrewCalc,env,color,alertFactory) {

        $rootScope.BrewCalc = BrewCalc;

        $rootScope.version = version;

        $rootScope.env = env;
        
        $rootScope.color = color;

        $rootScope.getAlerts = function() {
            return alertFactory.getAlerts();
        };

        $rootScope.encodeName = function(name) {
            return encodeURIComponent(name);
        };
        
        $rootScope.sharedUrl = function(_id) {
            return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        };
        
        $rootScope.formatDate = function(date) {
            return util.formatDate(date, $filter('date'))
        };
    });

})();
