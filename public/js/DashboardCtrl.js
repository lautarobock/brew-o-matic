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

            $scope.recipes = Recipe;

            //Search
            $scope.sort = {
                combo: [{
                    label: 'Codigo',
                    sort: '-code'
                },{
                    label: 'Codigo Asc',
                    sort: 'code'
                },{
                    label: 'Por nombre',
                    sort: 'NAME'
                },{
                    label: 'Por nombre descendente',
                    sort: '-NAME'
                },{
                    label: 'Por estilo',
                    sort: 'STYLE.NAME'
                },{
                    label: 'Por estilo descendente',
                    sort: '-STYLE.NAME'
                },{
                    label: 'Por DI',
                    sort: 'OG'
                },{
                    label: 'Por DI descendente',
                    sort: '-OG'
                },{
                    label: 'Por % alc',
                    sort: 'ABV'
                },{
                    label: 'Por % alc descendente',
                    sort: '-ABV'
                },{
                    label: 'Por IBU',
                    sort: 'CALCIBU'
                },{
                    label: 'Por IBU descendente',
                    sort: '-CALCIBU'
                },{
                    label: 'Por Litros',
                    sort: 'BATCH_SIZE'
                },{
                    label: 'Por Litros descendente',
                    sort: '-BATCH_SIZE'
                },{
                    label: 'Por Color',
                    sort: 'CALCCOLOUR'
                },{
                    label: 'Por Color descendente',
                    sort: '-CALCCOLOUR'
                }]
            };

            $scope.config = {
                name: 'recipes.mines',
                filterOrder: ['[state]'],
                filterColSpan: 6,
                plural: 'Recetas',
                singular: 'Receta',
                searchCriteriaLabel: 'Buscar',
                hideSorting: false,
                hideFilters: false
            };

            $templateCache.put('my-recipe-name.html',
                '<a ng-href="{{header.showUrl($model, header)}}">' +
                '{{$model.NAME}}' +
                '</a>' +
                '<show-tags item-click="header.filterByTag" tags="$model.tags"></show-tags>');

            $templateCache.put('recipe-code.html',
                '<a ng-href="{{header.showUrl($model, header)}}">' +
                '{{$model.code}}' +
                '</a>');

            $templateCache.put('recipe-srm.html',
                '<div title="SRM {{$model.CALCCOLOUR|number:0}}" style="text-align: center;border: 1px solid {{header.convertColor($model.CALCCOLOUR)}}; height: 20px; background-color: {{header.convertColor($model.CALCCOLOUR)}};color:{{header.complementary(header.convertColor($model.CALCCOLOUR))}};border-radius: 3px;">' +
                '{{$model.CALCCOLOUR|number:0}}' +
                '</div>');

            $templateCache.put('recipe-publish.html',
                '<a href="" ng-click="header.publish($model)" type="button" class="btn btn-success btn-xs" ng-hide="$model.isPublic" title="Compartir la receta con el resto de los cerveceros">' +
                '<span class="glyphicon glyphicon-cloud-upload"></span>' +
                'publicar' +
                '</a>' +
                '<span class="glyphicon glyphicon-check" title="Esta receta es publica, puede ser vista por todos los usuarios" ng-show="$model.isPublic"/>');

            $templateCache.put('recipe-remove.html', '<button data-target="#{{header.confirmationID($model._id)}}" data-toggle="modal"  type="button" class="close" aria-hidden="true">&times;</button>' +
                '<div class="modal fade" id="{{header.confirmationID($model._id)}}" role="dialog" aria-labelledby="#label">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title" id="label">Confirmacion</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '¿Esta seguro que desea eliminar la receta?' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn" data-dismiss="modal">No</a>' +
                '<button type="button" ng-click="header.removeRecipe($model._id)" class="btn btn-primary" >' +
                'Si' +
                '</button >' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');

            $scope.headers = [{
                    field:'code',
                    caption: '#',
                    tooltip: 'Codigo de la preceta',
                    templateUrl: 'recipe-code.html',
                    showUrl: function($model, header) {
                        return '#/recipe/edit/' + $model._id;
                    }
                },{
                    field:'NAME',
                    caption: 'Nombre',
                    tooltip: 'Nombre de la receta',
                    templateUrl: 'my-recipe-name.html',
                    filterByTag: function(tag) {
                        $scope.config.searchCriteria = tag;
                    },
                    user: function() {
                        return $scope.user;
                    },
                    showUrl: function($model, header) {
                        if ( !header.user() ) return '';
                        if ( $model.owner._id == header.user()._id ) {
                            return '#/recipe/edit/' + $model._id;
                        } else {
                            return $scope.sharedUrl($model._id);
                        }
                    }
                },{
                    field: 'STYLE.NAME',
                    caption: 'Estilo'
                },{
                    field: 'CALCCOLOUR',
                    caption: 'Color',
                    templateUrl: 'recipe-srm.html',
                    convertColor: function(srm) {
                        return BrewHelper.convertColor(srm);
                    },
                    complementary: function(color) {
                        return BrewHelper.complementary(color);
                    }
                },{
                    field: 'OG',
                    caption: 'DI',
                    tooltip: 'Densidad inicial'
                },{
                    field: 'ABV',
                    caption: '% alc',
                    tooltip: 'graduacion alcoholica'
                },{
                    field: 'CALCIBU',
                    caption: 'IBUs'
                },{
                    field: 'BATCH_SIZE',
                    caption: 'Litros'
                },{
                    field: 'BREWER',
                    caption: 'Cervecero'
                },{
                    field: 'clone',
                    caption: '',
                    template:   '<a class="btn btn-default btn-xs" href="#/recipe/clone/{{header.encodeName($model._id)}}">' +
                    'clonar' +
                    '</a>',
                    encodeName: $scope.encodeName
                },{
                    field: 'publish',
                    caption: '',
                    templateUrl: 'recipe-publish.html',
                    publish: function(recipe) {
                        recipe.$publish({isPublic: true},function() {
                            alertFactory.create('success','La misma ya estara disponible para el resto de los usuarios!','Receta publicada con exito!');
                        });
                    }
                },{
                    field: 'remove',
                    caption: '',
                    templateUrl: 'recipe-remove.html',
                    confirmationID: function(id) {
                        return 'confirmation' + id.replace('(','_').replace(')','_');
                    },
                    removeRecipe: function(_id) {
                        Recipe.remove({id:_id}, function() {
                            $('#'+$scope.confirmationID(_id)).modal('hide');
                            $timeout(function() {
                                $scope.recipes = $scope.config.control.refresh();
                            },500);
                        });
                    }
                }
            ];

            $scope.filterData = {};
            $scope.filterData['[state]'] = {
                caption: 'Estado',
                data: ['defined'],
                type: 'combo',
                value: 'defined',
                comparator: 'equal'
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
