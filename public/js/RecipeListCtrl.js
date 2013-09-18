(function() {

    var index = angular.module('index');

    index.filter("limitText", function() {
        return function(value, limit) {
            if ( value.length > limit ) {
                return value.substring(0,limit) + "...";
            } else {
                return value;
            }
        };
    });
    
    index.controller("RecipeListCtrl", function ($scope,$rootScope,Recipe) {

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        }];

        //$scope.load = function() {
            //if ( localStorage["brew-o-matic.recipes"] ) {
            //    $scope.recipes = JSON.parse(localStorage["brew-o-matic.recipes"]);
            //    var any = false;
            //    angular.forEach($scope.recipes,function(value){
            //        any=true;
            //    });
            //    if (!any) {
            //        $scope.recipes = undefined;
            //    }
            //}            
        //}
        //$scope.load();
        $rootScope.$watch('user',function() {
            $scope.recipes = Recipe.query();    
        });
        
        $scope.removeRecipe = function(_id) {
            //delete $scope.recipes[name];
            //localStorage["brew-o-matic.recipes"] = JSON.stringify($scope.recipes);
            //$scope.load();
            Recipe.remove({id:_id}, function() {
                $scope.recipes = Recipe.query();
            });
            
        };

        $scope.encodeName = function(name) {
            return encodeURIComponent(name);
        };
    });

})();
