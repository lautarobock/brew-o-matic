(function() {
    
    var abm = angular.module("admin",[]);
    

    abm.controller("AdminCtrl",function($scope,$rootScope,$routeParams,AdminUser,AdminRecipe,Bottle,$filter,$location,AdminAction,TempDeviceReport,PublishedRecipe) {

        $scope.allConfigs = {
            Action:  {
                data: AdminAction,
                name: "Acciones",
                singular: "Accion",
                canAdd: false,
                canRemove: false,
                canEdit: false,
                orderBy: "date",
                orderDir: "-",
                headers: [
                    {
                        field:'date',
                        caption: 'Fecha',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy HH:mm');
                        }
                    },
                    {
                        field:'actionType',
                        caption: 'Accion'
                    },
                    {
                        field:'data',
                        caption: 'Datos'
                    },
                    {
                        field:'_id',
                        caption: 'ID'
                    }
                ]
            },
            User:  {
                data: AdminUser,
                name: "Usuarios",
                singular: "Usuario",
                canAdd: false,
                canRemove: false,
                canEdit: false,
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        valueTemplateUrl: 'partial/admin/abm-value-user-link.html'
                    },
                    {
                        field:'singInDate',
                        caption: 'Entrada',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy HH:mm');
                        }
                    },
                    {
                        field:'lastLogin',
                        caption: 'Ultima vez',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy HH:mm');
                        }
                    },
                    {
                        field:'_id',
                        caption: 'ID'
                    }
                ]
            },
            Recipe:  {
                data: AdminRecipe,
                name: "Recetas",
                singular: "Receta",
                orderBy: "NAME",
                canAdd: false,
                canRemove: false,
                canEdit: false,
                headers: [
                    {
                        field:'NAME',
                        caption: 'Nombre',
                        type: 'link',
                        href: function(row) {
                            return '/share.html#/' + row._id;
                        }
                        // valueTemplateUrl: 'partial/admin/abm-value-link.html'
                    },{
                        field:'STYLE.NAME',
                        caption: 'Estilo'
                    },{
                        field:'date',
                        caption: 'Creacion',
                        width: '10em',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy');
                        }
                    },{
                        field:'modificationDate',
                        caption: 'Modificacion',
                        width: '10em',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy');
                        }
                    },{
                        field:'OG',
                        width: '6em',
                        caption: 'OG'
                    },{
                        field:'ABV',
                        width: '6em',
                        caption: '%Acl'
                    },{
                        field:'CALCIBU',
                        width: '6em',
                        caption: 'IBUs'
                    },
                    {
                        field:'isPublic',
                        caption: 'Publica',
                        type:'checkbox'
                    },
                    {
                        field:'BREWER',
                        caption: 'Cervecero'
                    },
                    {
                        field:'owner.name',
                        caption: 'Dueño'
                    }
                ]
            },
            TempDeviceReport: {
                data: TempDeviceReport,
                name: "Temperaturas",
                singular: "Temperatura",
                canAdd: true,
                canRemove: true,
                canEdit: true,
                orderBy: "name",
                headers: [{
                        field:'code',
                        caption: 'Codigo'
                    },{
                        field:'timestamp',
                        caption: 'Timestamp',
                        type: 'number'
                    },{
                        field:'recipe_id',
                        caption: 'Receta'
                    },{
                        field:'source',
                        caption: 'Source'
                    },{
                        field:'temperature',
                        caption: 'Temp',
                        type: 'number',
                        step: 0.1
                    },{
                        field:'temperatureExt',
                        caption: 'Temp Ext',
                        type: 'number',
                        step: 0.1
                    },{
                        field:'temperatureDev',
                        caption: 'Temp Dev',
                        type: 'number',
                        step: 0.1
                    },{
                        field:'coldStatus',
                        caption: 'Frio'
                    },{
                        field:'heatStatus',
                        caption: 'Calor'
                    }
                ]
            },
            Stats:  {
                name: "Stats"
            }
        };
        
        $scope.getActiveClass = function(tab) {
            if (tab == $scope.entity) {
                return 'active';
            } else {
                return '';
            }
        };

        $scope.context = {
            sharedUrl: function(_id) {
                return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
            }
        };
        
        $scope.entity = $routeParams.entity || 'Stats';
        
        $scope.config = $scope.allConfigs[$scope.entity];
        
        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: $scope.config.name
        }];

        if ( $scope.entity == 'Stats' ) {
            $scope.recipeCount = AdminRecipe.count();
            $scope.userCount = AdminUser.count();
            $scope.publicCount = PublishedRecipe.count();
        }
        
        
    });
    
})();