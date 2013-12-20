(function() {

	var settings = angular.module("settings", []);

	settings.controller("UserSettingsCtrl",function($scope,User,$rootScope) {

		$scope.report={};

		$scope.water = {
			cations: {},
			anions: {}
		}

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
		}];

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