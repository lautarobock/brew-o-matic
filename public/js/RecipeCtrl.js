(function() {

    var module = angular.module("brew-o-module.controller",[]);

    module.controller("RecipeTabCtrl",function($scope) {
        $scope.sortTabs = ['main','mash','boil','fermentation','bottling'];
        $scope.tabs = {
            main: {
                title: 'Recipe',
                template: 'detail-main'
            },
            mash: {
                title: 'Macerado',
                template: 'mash'
            },
            boil: {
                title: 'Hervido',
                template: 'boil'
            },
            fermentation: {
                title: 'Fermentacion',
                template: 'fermentation'
            },
            bottling: {
                title: 'Embotellado',
                template: 'bottling'
            }};

        $scope.selectedTab = 'main';

        $scope.getActiveClass = function(tab) {
            return $scope.selectedTab === tab ? 'active':'';
        };

        $scope.changeTab = function(tab) {
            $scope.selectedTab=tab;
            $scope.$parent.notifications = [];
        };
    });
})();