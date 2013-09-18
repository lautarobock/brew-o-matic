(function() {

    var index = angular.module('index');

    index.controller("RecipeListCtrl", function ($scope,$rootScope) {

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        }];

        $scope.load = function() {
            if ( localStorage["brew-o-matic.recipes"] ) {
                $scope.recipes = JSON.parse(localStorage["brew-o-matic.recipes"]);
                var any = false;
                angular.forEach($scope.recipes,function(value){
                    any=true;
                });
                if (!any) {
                    $scope.recipes = undefined;
                }
            }
        }
        $scope.load();

        $scope.removeRecipe = function(name) {
            delete $scope.recipes[name];
            localStorage["brew-o-matic.recipes"] = JSON.stringify($scope.recipes);
            $scope.load();
        };

        $scope.encodeName = function(name) {
            return encodeURIComponent(name);
        };
    });

})()
