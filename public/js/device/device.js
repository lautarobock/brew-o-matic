(function() {

	var device = angular.module("device", ['resources']);

	device.controller("DeviceController", function($scope,TempDevice) {

		$scope.entity = 'TempDevice';
        
        $scope.config = {
            data: TempDevice,
            name: "Dispositivos",
            singular: "Dispositivo",
            orderBy: "name",
            headers: [{
                    field:'name',
                    caption: 'Nombre'
                },{
                    field:'code',
                    caption: 'Codigo'
                }
            ]
        };

	});

})();