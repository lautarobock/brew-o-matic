(function() {

	var device = angular.module("device", ['resources']);

	device.controller("DeviceController", function($scope,TempDevice,Recipe) {

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
                },{
                    field:'recipe_id',
                    caption: 'Receta',
                    type: 'combo-object',
                    comboKey: '_id',
                    comboValue: 'NAME',
                    data: Recipe.query()
                }
            ]
        };

	});

})();