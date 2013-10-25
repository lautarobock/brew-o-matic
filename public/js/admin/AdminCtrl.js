(function() {
    
    var abm = angular.module("admin",[]);
    

    abm.controller("AdminCtrl",function($scope,$rootScope,$routeParams,AdminUser,AdminRecipe) {

        $scope.allConfigs = {
            User:  {
                data: AdminUser,
                name: "Usuarios",
                singular: "Usuario",
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
                headers: [
                    {
                        field:'NAME',
                        caption: 'Nombre'
                    },
                    {
                        field:'isPublic',
                        caption: 'Publica'
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