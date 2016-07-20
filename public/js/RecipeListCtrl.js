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

    index.filter("filterFavorites",function() {
        return function(list, favorites) {
            var ret = [];
            if ( list && list.length !=0 && favorites && favorites.length != 0) {
                angular.forEach(list,function(recipe) {
                    if ( favorites.indexOf(recipe._id) != -1) {
                        ret.push(recipe);
                    }
                });
            }
            return ret;
        }
    });

    /**
     * RecipeCollaboratedCtrl
     */
    index.controller("RecipeCollaboratedCtrl",function($scope,$rootScope,Recipe,sortData) {

        $scope.sort = sortData("NAME","");

        $scope.showTags = function(recipe) {
            if (recipe.tags && recipe.tags.length != 0) {
                var txt = "- Tags: [" + recipe.tags[0];
                for (var i=1;i<recipe.tags.length; i++) {
                    txt += ", " + recipe.tags[i];
                }
                return txt + "]";
            } else {
                return '';
            }
        };

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Colaboraciones'
        }];

        $rootScope.$watch('user',function(user) {
            if ( user ) {
                $scope.collaborated = Recipe.findCollaborated();
                $scope.stats = Recipe.stats();
            }
        });

    });

    index.controller("RecipeFavoriteCtrl", function ($scope,$rootScope,Recipe,User,sortData) {

        $scope.sort = sortData("NAME","");

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Recetas Favoritas'
        }];

        $rootScope.$watch('user',function(user) {
            if ( user ) {
                $scope.published = Recipe.findPublic();
                $scope.stats = Recipe.stats();
            }
        });

        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

    });

    index.controller("RecipePublicCtrl", function (
        $scope,
        $rootScope,
        $location,
        Recipe,
        User,
        sortData,
        Style,
        Tag,
        PublishedRecipe,
        $templateCache,
        BrewHelper
    ) {

        $scope.published = PublishedRecipe;

        //Search
        $scope.sort = {// initial: '-score.overall -score.avg score.position',
            combo: [{
                label: 'Fecha de publicacion',
                sort: '-publishDate'
            },{
                label: 'Fecha de publicacion asc',
                sort: 'publishDate'
            },{
                label: 'Mas Favorita',
                sort: '-starredByCount'
            },{
                label: 'Mas Clonada',
                sort: '-clonedByCount'
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
            name: 'recipes.public',
            filterOrder: ['[STYLE.NAME]'],
            filterColSpan: 6,
            plural: 'Recetas',
            singular: 'Receta',
            searchCriteriaLabel: 'Buscar'
        };

        $templateCache.put(
            'recipe-srm.html',
            '<div title="SRM {{$model.CALCCOLOUR|number:0}}" style="text-align: center;border: 1px solid {{header.convertColor($model.CALCCOLOUR)}}; height: 20px; background-color: {{header.convertColor($model.CALCCOLOUR)}};color:{{header.complementary(header.convertColor($model.CALCCOLOUR))}};border-radius: 3px;">' +
                '{{$model.CALCCOLOUR|number:0}}' +
            '</div>'
        );

        $templateCache.put(
            'recipe-name.html',
            '<a ng-href="{{header.showUrl($model, header)}}">' +
                '{{$model.NAME}}' +
            '</a>' +
            '<show-tags item-click="header.filterByTag" tags="$model.tags"></show-tags>'
        );

        $templateCache.put(
            'recipe-style.html',
            '<a href="" ng-click="header.filter($model.STYLE.NAME)">' +
                '{{$model.STYLE.NAME}}' +
            '</a>'
        );

        $scope.headers = [
            {
                field:'NAME',
                caption: 'Nombre',
                tooltip: 'Nombre de la receta',
                templateUrl: 'recipe-name.html',
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
                caption: 'Estilo',
                templateUrl: 'recipe-style.html',
                filter: function(name) {
                    $scope.filterByStyle(name);
                }
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
                field: 'starredByCount',
                caption: 'Social',
                template: '<span title="Receta favorita">{{$model.starredByCount}} <span style="color:orange" class="glyphicon glyphicon-star"></span></span> | <span title="Cantidad de veces que fue clonada"><span class="glyphicon glyphicon-duplicate"></span> {{$model.clonedByCount}}</span>',
                width: 80,
            // },{
            //     field: 'clonedByCount',
            //     caption: '<span class="glyphicon glyphicon-duplicate"></span>'
            },{
                field: 'BREWER',
                caption: 'Cervecero'
            },{
                field: 'owner.name',
                caption: 'Compartida por',
                template:   '<a href="/#/home/{{$model.owner._id}}">' +
                                '{{$model.owner.name}}' +
                            '</a>'
            },{
                field: 'publishDate',
                caption: 'Fecha',
                template:   '{{$model.publishDate | date:"dd-MM-yyyy HH:mm"}}'
            },{
                field: 'clone',
                caption: '',
                template:   '<a class="btn btn-default btn-xs" href="#/recipe/clone/{{header.encodeName($model._id)}}">' +
                                '<i class="glyphicon glyphicon-duplicate"></i>' +
                                ' clonar' +
                            '</a>',
                encodeName: $scope.encodeName
            }
        ];

        $scope.filterData = {};
        $scope.filterData['[STYLE.NAME]'] = {
            caption: 'Estilo',
            type: 'combo',
            comparator: 'equal',
            getLabel: function(value) {
                return value._id + ' (' + value.total + ')';
            },
            valueKey: '_id',
            ignoreCase: false,
            data: Recipe.publicStyles(),
            orderBy: '_id'
        };

        //Take filter from showUrl
        if ( $location.$$search.style ) {
            $scope.filterData['[STYLE.NAME]'].value = $location.$$search.style;
        }
        if ( $location.$$search.searchCriteria ) {
            $scope.config.searchCriteria = $location.$$search.searchCriteria;
        }
        $scope.filterByStyle = function(name) {
            $scope.filterData['[STYLE.NAME]'].value = name;
            $scope.config.control.refresh();
        };

        $scope.stylesCloud = Recipe.publicStyles();

        //Style stylesCloud
        $scope.styles = [];
        Recipe.publicStyles(function(styles) {
            styles.forEach(function(style,i) {
                $scope.styles.push({
                    word:style._id,
                    size: (style.total+10) + 'px',
                    count: style.total,
                    getStyle: function() {
                        return $scope.filterData['[STYLE.NAME]'].value;
                    }
                });
            });
        });
        $scope.filterByTag = function(tag) {
            $scope.config.searchCriteria = tag.word;
        };

        $scope.reset = function() {
            angular.forEach($scope.filterData,function(val) {
                delete val.value;
            });
        };

        $rootScope.$watch('user',function(user) {
            if ( user ) {
                // $scope.published = PublishedRecipe;
                $scope.stats = Recipe.stats();
                // skip += 10;
            }
        });

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Recetas Publicadas'
        }];

        $scope.addFavorites = function(recipe) {
            User.addToFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

        $scope.removeFavorites = function(recipe) {
            User.removeFromFavorites(recipe,function(user) {
                $rootScope.user.favorites = user.favorites;
            });
        };

        $scope.newTag = '';
        $scope.addTag = function($event) {
            if ( $event.keyCode == 13) {
                if ( !$scope.filterData['tags'].value ) {
                    $scope.filterData['tags'].value = [];
                }
                if ( $scope.filterData['tags'].value.indexOf($scope.newTag) == -1) {
                    $scope.filterData['tags'].value.push($scope.newTag);
                }
                $scope.newTag = '';
            }
        };

    });

    index.controller("RecipeListCtrl", function (
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
        TagColor,
        State
    ) {

        // $scope.sort = sortData("code","-");

        $scope.tags = [];
        Recipe.tags(function(tags) {
            tags.forEach(function(tag,i) {
                $scope.tags.push({
                    word:tag._id,
                    size: tag.total + 'px',
                    count: tag.total,
                    color: TagColor(tag._id)
                });
            });
        });
        $scope.filterByTag = function(tag) {
            $scope.config.searchCriteria = tag.word;
        };

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
                label: 'Fecha de Inicio',
                sort: '-fermentation.estimateDate'
            },{
                label: 'Fecha de Inicio asc',
                sort: 'fermentation.estimateDate'
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
            filterOrder: ['[STYLE.NAME]'],
            filterColSpan: 6,
            plural: 'Recetas',
            singular: 'Receta',
            searchCriteriaLabel: 'Buscar'
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
                '<i class="glyphicon glyphicon-cloud-upload"></i>' +
                 ' publicar' +
            '</a>' +
            '<span class="glyphicon glyphicon-cloud" title="Esta receta es publica, puede ser vista por todos los usuarios" ng-show="$model.isPublic"/>');

        $templateCache.put('recipe-state.html','{{header.stateName($model)}}');

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
                caption: '%alc',
                tooltip: 'graduacion alcoholica'
            },{
                field: 'CALCIBU',
                caption: 'IBUs'
            },{
                field: 'BATCH_SIZE',
                caption: 'Litros'
            },{
                field: 'estimateDate',
                caption: 'Fecha',
                width: 65,
                template:   '{{$model.fermentation.estimateDate | date:"dd-MM-yy"}}'
            },{
                field: 'state',
                caption: 'Estado',
                templateUrl: 'recipe-state.html',
                stateName: function(recipe) {
                    return State.valueOf(recipe.state).name;
                }
            },{
                field: 'clone',
                caption: '',
                template:   '<a class="btn btn-default btn-xs" href="#/recipe/clone/{{header.encodeName($model._id)}}">' +
                                '<i class="glyphicon glyphicon-duplicate"></i>' +
                                ' clonar' +
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
        $scope.filterData['[STYLE.NAME]'] = {
            caption: 'Estilo',
            type: 'combo',
            comparator: 'equal',
            getLabel: function(value) {
                return value.name;
            },
            valueKey: 'name',
            ignoreCase: false,
            data: Style.query(),
            orderBy: 'name'
        };


        $scope.showTags = function(recipe) {
            if (recipe.tags && recipe.tags.length != 0) {
                var txt = "- Tags: [" + recipe.tags[0];
                for (var i=1;i<recipe.tags.length; i++) {
                    txt += ", " + recipe.tags[i];
                }
                return txt + "]";
            } else {
                return '';
            }
        };

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        }];

        $rootScope.$watch('user',function(user) {
            if ( user ) {
                // $scope.recipes = Recipe.query();
                $scope.stats = Recipe.stats();
            }
        });

        $scope.confirmationID = function(id) {
            return 'confirmation' + id.replace('(','_').replace(')','_');
        };

        $scope.removeRecipe = function(_id) {
            Recipe.remove({id:_id}, function() {
                $('#'+$scope.confirmationID(_id)).modal('hide');
                $timeout(function() {
                    $scope.recipes = Recipe.query();
                },500);
            });

        };

    });

})();
