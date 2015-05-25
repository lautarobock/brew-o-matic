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
                alertFactory,
                BrewHelper,
                Tag,
                TagColor
            ) {
                function createConfig(state,title,emptyText) {
                    var config = {
                        title: title,
                        emptyText: emptyText,
                        limit: 5,
                        noMore: false,
                        load: function() {
                            Recipe.query({
                                'filter[state]':state,
                                limit: this.limit,
                                sort:'-code'},
                                function(recipes) {
                                    config.noMore =  recipes.length < config.limit;
                                    config.items = recipes;
                                }
                            );
                        },
                        more: function() {
                            config.limit += 6;
                            config.load();
                        }
                    };
                    return config;
                }

                $scope.panels = ['running','ready','draft'];
                $scope.configs = {
                    running: createConfig('running', 'En Curso', 'No tenes recetas en curso'),
                    ready: createConfig('ready', 'Listas', 'No tenes recetas listas'),
                    draft: createConfig('draft', 'Borradores', 'No tenes recetas en borrador')
                };
                function reload() {
                    angular.forEach($scope.panels, function(key) {
                        $scope.configs[key].load();
                    });
                }

                $scope.convertColor = function(srm) {
                    return BrewHelper.convertColor(srm);
                };

                $scope.doDefault = function(recipe) {
                    if ( recipe.state === 'draft' ) {
                        recipe.$state({state:'ready'}, function() {
                            reload();
                        });
                    } else if ( recipe.state === 'ready' ) {
                        recipe.$state({state:'running'}, function() {
                            reload();
                        });
                    } else if ( recipe.state === 'running' ) {
                        recipe.$state({state:'finished'}, function() {
                            reload();
                        });
                    }
                };

                $scope.defaultActionName = function(recipe) {
                    if ( recipe.state === 'draft' ) {
                        return 'Esta Lista';
                    } else if ( recipe.state === 'ready' ) {
                        return 'Comenzar';
                    } else if ( recipe.state === 'running' ) {
                        return 'Finalizar';
                    }
                };

                $rootScope.breadcrumbs = [{
                    link: '#',
                    title: 'Inicio'
                }];
                $rootScope.$watch('user',function(user) {
                    if ( user ) {
                        // $scope.recipes = Recipe.query();
                        $scope.stats = Recipe.stats();
                        reload();
                    }
                });
            }
        );

})();
