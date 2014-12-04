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
    
    index.controller("RecipePublicCtrl", function ($scope,$rootScope,$location,Recipe,User,sortData,Style,Tag, PublishedRecipe) {

        $scope.published = PublishedRecipe;

        //Search
        $scope.sort = {// initial: '-score.overall -score.avg score.position',
            combo: [{
                label: 'Fecha de publicacion',
                sort: '-publishDate'
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
            }]
        };

        $scope.config = {
            pageSize: 10,
            filterOrder: ['[STYLE.NAME]'],
            filterColSpan: 6,
            plural: 'Recetas',
            singular: 'Receta',
            searchCriteriaLabel: 'Buscar'
        };

        $scope.headers = [{
                field:'NAME',
                caption: 'Nombre',
                tooltip: 'Nombre de la receta',
                template:   '<a href="{{header.showUrl($model, header)}}">' +
                                '{{$model.NAME}}' +
                            '</a>',
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
                                'clonar' +
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
                return value.name;
            },
            valueKey: 'name',
            ignoreCase: false,
            data: Style.query(),
            orderBy: 'name'
        };

        // $scope.sort = sortData("publishDate","-");
        
        // $scope.styles = Style.query();

        // $scope.tags = Tag.query();

        // $scope.showAd=false;

        // $scope.filterData = {};
        // $scope.filterData['STYLE.NAME'] = {
        //     comparator: 'equal',
        //     ignoreCase: false
        // };
        // $scope.filterData['NAME'] = {
        //     comparator: 'like',
        //     ignoreCase: true
        // };
        // $scope.filterData['tags'] = {
        //     comparator: 'searchIn',
        //     type: 'list',
        //     ignoreCase: true
        // };
        // angular.forEach($scope.filterData,function(f,key){
        //     if ( $location.$$search[key] ) {
        //         $scope.showAd=true;
        //         if (f.type == 'list' ) {
        //             $scope.filterData[key].value = $location.$$search[key].split(",");
        //         } else {
        //             $scope.filterData[key].value = $location.$$search[key];
        //         }

        //     }
        // });
        $scope.filterByTag = function(tag) {
            window.location.href = '/#/public?tags=' + tag;
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
                User,
                $location,
                $timeout,
                sortData,
                alertFactory) {

        $scope.sort = sortData("code","-");

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
                $scope.recipes = Recipe.query();
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
        
        $scope.publish = function(recipe) {
            recipe.$publish({isPublic: true},function() {
                alertFactory.create('success','La misma ya estara disponible para el resto de los usuarios!','Receta publicada con exito!');
            });

        };
        
    });

})();
