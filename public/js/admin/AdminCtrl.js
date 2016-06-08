(function() {

    var abm = angular.module("admin",[]);


    abm.controller("AdminCtrl",function(
        $scope,
        $rootScope,
        $routeParams,
        AdminUser,
        AdminRecipe,
        Bottle,
        $filter,
        $location,
        AdminAction,
        TempDeviceReport,
        PublishedRecipe,
        Stats,
        $http,
        $interval
    ) {

        $scope.allConfigs = {
            Action:  {
                data: AdminAction,
                name: "Acciones",
                singular: "Accion",
                canAdd: false,
                canRemove: false,
                canEdit: false,
                orderBy: "date",
                orderDir: "-",
                headers: [
                    {
                        field:'date',
                        caption: 'Fecha',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy HH:mm');
                        }
                    },
                    {
                        field:'actionType',
                        caption: 'Accion'
                    },
                    {
                        field:'data',
                        caption: 'Datos'
                    },
                    {
                        field:'_id',
                        caption: 'ID'
                    }
                ]
            },
            User:  {
                data: AdminUser,
                name: "Usuarios",
                singular: "Usuario",
                canAdd: false,
                canRemove: false,
                canEdit: false,
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        valueTemplateUrl: 'partial/admin/abm-value-user-link.html'
                    },
                    {
                        field:'singInDate',
                        caption: 'Entrada',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy HH:mm');
                        }
                    },
                    {
                        field:'lastLogin',
                        caption: 'Ultima vez',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy HH:mm');
                        }
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
                canAdd: false,
                canRemove: false,
                canEdit: false,
                headers: [
                    {
                        field:'NAME',
                        caption: 'Nombre',
                        type: 'link',
                        href: function(row) {
                            return '/share.html#/' + row._id;
                        }
                        // valueTemplateUrl: 'partial/admin/abm-value-link.html'
                    },{
                        field:'STYLE.NAME',
                        caption: 'Estilo'
                    },{
                        field:'date',
                        caption: 'Creacion',
                        width: '10em',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy');
                        }
                    },{
                        field:'modificationDate',
                        caption: 'Modificacion',
                        width: '10em',
                        format: function(value) {
                            return $filter('date')(value,'dd-MM-yyyy');
                        }
                    },{
                        field:'OG',
                        width: '6em',
                        caption: 'OG'
                    },{
                        field:'ABV',
                        width: '6em',
                        caption: '%Acl'
                    },{
                        field:'CALCIBU',
                        width: '6em',
                        caption: 'IBUs'
                    },
                    {
                        field:'isPublic',
                        caption: 'Publica',
                        type:'checkbox'
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
            },
            TempDeviceReport: {
                data: TempDeviceReport,
                name: "Temperaturas",
                singular: "Temperatura",
                canAdd: true,
                canRemove: true,
                canEdit: true,
                orderBy: "name",
                headers: [{
                        field:'code',
                        caption: 'Codigo'
                    },{
                        field:'timestamp',
                        caption: 'Timestamp',
                        type: 'number'
                    },{
                        field:'recipe_id',
                        caption: 'Receta'
                    },{
                        field:'source',
                        caption: 'Source'
                    },{
                        field:'temperature',
                        caption: 'Temp',
                        type: 'number',
                        step: 0.1
                    },{
                        field:'temperatureExt',
                        caption: 'Temp Ext',
                        type: 'number',
                        step: 0.1
                    },{
                        field:'temperatureDev',
                        caption: 'Temp Dev',
                        type: 'number',
                        step: 0.1
                    },{
                        field:'coldStatus',
                        caption: 'Frio'
                    },{
                        field:'heatStatus',
                        caption: 'Calor'
                    }
                ]
            },
            Stats:  {
                name: "Stats"
            }
        };

        $scope.getActiveClass = function(tab) {
            if (tab == $scope.entity) {
                return 'active';
            } else {
                return '';
            }
        };

        $scope.context = {
            sharedUrl: function(_id) {
                return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
            }
        };

        $scope.entity = $routeParams.entity || 'Stats';

        $scope.config = $scope.allConfigs[$scope.entity];

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: $scope.config.name
        }];

        $scope.loaded = {};

        if ( $scope.entity == 'Stats' ) {
            $scope.recipeCount = AdminRecipe.count();
            $scope.userCount = AdminUser.count();
            $scope.publicCount = PublishedRecipe.count();
            $scope.stats = {};
            // Stats.query({stats:['newRecipesByPeriod']}, mix);
            Stats.query({stats:['lastLogin']}, mix);
            Stats.query({stats:['singInDate']}, mix);
            Stats.query({stats:['date']}, mix);
            Stats.query({stats:['modificationDate']}, mix);
            Stats.query({stats:['isPublic']}, mix);
            // Stats.query({stats:['recipesByUser']}, mix);
            Stats.query({stats:['active']}, mix);
            // Stats.query({stats:['newRecipesByPeriod']}, mix);
            $scope.fields = ['today','week','month','year','origin'];
            var origin = new Date(2013,10,19).getTime();
            var now = new Date().getTime();
            var anios = (now-origin)/1000/60/60/24/365;
            $scope.labels = {
                today: 'Ultimas 24 hs',
                week: 'Ultima semana',
                month: 'Ulitmo mes',
                year: 'Ultimo año',
                origin: 'Origen de los tiempos (19-10-2013, ' + (Math.round(anios*100)/100) + ' años)'
            };
            var MONTHS = [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'
            ];
            var DAYS_MONTHS = [31,28,31,30,31,30,31,31,30,31,30,31];
            $scope.monthName = function(date) {
                return MONTHS[new Date(date).getMonth()];
            };
            $scope.monthDays = function(date) {
                var date = new Date(date);
                var now = new Date();
                if ( date.getMonth() === now.getMonth() && date.getYear() === now.getYear() )  {
                    return now.getDate();
                } else {
                    return DAYS_MONTHS[date.getMonth()];
                }
            };
            $scope.greaterThan = function(value) {
                return value.total > ($scope.recipesFilter || 0);
            };
        }

        function mix(stats) {
            angular.extend($scope.stats,stats);
            console.log('stats.add', stats);
            console.log('stats', $scope.stats);
        }

        $scope.loadChart = function(stats) {
            mix(stats);
            $scope.chartLabels = [];
            $scope.series = ['Recetas'];
            $scope.data = [[]];
            angular.forEach(stats.newRecipesByPeriod, function(month) {
                $scope.chartLabels.push(''+month._id.year+'/'+month._id.month);
                $scope.data[0].push(month.total);
            });
        };

        $scope.load = function(type, cb) {
            if ( cb ) {
                Stats.query({stats:[type]}, $scope[cb]);
            } else {
                Stats.query({stats:[type]}, mix);
            }
            $scope.loaded[type] = true;
        };

        var timer = null;
        $scope.loadLastActions = function() {
            console.log('LOAD LAST ACTIONS')
            startLoadLastActions();
            $scope.loaded.lastActions = true;
            if ( timer ) $interval.cancel(timer);
            $interval(startLoadLastActions,5000);
        };

        function startLoadLastActions() {
            $http.get('/stats/last?hours='+($scope.hours||1)).success(function(result) {
                $scope.lastActions = result;
            });
        }
    });



    abm.filter('filterDate', function() {
        return function(items, field, from) {
            if ( !from || from === '' ) return items;
            var result = [];
            angular.forEach(items,function(item) {
                var value;
                if ( typeof field !== 'string' ) {
                    value = item;
                    for( var i=0;i<field.length; i++ ) {
                        value = value[field[i]];
                    }
                } else {
                    value = item[field];
                }
                var dateValue = new Date(value);
                var dateFrom = new Date(from);
                if ( dateValue.getTime() >= dateFrom.getTime() ) {
                    result.push(item);
                }
            });
            return result;
        };
    });

})();
