(function() {


    var index = angular.module('index', [
                                'ngResource',
                                'ngRoute',
                                'ngSanitize',
                                'ngAnimate',
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
                                'settings',
                                'water',
                                'env',
                                'observer']);

    index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/recipe', {templateUrl: 'partial/recipe-list.html',   controller: 'RecipeListCtrl'}).
                when('/collaborated', {templateUrl: 'partial/recipe-collaborated.html',   controller: 'RecipeCollaboratedCtrl'}).
                when('/favorites', {templateUrl: 'partial/recipe-favorite.html',   controller: 'RecipeFavoriteCtrl'}).
                when('/public', {templateUrl: 'partial/recipe-public.html',   controller: 'RecipePublicCtrl'}).
                when('/home/:userId', {templateUrl: 'partial/user/home.html',   controller: 'HomeCtrl'}).
                when('/recipe/edit/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/clone/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/new', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                //when('/stats', {templateUrl: 'partial/user/user-stats.html', controller: 'UserStatsCtrl'}).
                when('/settings/water', {templateUrl: 'partial/user/user-settings-water.html', controller: 'SettingsWaterCtrl'}).
                when('/settings/water/new', {templateUrl: 'partial/user/settings/user-settings-water-detail.html', controller: 'SettingsWaterDetailCtrl'}).
                when('/settings/water/:waterId', {templateUrl: 'partial/user/settings/user-settings-water-detail.html', controller: 'SettingsWaterDetailCtrl'}).
                when('/settings', {templateUrl: 'partial/user/user-settings.html', controller: 'UserSettingsCtrl'}).
                when('/notification', {templateUrl: 'partial/user/user-notification.html', controller: 'NotificationsCtrl'}).
                when('/data/:entity', {templateUrl: 'partial/data/abm.html', controller: 'AbmCtrl'}).
                when('/admin/:entity', {templateUrl: 'partial/admin/admin.html', controller: 'AdminCtrl'}).
                otherwise({redirectTo: '/recipe'});
    }]);

    index.config(['abmProvider',function(abmProvider) {
        abmProvider.setTemplateDir('template');
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
    

    index.controller("MainController",function($scope,$rootScope,User) {
        $rootScope.breadcrumbs = [];
        
        $scope.login = function() {
            googleSignIn();
        };

        var infos = [{
            text: 'Si tenes 2 minutos, podes rellenar una encuesta sobre uso de Brew-o-Matic.',
            link: {
                text: 'Abrir Encuesta',
                href: 'https://docs.google.com/forms/d/1lCObRGFtB2g3S3jiwwNweNUz5hRrLuyni2zFZz40R58/viewform'
            },
            id: 'closeUseSurvey'
        }];

        $scope.infos = []

        $scope.closeInfo = function(index) {
            $scope.infos.splice(index,1);
        };

        $scope.closeForEver = function(info, index) {
            $scope.user.settings[info.id] = true;
            User.updateSettings($scope.user, function() {
                $scope.infos.splice(index,1);    
            });
        }

        $scope.$watch("user", function(user) {
            if ( user ) {
                //elimino las info que ya cerre desde la configuracion del usuario
                for ( var i=0; i<infos.length; i++ ) {
                    if ( !user.settings[infos[i].id] ) {
                        $scope.infos.push(infos[i]);
                    }
                }
            }
        })
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


    
    index.run(function($rootScope,version,$filter,$location,BrewCalc,env,color,alertFactory,BrewHelper) {

        $rootScope.BrewCalc = BrewCalc;

        $rootScope.BrewHelper = BrewHelper;

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
