(function() {
    
    var abm = angular.module("admin",[]);
    

    abm.controller("AdminCtrl",function($scope,$rootScope,$routeParams,AdminUser,AdminRecipe,Bottle) {

        $scope.allConfigs = {
            User:  {
                data: AdminUser,
                name: "Usuarios",
                singular: "Usuario",
                canRemove: false,
                canEdit: true,
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre'
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
                canRemove: false,
                canEdit: false,
                headers: [
                    {
                        field:'NAME',
                        caption: 'Nombre'
                    },{
                        field:'STYLE.NAME',
                        caption: 'Estilo'
                    },{
                        field:'OG',
                        caption: 'OG'
                    },{
                        field:'ABV',
                        caption: '%Acl'
                    },{
                        field:'CALCIBU',
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