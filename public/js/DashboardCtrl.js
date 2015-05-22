(function() {

    angular.module('dashboard', [])
        .controller(
            'DashboardCtrl',
            function(
                $scope,
                $rootScope,
                Recipe,
                Style,
                User,
                $location,
                $timeout,
                sortData,
                alertFactory,
                $templateCache,
                BrewHelper,
                Tag,
                TagColor
            ) {

            $templateCache.put('recipe-name.html',
                '<a href="/#/recipe/edit/{{row._id}}">' +
                    '{{getValue(row,header)}}' +
                '</a>');

            //defined
            $scope.defined = {
                data: Recipe,
                pageSize: 5,
                hideFilters: true,
                serverFilter: {'filter[state]':'ready'},
                orderBy: "code",
                orderDir: "-",
                headers: [{
                    field: 'code',
                    caption: 'Codigo',
                    valueTemplateUrl: 'recipe-name.html'
                }, {
                    field: 'NAME',
                    caption: 'Nombre',
                    valueTemplateUrl: 'recipe-name.html'
                }]
            };

            //draft
            $scope.draft = {
                data: Recipe,
                pageSize: 5,
                serverFilter: {'filter[state]':'draft'},
                orderBy: "code",
                orderDir: "-",
                headers: [{
                    field: 'code',
                    caption: 'Codigo'
                }, {
                    field: 'NAME',
                    caption: 'Nombre'
                }]
            };

            $rootScope.breadcrumbs = [{
                link: '#',
                title: 'Inicio'
            }];

            $rootScope.$watch('user',function(user) {
                if ( user ) {
                    // $scope.recipes = Recipe.query();
                    $scope.stats = Recipe.stats();
                }
            });

        });

})();
