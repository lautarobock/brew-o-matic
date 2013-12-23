(function() {

	var settings = angular.module("settings", []);

	settings.controller("UserSettingsCtrl",function($scope,User,$rootScope) {

        $scope.water = {
            cations: {},
            anions: {}
        };


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
    

    settings.controller("SettingsTabCtrl",function($scope) {
        $scope.sortTabs = ['data','water'];
        $scope.tabs = {
            data: {
                title: 'Datos',
                template: 'data'
            },
            water: {
                title: 'Ajuste Agua',
                template: 'water'
            }
        };

        $scope.selectedTab = 'data';

        $scope.changeTab = function(tab) {
            $scope.selectedTab=tab;
            $scope.$parent.notifications = [];
        };
    });

})();