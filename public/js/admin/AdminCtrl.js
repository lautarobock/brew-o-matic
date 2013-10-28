(function() {
    
    var abm = angular.module("admin",[]);
    

    abm.controller("AdminCtrl",function($scope,$rootScope,$routeParams,AdminUser,AdminRecipe,Bottle,$filter,$location) {

        $scope.allConfigs = {
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
                        caption: 'Nombre'
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
                        valueTemplateUrl: 'partial/admin/abm-value-link.html'
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
        
        $scope.entity = $routeParams.entity;
        
        $scope.config = $scope.allConfigs[$scope.entity];
        
        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: $scope.config.name
        }];         
        
        
    });
    
})();