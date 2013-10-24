(function() {
    
    var abm = angular.module("abm",[]);
    
    var config = {
        Misc:  {
            name: "'Otros'",
            orderBy: "name",
            headers: [
                {
                    field:'name',
                    caption: 'Nombre'
                },{
                    field:'type',
                    caption: 'Tipo'
                },{
                    field:'use',
                    caption: 'Uso'
                }
            ]
        },
        Bottle:  {
            name: "Botellas",
            orderBy: "name",
            headers: [
                {
                    field:'_id',
                    caption: 'ID',
                    width: 25
                },{
                    field:'name',
                    caption: 'Nombre',
                    width: 25
                },{
                    field:'size',
                    caption: 'Tamaño',
                    width: 25
                },{
                    field:'colour',
                    caption: 'Color',
                    width: 25
                }
            ]
        },
        Grain: {
            name: "Granos",
            orderBy: "name",
            headers: [
                {
                    field:'name',
                    caption: 'Nombre'
                },{
                    field:'type',
                    caption: 'Tipo'
                },{
                    field:'colour',
                    caption: 'Color'
                },{
                    field:'potential',
                    caption: 'Potencial'
                }
            ]
        },
        Hop: {
            name: "Lupulos",
            orderBy: "name",
            headers: [
                {
                    field:'name',
                    caption: 'Nombre'
                },{
                    field:'alpha',
                    caption: 'AA%'
                }
            ]
        }
    };
    
    abm.controller("AbmCtrl",function($scope,$routeParams,Grain, Hop, Bottle, Misc) {
        
        $scope.allConfigs = config;
        
        
        $scope.entity = $routeParams.entity;
        
        $scope.data = {
            Grain: Grain,
            Hop: Hop,
            Bottle: Bottle,
            Misc: Misc
        };
        
        $scope.getActiveClass = function(tab) {
            if (tab == $scope.entity) {
                return 'active';
            } else {
                return '';
            }
        };
        
        $scope.edit_id = null;
        
        $scope.edit = function(row) {
            $scope.edit_id = row._id;
        };
        
        $scope.copy = function(row) {
            return angular.copy(row);
        };
        
        $scope.cancel = function (row,value) {
            if (row._draft){
                util.Arrays.remove($scope.rows,row);
            } else {
                angular.forEach($scope.config.headers,function(h) {
                    value[h.field] = row[h.field];
                });                
            }
            $scope.edit_id = null;
        };
        
        $scope.save = function(value,row) {
            angular.forEach($scope.config.headers,function(h) {
                row[h.field] = value[h.field];
            });
            if ( row._id ) {
                if (!row.$save) {
                    $scope.data[$scope.entity].save(row);
                } else {
                    row.$save();    
                }
                $scope.edit_id = null;
            } else {
                $scope.data[$scope.entity].save(row, function(n) {
                    row._id = n._id;
                });
            }
            
            
        };
        
        $scope.config = config[$scope.entity];
        
        $scope.rows = $scope.data[$scope.entity].query();
    });
    
})();