(function() {

	var settings = angular.module("settings", []);

    settings.controller("SettingsWaterDetailCtrl", function($scope,WaterReport,$routeParams,$rootScope,alertFactory,$location) {

        $rootScope.$watch('user',function(user) {
            if ( !user) return;
            if ($routeParams.waterId) {
                console.log("INFO", "Edit Water report");
                $scope.water = WaterReport.get({_id: $routeParams.waterId});
            } else {
                console.log("INFO", "New Water report");
                $scope.water = new WaterReport({
                    date: new Date(),
                    name: 'Mi Reporte de agua',
                    owner: $scope.user._id,
                    cations: {},
                    anions: {}
                });
            }
        });

		$scope.canEdit = function() {
			return $rootScope.user && $rootScope.user._id === $scope.water.owner;
		};

        $scope.save = function() {
            $scope.water.$save(function(saved) {
                alertFactory.create('success','Reporte de agua Guardado!');
                $location.path('/settings/water/' + saved._id)
            });
        };
    });

    settings.controller("SettingsWaterCtrl", function($scope,WaterReport,$rootScope,$timeout) {
        $rootScope.$watch('user',function(user) {
            if (user) {
                $scope.reports = WaterReport.query();
            }
        });


        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Agua'
        }];

        $scope.removeReport = function(report) {
            $('#confirmation'+report._id).modal('hide');
            $timeout(function() {
                report.$remove(function() {
                    $scope.reports = WaterReport.query();
                });
            },500);
        };
    });

	settings.controller("UserSettingsCtrl",function($scope,User,$rootScope,PitchRate) {

        $rootScope.$watch('user',function(user) {
            if ( !user) return;
            $scope.user.settings.defaultValues.pitchRate = $scope.user.settings.defaultValues.pitchRate || 0.75;
        });
		
        $scope.inputType = 'password';
        $scope.toggleAccessInput = function() {
            if ( $scope.inputType === 'password' ) {
                $scope.inputType = 'text';
            } else {
                $scope.inputType = 'password';
            }
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

		$scope.pitchRates = PitchRate.query();

        $scope.notifications = [];
        $scope.save = function() {
            //$scope.user.settings.defaultValues = $scope.dv;
			$scope.user.settings.defaultValues.pitchRate = parseFloat($scope.user.settings.defaultValues.pitchRate);
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
        $scope.sortTabs = ['data'];
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
