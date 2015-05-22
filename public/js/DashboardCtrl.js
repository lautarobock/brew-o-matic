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
                function createConfig(state,title) {
                    var config = {
                        title: title,
                        limit: 5,
                        noMore: false,
                        load: function() {
                            Recipe.query({
                                'filter[state]':state,
                                limit: this.limit,
                                sort:'-code'},
                                function(recipes) {
                                    if ( recipes.length < config.limit ) {
                                        config.noMore = true;
                                    }
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
                    running: createConfig('running', 'En Curso'),
                    ready: createConfig('ready', 'Listas'),
                    draft: createConfig('draft', 'Borradores')
                };
                angular.forEach($scope.panels, function(key) {
                    $scope.configs[key].load();
                });

                $scope.convertColor = function(srm) {
                    return BrewHelper.convertColor(srm);
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
            }
        );

})();
