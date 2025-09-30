(function() {


    var index = angular.module('index', [
                                'ngResource',
                                'ngRoute',
                                'ngSanitize',
                                'ngAnimate',
                                'data',
                                'resources',
                                'helper',
                                'login',
                                'comments',
                                'googlechart',
                                'calculator',
                                'device',
                                'brew-o-module.controller',
                                'notification',
                                'abm',
                                'gt.abm',
                                'admin',
                                'ui.bootstrap',
                                'alerts',
                                'settings',
                                'water',
                                'env',
                                'observer',
                                'print',
                                'gt.listview',
                                'vr.directives.wordCloud',
                                'ngAudio',
                                'chart.js',
                                'dashboard']);

    index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/dashboard', {templateUrl: 'partial/dashboard.html',   controller: 'DashboardCtrl'}).
                when('/recipe', {templateUrl: 'partial/recipe-list.html',   controller: 'RecipeListCtrl'}).
                when('/collaborated', {templateUrl: 'partial/recipe-collaborated.html',   controller: 'RecipeCollaboratedCtrl'}).
                when('/favorites', {templateUrl: 'partial/recipe-favorite.html',   controller: 'RecipeFavoriteCtrl'}).
                when('/public', {templateUrl: 'partial/recipe-public.html',   controller: 'RecipePublicCtrl'}).
                when('/home/:userId', {templateUrl: 'partial/user/home.html',   controller: 'HomeCtrl'}).
                when('/recipe/edit/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/clone/:recipeId', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                when('/recipe/new', {templateUrl: 'partial/recipe-detail.html', controller: 'RecipeDetailCtrl'}).
                //when('/stats', {templateUrl: 'partial/user/user-stats.html', controller: 'UserStatsCtrl'}).
                when('/settings/water', {templateUrl: 'partial/user/user-settings-water.html', controller: 'SettingsWaterCtrl'}).
                when('/settings/water/new', {templateUrl: 'partial/user/settings/user-settings-water-detail.html', controller: 'SettingsWaterDetailCtrl'}).
                when('/settings/water/:waterId', {templateUrl: 'partial/user/settings/user-settings-water-detail.html', controller: 'SettingsWaterDetailCtrl'}).
                when('/settings', {templateUrl: 'partial/user/user-settings.html', controller: 'UserSettingsCtrl'}).
                when('/settings/device', {templateUrl: 'partial/device/device.html', controller: 'DeviceController'}).
                when('/calculator', {templateUrl: 'partial/calculator/calculator.html', controller: 'CalculatorCtrl'}).
                when('/notification', {templateUrl: 'partial/user/user-notification.html', controller: 'NotificationsCtrl'}).
                when('/data/:entity', {templateUrl: 'partial/data/abm.html', controller: 'AbmCtrl'}).
                when('/admin/Stats', {templateUrl: 'partial/admin/stats.html', controller: 'AdminCtrl'}).
                when('/admin/:entity', {templateUrl: 'partial/admin/admin.html', controller: 'AdminCtrl'}).
                otherwise({redirectTo: '/dashboard'});
    }]);

    index.config(['abmProvider','ChartJsProvider',function(abmProvider, ChartJsProvider) {
        abmProvider.setTemplateDir('template');
        // ChartJsProvider.setOptions({ colors : [ 'blue', 'red', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    }]);

    index.controller("HomeCtrl",function($scope,$rootScope,User,Recipe,$routeParams) {

        $scope.$watch('user',function() {
            //$scope.notifications = Notification.query($scope.updateCount);
            $scope.viewUser = User.get({id:$routeParams.userId},function() {
                $rootScope.breadcrumbs = [{
                    link: '#',
                    title: 'Home'
                },{
                    link: '#',
                    title: $scope.viewUser.name
                }];
            });

            $scope.recipes = Recipe.findByUser({id:$routeParams.userId});
        });

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


    });

    var notification = angular.module("notification",[]);

    notification.factory("notificationData", function() {
        return {
            listener: null,
            reset: function() {
                if ( this.listener ) {
                    this.listener();
                }
            }
        };
    });

    notification.controller("NotificationsCtrl",function($scope,Notification,$rootScope,notificationData) {

        notificationData.reset();

        $scope.updateCount = function(notifications) {
            $scope.countUnread = 0;
            $scope.countNew = 0;
            angular.forEach(notifications, function(not) {
                if ( not.status == 'new') {
                    $scope.countNew++;
                } else if ( not.status == 'unread') {
                    $scope.countUnread++;
                }
            });
        };

        $scope.$watch('user',function() {
            $scope.notifications = Notification.query($scope.updateCount);
        });


        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Notificaciones'
        }];

        $scope.markAsRead = function(notification) {
            if ( notification.status != 'read' ) {
                notification.status = 'read';
                notification.$save();
                $scope.updateCount($scope.notifications);
            }
        };

        $scope.statusClass = function(notification) {
            if ( notification.status == 'unread') {
                return 'gt-notification-unread';
            } else if ( notification.status == 'new') {
                return 'gt-notification-new';
            }
            return '';
        };

        //$rootScope.notificationCount = 0;
        //$rootScope.notificationClass = '';

    });


    index.controller("MainController",function($scope,$rootScope,User,$location) {
        $rootScope.breadcrumbs = [];

        $scope.email = '';
        $scope.password = '';

        $scope.login = function() {
            googleSignIn();
        };

        var infos = [{
            text: 'Si tenes 2 minutos, podes rellenar una encuesta sobre uso de Brew-o-Matic.',
            link: {
                text: 'Abrir Encuesta',
                href: 'https://docs.google.com/forms/d/1lCObRGFtB2g3S3jiwwNweNUz5hRrLuyni2zFZz40R58/viewform'
            },
            id: 'closeUseSurvey'
        },{
            text: 'Nueva pagina en Facebook, enterate de las ultimas novedades',
            link: {
                text: 'Ir a la pagina',
                href: 'https://www.facebook.com/brewomatic/timeline'
            },
            id: 'gotoFanPage'
        }];

        $scope.infos = [];

        $scope.closeInfo = function(index) {
            $scope.infos.splice(index,1);
        };

        $scope.closeForEver = function(info, index) {
            $scope.user.settings[info.id] = true;
            User.updateSettings($scope.user, function() {
                $scope.infos.splice(index,1);
            });
        };

        $scope.$watch("user", function(user) {
            if ( user ) {
                //elimino las info que ya cerre desde la configuracion del usuario
                for ( var i=0; i<infos.length; i++ ) {
                    if ( !user.settings[infos[i].id] ) {
                        $scope.infos.push(infos[i]);
                    }
                }
            }
        });
        
        $scope.goToTab = function(path) {
            $location.path(path);
        };

        $scope.loginPassword = function() {
            console.log('loginPassword', $scope.email, $scope.password);
            User.loginPassword({email: $scope.email, password: $scope.password}, function(user) {
                $rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.user = user;
                localStorage.setItem('bomuser', JSON.stringify(user));
                // $rootScope.$apply();
                console.log(user);
            }, function() {
                $rootScope.loginSuccess = false;
                $scope.loginError = 'Error al iniciar sesión';
                // $rootScope.$apply();
            });
        }
    });


    var alerts = angular.module("alerts",[]);

    alerts.factory("alertFactory", function($rootScope) {
        var alerts = [];
        return {
            create: function(type,text,title) {
                alerts = [];
                var a = {
                    type:  type,
                    text: text,
                    title: title
                };
                alerts.push(a)
                setTimeout(function() {
                    util.Arrays.remove(alerts,a);
                    $rootScope.$apply();
                },5000)
            },
            getAlerts: function() {
                return alerts;
            }
        };
    });



    index.run(function($rootScope,version,$filter,$location,BrewCalc,env,color,alertFactory,BrewHelper,$templateCache) {

        $rootScope.$templateCache = $templateCache;

        $rootScope.BrewCalc = BrewCalc;

        $rootScope.BrewHelper = BrewHelper;

        $rootScope.version = version;

        $rootScope.env = env;

        $rootScope.color = color;

        $rootScope.getAlerts = function() {
            return alertFactory.getAlerts();
        };

        $rootScope.encodeName = function(name) {
            return encodeURIComponent(name);
        };

        $rootScope.sharedUrl = function(_id) {
            return '//'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        };

        $rootScope.formatDate = function(date) {
            return util.formatDate(date, $filter('date'));
        };
    });

    index.factory("Responsive", function($window) {
        return {
            isXs: function() {
                return $window.innerWidth < 768;
            },
            isSm: function() {
                return $window.innerWidth >= 768 && $window.innerWidth < 992;
            },
            isMd: function() {
                return $window.innerWidth >= 992 && $window.innerWidth < 1200;
            },
            isLg: function() {
                return $window.innerWidth >= 1200;
            }
        };
    });

})();

(function() {

    var helper = angular.module("helper",['data']);

    helper.directive('alertInput', function() {
        return {
            restrict : 'A',
            scope : {
                alertInput: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('alertInput', function(v) {
                    if ( v ) {
                        element.addClass('gt-error');
                        element.removeClass('gt-calculated');
                    } else {
                        element.addClass('gt-calculated');
                        element.removeClass('gt-error');
                    }
                    element.attr.title = v;
                });
            }
        };
    });

    helper.directive('showTags', function($compile,TagColor) {
        return {
            restrict : 'EA',
            replace : false,
            scope : {
                tags: '&',
                removable: '@',
                itemClick: '&'
            },
            template: "<button style='margin:2px' ng-click='removeTag($index)' ng-repeat='tag in tags() track by $index' type='button' class='btn btn-xs' ng-class='color(tag)'>" +
                    "{{tag}}" +
                    "<span ng-show='removable' class='glyphicon glyphicon-remove'></span>" +
                    "</button>",
            controller: function($scope) {
                $scope.color = TagColor;

                $scope.removeTag = function($index) {
                    if ( $scope.removable ) {
                        $scope.tags().splice($index,1);
                    } else if ( $scope.itemClick ) {
                        $scope.itemClick()($scope.tags()[$index]);
                    }
                };
            }
        };
    });

    helper.filter("formatDate",function($filter) {
        return function(date) {
            return util.formatDate(date,$filter('date'));
        };
    });

    helper.filter('numberCeil', function() {
        return function(value) {
            return Math.ceil(value);
        };
    });

    helper.factory("TagColor",function() {
        var colorsStyles = ['btn-primary','btn-success','btn-yellow','btn-info','btn-warning','btn-danger','btn-brown'];
        var colorPos = 0;
        var colorsTags = {};

        return function(tag) {
            if ( colorsTags[tag] ) {
                return colorsTags[tag];
            } else {
                var ret=colorsStyles[colorPos++];
                colorPos %= colorsStyles.length;
                colorsTags[tag] = ret;
                return ret;
            }
        };
    });

    var ABV_COHEF = 0.131;

    helper.factory("BrewCalc",function(
        BrewHelper,
        FermentableUses
    ) {
        return {
            /**
             * Calcula el porcentaje final de evaporacion.
             * Evaporacion horaria extendida a todo el tiempo de coccion
             *
             * @param BOIL_TIME tiempo total de hervor en minutos.
             * @param EvapPerHour porcentaje de evaporacion por hora.
             */
            evapTotal: function(BOIL_TIME, EvapPerHour) {
                var hours = Math.floor(BOIL_TIME/60);
                var rest = (BOIL_TIME % 60) / 60;

                var percentageEvap = 1 - rest * EvapPerHour/100;

                for (var i=0; i < hours; i++ ) {
                    percentageEvap *= 1 - EvapPerHour/100;
                }
                return 1-percentageEvap;
            },
            calculateBoilSize: function (BATCH_SIZE, TrubChillerLosses, BOIL_TIME, PercentEvap, TopUpWater) {
                var ltsAfterBoil = BATCH_SIZE/0.96+TrubChillerLosses;

                var percentageEvap = this.evapTotal(BOIL_TIME,PercentEvap);
                var tuw = TopUpWater ? TopUpWater : 0;
                return ltsAfterBoil / ( 1 - percentageEvap ) + tuw;
            },
            initialMashVolume: function(StrikeWater,totalAmount) {
                return StrikeWater+totalAmount;
            },
            actualMashVolume: function($index,initVol,steps) {
                var liters = initVol;
                for ( var i=0; i<=$index; i++ ) {
                    var it = steps[i];
                    if ( it.infuse ) {
                        liters += it.INFUSE_AMOUNT;
                    }
                }
                return liters;
            },
            estimateLiters: function($index,BATCH_SIZE,stages) {
                var liters = BATCH_SIZE;
                for ( var i=0; i<$index; i++ ) {
                    var it = stages[i];
                    if ( it.transferring ) {
                        liters -= it.losses;
                    }
                }
                return liters;
            },
            bottledLiters: function(volumeByCarbonatationType,bottles) {
                var liters = 0;
                volumeByCarbonatationType.sugar= 0;
                volumeByCarbonatationType.must= 0;
                volumeByCarbonatationType.co2= 0;

                angular.forEach(bottles,function(bottle){
                    liters += bottle.size * bottle.amount;
                    volumeByCarbonatationType[bottle.carbonatationType] += bottle.size * bottle.amount;
                });

                return liters;
            },
            fixEmptyValues: function (recipe, defaultValues) {
                recipe.TrubChillerLosses = recipe.TrubChillerLosses || 0;
                recipe.mashTemp = recipe.mashTemp || 66;
                recipe.GrainTemp = recipe.GrainTemp || 25;
                recipe.SpargeTempDesired = recipe.SpargeTempDesired || 75;
                recipe.SpargeDeadSpace = recipe.SpargeDeadSpace || 0;
                recipe.lossMashTemp = recipe.lossMashTemp || 0;
                recipe.PercentEvap = recipe.PercentEvap || 10;
                recipe.pitchRate = recipe.pitchRate || 0.75;
                if ( !recipe.WatertoGrainRatio ) {
                    recipe.WatertoGrainRatio = 3;
                    recipe.StrikeWater = BrewHelper.round(recipe.WatertoGrainRatio * recipe.totalAmountMash,10);
                }
                //Fermentables Uses in mash
                var amountMash = 0;
                angular.forEach(recipe.FERMENTABLES.FERMENTABLE, function(ferm) {
                    ferm.USE = ferm.USE || FermentableUses.defaultValue;
                    if ( FermentableUses.valueOf(ferm.USE).mash ) {
                        amountMash += ferm.AMOUNT;
                    }
                });
                //fix recipe.StrikeWater issue #136
                //Only when totalAmountMash is empty (First time)
                if ( !recipe.totalAmountMash ) {
                    recipe.StrikeWater = BrewHelper.round(recipe.WatertoGrainRatio * amountMash,10);
                }
                recipe.totalAmountMash = recipe.totalAmountMash || amountMash;
                recipe.OG_exclude = recipe.OG;
                if ( recipe.YEASTS.YEAST ) {
                    recipe.YEASTS.YEAST[0].density = recipe.YEASTS.YEAST[0].density || 10;
                    recipe.YEASTS.YEAST[0].packageSize = recipe.YEASTS.YEAST[0].packageSize || 11;
                }

                defaultValues = defaultValues || {};
                recipe.timeWaterMash = recipe.timeWaterMash || defaultValues.timeWaterMash || 60;
                recipe.spargeDuration = recipe.spargeDuration || defaultValues.spargeDuration || 45;
                recipe.preBoilTime = recipe.preBoilTime || defaultValues.preBoilTime || 60;
                recipe.coolingTime = recipe.coolingTime || defaultValues.coolingTime || 30;
            },
            totalCations: function(cations) {
                if ( !cations ) return null;
                var B4=cations.calcium || 0;
                var B5=cations.magnesium || 0;
                var B6=cations.sodium || 0;
                var B7=cations.potassium || 0;
                var B8=cations.iron || 0;
                return (B4/20.05)+(B5/12.15)+(B6/23)+(B7/39.1)+(B8/28);
            },
            totalHardness: function(cations) {
                if ( !cations ) return null;
                var B4=cations.calcium || 0;
                var B5=cations.magnesium || 0;
                return ((B4/20.04)+(B5/12.15))*50;
            },
            permanentHardness: function(water) {
                if ( !water ) return null;
                return this.totalHardness(water.cations)-this.temporaryHardness(water);
            },
            temporaryHardness: function(water) {
                if ( !water ) return null;
                return Math.min(this.totalHardness(water.cations),this.alkalinity(water.anions));
            },
            alkalinity: function(anions) {
                if ( !anions ) return null;
                var C4=anions.bicarbonate || 0;
                var C5=anions.carbonate || 0;
                return (C4+(C5/0.6))*(50/61)*(1+(2*Math.pow(10,-2.4)));
            },
            effectiveHardness: function(cations) {
                if ( !cations ) return null;
                var B4=cations.calcium || 0;
                var B5=cations.magnesium || 0;
                return ((B4/20)+(B5/24.3))*50;
            },
            residualAlkalinity: function(water) {
                if ( !water || !water.cations) return null;
                var B4=water.cations.calcium || 0;
                var B5=water.cations.magnesium || 0;
                return (this.alkalinity(water.anions)-((B4*0.7143)+(B5*0.5879)));
            },
            totalAnions: function(anions) {
                if ( !anions ) return null;
                var C4=anions.bicarbonate || 0;
                var C5=anions.carbonate || 0;
                var C6=anions.sulfate || 0;
                var C7=anions.chloride || 0;
                var C8=anions.nitrate || 0;
                var C9=anions.nitrite || 0;
                var C10=anions.fluoride || 0;
                return (C4/61)+(C5/30)+(C6/48)+(C7/35.45)+(C8/62)+(C9/46)+(C10/19);
            },
            waterBalance: function(water) {
                if ( !water ) return null;
                return Math.abs(this.totalAnions(water.anions)-this.totalCations(water.cations));
            },
            waterCalculation: function(input, output) {
                return bfWater.recalculate(input, output);
            },
            suggestWaterCalculation: function(input) {
                return bfWater.suggest(input);
            },
            calculateABV: function(og, fg) {
                var OG = BrewHelper.toPpg(og);
                var FG = BrewHelper.toPpg(fg);
                return BrewHelper.round((OG-FG)*ABV_COHEF,100);
            },
            calculateOG: function(fg, abv) {
                var FG = BrewHelper.toPpg(fg);
                var OG = abv/ABV_COHEF + FG;
                return BrewHelper.toPotential(OG);
            },
            calculateFG: function(og, abv) {
                var OG = BrewHelper.toPpg(og);
                var FG = OG - abv/ABV_COHEF;
                return BrewHelper.toPotential(FG);
            },
            attenuation: function(og, fg) {
                var OG = BrewHelper.toPpg(og);
                var FG = BrewHelper.toPpg(fg);
                return ((OG - FG) / OG)*100;
            },
            toPlato: function(sg) {
                // var sg = BrewHelper.toPpg(gravity);
                return BrewHelper.round((-1 * 616.868) + (1111.14 * sg) - (630.272 * Math.pow(sg,2)) + (135.997 * Math.pow(sg,3)),100);
            },
            fromPlato: function(plato) {
                // console.log("plato", plato);
                var r=1 + (plato / (258.6 - ( (plato/258.2) *227.1) ) );
                // console.log("r", r);
                var result = BrewHelper.round(r,10000);
                // console.log("result", result);
                return result;
            },
            adjustHydrometer: function(gravity, reading, calibration) {
                return bfHydrometer.recalculate(gravity,reading,calibration);
            },
            adjustRefractometer: function(og, fg, correction) {
                return bfRefractometer.recalculate(og,fg,correction);
            },
            dilution: function(currentGrav, currentVol, finalGrav) {
                return bfDilution.recalculate(currentVol, currentGrav, finalGrav);
            },
            yeastDiff: function(volume, gravity, grams, density, pitchRate) {
                return bfYeast.recalculate(
                    volume,
                    gravity,
                    pitchRate || 0.75,
                    'dry',
                    grams,
                    density || 10
                ).yeastDifference;
            },
            //In grams
            yeastNeed: function(volume, gravity, grams, density, pitchRate) {
                density = density || 10;
                var diff = bfYeast.recalculate(
                    volume,
                    gravity,
                    pitchRate || 0.75,
                    'dry',
                    grams,
                    density
                ).yeastDifference;
                //diff is billon of cells
                return Math.ceil(diff/density); //10 is density (it may change)
            },
            /**
            * @param items [{size, gravity}]
            */
            calculateMix: function(items) {
                items = items || [];
                var sumGrav = 0;
                var sumSize = 0;
                for ( var i=0; i<items.length; i++ ) {
                    var item = items[i];
                    sumGrav += (item.gravity*1000-1000) * item.size;
                    sumSize += item.size;
                }
                if ( sumSize === 0 || isNaN(sumSize) ) return 0;

                var v = (sumGrav/sumSize + 1000) / 1000;
                console.log(v,BrewHelper.round(v,1000));
                return BrewHelper.round(v,1000);
            }
        };
    });

    helper.factory("BrewHelper",function() {
        return {
            toLbs: function(kg) {
                return kg / 0.45359;
            },
            toOz: function(kg) {
                return kg * 1000 * 0.035274;
            },
            toGal: function(liters) {
                return liters * 0.264172052637296;
            },
            toPpg: function(potential) {
                return potential * 1000 - 1000;
            },
            toPotential: function(ppg) {
                return this.round((ppg + 1000) / 1000,1000);
            },
            round: function (value, zeros) {
                return Math.round(value*zeros)/zeros;
            },
            pad: function(value,zeros) {
                return util.pad(value,zeros);
            },
            calculateU: function(gravity,time) {
                var g = this.toPpg(gravity);
                var m = 30;
                var M = 120;
                for (var i=0; i<U_gravity.length; i++) {
                    if (g < U_gravity[i]) {
                        M = U_gravity[i];
                        break;
                    } else {
                        m = U_gravity[i];
                    }
                }
                var diff = M-m;
                var p = (g-m)/diff; //proporcion
                if ( p == Infinity || isNaN(p) ) {
                    p = 0;
                }

                var valm;
                var valM;
                if ( U[time.toString()] ) {
                    valm = U[time.toString()][m.toString()];
                    valM = U[time.toString()][M.toString()];
                } else {
                    valm = 0;
                    valM = 0;
                }

                var valDiff = valM-valm; //Diff de valores
                var valP = valDiff*p;
                return valm+valP;
            },convertColor: function(srm) {
                if ( srm > 40 ) {
                    return "black";
                } else if ( srm < 1 ) {
                    return "white";
                } else {
                    return SRM[Math.round(srm)];
                }
            },
            complementary: function(color) {
                var hexa = color.replace('#', '0x');
                var colorDec = 0xffffff ^ hexa;
                return '#' + colorDec.toString(16);
            }
        };
    });

    var SRM = ['#FFFFFF','FFE699' , '#FFD878' , '#FFCA5A' , '#FFBF42' , '#FBB123' , '#F8A600' , '#F39C00' , '#EA8F00' , '#E58500' , '#DE7C00',
        '#D77200' , '#CF6900' , '#CB6200' , '#C35900' , '#BB5100' , '#B54C00' , '#B04500' , '#A63E00' , '#A13700' , '#9B3200',
        '#952D00' , '#8E2900' , '#882300' , '#821E00' , '#7B1A00' , '#771900' , '#701400' , '#6A0E00' , '#660D00' , '#5E0B00',
        '#5A0A02' , '#600903' , '#520907' , '#4C0505' , '#470606' , '#440607' , '#3F0708' , '#3B0607' , '#3A070B' , '#36080A'];

    var U_time = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,90,100,110,120];
    var U_gravity = [30,40,50,60,70,80,90,100,110,120];
    var U = {
        '0': {
            '30':0,
            '40':0,
            '50':0,
            '60':0,
            '70':0,
            '80':0,
            '90':0,
            '100':0,
            '110':0,
            '120':0
        },
        '5': {
            '30':0.055,
            '40':0.050,
            '50':0.046,
            '60':0.042,
            '70':0.038,
            '80':0.035,
            '90':0.032,
            '100':0.029,
            '110':0.027,
            '120':0.025
        },
        '10': {
            '30':0.100,
            '40':0.091,
            '50':0.084,
            '60':0.076,
            '70':0.070,
            '80':0.064,
            '90':0.058,
            '100':0.053,
            '110':0.049,
            '120':0.045
        },
        '15': {
            '30':0.137,
            '40':0.125,
            '50':0.114,
            '60':0.105,
            '70':0.096,
            '80':0.087,
            '90':0.080,
            '100':0.073,
            '110':0.067,
            '120':0.061
        },
        '20': {
            '30':0.167,
            '40':0.153,
            '50':0.140,
            '60':0.128,
            '70':0.117,
            '80':0.107,
            '90':0.098,
            '100':0.089,
            '110':0.081,
            '120':0.074
        },
        '25': {
            '30':0.192,
            '40':0.175,
            '50':0.160,
            '60':0.147,
            '70':0.134,
            '80':0.122,
            '90':0.112,
            '100':0.102,
            '110':0.094,
            '120':0.085
        },
        '30': {
            '30':0.212,
            '40':0.194,
            '50':0.177,
            '60':0.162,
            '70':0.148,
            '80':0.135,
            '90':0.124,
            '100':0.113,
            '110':0.103,
            '120':0.094
        },
        '35': {
            '30':0.229,
            '40':0.209,
            '50':0.191,
            '60':0.175,
            '70':0.160,
            '80':0.146,
            '90':0.133,
            '100':0.122,
            '110':0.111,
            '120':0.102
        },
        '40': {
            '30':0.242,
            '40':0.221,
            '50':0.202,
            '60':0.185,
            '70':0.169,
            '80':0.155,
            '90':0.141,
            '100':0.129,
            '110':0.118,
            '120':0.108
        },
        '45': {
            '30':0.253,
            '40':0.232,
            '50':0.212,
            '60':0.194,
            '70':0.177,
            '80':0.162,
            '90':0.148,
            '100':0.135,
            '110':0.123,
            '120':0.113
        },
        '50': {
            '30':0.263,
            '40':0.240,
            '50':0.219,
            '60':0.200,
            '70':0.183,
            '80':0.168,
            '90':0.153,
            '100':0.140,
            '110':0.128,
            '120':0.117
        },
        '55': {
            '30':0.270,
            '40':0.247,
            '50':0.226,
            '60':0.206,
            '70':0.188,
            '80':0.172,
            '90':0.157,
            '100':0.144,
            '110':0.132,
            '120':0.120
        },
        '60': {
            '30':0.276,
            '40':0.252,
            '50':0.231,
            '60':0.211,
            '70':0.193,
            '80':0.176,
            '90':0.161,
            '100':0.147,
            '110':0.135,
            '120':0.123
        },
        '65': {
            '30':0.28049999999999997,
            '40':0.2565,
            '50':0.2345,
            '60':0.2145,
            '70':0.196,
            '80':0.179,
            '90':0.1635,
            '100':0.1495,
            '110':0.137,
            '120':0.125
        },
        '70': {
            '30':0.285,
            '40':0.261,
            '50':0.238,
            '60':0.218,
            '70':0.199,
            '80':0.182,
            '90':0.166,
            '100':0.152,
            '110':0.139,
            '120':0.127
        },
        '75': {
            '30':0.288,
            '40':0.2635,
            '50':0.2405,
            '60':0.22,
            '70':0.201,
            '80':0.184,
            '90':0.168,
            '100':0.1535,
            '110':0.1405,
            '120':0.1285
        },
        '80': {
            '30':0.291,
            '40':0.266,
            '50':0.243,
            '60':0.222,
            '70':0.203,
            '80':0.186,
            '90':0.170,
            '100':0.155,
            '110':0.142,
            '120':0.130
        },
        '90': {
            '30':0.295,
            '40':0.270,
            '50':0.247,
            '60':0.226,
            '70':0.206,
            '80':0.188,
            '90':0.172,
            '100':0.157,
            '110':0.144,
            '120':0.132
        },
        '100': {
            '30':0.298,
            '40':0.272,
            '50':0.249,
            '60':0.228,
            '70':0.208,
            '80':0.190,
            '90':0.174,
            '100':0.159,
            '110':0.145,
            '120':0.133
        },
        '110': {
            '30':0.300,
            '40':0.274,
            '50':0.251,
            '60':0.229,
            '70':0.209,
            '80':0.191,
            '90':0.175,
            '100':0.160,
            '110':0.146,
            '120':0.134
        },
        '120': {
            '30':0.301,
            '40':0.275,
            '50':0.252,
            '60':0.230,
            '70':0.210,
            '80':0.192,
            '90':0.176,
            '100':0.161,
            '110':0.147,
            '120':0.134
        }
    };
})();

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
                function createConfig(state,title,emptyText,show,showPanel,reverse) {
                    var config = {
                        title: title,
                        emptyText: emptyText,
                        showPanel: showPanel,
                        limit: 5,
                        state: state,
                        // show: show === true || show === 'true',
                        show: true,
                        noMore: false,
                        load: function() {
                            Recipe.query({
                                'filter[state]':state,
                                limit: this.limit,
                                sort:reverse ? 'code' : '-code'
                            }, function(recipes) {
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

                $scope.panels = ['running','ready','draft','finished','archived','wish'];
                $scope.configs = {
                    running: createConfig(
                        'running',
                        'En Curso',
                        'No tenes recetas en curso',
                        localStorage['home.running.show'] || true,
                        'Mostrar recetas en curso',true
                    ),
                    ready: createConfig(
                        'ready',
                        'Listas',
                        'No tenes recetas listas',
                        localStorage['home.ready.show'] || true,
                        'Mostrar recetas listas',true
                    ),
                    draft: createConfig(
                        'draft',
                        'Borradores',
                        'No tenes recetas en borrador',
                        localStorage['home.draft.show'] || true,
                        'Mostrar Borradores',true
                    ),
                    finished: createConfig(
                        'finished',
                        'Finalizadas',
                        'No tenes recetas finalizadas',
                        localStorage['home.finished.show'] || false,
                        'Mostrar finalizadas'
                    ),
                    archived: createConfig(
                        'archived',
                        'Archivadas',
                        'No tenes recetas archivadas',
                        localStorage['home.archived.show'] || false,
                        'Mostrar archivadas'
                    ),
                    wish: createConfig(
                        'wish',
                        'Lista de deseos',
                        'No tenes recetas en lista de deseos',
                        localStorage['home.wish.show'] || false,
                        'Mostrar lista de deseos',true
                    )
                };
                function reload() {
                    angular.forEach($scope.panels, function(key) {
                        $scope.configs[key].load();
                    });
                }

                $scope.convertColor = function(srm) {
                    return BrewHelper.convertColor(srm);
                };

                $scope.publish = function(recipe) {
                    recipe.$publish({isPublic: true},function() {
                        alertFactory.create('success','La misma ya estara disponible para el resto de los usuarios!','Receta publicada con exito!');
                        reload();
                    });
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
                    } else if ( recipe.state === 'finished' ) {
                        recipe.$state({state:'archived'}, function() {
                            reload();
                        });
                    } else if ( recipe.state === 'wish' ) {
                        recipe.$state({state:'draft'}, function() {
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
                    } else if ( recipe.state === 'finished' ) {
                        return 'Archivar';
                    } else if ( recipe.state === 'wish' ) {
                        return 'Recuperar';
                    }
                };

                $scope.show = function(panel) {
                    panel.show = true;
                    localStorage['home.' + panel.state + '.show'] = true;
                };

                $scope.hide = function(panel) {
                    panel.show = false;
                    localStorage['home.' + panel.state + '.show'] = false;
                };

                $scope.currentState = function(recipe) {
                    if ( recipe.state === 'running' &&
                        recipe.fermentation.estimateDate &&
                        new Date(recipe.fermentation.estimateDate).getTime() < (new Date()).getTime()) {

                        var now = new Date(recipe.fermentation.estimateDate).getTime();
                        var lastStage = null;
                        for (var i=0; i<recipe.fermentation.stages.length; i++) {
                            var duration = recipe.fermentation.stages[i].duration;
                            var mode = recipe.fermentation.stages[i].durationMode;
                            lastStage = recipe.fermentation.stages[i];
                            if ( mode === 'Horas' ) {
                                now += duration*60*60*1000;
                            } else {
                                now += duration*24*60*60*1000;
                            }
                            if ( now > new Date().getTime() ) {
                                break;
                            }
                        }
                        if ( now < new Date().getTime() ) {
                            return 'Lista para embotellar';
                        } else if ( lastStage !== null ) {
                            if ( lastStage.temperature === lastStage.temperatureEnd) {
                                return '$title: $tiº'
                                .replace('$title',lastStage.title)
                                .replace('$ti',lastStage.temperature);
                            } else {
                                return '$title: $tiº a $tfº'
                                .replace('$title',lastStage.title)
                                .replace('$ti',lastStage.temperature)
                                .replace('$tf',lastStage.temperatureEnd);
                            }

                        } else {
                            return null;
                        }
                    } else {
                        return null;
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

(function() {

    var module = angular.module("brew-o-module.controller",[]);


    module.controller("RecipeMashCtrl",function(
        $scope,
        BrewCalc,
        BrewHelper,
        FermentableUses
    ) {
        $scope.styleTitle = function(onFocus) {
            if ( onFocus ) {
                return {background: 'white','border-color':'#ccc'};
            } else {
                return {background: 'white','border-color':'white',cursor:'pointer'};
            }
        };
        $scope.moment = function($index) {
            var time = 0;
            for (var i=0; i<$index; i++) {
                time += $scope.recipe.MASH.MASH_STEPS.MASH_STEP[i].STEP_TIME;
            }
            return time;
        };
        $scope.firstRunSg = function() {
            var og = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                if ( FermentableUses.valueOf(f.USE).mash ) {
                    og += BrewHelper.toLbs(f.AMOUNT) *
                        BrewHelper.toPpg(f.POTENTIAL) *
                        // ($scope.recipe.EFFICIENCY/100) /
                        0.75 /
                        BrewHelper.toGal($scope.recipe.StrikeWater);
                }
            });
            return BrewHelper.toPotential(og);
        };

        $scope.spargeWater = function() {
            return $scope.totalWater() -
                BrewCalc.actualMashVolume(
                    $scope.recipe.MASH.MASH_STEPS.MASH_STEP.length-1,
                   0,
                   $scope.recipe.MASH.MASH_STEPS.MASH_STEP
                ) -
                $scope.recipe.StrikeWater-
                ($scope.recipe.TopUpWater||0);
        };

        $scope.totalWater = function() {
            return BrewCalc
                        .calculateBoilSize($scope.recipe.BATCH_SIZE,
                                           $scope.recipe.TrubChillerLosses,
                                           $scope.recipe.BOIL_TIME,
                                           $scope.recipe.PercentEvap,
                                           $scope.recipe.TopUpWater)
                    +$scope.recipe.SpargeDeadSpace
                    +$scope.recipe.GrainAbsorbtion*$scope.recipe.totalAmountMash;
        };

        $scope.addWaterVol = function(STEP,$index) {
            //Hago los caclulos para el agregado de agua
            var ratio;
            if ( $index == 0 ) {
                ratio = $scope.recipe.WatertoGrainRatio;
            } else {
                var vol = BrewCalc.actualMashVolume($index-1,$scope.recipe.StrikeWater,$scope.recipe.MASH.MASH_STEPS.MASH_STEP);
                ratio = vol/$scope.recipe.totalAmountMash;
            }
            var botvol = 0.7; //Equivalente en agua del barril (absorcion de temp), por ahora desprecio y dejo en 0.
            //el otro cero es los litros perdidos debejo del FF, que deberia calcularlos antes.
            STEP.INFUSE_AMOUNT = restCalc($scope.recipe.totalAmountMash,ratio,0,0,STEP.STEP_TEMP,STEP.END_TEMP,STEP.INFUSE_TEMP);

            //Calculos para tamaño de la decoccion
            var volMash = BrewCalc.actualMashVolume($index-1,$scope.recipe.StrikeWater+$scope.recipe.totalAmountMash,$scope.recipe.MASH.MASH_STEPS.MASH_STEP);

            //Supongo q siempre decocciono a 100
            var decoctionTemp = 100;
            STEP.DECOCTION_AMT = BrewHelper.round(volMash * ( STEP.END_TEMP - STEP.STEP_TEMP ) / ( decoctionTemp - STEP.STEP_TEMP ),10);
        };

        function restCalc(weight,thick,botvol,eqvol,curtemp,tartemp,boiltemp) {
            var vol=weight*(0.417+thick)+botvol+eqvol;
            var watvol=vol*(tartemp-curtemp)/(boiltemp-tartemp);
            return BrewHelper.round(watvol,10);
        }

        $scope.strikeWaterTemp = function() {
            return ($scope.recipe.mashTemp-$scope.recipe.GrainTemp)*0.417/$scope.recipe.WatertoGrainRatio
                    +$scope.recipe.mashTemp
                    +$scope.recipe.lossMashTemp;
        };

        $scope.changeAction = function(STEP, actionValue) {
            if (actionValue == '0') {
                STEP.infuse = false;
                STEP.decoction = false;
            } else if (actionValue == '1') {
                STEP.infuse = true;
                STEP.decoction = false;
            } else if (actionValue == '2') {
                STEP.infuse = false;
                STEP.decoction = true;
            }
        };

        $scope.stepAction = function(STEP) {
            if (STEP.infuse) {
                return "Agregar Agua"
            } else if (STEP.decoction) {
                return "Decoccion";
            }
            return null;
        };

        $scope.initActionValue = function(STEP) {
            if (STEP.infuse) {
                return '1';
            } else if (STEP.decoction) {
                return '2';
            } else {
                return '0';
            }
        };

        $scope.addMashStep = function() {
            //ahora pongo esa, luego debeira obtene la del ultimo step.
            var temp = $scope.recipe.mashTemp;
            angular.forEach($scope.recipe.MASH.MASH_STEPS.MASH_STEP,function(step) {
                temp = step.END_TEMP;
            });
            //Idem anterior
            var ratio = $scope.recipe.WatertoGrainRatio;
            //Copiar ultimo
            var recirculate = false;

            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.push({
                NAME: null,
                TYPE: 'Infusion',
                infuse: false,
                INFUSE_AMOUNT: 0, //Agua agregada
                INFUSE_TEMP: 100,   //Temp agua agregada
                STEP_TIME: 0,     //Duracion
                STEP_TEMP: temp,     //Temperatura buscada (si pongo INFUSE se calcula sola, pero se puede pisar)
                END_TEMP: temp,      //Temp final de la etapa.
                DESCRIPTION: null,   //texto libre
                WATER_GRAIN_RATIO: ratio, //relacion final (calculada, INFUSE_AMOUNT y DECOCTION_AMT)
                DECOCTION_AMT: 0,  //cantidad sacada para decocction
                recirculate: recirculate,
                compact:false
            });
        };

        $scope.updateInfuse = function() {

        };

        $scope.calculateVolume = function(step_index) {
            return BrewCalc.actualMashVolume(
                        step_index,
                        BrewCalc.initialMashVolume($scope.recipe.StrikeWater,$scope.recipe.totalAmountMash),
                        $scope.recipe.MASH.MASH_STEPS.MASH_STEP);
        };

        $scope.updateChart = function() {

        };

        $scope.moveUp = function(STEP,$index) {
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index,1);
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index-1,0,STEP);
        };

        $scope.moveDown = function(STEP,$index) {
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index,1);
            $scope.recipe.MASH.MASH_STEPS.MASH_STEP.splice($index+1,0,STEP);
        };

    });

    /**
     * BottlingControler
     */
    module.controller("BottlingCtrl",function($scope,Bottle,BrewHelper) {

        $scope.bottleColor = {
            'Ambar': 'rgb(226, 137, 58)',
            'Verde': '#348B29'
        };

        $scope.getBottleColor = function(colour) {
            if (colour) {
                return $scope.bottleColor[colour] || '#FFFFFF';
            } else {
                return '#FFFFFF';
            }
        };
        $scope.bottles = Bottle.query();

        var sugarTypeCoef = {
            cane: 1,
            corn: 0.87,
            honey: 0.65
        };
        $scope.carbonatationStrategy = {
            sugar: function() {
                if ( $scope.recipe.bottling.sugar ) {
                    var volCO2 = $scope.recipe.bottling.sugar.desiredVol; //D10
                    var temp = $scope.recipe.bottling.sugar.temperature; //D11
                    if ( !$scope.recipe.bottling.sugar.sugarType ) {
                        $scope.recipe.bottling.sugar.sugarType = 'cane';
                    }
                    var G11 = ((9*temp)/5)+32;
                    var H13 = sugarTypeCoef[$scope.recipe.bottling.sugar.sugarType]; //1 para azucar de caña (0,87 para maiz)
                    $scope.restCO2 = 3.0378-0.050062*G11+0.0002655*G11*G11; //D14
                    $scope.gramsLiter = BrewHelper.round((volCO2-$scope.restCO2)*4.23/H13,10);
                }
            }
        };


        $scope.changeBottles = function() {
            $scope.carbonatationStrategy.sugar();
        }
        //Execute calculus at first time
        $scope.carbonatationStrategy.sugar();

        $scope.changeBottleType = function(bottle) {
            angular.forEach($scope.bottles,function(it) {
                if ( it.name == bottle.bottleType) {
                    bottle.size = it.size;
                    bottle.colour = it.colour;
                    bottle.amount=$scope.round(bottle.subTotal/bottle.size)
                }
            });
            $scope.changeBottles();
        };

        $scope.obtainVolCO2Style = function() {
            var vol;
            $scope.titleForDesiredCO2 = '';
            angular.forEach($scope.styles,function(style) {
                if (style.link && $scope.recipe.STYLE.NAME == style.name) {
                    vol = BrewHelper.round(((style.co2_max||0) + (style.co2_min||0)) / 2,100);
                }
            });
            if (vol) {
                $scope.titleForDesiredCO2 = 'Usar ' + vol + ' VOL (' + $scope.recipe.STYLE.NAME +')';
                $scope.disableObtainVolCO2 = false;
            } else {
                $scope.titleForDesiredCO2 = 'Vol de CO2 no conocido para el estilo';
                $scope.disableObtainVolCO2 = true;
            }
            //$scope.changeBottles();
            return vol;
        };
        $scope.obtainVolCO2Style();

        $scope.presureInPsi = function(vol,temp) {
            var tempF = ((212-32)/100 *temp + 32);
            var psi =  BrewHelper.round(-16.6999- 0.0101059 *tempF+0.00116512*tempF*tempF+0.173354*tempF*vol+4.24267 *vol- 0.0684226*vol*vol,10);
            $scope.presureInBar = BrewHelper.round(Math.round(1 / 14.5038 *psi* 1000000) / 1000000,100);
            $scope.presureKgCm2 = BrewHelper.round($scope.presureInBar * 1.01972,100);
            return psi;
        };

        $scope.obtainMaxFermTemp = function(carbonatationType) {
            //Si no tiene cargada temperatura busco la mayor de la fermentacion
            var max = 0;
            angular.forEach($scope.recipe.fermentation.stages,function(stage) {
                if (stage.temperature > max) {
                    max = stage.temperature;
                }
                if (stage.temperatureEnd > max) {
                    max = stage.temperatureEnd;
                }
            });
            $scope.recipe.bottling[carbonatationType].temperature = max;
            $scope.changeBottles();
        };

        $scope.leftClass = function(value) {

            //Botella mas chica
            var min = 100;
            angular.forEach($scope.recipe.bottling.bottles, function(bottle) {
                if ( bottle.size < min ) {
                    min = bottle.size;
                }
            });
            if (min == 100) {
                min = 0;
            }

            if ( value >= min ) { //tenes para mas de una botella
                $scope.restClass = 'text-info';
                $scope.restComment = 'Vamos! Aun podes seguir llenando mas botellas';
                return 'gt-calculated';
            } else if ( value >= 0 ) { //Te queda para una botella mas
                $scope.restClass = 'text-warning';
                $scope.restComment = 'Ya usaste casi toda la cerveza, aun podes llenar una botella mas de ' + min + ' L a medias';
                return 'gt-calculated';
            } else if ( value >= -min ) { //te pasaste, ultima botella a medias
                $scope.restClass = 'text-success';
                $scope.restComment = 'Ya has usado toda la cerveza, la ultima botella te ha quedado a medias';
                return 'gt-green';
            } else { //listo, tanta birra no tenes.
                $scope.restClass = 'text-danger';
                $scope.restComment = 'Te has pasado!! no tienes tanta cerveza para llenar todas las botellas.';
                return 'gt-error';
            }
        };

        $scope.totalBottles = function() {
            return _.sumBy($scope.recipe.bottling.bottles, 'amount');
        };

        $scope.restLiters = function() {
            return _.sumBy($scope.recipe.bottling.bottles, function(b) {
                return b.size*(b.amount-b.used);
            });
        };

        $scope.rest = function() {
            return _.sumBy($scope.recipe.bottling.bottles, function(b) {
                return b.amount-b.used;
            });
        };

        $scope.addBottle = function() {
            var rest = $scope.estimateLiters($scope.recipe.fermentation.stages.length)-$scope.bottledLiters();

            $scope.recipe.bottling.bottles.push({
                type: null,
                size: null, //En litros
                amount: 0,
                subTotal: rest,
                carbonatationType: 'sugar'//'sugar', 'must', 'co2'
            });

            $scope.changeBottles();
        };
    });

    /**
     * BoilControler
     */
    module.controller("RecipeBoilCtrl",function(
        $scope,
        BrewHelper,
        BrewCalc,
        FermentableUses
    ) {
        $scope.calculateSgBeforeBoil = function(BOIL_TIME, PercentEvap) {
            //Debo calcular la Densidad de los fermentables que van en el MASH
            //par excluir por ejemplo miel o candy que no cuenta como
            //SG Before Boil
            var og = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                if ( FermentableUses.valueOf(f.USE).mash ) {
                    og += BrewHelper.toLbs(f.AMOUNT) *
                        BrewHelper.toPpg(f.POTENTIAL) *
                        ($scope.recipe.EFFICIENCY/100) /
                        BrewHelper.toGal($scope.recipe.BATCH_SIZE);
                }
            });
            return BrewHelper.toPotential(
                og * (1-BrewCalc.evapTotal(BOIL_TIME,PercentEvap))
            );
        };
        $scope.calculateSgDuringBoil = function(BOIL_TIME, PercentEvap) {
            var og = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                if ( f.USE === 'Boil' ) {
                    og += BrewHelper.toLbs(f.AMOUNT) *
                    BrewHelper.toPpg(f.POTENTIAL) *
                    ($scope.recipe.EFFICIENCY/100) /
                    BrewHelper.toGal($scope.recipe.BATCH_SIZE);
                }
            });
            return BrewHelper.round(
                BrewHelper.toPotential(
                    og * (1-BrewCalc.evapTotal(BOIL_TIME,PercentEvap))
                ) - 1,
                1000
            );
        };
    });


    /**
     * RecipeCollaboratorsCtrl
     */
    module.controller("RecipeCollaboratorsCtrl",function($scope,User,alertFactory) {

        // $scope.users = User.query();

        $scope.removeUser = function(collaborator) {
            util.Arrays.remove($scope.recipe.collaborators,collaborator);
        };

        $scope.filterUser = function(name) {
            return User.query({
                "name": name
            }, function(r) {
                $scope.users = r;
            }).$promise;
        };

        // $scope.onSelectUser = function(user) {
        //     $scope.vintage.title = $scope.vintage.title || beer.name;
        // };

        $scope.formatUserSelection = function(user_id, users, $item) {
            if ( users ) {
                var filtered = _.find(users,{_id:user_id});
                if ( filtered ) {
                    return filtered.name;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };

        $scope.addUser = function(user_id) {

            //Filter by user_id
            var filter = function(item) {
                return item._id == user_id ? 0 : -1;
            };

            //Veo si quiero agregar un colaborador existente
            var exists = util.Arrays.filter($scope.recipe.collaborators,filter).length != 0;
            if ( exists ) {
                alertFactory.create("warning","El usuario seleccionado ya es un colaborador","Error al agregar usuario");
                return;
            }

            // if ( user_id == $scope.recipe.owner._id ) {
            if ( ($scope.recipe.owner && user_id == $scope.recipe.owner._id) ||
                    ($scope.recipe.owner && user_id == $scope.user._id) ) {
                alertFactory.create("warning","No puede agregar al dueño de la receta como colaborador","Error al agregar usuario");
                return;
            }

            //Busco el objeto usuario compelto y lo agrego
            var user = util.Arrays.filter($scope.users,filter)[0];
            $scope.recipe.collaborators.push(user);

        };

    });

    /**
     * RecipeRatingCtrl
     */
    module.controller("RecipeRatingCtrl",function($scope,$http,$sce) {

        $http.get("rating/beers").success(function(beers) {
            console.log(beers);
            $scope.beers = beers;
        });

        $scope.updateBeer = function() {
            // if ( $scope.recipe.beer_id ) {

            // } else {

            // }
            updateIFrame();
        }

        function updateIFrame() {
            if ( $scope.recipe.beer_id ) {
                $scope.iframeUrl = $sce.trustAsResourceUrl("http://www.birrasquehetomado.com.ar/html/tag.html#/beer/tag/" + $scope.recipe.beer_id);
            }
        }
        updateIFrame();



    });

    var tabs = {
        main: {
            title: 'Receta',
            template: 'detail-main'
        },
        water: {
            title: 'Agua',
            template: 'water'
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
        },
        log: {
            title: 'Bitacora',
            template: 'log'
        },
        collaborators: {
            title: 'Colaboradores',
            template: 'collaborators'
        },
        rating: {
            title: 'Calificaciones',
            template: 'rating'
        },
        temperature: {
            title: 'Temp. CEBADA',
            template: 'temperature'
        },
        tilt: {
            title: 'TILT',
            template: 'tilt'
        },
        chronometer: {
            title: 'Tiempos',
            template: 'chronometer'
        }
    };



    /**
     * TabControler
     */
    module.controller("RecipeTabCtrl",function($scope) {
        $scope.sortTabs = [
            'main',
            'water',
            'mash',
            'boil',
            'fermentation',
            'bottling',
            'log',
            'collaborators',
            'tilt',
            // 'rating',
            // 'temperature',
            'chronometer'
        ];
        $scope.tabs = tabs;

        $scope.selectedTab = 'main';

        $scope.changeTab = function(tab) {
            $scope.selectedTab=tab;
            $scope.$parent.notifications = [];
        };
    });

    /**
    * TabControler
    */
    module.controller("ShareTabCtrl",function($scope) {
        $scope.sortTabs = [
            'main',
            'mash',
            'boil',
            'fermentation',
            'bottling',
            'log'
            // ,
            // 'rating'
        ];
        $scope.tabs = tabs;

        $scope.selectedTab = 'main';

        $scope.changeTab = function(tab) {
            $scope.selectedTab=tab;
            $scope.$parent.notifications = [];
        };
    });

    module.filter("ts2date", function() {
        return function(timestamp) {
            return new Date(timestamp);
        };
    });

    module.controller("RecipeTemperatureCtrl", function($scope, TempDeviceReport, pushListener) {

        $scope.reload = function() {
            $scope.temperatures = TempDeviceReport.query({recipe_id: $scope.recipe._id}, function() {
                $scope.updateChart();
            });
        };

        $scope.reload();

        function onNewTemperature(temp) {
            $scope.temperatures.push(temp);
            $scope.updateChart();
            $scope.$apply();
        }

        pushListener.on("TEMP_DEVICE_REPORT_" + $scope.recipe._id, onNewTemperature);

        $scope.$on('$destroy',function() {
            pushListener.off("TEMP_DEVICE_REPORT_" + $scope.recipe._id, onNewTemperature);
        });


        $scope.updateChart = function() {
            var cols = [{
                    "id": "day",
                    "label": "Dias",
                    "type": "date"
                },{
                    "id": "temp",
                    "label": "Temperatura",
                    "type": "number"
                }];

            var rows = [];
            // var day = 0;
            // var today = new Date($scope.temperatures[0].timestamp);
            angular.forEach($scope.temperatures,function(stage) {
                rows.push({
                    "c": [
                        {
                            "v": new Date(stage.timestamp)
                        },
                        {
                            "v": stage.temperature|0,
                            "f": (stage.temperature|0) + "º (" + stage.temperatureMax + ")"
                        }
                    ]
                });
            });
            $scope.chart.data.cols = cols;
            $scope.chart.data.rows = rows;
        };

        $scope.chart = {
            "type": "LineChart",
            "displayed": true,
            "cssStyle": {height:'300px', width:'100%'},
            "data": {
                "cols": [],
                "rows": []
            },
            "options": {
                "title": "Evolucion",
                "isStacked": "false",
                "fill": 20,
                //"curveType": "function",
                "displayExactValues": true,
                "vAxis": {
                    "title": "Temperatura",
                    "gridlines": {
                        "count": 10
                    },
                    minValue:0
                },
                "hAxis": {
                    "title": "Dias"
                }
            },
            "formatters": {}
        };



    });

    function parse(value) {
        if ( value ) return parseInt(value);
        return null;
    }
    function parseB(value) {
        if ( value ) return value.toLowerCase() === 'true';
        return null;
    }

    /**
    * @param checkpoints [{
    *   time: Number,
    *   name: String
    * }]
    */
    module.directive('chron', function(ngAudio, alertFactory, BrewHelper) {
        return {
            restrict : 'EA',
            replace : true,
            scope : {
                id: '@',
                initial: '=',
                checkpoints: '='
            },
            templateUrl: 'partial/chron/chron.html',
            controller: function($scope, $interval) {

                var ID = $scope.id || Math.random().toString();

                //Sounds
                var bell = ngAudio.load('sounds/bell.wav');
                var bip = ngAudio.load('sounds/bip.wav');

                if ( parseB(localStorage['bom'+ID+'soundAlert']) !== null ) {
                    $scope.soundAlert =  parseB(localStorage['bom'+ID+'soundAlert']);
                } else {
                    $scope.soundAlert =  true;
                }
                localStorage['bom'+ID+'soundAlert'] = $scope.soundAlert;
                $scope.$watch('soundAlert', function(v) {
                    localStorage['bom'+ID+'soundAlert'] = v;
                });
                function playSound(sound) {
                    if ( $scope.soundAlert ) sound.play();
                }

                function calculate(mashTime) {
                    $scope.hours = Math.floor(mashTime / (1000*60*60));
                    $scope.minutes = Math.floor( mashTime / (1000*60) - ($scope.hours*60));
                    $scope.seconds = Math.floor( mashTime / 1000 - (Math.floor( mashTime / (1000*60))*60));
                }
                if ( localStorage['bom'+ID+'left'] ) {
                    calculate(parse(localStorage['bom'+ID+'left']));
                } else {
                    calculate($scope.initial||0);
                }


                var interval;
                var start = parse(localStorage['bom'+ID+'start']);
                localStorage['bom'+ID+'state'] = localStorage['bom'+ID+'state']  || 'new'; //new | run | stop
                var left = $scope.initial;
                localStorage['bom'+ID+'left'] = left;
                $scope.start = function() {
                    left = $scope.hours * 60 * 60 * 1000;
                    left += $scope.minutes * 60 * 1000;
                    left += $scope.seconds * 1000;
                    localStorage['bom'+ID+'left'] = left;
                    localStorage['bom'+ID+'state'] = 'run';
                    if ( !start ) {
                        localStorage['bom'+ID+'start'] = start = new Date().getTime();
                    }
                    //Reset checkpoints
                    angular.forEach($scope.checkpoints, function(c) {
                        delete c.check;
                    });
                    checkTime(true);
                    interval = $interval(function() {
                        var now = new Date().getTime();
                        var diff = now - start;
                        var value = left - diff;
                        if ( value <= 0) {
                            $scope.stop();
                            calculate(0);
                            if ( left !== 0 ) playSound(bell);
                            localStorage['bom'+ID+'left'] = left = 0;
                        } else {
                            checkTime();
                            calculate(value);
                        }
                    },100);
                };
                if ( localStorage['bom'+ID+'state'] === 'run' ) {
                    $scope.start();
                }
                $scope.stop = function() {
                    localStorage['bom'+ID+'state'] = 'stop';

                    var now = new Date().getTime();
                    var diff = now - start;
                    left = left - diff;
                    localStorage['bom'+ID+'left'] = left;
                    localStorage['bom'+ID+'start'] = start = null;

                    if ( interval ) {
                        $interval.cancel(interval);
                    }
                };
                $scope.reset = function() {
                    localStorage['bom'+ID+'state'] = 'new';
                    localStorage['bom'+ID+'start'] = start = null;
                    left = $scope.initial;
                    localStorage['bom'+ID+'left'] = left;
                    calculate(left);
                };
                $scope.enableStart = function() {
                    return localStorage['bom'+ID+'state'] === 'new' || localStorage['bom'+ID+'state'] === 'stop';
                };
                $scope.enableStop = function() {
                    return localStorage['bom'+ID+'state'] === 'run';
                };
                $scope.enableReset = function() {
                    return localStorage['bom'+ID+'state'] === 'stop';
                };
                $scope.enable = function() {
                    return localStorage['bom'+ID+'state'] === 'new' || localStorage['bom'+ID+'state'] === 'stop';
                };
                $scope.$on('$destroy',function() {
                    if ( interval ) {
                        $interval.cancel(interval);
                    }
                });
                /**
                * @param time miliseconds
                * @return {hours:Number,minutes:Number,seconds:Number}
                */
                $scope.timeToHour = function(time) {
                    var hours = Math.floor(time / (1000*60*60));
                    var minutes = Math.floor( time / (1000*60) - (hours*60));
                    var seconds = Math.floor( time / 1000 - (Math.floor( time / (1000*60))*60));
                    return {
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
                        toString: function() {
                            return 'hh:MM:ss'
                                .replace('hh',BrewHelper.pad(this.hours,2))
                                .replace('MM',BrewHelper.pad(this.minutes,2))
                                .replace('ss',BrewHelper.pad(this.seconds,2));
                        }
                    };
                };

                function checkTime(noAlert) {
                    if ( !$scope.checkpoints ) return;
                    var l = $scope.hours * 60 * 60 * 1000;
                    l += $scope.minutes * 60 * 1000;
                    l += $scope.seconds * 1000;
                    angular.forEach($scope.checkpoints, function(c) {
                        if ( c.time > l && !c.check ) {
                            c.check = true;
                            if (!noAlert) {
                                alertFactory.create('info',c.name);
                                playSound(bip);
                            }
                        }
                    });
                }
                checkTime(true);
            }
        };
    });

    module.controller("RecipeChronometerCtrl", function($scope) {

        $scope.mashTime = $scope.totalTime() * 60 * 1000;

        $scope.mashSteps = [];

        //Mash Steps
        var actualTime = $scope.totalTime();
        angular.forEach($scope.recipe.MASH.MASH_STEPS.MASH_STEP,function(step) {
            $scope.mashSteps.push({
                time: actualTime * 60 * 1000,
                name: step.NAME
            });
            actualTime -= step.STEP_TIME;
        });

        //Hoping
        // var hopMax = 0;
        // angular.forEach($scope.recipe.HOPS.HOP, function(h) {
        //     hopMax = Math.max(hopMax,h.TIME);
        // });
        $scope.hopTime = $scope.recipe.BOIL_TIME * 60 * 1000;
        $scope.boilStep = [];
        for( var i=0; i<$scope.recipe.HOPS.HOP.length; i++ ) {
            var hop = $scope.recipe.HOPS.HOP[i];

                prevDelay = hop.TIME;
            var name = hop.AMOUNT*1000 + 'g de ' + hop.NAME;
            $scope.boilStep.push({
                time: hop.TIME * 60 * 1000,
                name: name
            });
        }



    });

    /**
     * TiltCtrl
     */
    module.controller("TiltCtrl",function(
        $scope,
        BrewHelper,
        BrewCalc,
        Recipe,
        $routeParams
    ) {

        $scope.refreshTiltData = function() {
            Recipe.get({id:$routeParams.recipeId}, function(tiltRecipe) {
                $scope.recipe.tiltValues = tiltRecipe.tiltValues;
                // $scope.updateChart();
                $scope.refreshChart();
            });  
        };

        // $scope.removeTiltValue = function($index) {
        //     $scope.recipe.tiltValues.splice($index,1);
        //     $scope.updateChart();
        // };

        $scope.calculateAlc = function(SG) {
            var OG = BrewHelper.toPpg($scope.recipe.OG);
            var SG = BrewHelper.toPpg(SG);
            return BrewHelper.round((OG-SG)*0.131,100);
        };

        $scope.calculateTime = function(value) {
            var hours = (new Date(value.date).getTime() - new Date($scope.recipe.tiltValues[0].date).getTime())/1000/60/60;
            var days = Math.floor(hours/24);
            var rest = Math.round(hours%24);
            return days + 'd ' + rest + 'h';
            // return `${days}d ${rest}h`;
        };

        $scope.refreshChart = function() {
            $scope.chartData = [
                $scope.recipe.tiltValues.map(function(v) {return v.temp}),
                $scope.recipe.tiltValues.map(function(v) {return v.sg})
            ];
            $scope.chartLabels = $scope.recipe.tiltValues.map(function(v) {return v.date});
        };
        $scope.refreshChart();

        $scope.chartSeries = ['Temperatura', 'Densidad'];

		$scope.datasetOverride = [
            { yAxisID: 'y-axis-1', fill: false }, 
            { yAxisID: 'y-axis-2', fill: false }
        ];

        $scope.chartOptions =  {
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            },
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            beginAtZero:true
                        }
                    },
                    {
                        id: 'y-axis-2',
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            min: 1
                        }
                    }
                ],
                xAxes: [{
                    type: 'time'
                }]
            }
        };
    });

})();

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
                caption: 'Estilo',
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

(function() {
    var index = angular.module('index');

    index.controller("RecipeDetailHopAmountCtrl",function($scope) {

        $scope.$watch("hop.AMOUNT",function() {
            $scope.amountGrs=$scope.hop.AMOUNT*1000;
        });

        $scope.amountGrs=$scope.hop.AMOUNT*1000;
    });

    index.controller(
        "RecipeDetailCtrl",
        function (
           $scope,
           BrewHelper,
           BrewCalc,
           Grain,
           Hop,
           HopUse,
           HopForm,
           Yeast,
           Style,
           Tag,
           Misc,
           MiscType,
           MiscUse,
           $routeParams,
           $rootScope,
           Recipe,
           $location,
           alertFactory,
           TagColor,
           CalculatorPopup,
           PrintRecipePopup,
           BuyListPopup,
           FermentableUses,
           PitchRate,
           State,
           Responsive,
           $modal,
           $sce
        ) {

        $scope.BrewHelper = BrewHelper;

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Receta'
        }];

        $scope.color = TagColor;

        $scope.grains = Grain.query();

        $scope.hops = Hop.query();

        $scope.hopUses = HopUse.query();

        $scope.hopForms = HopForm.query();

        $scope.yeasts = Yeast.query();

        $scope.miscs = Misc.query();

        $scope.styles = Style.query();

        $scope.miscTypes = MiscType.query();

        $scope.miscUses = MiscUse.query();

        $scope.fermentableUses = FermentableUses.query();

        $scope.pitchRates = PitchRate.query();

        $scope.states = State.query();

        $scope.tags = Tag.query();

        $scope.openCalculatorOG = function() {
            CalculatorPopup.open({
                abv: true,
                hydrometer: false,
                refractometer: false
            },{
                OG: $scope.recipe.OG,
                FG: $scope.recipe.FG
            });
        };

        $scope.openCalculatorFG = function() {
            CalculatorPopup.open({
                abv: false,
                hydrometer: false,
                refractometer: true
            },{
                OG: $scope.recipe.OG,
                FG: $scope.recipe.FG
            });
        };

        $scope.totalTime = function() {
            var time = 0;
            angular.forEach($scope.recipe.MASH.MASH_STEPS.MASH_STEP,function(step) {
                time += step.STEP_TIME;
            });
            return time;
        };

        //Helper functions

        $scope.round = function(value) {
            return Math.round(value);
        };

        $scope.round1 = function(value) {
            return BrewHelper.round(value,10);
        };

        $scope.round2 = function(value) {
            return BrewHelper.round(value,100);
        };

        $scope.removeFermentable = function(fermentable) {
            var index = $scope.recipe["FERMENTABLES"]["FERMENTABLE"].indexOf(fermentable);
            $scope.recipe["FERMENTABLES"]["FERMENTABLE"].splice(index, 1);
            $scope.changeAmount();
        };

        $scope.addFermentable = function() {
            /*
             * Yield y Potential:
             * 82.608695652173992 -> 1.038
             *
             */
            $scope.recipe["FERMENTABLES"]["FERMENTABLE"].push({
                "NAME": "",
                "VERSION": "1",
                "AMOUNT": null,
                "TYPE": "Grain",
                "YIELD": 0,
                "COLOR": null,
                "POTENTIAL": null,
                "PERCENTAGE": 100,
                "USE": "Mash"
            });
            $scope.changeAmount();
        };

        $scope.batchSizeBlur = function() {
            if ( (!$scope.recipe.BATCH_SIZE || $scope.recipe.BATCH_SIZE == 0) && $scope.tempAmount ) {
                $scope.recipe.BATCH_SIZE = $scope.tempAmount;
            }
        };

        $scope.tempAmount = null;

        $scope.noUpdate = false;
        $scope.$watch("recipe.EFFICIENCY", function(newValue,oldValue) {
            if ( $scope.disableWatchs || !oldValue || !$scope.recipe ) return;

            //Si se da esto es porque estoy fijando la OG
            if ( !$scope.recipe.fixIngredients || $scope.recipe.fixIngredients == '0' ) {
                $scope.noUpdate = true;
                $scope.recipe.BATCH_SIZE = BrewHelper.round($scope.recipe.BATCH_SIZE * newValue / oldValue,10);
                $scope.changeAmount();
            } else {
                $scope.changeAmount();
            }
        });

        $scope.$watch("recipe.BATCH_SIZE", function(newValue,oldValue) {
            if ( $scope.disableWatchs || !oldValue || !$scope.recipe || !$scope.recipe.FERMENTABLES ) return;

            if ( $scope.noUpdate ) {
                $scope.noUpdate = false;
                return;
            }

            if ( !newValue || newValue == 0) {
                $scope.tempAmount = oldValue;
                return;
            }

            //Entra si FIJO la OG
            if ( !$scope.recipe.fixIngredients || $scope.recipe.fixIngredients == '0' ) {
                var cohef = newValue / oldValue;

                //Ajusto los ingredientes antes de re-hacer los calculos

                //Maltas
                var newTotalAmount = $scope.recipe.totalAmount * cohef;
                angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                    f.AMOUNT = BrewHelper.round((f.PERCENTAGE/100)*newTotalAmount,1000);
                });

                //Lupulos
                var newTotalHop = $scope.recipe.totalHop * cohef;
                angular.forEach($scope.recipe.HOPS.HOP,function(hop) {
                    var percentage = $scope.hopPercentage(hop,$scope.recipe.totalHop);
                    hop.AMOUNT = BrewHelper.round((percentage/100)*newTotalHop,10000);
                });

                //yeast
                var newTotalYeast = $scope.totalYeast() * cohef;
                //Asumo una sola levadura por ahora
                $scope.recipe.YEASTS.YEAST[0].AMOUNT = Math.ceil(newTotalYeast);
            }
            $scope.changeAmount();
        });



        /**
         * si fijo la OG, al aumentar los litros debo aumentar materiales en la misma proporcion.
         */
        $scope.changeAmount = function() {
            var amount = 0;
            var amountMash = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                amount += f.AMOUNT;
                if ( FermentableUses.valueOf(f.USE).mash ) {
                    amountMash += f.AMOUNT;
                }
            });
            $scope.recipe.totalAmount = amount;
            $scope.recipe.totalAmountMash = amountMash;

            //Percetajes
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                f.PERCENTAGE = BrewHelper.round(f.AMOUNT/$scope.recipe.totalAmount*100,100);
            });

            //Color
            var colourMCU = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                colourMCU += ((f.AMOUNT / 0.45359) * f.COLOR) / ($scope.recipe.BATCH_SIZE*0.264172052637296);
            });
            $scope.recipe.CALCCOLOUR = 1.4922 * Math.pow(colourMCU,0.6859);

            //OG
            var og = 0;
            var OG_exclude = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                og += BrewHelper.toLbs(f.AMOUNT) *
                    BrewHelper.toPpg(f.POTENTIAL) *
                    ($scope.recipe.EFFICIENCY/100) /
                    BrewHelper.toGal($scope.recipe.BATCH_SIZE);
                if ( !f.excludeIBU ) {
                    OG_exclude += BrewHelper.toLbs(f.AMOUNT) *
                        BrewHelper.toPpg(f.POTENTIAL) *
                        ($scope.recipe.EFFICIENCY/100) /
                        BrewHelper.toGal($scope.recipe.BATCH_SIZE);
                }
            });
            $scope.recipe.OG = BrewHelper.toPotential(og);
            $scope.recipe.OG_exclude = BrewHelper.toPotential(OG_exclude);

            //Calculo el agua para el macerado en
            $scope.recipe.StrikeWater=BrewHelper.round($scope.recipe.WatertoGrainRatio*$scope.recipe.totalAmountMash,10);

            $scope.changeHop();

            checkStyle();
        };

        $scope.error = {};
        $scope.suggestedStyles = [];
        $scope.hasStyleError = false;
        function checkStyle() {
            var style;
            angular.forEach($scope.styles, function(s) {
                if ( s.name === $scope.recipe.STYLE.NAME) {
                    style = s;
                }
            });
            var prevError = $scope.hasStyleError;
            $scope.hasStyleError = false;
            function range(attr, min, max, name) {
                if ( $scope.recipe.naziMode && ($scope.recipe[attr] > max || $scope.recipe[attr] < min)) {
                    $scope.error[attr] = (name||attr) + ' entre ' + min + ' y ' + max;
                    return false;
                } else {
                    delete $scope.error[attr];
                    return true;
                }
            }
            if ( style ) {
                $scope.hasStyleError = !range('OG', style.OG_Min, style.OG_Max) || $scope.hasStyleError;
                $scope.hasStyleError = !range('FG', style.FG_Min, style.FG_Max) || $scope.hasStyleError;
                $scope.hasStyleError = !range('CALCIBU', style.IBU_Min, style.IBU_Max,'IBU') || $scope.hasStyleError;
                $scope.hasStyleError = !range('CALCCOLOUR', style.Colour_Min, style.Colour_Max,'Color') || $scope.hasStyleError;
                $scope.hasStyleError = !range('ABV', style.ABV_Min, style.ABV_Max) || $scope.hasStyleError;
                if ( $scope.hasStyleError ) {
                    alertFactory.create('warning','Nazi mode alerta, tiene parametros fuera de estilo ');
                } else if ( prevError && $scope.recipe.naziMode ){
                    alertFactory.create('success','Felicitaciones! Has conseguido tener los parametros dentro del estilo!');
                }
            } else {
                delete $scope.error.OG;
                delete $scope.error.FG;
                delete $scope.error.CALCIBU;
                delete $scope.error.CALCCOLOUR;
                delete $scope.error.ABV;
            }

            //suggestedStyles
            $scope.suggestedStyles = [];
            function isRange(attr, min, max) {
                return $scope.recipe[attr] <= max && $scope.recipe[attr] >= min;
            }
            angular.forEach($scope.styles, function(s) {
                var ok = true;
                ok = isRange('OG', s.OG_Min, s.OG_Max) && ok;
                ok = isRange('FG', s.FG_Min, s.FG_Max) && ok;
                ok = isRange('CALCIBU', s.IBU_Min, s.IBU_Max) && ok;
                ok = isRange('CALCCOLOUR', s.Colour_Min, s.Colour_Max) && ok;
                ok = isRange('ABV', s.ABV_Min, s.ABV_Max) && ok;
                if ( ok ) {
                    $scope.suggestedStyles.push(s.name);
                }
            });

        }
        $scope.$watch('recipe.naziMode+recipe.STYLE.NAME', function() {
            checkStyle();
        });

        $scope.hopGramsPerLiter = function(hop,batchSize) {
            return hop.AMOUNT*1000/batchSize;
        };

        $scope.hopPercentage = function(hop,totalHop) {
            return hop.AMOUNT/totalHop*100;
        };

        function getUtilization(name,list) {
            var utilization = 1;
            angular.forEach(list, function(it) {
                if ( name === it.name ) {
                    utilization = it.utilization;
                }
            });
            return utilization;
        }

        $scope.hopIBU = function(hop) {
            var U = BrewHelper.calculateU($scope.recipe.OG_exclude,hop.TIME);
            var baseIBU = BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            //add or remove by utilization (ej: mash use 20%)
            return baseIBU * getUtilization(hop.USE,$scope.hopUses) * getUtilization(hop.FORM,$scope.hopForms);
        };

        $scope.copyHop = function(hop) {
            var copy = angular.copy(hop);
            delete copy._id;
            $scope.recipe["HOPS"]["HOP"].push(copy);
            $scope.changeHop();
        };

        $scope.removeHop = function(hop) {
            var index = $scope.recipe["HOPS"]["HOP"].indexOf(hop);
            $scope.recipe["HOPS"]["HOP"].splice(index, 1);
            $scope.changeHop();
        };

        $scope.addHop = function() {
            $scope.recipe["HOPS"]["HOP"].push({
                "NAME": "",
                "VERSION": "1",
                "ALPHA": null,
                "AMOUNT": null,
                "USE": "Boil",
                "TIME": 0,
                "FORM": "Pellet"
            });
            $scope.changeHop();
        };

        $scope.suggests = [];

        $scope.changeHop = function() {
            var amount = 0;
            var ibu = 0;
            $scope.suggests = [];
            angular.forEach($scope.recipe.HOPS.HOP,function(hop) {
                amount += hop.AMOUNT;
                ibu += $scope.hopIBU(hop);
                $scope.suggests.push(hop.NAME);
            });
            $scope.recipe.totalHop = amount;
            $scope.recipe.CALCIBU = BrewHelper.round(ibu,10);
            $scope.changeYeast();

        };

        $scope.changeYeast = function() {
            var OG = BrewHelper.toPpg($scope.recipe.OG);
            var FG = OG * (100-$scope.recipe.YEASTS.YEAST[0].ATTENUATION)/100;
            $scope.recipe.FG = BrewHelper.toPotential(FG);
            $scope.recipe.ABV = BrewHelper.round((OG-FG)*0.131,100);

            //Balance Value
            var AA = (OG-FG)/OG;

            var RTE = 0.82 * FG + 0.18 * OG;

            $scope.recipe.BV = BrewHelper.round(0.8 * $scope.recipe.CALCIBU / RTE,100);

            checkStyle();
        };

        $scope.convertColor = function(srm) {
            return BrewHelper.convertColor(srm);
        };

        $scope.calulateBUGU = function(bu,gu) {
            return bu/BrewHelper.toPpg(gu);
        };

        $scope.changeGrain = function(fermentable) {
            angular.forEach($scope.grains,function(grain) {
                if ( fermentable.NAME == grain.name) {
                    fermentable.POTENTIAL = grain.potential;
                    fermentable.COLOR = grain.colour;
                    fermentable.USE = grain.use;
                    fermentable.excludeIBU = grain.excludeIBU;
                }
            });
            $scope.changeAmount();
        };

        $scope.onChangeHop = function(changed) {
            angular.forEach($scope.hops,function(hop) {
                if ( changed.NAME == hop.name) {
                    changed.ALPHA = hop.alpha;
                }
            });
            $scope.changeHop();
        };

        $scope.onChangeYeast = function(changed) {
            angular.forEach($scope.yeasts,function(yeast) {
                if ( changed.NAME == yeast.name) {
                    changed.ATTENUATION = yeast.aa;
                    changed.density = yeast.density || 10;
                    changed.packageSize = yeast.packageSize || 11;
                }
            });
            $scope.changeYeast();
        };

        $scope.addMisc = function() {
            $scope.recipe.MISCS.MISC.push({
                NAME: null,
                VERSION: "1",
                TYPE: "Fining",
                USE: "Boil",
                TIME: null,
                AMOUNT: null
            });
        };

        $scope.onChangeMisc = function(changed) {
            angular.forEach($scope.miscs,function(misc) {
                if ( changed.NAME == misc.name) {
                    changed.TYPE = misc.type;
                    changed.USE = misc.use;
                }
            });
        };

        $scope.removeMisc = function(misc) {
            var index = $scope.recipe.MISCS.MISC.indexOf(misc);
            $scope.recipe.MISCS.MISC.splice(index, 1);
        };

        $scope.importEnabled = angular.isDefined(window.File)
            && angular.isDefined(window.FileReader)
            && angular.isDefined(window.FileList)
            && angular.isDefined(window.Blob);

        $scope.notifications = [];

        //$scope.sharedUrl = function(_id) {
        //    return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
        //};

        $scope.openStyle = function(name) {
            var selected = null;
            angular.forEach($scope.styles,function(style) {
                if (name == style.name) {
                    selected = style;
                }
            });
            if (selected) {
                var modalInstance = $modal.open({
                    templateUrl: 'partial/style-popup.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {
                        $scope.style = function() {
                            return selected;
                        }
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            }
        };

        $scope.bjcpField = function(name, field) {
            var value;
            angular.forEach($scope.styles,function(style) {
                if (style[field] && name == style.name) {
                    value = style[field];
                }
            });
            return value;
        };

        $scope.bjcpLink = function(selected) {
            var link;
            angular.forEach($scope.styles,function(style) {
                if (style.link && selected == style.name) {
                    link = style.link;
                }
            });
            return link;
        };

        $scope.relatedLink = function(selected) {
            var link;
            angular.forEach($scope.styles,function(style) {
                if (style.link && selected == style.name) {
                    link = style.related;
                }
            });
            return link;
        };

        $scope.save = function() {
            if ( !angular.isDefined($scope.recipe.NAME) ) {
                $scope.notifications.push({
                    type:'danger',
                    title:'Nombre obligatorio',
                    text:'La receta debe tener un nombre'
                });
                alertFactory.create('danger','El nombre debe ser obligatorio');
            } else {
                //var recipe = new Recipe($scope.recipe);
                if (!$scope.recipe.$save) {
                    $scope.recipe = new Recipe($scope.recipe);
                }
                $scope.recipe.BOIL_SIZE = $scope.BrewCalc.calculateBoilSize($scope.recipe.BATCH_SIZE, $scope.recipe.TrubChillerLosses, $scope.recipe.BOIL_TIME, $scope.recipe.PercentEvap, $scope.recipe.TopUpWater);

                $scope.saving = true;
                $scope.recipe.$save(function(saved){
                    $scope.saving = false;
                    $scope.notifications.push({
                        type:'success',
                        title:'Receta Guardada!',
                        text:'Ya puedes acceder a esta receta desde cualquier lugar!'
                    });
                    alertFactory.create('success','Receta Guardada!');
                    $location.path('/recipe/edit/' + saved._id)
                },function(error) {
                    if ( error.status == 501 ) {
                        alertFactory.create('warning',error.data.error,"Cuidado!");
                        $scope.notifications.push({
                            type:'warning',
                            title:'Cuidado!',
                            text:error.data.error
                        });
                    } else {
                        alertFactory.create('danger',error.data.error);
                        $scope.notifications.push({
                            type:'danger',
                            title:'Error!',
                            text:error.data.error
                        });
                    }

                });
            }
        };

        //busco la receta o creo una nueva solo una vez
        //q ya este cargado el usuario en en $rootScope
        $rootScope.$watch('user',function(user) {
            if (user) {
                var now = new Date();
                if ( $routeParams.recipeId ) {
                    $scope.recipe = Recipe.get({id:$routeParams.recipeId},function() {
                        if ( $location.path().indexOf('/recipe/clone') === 0) {
                            $scope.recipe.cloneFrom = $scope.recipe._id;
                            $scope.recipe._id = undefined;
                            $scope.recipe.code = undefined;
                            $scope.recipe.date = now;
                            $scope.recipe.modificationDate = now;
                            $scope.recipe.starredBy = [];
                            $scope.recipe.clonedBy = [];
                            $scope.recipe.isPublic = $scope.user.settings.defaultValues.isPublic;
                            //Al clonar elimino los comentarios de la original
                            $scope.recipe.comments = [];
                        }

                        //antes de cargar todos los datos verfico si hay valores en null y los reemplazo por el Default
                        //Verifico si realmente existe la receta que buscaba
                        if ( $scope.recipe._id || $scope.recipe.cloneFrom ) {
                            BrewCalc.fixEmptyValues($scope.recipe, $scope.user.settings.defaultValues);

                            $scope.changeYeast();
                            //$scope.$emit("recipeLoaded");

                            $rootScope.breadcrumbs = [{
                                link: '#',
                                title: 'Home'
                            },{
                                link: '#',
                                title: 'Receta - ' + $scope.recipe.NAME
                            }];
                        } else {
                            $scope.errorLoading = true;
                            alertFactory.create('danger','La receta que intentas abrir no existe');
                        }

                        $scope.updateTilt = function() {
                            if ( $scope.recipe.tilt ) {
                                $scope.tiltURL = $sce.trustAsResourceUrl($scope.recipe.tilt);
                            }
                        }
                        $scope.updateTilt();
                        $scope.refreshTilt = function() {
                            document.getElementById('titlIFrame').src = document.getElementById('titlIFrame').src;
                        };
                    });
                } else {
                    $scope.recipe = new Recipe({
                        "GrainCalcMethod": "2",
                        fixIngredients: "1",
                        STYLE:{},
                        date: now,
                        modificationDate: now,
                        totalAmount: 0,
                        totalHop: 0,
                        CALCCOLOUR: 0,
                        BATCH_SIZE: $scope.user.settings.defaultValues.BATCH_SIZE,
                        EFFICIENCY: $scope.user.settings.defaultValues.EFFICIENCY,
                        OG: 1,
                        CALCIBU: 0,
                        FG: 1,
                        state: 'draft',
                        BOIL_TIME: $scope.user.settings.defaultValues.BOIL_TIME,
                        BREWER: $scope.user.settings.defaultValues.BREWER,
                        GrainAbsorbtion: $scope.user.settings.defaultValues.GrainAbsorbtion || 0.9,
                        "FERMENTABLES": {
                            "FERMENTABLE": []
                        },
                        "HOPS": {
                            "HOP": []
                        },
                        "YEASTS": {
                            "YEAST": [{
                                "NAME": "",
                                "VERSION": "1",
                                "ATTENUATION": 75,
                                "density": 10
                            }]
                        },
                        MASH: {
                            MASH_STEPS: {
                                MASH_STEP: [ ]
                            }
                        },
                        MISCS: {
                            MISC: []
                        },
                        fermentation: {
                            view: 'expand',
                            stages: []
                        },
                        bottling: {
                            sugarType: 'cane', //'cane', 'corn'
                            bottles: []
                        },
                        water: {
                            liters: 0,
                            dilution: 0,
                            source: { ca: 0, mg: 0, so4: 0, na: 0, cl: 0, hco3: 0,alc: 0},
                            target: { ca: 0, mg: 0, so4: 0, na: 0, cl: 0, hco3: 0,alc: 0},
                            CaCO3: 0,
                            NaHCO3: 0,
                            CaSO4: 0,
                            CaCl2: 0,
                            MgSO4: 0,
                            NaCl: 0

                        },
                        WatertoGrainRatio: $scope.user.settings.defaultValues.WatertoGrainRatio,
                        mashTemp: $scope.user.settings.defaultValues.mashTemp,
                        lossMashTemp: $scope.user.settings.defaultValues.lossMashTemp,
                        GrainTemp: $scope.user.settings.defaultValues.GrainTemp,
                        SpargeDeadSpace: $scope.user.settings.defaultValues.SpargeDeadSpace,
                        SpargeTempDesired: $scope.user.settings.defaultValues.SpargeTempDesired,
                        TopUpWater: 0,
                        pitchRate: $scope.user.settings.defaultValues.pitchRate,
                        PercentEvap: $scope.user.settings.defaultValues.PercentEvap,
                        LitersEvap: $scope.user.settings.defaultValues.LitersEvap,
                        TrubChillerLosses: $scope.user.settings.defaultValues.TrubChillerLosses,
                        isPublic: $scope.user.settings.defaultValues.isPublic,
                        MashDesiredPH: $scope.user.settings.defaultValues.MashDesiredPH,
                        SpargeWhaterDesiredPH: $scope.user.settings.defaultValues.SpargeWhaterDesiredPH,
                        phPreBoil: $scope.user.settings.defaultValues.phPreBoil,
                        phPostBoil: $scope.user.settings.defaultValues.phPostBoil,
                        timeWaterMash: $scope.user.settings.defaultValues.timeWaterMash||60,
                        spargeDuration: $scope.user.settings.defaultValues.spargeDuration||45,
                        preBoilTime: $scope.user.settings.defaultValues.preBoilTime||60,
                        coolingTime: $scope.user.settings.defaultValues.coolingTime||30,
                        collaborators: [],
                        version: [],
                        log: {
                            logs: []
                        }
                    });
                    $scope.changeYeast();
                }
            }
        });


        $scope.tabLink = function(tab) {
            var base = "#/recipe/edit/" + $scope.recipe._id;
            if ( tab == 'mash') {
                return base + "/mash";
            }
            return base;
        };

        $scope.gravityBarValue = function(grav,max) {
            return BrewHelper.toPpg(grav) / max * 100;
        };


        //Carbonatation section
        $scope.volumeByCarbonatationType = {
            sugar: 0,
            must: 0,
            co2: 0
        };

        $scope.addTag = function($event) {
            if ( $event.keyCode == 13) {
                if ( !$scope.recipe.tags) {
                    $scope.recipe.tags = [];
                }
                if ( $scope.recipe.tags.indexOf($scope.recipe.newTag) == -1) {
                    $scope.recipe.tags.push($scope.recipe.newTag);
                }
                $scope.recipe.newTag = '';
            }
        };

        $scope.bottledLiters = function() {
            return BrewCalc.bottledLiters($scope.volumeByCarbonatationType,$scope.recipe.bottling.bottles);
        };

        $scope.estimateLiters = function($index) {
            return BrewCalc.estimateLiters($index,$scope.recipe.BATCH_SIZE,$scope.recipe.fermentation.stages);
        };

        $scope.handleFileSelect = function(file) {
            var files = file.files; // FileList object

            // files is a FileList of File objects. List some properties.
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {

                        var xotree = new XML.ObjTree();
                        var xml = e.target.result;
                        var tree = xotree.parseXML( xml );       	// source to tree

                        //var scope = angular.element(document.getElementById('RecipeDetailCtrl')).scope();
                        var scope = $scope;
                        scope.recipe = tree.RECIPES.RECIPE;
                        scope.recipe.CALCCOLOUR = parseFloat(scope.recipe.CALCCOLOUR);
                        scope.recipe.BATCH_SIZE = parseFloat(scope.recipe.BATCH_SIZE) || $scope.user.settings.defaultValues.BATCH_SIZE;
                        scope.recipe.EFFICIENCY = parseFloat(scope.recipe.EFFICIENCY) || $scope.user.settings.defaultValues.EFFICIENCY;
                        scope.recipe.OG = parseFloat(scope.recipe.OG);
                        scope.recipe.FG = parseFloat(scope.recipe.FG);
                        scope.recipe.CALCIBU = parseFloat(scope.recipe.CALCIBU);
                        scope.recipe.BOIL_SIZE = parseFloat(scope.recipe.BOIL_SIZE);
                        scope.recipe.BOIL_TIME = parseFloat(scope.recipe.BOIL_TIME) || $scope.user.settings.defaultValues.BOIL_TIME;
                        scope.recipe.PRIMARY_TEMP = parseFloat(scope.recipe.PRIMARY_TEMP);
                        scope.recipe.BREWER = scope.recipe.BREWER || $scope.user.settings.defaultValues.BREWER;

                        scope.recipe.TrubChillerLosses = parseFloat(scope.recipe.TrubChillerLosses) || $scope.user.settings.defaultValues.TrubChillerLosses;
                        scope.recipe.mashTemp = parseFloat(scope.recipe.mashTemp) || $scope.user.settings.defaultValues.mashTemp;
                        scope.recipe.GrainTemp = parseFloat(scope.recipe.GrainTemp) || $scope.user.settings.defaultValues.GrainTemp;
                        scope.recipe.SpargeTempDesired = parseFloat(scope.recipe.SpargeTempDesired) || $scope.user.settings.defaultValues.SpargeTempDesired;
                        scope.recipe.SpargeDeadSpace = parseFloat(scope.recipe.SpargeDeadSpace) || $scope.user.settings.defaultValues.SpargeDeadSpace;
                        scope.recipe.lossMashTemp = parseFloat(scope.recipe.lossMashTemp) || $scope.user.settings.defaultValues.lossMashTemp;
                        scope.recipe.PercentEvap = parseFloat(scope.recipe.PercentEvap) || $scope.user.settings.defaultValues.PercentEvap;
                        scope.recipe.WatertoGrainRatio = parseFloat(scope.recipe.WatertoGrainRatio) || $scope.user.settings.defaultValues.WatertoGrainRatio;
                        scope.recipe.StrikeWater = parseFloat(scope.recipe.StrikeWater) || BrewHelper.round(scope.recipe.WatertoGrainRatio * scope.recipe.totalAmountMash,10);
                        scope.recipe.GrainAbsorbtion = parseFloat(scope.recipe.GrainAbsorbtion) || $scope.user.settings.defaultValues.GrainAbsorbtion || 0.9;
                        scope.recipe.isPublic = $scope.user.settings.defaultValues.isPublic;

                        //FIXME, por ahora lo dejo en 0, ya q no lo uso ni lo muestro.
                        scope.recipe.TopUpWater = 0;

                        scope.recipe.totalAmount = 0;
                        scope.recipe.totalAmountMash = 0;
                        function convertFerm(ferm) {
                            ferm.AMOUNT = parseFloat(ferm.AMOUNT);
                            ferm.COLOR = parseFloat(ferm.COLOR);
                            ferm.POTENTIAL = parseFloat(ferm.POTENTIAL);
                            ferm.PERCENTAGE = parseFloat(ferm.PERCENTAGE);
                            scope.recipe.totalAmount += ferm.AMOUNT;
                            scope.recipe.totalAmountMash += ferm.AMOUNT;
                        }
                        if (scope.recipe.FERMENTABLES.FERMENTABLE instanceof Array) {
                            angular.forEach(scope.recipe.FERMENTABLES.FERMENTABLE,convertFerm);
                        } else {
                            convertFerm(scope.recipe.FERMENTABLES.FERMENTABLE);
                            scope.recipe.FERMENTABLES.FERMENTABLE = [scope.recipe.FERMENTABLES.FERMENTABLE];
                        }

                        var times = [0,5,10,15,20,25,30,35,40,45,50,55,60,70,80,90,100,110,120];

                        function convertHop(hop) {
                            hop.ALPHA = parseFloat(hop.ALPHA);
                            hop.AMOUNT = parseFloat(hop.AMOUNT);
                            hop.TIME = parseFloat(hop.TIME);
                            if (times.indexOf(hop.TIME) == -1) {
                                var t = times[0];
                                var i = 0;
                                while ( t < hop.TIME) {
                                    t = times [++i];
                                }
                                hop.TIME = times[i-1];
                            }
                            scope.recipe.totalHop += hop.AMOUNT;
                        }
                        scope.recipe.totalHop = 0;
                        if (scope.recipe.HOPS.HOP instanceof Array) {
                            angular.forEach(scope.recipe.HOPS.HOP,convertHop);
                        } else {
                            convertHop(scope.recipe.HOPS.HOP);
                            scope.recipe.HOPS.HOP = [scope.recipe.HOPS.HOP];
                        }

                        function convertMisc(misc) {
                            misc.TIME = parseFloat(misc.TIME);
                            misc.AMOUNT = parseFloat(misc.AMOUNT);
                        }

                        if ( scope.recipe.MISCS && scope.recipe.MISCS.MISC ) {
                            if ( scope.recipe.MISCS.MISC instanceof Array ) {
                                angular.forEach(scope.recipe.MISCS.MISC,convertMisc);
                            } else {
                                convertMisc(scope.recipe.MISCS.MISC);
                                scope.recipe.MISCS.MISC = [scope.recipe.MISCS.MISC];
                            }
                        } else {
                            scope.recipe.MISCS = {
                                MISC: []
                            };
                        }

                        //Elimino los escalones
                        scope.recipe.MASH.MASH_STEPS.MASH_STEP = [];

                        scope.recipe.YEASTS.YEAST = [scope.recipe.YEASTS.YEAST];
                        scope.recipe.YEASTS.YEAST[0].ATTENUATION = parseFloat(scope.recipe.YEASTS.YEAST[0].ATTENUATION);
                        scope.recipe.GrainCalcMethod = '2';

                        scope.recipe.fermentation= {
                            view: 'expand',
                            stages: []
                        };
                        scope.recipe.bottling= {
                            sugarType: 'cane', //'cane', 'corn'
                            bottles: []
                        };

                        scope.changeYeast();
                        scope.recipe.date = new Date();
                        scope.disableWatchs = true;
                        scope.$apply();
                        scope.disableWatchs = false;
                    };
                })(f);
                reader.readAsText(f);
            }
        };

        $scope.printRecipe = function() {
            PrintRecipePopup.open($scope.recipe);
        };

        $scope.showBuyList = function() {
            BuyListPopup.open($scope.recipe);
        };

        //Yeast section
        // $scope.yeastDiff = BrewCalc.yeastDiff;
        $scope.yeastNeed = BrewCalc.yeastNeed;
        $scope.totalYeast = function() {
            if ( !$scope.recipe || !$scope.recipe.YEASTS ) return 0;
            var total = 0;
            angular.forEach($scope.recipe.YEASTS.YEAST, function(y) {
                total += y.AMOUNT;
            });
            return total;
        };
        /*
        aca deberia hacer los calculos por cad leva por separado para total
        y densidad y luego juntarlos. Por ahora asumo una sola leva
        */
        $scope.totalDensity = function() {
            if ( !$scope.recipe || !$scope.recipe.YEASTS ) return 0;
            return $scope.recipe.YEASTS.YEAST[0].density;
        };
        $scope.fixYeast = function() {
            var need = -$scope.yeastNeed(
                $scope.recipe.BATCH_SIZE,
                $scope.recipe.OG,
                0,
                $scope.totalDensity(),
                $scope.recipe.pitchRate
            );
            need = Math.ceil(need);
            try {
                $scope.recipe.YEASTS.YEAST[0].AMOUNT = need;
            } catch (e) {

            }
        };
    });
})();

(function() {

    var index = angular.module('login',['calculator']);

    index.run(function($rootScope) {
        
        $rootScope.loginSuccess = false;
        
    });
 
    index.controller("LoginController",function($scope,$rootScope,User,Notification,notificationData,pushListener,CalculatorPopup) {
        
        $scope.openCalcPopup = function() {
            CalculatorPopup.open();
        };

        function afterLogin(user) {
            if (!user.password) {
                alert('Proximamente se dejara de tener la opcion de login con google, por favor crear una constraseña para futuros accesos');
                var password = prompt('Ingresar contraseña');
                if (password) {
                    user.password = password;
                    User.updatePassword(user, function() {
                        $rootScope.loginSuccess = true;
                        $rootScope.user = user;
                        console.log(user);
                    });
                } else {
                    afterLogin(user);
                }
            } else {
                $rootScope.loginSuccess = true;
                $rootScope.user = user;
                console.log(user);
            }
        }

        $scope.$on('g+login',function(event,authResult) {
            if ( authResult == null ) {
                $rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.$apply();
            } else if ( authResult['access_token']) {
              // Autorizado correctamente
              // Oculta el botón de inicio de sesión ahora que el usuario está autorizado, por ejemplo:
              //Guardo el token
              gapi.auth.setToken(authResult);
              
              //Pido los datos del usuario
              gapi.client.load('oauth2', 'v2', function() {
                var request = gapi.client.oauth2.userinfo.get();
                
                request.execute(function (obj){
                    User.getByGoogleId({
                        id:obj.id,
                        name: obj.name,
                        email: obj.email
                    }, afterLogin);
                    
                });
              });
            } else if ( authResult.googleId ) {
                //En este caso viene de login interno de la app mobile (en un iframe)
                User.getByGoogleId({
                    id: authResult.googleId,
                    name: authResult.name,
                    email: authResult.email
                }, afterLogin);
            } else if ( authResult['error'] == "immediate_failed") {
                $rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.$apply();
            } else if ( authResult['error'] ) {
                $rootScope.loginSuccess = true;
                $scope.loginError = authResult['error'];
                $scope.$apply();
                $rootScope.$apply();
                console.log('There was an error: ' + authResult['error']);
            } else {
                $rootScope.loginSuccess = true;
                $scope.loginError = JSON.stringify(authResult);
                $scope.$apply();
                $rootScope.$apply();
                console.log('Error inesperado');
            }
        });

        $scope.googleSignIn = function() {
            googleSignIn();
        };
        
        notificationData.listener = function() {
            $scope.notificationClass = '';
            $scope.notificationCount = 0;
        };

        notificationData.updateListener = function() {
            $scope.findNotificationsCount();
        };
                
        $scope.notificationClass = '';
        $scope.notificationCount = 0;

        $scope.$watch('user',function(user) {
            if (user) {
                $scope.findNotificationsCount();
                //setInterval($scope.findNotificationsCount,60*1000);
                pushListener.on("NOTIFICATION_ADD_" + user._id, function(data) {
                    console.log("INFO","New Notification (Count)", data);
                    $scope.findNotificationsCount();
                });
            }
        });

        $scope.findNotificationsCount = function() {
            console.log("Actualizacion notificaciones");
            Notification.findNews(function(nots) {
                $scope.notificationCount = nots.length;
                $scope.notificationClass = nots.length != 0 ? 'gt-notificaction-count-alert' : '';
            });
        };            
        
        $scope.disconnectUser = function() {
            $rootScope.user = null;
            $rootScope.loginSuccess = false;
            localStorage.removeItem('bomuser');
            // $rootScope.$apply();
            window.location.reload();
        };


    });

})();
(function() {

    var comments = angular.module("comments",[]);

    comments.controller("CommentController",function($scope,Recipe,$filter,$timeout,$interval,pushListener) {

        $scope.rows = 1;

        $scope.loadNewComments = false;

        $scope.removeComment = function(comment) {
            $('#confirmation-'+comment._id).modal('hide');
            $timeout(function() {
                var remove = {
                    comment: comment,
                    recipe_id: $scope.recipe._id
                };
                Recipe.removeComment(remove);
            }, 1*1000);

        };

        $scope.comment_new_id = null;

//        function updateComments(comments) {
//            var diff = util.diff($scope.recipe.comments,comments,[
//                "\\[[0-9]*\\]*\\.\\$\\$hashKey",
//                "\\[[0-9]*\\]*\\.\\$.*",
//                "\\$\\[\\$promise\\]",
//                "\\$\\[\\$resolved\\]"]);
//
//            if ( diff.length != 0 ) {
//                console.log("diff",diff);
//
//                //En este momento solo puede haber un comentario extra o uno menos.
//                if ( comments.length > $scope.recipe.comments.length ) {
//                    $scope.comment_new_id = comments[comments.length-1]._id;
//                    $scope.recipe.comments = comments;
//                    $timeout(function() {
//                        $scope.comment_new_id = null;
//                    },3000);
//                } else {
//                    $scope.comment_new_id = jsonPath($scope.recipe.comments,diff[0]);
//                    $timeout(function() {
//                        $scope.comment_new_id = null;
//                        $scope.recipe.comments = comments;
//                    },3000);
//                }
//
//            }
//        }

        function loadComments() {
            Recipe.getComments({id:$scope.recipe._id},function(comments) {
                $scope.recipe.comments = comments;
            });
        }

        function onAddComment(data) {
            console.log("INFO","New comment", data);
            //Antes de agregar el comentario nuevo me fijo si no es que ya lo tengo
            //Esto puede pasar porque justo pude haber hecho un loadComments()
            var f = util.Arrays.filter($scope.recipe, data, function(data, iter) {
                return data._id == iter._id ? 0 : -1;
            });
            if ( f.length == 0 ) {
                $scope.recipe.comments.push(data);
                $scope.$apply();
            }
        }

        function onRemoveComment(removed) {
            console.log("INFO","Remove comment", data);
            util.Arrays.remove($scope.recipe.comments,removed, function(removed, iter) {
                return removed._id == iter._id ? 0 : -1;
            });
            $scope.$apply();
        }

        $scope.$watch("recipe._id", function () {
            if ( $scope.recipe && $scope.recipe._id ) {
                loadComments();
                pushListener.on("RECIPE_COMMENT_ADD_" + $scope.recipe._id, onAddComment);
                pushListener.on("RECIPE_COMMENT_REMOVE_" + $scope.recipe._id, onRemoveComment);
            };
        });


        $scope.$on('$destroy',function() {
            pushListener.off("RECIPE_COMMENT_ADD_" + $scope.recipe._id, onAddComment);
            pushListener.off("RECIPE_COMMENT_REMOVE_" + $scope.recipe._id, onRemoveComment);
        });


        $scope.addComment = function(comment) {
            var newComment = {
                recipe_id: $scope.recipe._id,
                text: comment
            };
            Recipe.addComment(newComment,function(comments){
                    // updateComments(comments);
                    $scope.comment = '';
                    $scope.rows = 1;
                });
        };

        $scope.focus = function(comment) {
            $scope.rows = 5;
        };

        $scope.blur = function(comment) {
            if (!comment || comment == '') {
                $scope.rows = 1;
            }
        };



    });
})();

(function() {
    var module = angular.module('brew-o-module.controller');

    // module.controller("FermentationStageCtrl", function($scope) {
    //     $scope.$watch("recipe.fermentation.estimateDate", function(value) {
    //         if ( value && $scope.stage.duration && $scope.stage.durationMode ) {
    //             var estimatedTime = new Date(value).getTime();


    //         }
    //     });
    // });

    module.controller("FermentationCtrl", function($scope) {
        $scope.addFermentationStage = function() {
            var temp = null;
            //cada etapa nueva la creo con la temperatura final de la anterior
            if ($scope.recipe.fermentation.stages.length != 0 ) {
                temp = $scope.recipe.fermentation.stages[$scope.recipe.fermentation.stages.length-1].temperatureEnd;
            }
            $scope.recipe.fermentation.stages.push({
                title: null,
                duration: 0,
                durationMode: 'Dias',
                transferring: false, //In the end of stage
                losses: 0, //Litros perdidos
                temperature: temp,
                temperatureEnd: null,
                action: null// 'Inoculacion', 'Dry-Hop', 'Otro'
            });
        };

        var today;
        if ($scope.recipe.fermentation.estimateDate) {
            today = new Date($scope.recipe.fermentation.estimateDate);
        } else {
            today = new Date();
        }

        $scope.simulatedDate_day = today.getDate();
        $scope.simulatedDate_month = today.getMonth() + 1;
        $scope.simulatedDate_year = today.getYear() + 1900;

        $scope.$watch("simulatedDate_day+simulatedDate_month+simulatedDate_year",function(value) {
            if ($scope.simulatedDate_day && $scope.simulatedDate_month && $scope.simulatedDate_year) {
                $scope.recipe.fermentation.estimateDate = new Date($scope.simulatedDate_year,$scope.simulatedDate_month-1,$scope.simulatedDate_day);

                var timeFromEstimate = $scope.recipe.fermentation.estimateDate.getTime();
                var nowTime = new Date().getTime();
                //Actualizo las alertas que ya fueron disparadas en caso de que se necesiten re-lanzar.
                for ( var i=0; i<$scope.recipe.fermentation.stages.length; i++ ) {
                    var stage = $scope.recipe.fermentation.stages[i];

                    if ( stage.alertDone && timeFromEstimate>nowTime ) {
                        stage.alertDone = false;
                    }

                    if ( stage.durationMode && stage.duration ) {
                        if ( stage.durationMode == 'Horas' ) {
                            timeFromEstimate += stage.duration * 1000*60*60;
                        }  else {
                            timeFromEstimate += stage.duration * 1000*60*60*24;
                        }
                    }
                }
            }
        });

        $scope.estimateEnd = function(day,month,year,fermentation) {
            var date = new Date(year, month-1, day);
            return new Date(date.getTime()+calculateDays(fermentation)*24*60*60*1000);
        }

        function calculateDays(fermentation) {
            var days = 0;
            angular.forEach(fermentation.stages,function(stage){
                var duration = stage.duration|0;
                if ( duration != 0) {
                    if (stage.durationMode == 'Horas') {
                        duration = duration/24;
                    }
                    days += duration;
                }
            });
            return days;
        }

        $scope.calculateDays = function(fermentation) {
            var days = calculateDays(fermentation);

            var round = Math.round(days);
            var dec = days - round;
            var hours = Math.round(24*dec);
            var result = round + " dias";
            if (hours != 0) {
                result += " y " + hours + " horas";
            }
            return result;
        };

        $scope.moveUp = function(stage,$index) {
            $scope.recipe.fermentation.stages.splice($index,1);
            $scope.recipe.fermentation.stages.splice($index-1,0,stage);
        };

        $scope.moveDown = function(stage,$index) {
            $scope.recipe.fermentation.stages.splice($index,1);
            $scope.recipe.fermentation.stages.splice($index+1,0,stage);
        };

        $scope.changeTemp = function(stage) {
            if ( !angular.isDefined(stage.temperatureEnd) || stage.temperatureEnd == null) {
                stage.temperatureEnd = stage.temperature;
                $scope.updateChart();
            }
        };

        $scope.styleTitle = function(onFocus) {
            if ( onFocus ) {
                return {background: 'white','border-color':'#ccc'};
            } else {
                return {background: '#f5f5f5','border-color':'#f5f5f5',cursor:'pointer'};
            }
        };

        $scope.updateChart = function() {
            var cols = [{
                    "id": "day",
                    "label": "Dias",
                    "type": "date"
                },{
                    "id": "temp",
                    "label": "Temperatura",
                    "type": "number"
                }];

            var rows = [];
            var day = 0;
            var today = new Date($scope.simulatedDate_year,$scope.simulatedDate_month-1,$scope.simulatedDate_day);
            angular.forEach($scope.recipe.fermentation.stages,function(stage) {
                var duration = stage.duration|0;
                if ( duration != 0) {
                    if (stage.durationMode == 'Horas') {
                        duration = duration/24;
                    }
                    rows.push({
                            "c": [
                                {
                                    "v": today
                                },
                                {
                                    "v": stage.temperature|0,
                                    "f": (stage.temperature|0) + "º (Inicio: " + stage.title + ")"
                                }
                            ]
                        });

                    day += duration;
                    today = new Date( today.getTime() + duration * 24 * 60 * 60 * 1000 );

                    rows.push({
                            "c": [
                                {
                                    "v": today
                                },
                                {
                                    "v": stage.temperatureEnd|0,
                                    "f": (stage.temperatureEnd|0) + "º (Fin: " + stage.title + ") " + ( stage.transferring?' trasvase':'' )
                                }
                            ]
                        });
                } else {
                    rows.push({
                            "c": [
                                {
                                    "v": today
                                },
                                {
                                    "v": stage.temperature|0,
                                    "f": (stage.temperature|0) + "º (" + stage.title + ")" + ( stage.transferring?' trasvase':'' )
                                }
                            ]
                        });
                }

            });
            $scope.chart.data.cols = cols;
            $scope.chart.data.rows = rows;
        };

        $scope.chart = {
            "type": "LineChart",
            "displayed": true,
            "cssStyle": {height:'300px', width:'100%'},
            "data": {
                "cols": [],
                "rows": []
            },
            "options": {
                "title": "Evolucion",
                "isStacked": "false",
                "fill": 20,
                //"curveType": "function",
                "displayExactValues": true,
                "vAxis": {
                    "title": "Temperatura",
                    "gridlines": {
                        "count": 10
                    },
                    minValue:0
                },
                "hAxis": {
                    "title": "Dias"
                }
            },
            "formatters": {}
        };

        $scope.updateChart();

        $scope.emptyAlert = function() {
            if ( $scope.recipe.fermentation.alertTime == "" ) delete $scope.recipe.fermentation.alertTime;
        }


    });

})();

(function() {

	var module = angular.module('brew-o-module.controller');

	module.controller("RecipeLogCtrl",function($scope,BrewCalc,BrewHelper,$timeout) {

        //Constantes (Esto tengo q poder configurarlo)
        var MASH_TEMP_TIME = $scope.recipe.timeWaterMash;
        var COOLING_TIME = $scope.recipe.coolingTime;

        $scope.discardFilter = {discard:false};
        $scope.isFiltering = true;

        $scope.toogleRemovedFilter = function() {
            if ( $scope.isFiltering ) {
                $scope.discardFilter = {};
                $scope.isFiltering = false;
            } else {
                $scope.discardFilter = {discard:false};
                $scope.isFiltering = true;
            }
        };

        $scope.removed = false;

        $scope.opened = false;
        $scope.openDp = function() {
            $timeout(function() {
                $scope.opened = true;
            });
        };

        $scope.edit = null;

        $scope.goEdit = function(log) {
            $scope.edit = log;
        };

        $scope.goNew = function() {
            var log = {
                time: new Date(),
                delay: 0,
                detail: null,
                logType: 'CUSTOM',
                discard: false
            };
            $scope.recipe.log.logs.push(log);
            $scope.goEdit(log);
            updatePendingTime();
        };

        $scope.orderLog = function(value) {
            if ( value.time instanceof Date ) {
                return value.time;
            } else {
                return new Date(value.time);
            }
        };

        $scope.now = function() {
            if ( $scope.recipe.log.logs.length != 0 ) {
                for ( var i=$scope.recipe.log.logs.length - 1; i>=0; i--) {
                    var log = $scope.recipe.log.logs[i];
                    if ( log.logType != 'CUSTOM') {
                        var time = log.time;
                        if ( typeof(time) == 'string') {
                            time = new Date(time);
                        }
                        return  time;
                    }
                }
                return new Date();
            } else {
                return new Date();
            }
        };

        var mashFixed = [{
            delay: 0,
            detail: 'Encender Fuego',
            logType: 'START'
        }];

        var spargeFixed = [{
            delay: $scope.recipe.spargeDuration,
            detail: 'Comenzar Lavado',
            logType: 'SPARGE_0'
        }, {
            delay: 60,
            detail: 'Finalizar Lavado',
            logType: 'SPARGE_1'
        }];

        var boilFixed = [{
            delay: $scope.recipe.preBoilTime,
            delayUnit: 'm',
            detail: 'Romper Hervor',
            logType: 'BOIL'
        }];

        var coolingFixed = [{
            delay: 0,
            delayUnit: 'm',
            detail: 'Apagar fuego y Whirpool',
            logType: 'COOLING'
        },{
            delay: 10,
            delayUnit: 'm',
            detail: 'Enfriado',
            logType: 'COOLING'
        }];


        function addMinutes(date, minutes) {
            var d = new Date(date.getTime());
            d.setMinutes(d.getMinutes()+minutes);
            return d;
        }

        function prevTime() {
            if ( $scope.pendingLogs.length != 0) {
                return $scope.pendingLogs[$scope.pendingLogs.length-1].time();
            } else {
                return $scope.now();
            }
        }

        function addFixed(list) {
            for (var i=0; i<list.length; i++) {
                var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
                    return item.logType == list[i].logType ? 0 : -1;
                });
                if ( filter.length != 0 ) continue;

                addPending(list[i].delay,list[i].detail,list[i].logType);
            }
        }

        function stepAction (STEP) {
            if (STEP.infuse) {
                return "Agregar Agua"
            } else if (STEP.decoction) {
                return "Decoccion";
            }
            return null;
        }

        $scope.calculatePending = function() {
            $scope.pendingLogs = [];

            addFixed(mashFixed);
            var delay = MASH_TEMP_TIME;

            //add mash step
            for ( var i=0; i<$scope.recipe.MASH.MASH_STEPS.MASH_STEP.length; i ++ ) {
                step = $scope.recipe.MASH.MASH_STEPS.MASH_STEP[i];

                var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
                    return item.logType == 'MASH_STEP' && item.logRef == step._id.toString() ? 0 : -1;
                });
                if ( filter.length != 0 ) {
                    delay = step.STEP_TIME;
                    continue;
                }

                var name = step.NAME + ' - ' + step.STEP_TEMP + 'ºC ';
                if ( step.END_TEMP != step.STEP_TEMP ) name += ' a ' + step.END_TEMP + 'ºC';
                name += ' - ' + step.STEP_TIME + ' min';
                if ( stepAction(step) ) name += ' - ' + stepAction(step);
                if ( step.recirculate ) name += ' - Recirculando';

                addPending(delay,name,'MASH_STEP',step._id.toString());
                delay = step.STEP_TIME;
            };
            //Sparge
            for (var i=0; i<spargeFixed.length; i++) {
                var f = spargeFixed[i];
                var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
                    return item.logType == f.logType ? 0 : -1;
                });
                if ( filter.length != 0 ) {
                    delay = f.delay;
                    continue;
                }
                addPending(delay, f.detail, f.logType);
                delay = f.delay;
            };

            addFixed(boilFixed);
			for (var i=0; i<boilFixed.length; i++) {
				delay = boilFixed[i].delay;
			}


            var prevDelay = $scope.recipe.BOIL_TIME;
            //Hoping (exclud Dry-Hop)
            for( var i=0; i<$scope.recipe.HOPS.HOP.length; i++ ) {
                var hop = $scope.recipe.HOPS.HOP[i];
				if ( hop.USE !== 'Dry Hop') {
					var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
	                    return item.logType == 'BOIL_HOP' && item.logRef == hop._id.toString() ? 0 : -1;
	                });
					var hopTime;
					if ( hop.USE !== 'First Wort') {
						hopTime = hop.TIME;
					} else {
						hopTime = $scope.recipe.BOIL_TIME;
					}
	                if ( filter.length != 0 ) {
						prevDelay = hopTime;
	                    continue;
	                }
	                var name = hop.AMOUNT*1000 + 'g de ' + hop.NAME + ' (' + hop.USE + ' '+hop.TIME+'\')';
	                addPending(prevDelay - hopTime,name,'BOIL_HOP',hop._id.toString());
					prevDelay = hopTime;
				}
            }

			//add coling time for last hopping addiction
			coolingFixed[0].delay = prevDelay;
            addFixed(coolingFixed);

            //Hasta la inoculacion tomo el tiempo fijo de enfriado.
            prevDelay = COOLING_TIME;
            for( var i=0; i<$scope.recipe.fermentation.stages.length; i++ ) {
                var stage = $scope.recipe.fermentation.stages[i];

                var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
                    return item.logType == 'FERM_STAGE' && item.logRef == stage._id.toString() ? 0 : -1;
                });
                if ( filter.length != 0 ) {
                    prevDelay = convert2Minutes(stage);
                    continue;
                }

                var name =  stage.title+' - '+stage.duration+' '+stage.durationMode;
                name += ' - '+stage.temperature+'º';
                if ( stage.temperature != stage.temperatureEnd) {
                	name += ' a '+stage.temperatureEnd+'º';
                }

                addPending(prevDelay,name,'FERM_STAGE',stage._id.toString());
                prevDelay = convert2Minutes(stage);
            }

			//Hoping (only Dry-Hop)
            for( var i=0; i<$scope.recipe.HOPS.HOP.length; i++ ) {
                var hop = $scope.recipe.HOPS.HOP[i];
				if ( hop.USE === 'Dry Hop') {
					var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
	                    return item.logType == 'BOIL_HOP' && item.logRef == hop._id.toString() ? 0 : -1;
	                });
	                if ( filter.length != 0 ) {
	                    prevDelay = hop.TIME;
	                    continue;
	                }
	                var name = hop.AMOUNT*1000 + 'g de ' + hop.NAME + ' (' + hop.USE + ' '+hop.TIME+'\')';
	                addPending(prevDelay - hop.TIME,name,'BOIL_HOP',hop._id.toString());
	                prevDelay = hop.TIME;
				}
            }

            //en prevDelay me queda ya cargado el timpo del ultimo paso de fermentacion.
            //Embotellado
            for( var i=0; i<$scope.recipe.bottling.bottles.length; i++ ) {
            	var bottle = $scope.recipe.bottling.bottles[i];

				var filter = util.Arrays.filter($scope.recipe.log.logs,function(item) {
                    return item.logType == 'BOTTLING' && item.logRef == bottle._id.toString() ? 0 : -1;
                });
                if ( filter.length != 0 ) {
                    prevDelay = 0;
                    continue;
                }
                var name =  bottle.bottleType+' - '+bottle.amount+' Unidades';

                addPending(prevDelay,name,'BOTTLING',bottle._id.toString());
                prevDelay = 0;
            }

        };

        function convert2Minutes(stage) {
            if ( stage.durationMode =='Horas') {
                return stage.duration * 60;
            } else if ( stage.durationMode =='Dias') {
                return stage.duration * 60 * 24;
            }
        }

        function addPending(delay,detail,type,ref) {
            $scope.pendingLogs.push({
                prev: prevTime(),
                time: function() {
                    return addMinutes(this.prev,this.delay);
                },
                delay: delay,
                detail: detail,
                logType: type,
                logRef: ref
            });
        }

        $scope.calculatePending();

        function updatePendingTime() {
            if ( $scope.pendingLogs != 0 ) {
                $scope.pendingLogs[0].prev = $scope.now();
                for (var i=1; i<$scope.pendingLogs.length; i++) {
                    $scope.pendingLogs[i].prev = $scope.pendingLogs[i-1].time();
                }
            }
        }

        $scope.$watch("edit.time", function(value) {
            updatePendingTime();
        });

        $scope.pushAndEdit = function(log) {
        	$scope.push(log);
        	var last = $scope.recipe.log.logs[$scope.recipe.log.logs.length-1];
        	$scope.goEdit(last);
        };

        $scope.push = function(log) {
            log.time = new Date();
            $scope.recipe.log.logs.push({
                time: new Date(),
                delay: log.delay,
                detail: log.detail,
                logType: log.logType,
                logRef: log.logRef,
                discard: false
            });
            util.Arrays.remove($scope.pendingLogs,log);
            updatePendingTime();
        };

        $scope.discard = function(log) {
        	log.discard = true;
        };

        $scope.pushAndDiscard = function(log) {
        	$scope.push(log);
        	var last = $scope.recipe.log.logs[$scope.recipe.log.logs.length-1];
        	$scope.discard(last);
        };

		$scope.restoreAll = function() {
			$scope.recipe.log.logs = [];
			$scope.calculatePending();
		};

        /*
         * Remove Log from top, and put in down list again.
         */
        $scope.restore = function(log) {
        	util.Arrays.remove($scope.recipe.log.logs,log);
        	$scope.calculatePending();
        };
    });
})();

(function() {

    var module = angular.module('brew-o-module.controller');

    module.controller('RecipeWaterCtrl', function($scope, BrewCalc, WaterReport, alertFactory) {

        WaterReport.query(function(reports) {
            $scope.reports = reports;
        });

        $scope.ions = [
            {txt: 'Ca',sup:'+2',key:'ca',balance: 'Ca_balance',showLevel:true,wr:'calcium',type:'cations'},
            {txt: 'Mg',sup:'+2',key:'mg',balance: 'Mg_balance',showLevel:true,wr:'magnesium',type:'cations'},
            {txt: 'SO',sup:'-2',sub:'4',key:'so4',balance: 'SO4_balance',showLevel:true,wr:'sulfate',type:'anions'},
            {txt: 'Na',sup:'+',key:'na',balance: 'Na_balance',showLevel:true,wr:'sodium',type:'cations'},
            {txt: 'Cl',sup:'-',key:'cl',balance: 'Cl_balance',showLevel:true,wr:'chloride',type:'anions'},
            {txt: 'HCO',sup:'-',sub:'3',key:'hco3',balance: 'SO4Cl_balance',wr:'bicarbonate',type:'anions'},
            {txt: 'Alkalinity',key:'alc'}
        ];

        $scope.output = {
            diluted: new Array(6),
            diff: new Array(6),
            salts: new Array(6),
            result: new Array(6),
            adjusted: new Array(6)
        };

        $scope.updateSource = function() {
            var report = $scope.getReport($scope.recipe.water.selectedSource);
            if ( report ) {
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    $scope.recipe.water.source[ion.key] = report[ion.type][ion.wr];
                }
                $scope.onChange();
            }
        };

        $scope.sourceEqual = function() {
            var report = $scope.getReport($scope.recipe.water.selectedSource);
            if ( report ) {
                var ret = true;
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    ret = ret && ($scope.recipe.water.source[ion.key] === report[ion.type][ion.wr]);
                }
                return ret;
            } else {
                return false;
            }
        };

        $scope.updateTarget = function() {
            var report = $scope.getReport($scope.recipe.water.selectedTarget);
            if ( report ) {
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    $scope.recipe.water.target[ion.key] = report[ion.type][ion.wr];
                }
                $scope.onChange();
            }
        };

        $scope.targetEqual = function() {
            var report = $scope.getReport($scope.recipe.water.selectedTarget);
            if ( report ) {
                var ret = true;
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    ret = ret && ($scope.recipe.water.target[ion.key] === report[ion.type][ion.wr]);
                }
                return ret;
            } else {
                return false;
            }
        };

        $scope.addProfile = function(id) {
            var name = prompt('Ingrese el nombre para el nuevo reporte (privado)','Mi Reporte de agua');
            if ( name ) {
                var report = new WaterReport({
                    date: new Date(),
                    name: name,
                    owner: $scope.user._id,
                    cations: {},
                    isPublic: false,
                    anions: {}
                });
                for ( var i=0;i<$scope.ions.length-1;i++) {
                    var ion = $scope.ions[i];
                    report[ion.type][ion.wr] = $scope.recipe.water[id][ion.key];
                }
                console.log('Report', report);
                report.$save(function(saved) {
                    alertFactory.create('success','Reporte de agua Guardado!');
                    WaterReport.query(function(reports) {
                        $scope.reports = reports;
                    });
                    $scope.recipe.water['selected'+id[0].toUpperCase()+id.substr(1)] = saved._id;
                });
            }
            
        };

        $scope.getReport = function(id) {
            if ( $scope.reports ) {
                var ret = null;
                angular.forEach($scope.reports, function(report) {
                    if (report._id === id) {
                        ret = report;
                    }
                });
                return ret;
            }
        };

        $scope.getLiters = function() {
            var total = BrewCalc.calculateBoilSize($scope.recipe.BATCH_SIZE,
                                           $scope.recipe.TrubChillerLosses,
                                           $scope.recipe.BOIL_TIME,
                                           $scope.recipe.PercentEvap,
                                           $scope.recipe.TopUpWater)
                    +$scope.recipe.SpargeDeadSpace
                    +$scope.recipe.GrainAbsorbtion*$scope.recipe.totalAmountMash;
            $scope.recipe.water.liters = Math.round(total);
            $scope.onChange();
        };

        $scope.suggest = function() {
            var input = {
                dilution: $scope.recipe.water.dilution,
                mashvolume: $scope.recipe.water.liters,
                source: convertArray($scope.recipe.water.source),
                target: convertArray($scope.recipe.water.target),
                CaCO3: $scope.recipe.water.CaCO3,
                NaHCO3: $scope.recipe.water.NaHCO3,
                CaSO4: $scope.recipe.water.CaSO4,
                CaCl2: $scope.recipe.water.CaCl2,
                MgSO4: $scope.recipe.water.MgSO4,
                NaCl: $scope.recipe.water.NaCl
            };

            var suggest = BrewCalc.suggestWaterCalculation(input, {
                diluted: new Array(6),
                diff: new Array(6),
                salts: new Array(6),
                result: new Array(6),
                adjusted: new Array(6)
            });

            $scope.recipe.water.CaCO3 = suggest.CaCO3;
            $scope.recipe.water.NaHCO3 = suggest.NaHCO3;
            $scope.recipe.water.CaSO4 = suggest.CaSO4;
            $scope.recipe.water.CaCl2 = suggest.CaCl2;
            $scope.recipe.water.MgSO4 = suggest.MgSO4;
            $scope.recipe.water.NaCl = suggest.NaCl;

            $scope.onChange();

        };

        $scope.onChange = function() {
            var input = {
                dilution: $scope.recipe.water.dilution,
                mashvolume: $scope.recipe.water.liters,
                source: convertArray($scope.recipe.water.source),
                target: convertArray($scope.recipe.water.target),
                CaCO3: $scope.recipe.water.CaCO3,
                NaHCO3: $scope.recipe.water.NaHCO3,
                CaSO4: $scope.recipe.water.CaSO4,
                CaCl2: $scope.recipe.water.CaCl2,
                MgSO4: $scope.recipe.water.MgSO4,
                NaCl: $scope.recipe.water.NaCl
            };

            BrewCalc.waterCalculation(input, $scope.output);

            $scope.recipe.water.source.alc = input.source[6];
        };

        function convertArray(ions) {
            var ret = [];
            angular.forEach($scope.ions, function(ion) {
                ret.push(ions[ion.key]);
            })
            return ret;
        };

        $scope.onChange();


    })
    .filter('result', function() {
        return function(value) {
            if ( value > 0 ) {
                return '+ ' + value;
            } if ( value === 0 ) {
                return '0';
            } else {
                return '- '+(-value);
            }
        }
    });
})();

(function() {

	var print = angular.module("print", []);

	print.factory('BuyListPopup', function($modal) {
		function objToList(obj, list, unit) {
			angular.forEach(obj, function(v,k) {
				list.push({
					name: k,
					value: v,
					unit: unit
				});
			});
		}
		return {
			open: function(recipe) {
				var modalInstance = $modal.open({
					templateUrl: 'partial/print/buy-popup.html',
					controller: function($scope, $modalInstance, recipe) {

						//Calculate buying list
						$scope.list = [];
						var fermentables = {};
						angular.forEach(recipe.FERMENTABLES.FERMENTABLE,function(f) {
							fermentables[f.NAME] = (fermentables[f.NAME] || 0) + f.AMOUNT;
						});
						objToList(fermentables, $scope.list, 'Kg');
						var hops = {};
						angular.forEach(recipe.HOPS.HOP,function(h) {
							hops[h.NAME] = (hops[h.NAME] || 0) + (h.AMOUNT*1000);
						});
						objToList(hops, $scope.list, 'g');
						var yeasts = {};
						angular.forEach(recipe.YEASTS.YEAST,function(h) {
							yeasts[h.NAME] = (yeasts[h.NAME] || 0) + (h.AMOUNT/h.packageSize);
						});
						objToList(yeasts, $scope.list, 'Sobres');
						var miscs = {};
						angular.forEach(recipe.MISCS.MISC,function(h) {
							miscs[h.NAME] = (miscs[h.NAME] || 0) + (h.AMOUNT*1000);
						});
						objToList(miscs, $scope.list, 'g');


						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

						$scope.print = function () {
							// angular.element("#print_content").html();
							var mywindow = window.open('', 'my div');
							mywindow.document.write('<html><head><title>' + recipe.NAME + '</title>');
							mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
							/*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
							mywindow.document.write('<link rel="stylesheet" href="/css/style.css" type="text/css" />');
							mywindow.document.write('<link rel="stylesheet" href="/css/bootstrap.min.css" type="text/css" />');
							mywindow.document.write('<link rel="stylesheet" href="/css/bootstrap-theme.min.css" type="text/css" />');
							mywindow.document.write(
								'<script>' +
								'	setTimeout(function() {' +
								'		window.print();' +
								'	},100);' +
								'</script>'
							);
							mywindow.document.write('</head><body >');
							mywindow.document.write(angular.element("#print_content").html());
							mywindow.document.write('</body></html>');

							// setTimeout(function() {
							// 	mywindow.print();
							// 	setTimeout(function() {
							// 		mywindow.close();
							// 	},1);
							// },1000);


							// $modalInstance.close();
						};

						$scope.fontClass = 'print-panel-md';

						$scope.recipe = recipe;
					},
					resolve:  {
						recipe: function() {
							return recipe;
						}
					}
				});
				return modalInstance.result;
			}
		};
	});

	print.factory("PrintRecipePopup", function($modal) {

		var obj = {
			open: function (recipe) {
				var modalInstance = $modal.open({
                    templateUrl: 'partial/print/print-popup.html',
                    controller: function($scope, $modalInstance, recipe) {

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };

                        $scope.print = function () {
                        	// angular.element("#print_content").html();
                        	var mywindow = window.open('', 'my div');
					        mywindow.document.write('<html><head><title>' + recipe.NAME + '</title>');
					        mywindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
					        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
					        mywindow.document.write('<link rel="stylesheet" href="/css/style.css" type="text/css" />');
					        mywindow.document.write('<link rel="stylesheet" href="/css/bootstrap.min.css" type="text/css" />');
					        mywindow.document.write('<link rel="stylesheet" href="/css/bootstrap-theme.min.css" type="text/css" />');
							mywindow.document.write(
								'<script>' +
								'	setTimeout(function() {' +
								'		window.print();' +
								'	},100);' +
								'</script>'
							);
							mywindow.document.write('</head><body >');
					        mywindow.document.write(angular.element("#print_content").html());
					        mywindow.document.write('</body></html>');

							// setTimeout(function() {
						    //     mywindow.print();
							// 	setTimeout(function() {
							// 		mywindow.close();
							// 	},250);
							// },100);


				            // $modalInstance.close();
				        };

				        $scope.fontClass = 'print-panel-md';

                        $scope.recipe = recipe;
                    },
                    resolve:  {
                    	recipe: function() {
                    		return recipe;
                    	}
                    }
                });
                return modalInstance.result;
			}
		};

		return obj;

	});

})();

(function() {
    var notification = angular.module("notification",[]);
    
    notification.factory("notificationData", function() {
        return {
            listener: null,
            reset: function() {
                if ( this.listener ) {
                    this.listener();
                }
            },
            updateListener : null,
            update: function() {
                if ( this.updateListener ) {
                    this.updateListener();
                }  
            }
        };
    });
    
    notification.controller("NotificationsCtrl",function($scope,Notification,$rootScope,notificationData,pushListener) {
        
        notificationData.reset();
        
        $scope.updateCount = function(notifications) {
            $scope.countUnread = 0;
            $scope.countNew = 0;
            angular.forEach(notifications, function(not) {
                if ( not.status == 'new') {
                    $scope.countNew++;
                } else if ( not.status == 'unread') {
                    $scope.countUnread++;
                }
            });
        };

        function onNewNotification(data) {
            console.log("INFO","New Notification (Data)", data);
            // $scope.notifications = Notification.query($scope.updateCount);
            $scope.notifications.splice(0,0,data);
            $scope.updateCount($scope.notifications);
        }

        $scope.$watch('user._id',function(user_id) {
            if ( user_id ) {
                $scope.notifications = Notification.query($scope.updateCount);
                pushListener.on("NOTIFICATION_ADD_" + user_id, onNewNotification);
            }                
        });

        $scope.$on('$destroy',function() {
            pushListener.off("NOTIFICATION_ADD_" + $scope.user._id, onNewNotification);
        });

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Notificaciones'
        }];
        
        $scope.markAllAsRead = function() {
            angular.forEach($scope.notifications, function(n) {
                $scope.markAsRead(n,false);
            });
            notificationData.reset();
        };

        $scope.markAsRead = function(notification,update) {
            function callback() {
                if ( update ) {

                    notificationData.update();
                }    
            }
            if ( notification.status != 'read' ) {
                notification.status = 'read';
                if ( notification.$save ) {
                    notification.$save(callback);    
                } else {
                    Notification.save(notification,callback);
                }
                $scope.updateCount($scope.notifications);
            }
        };
        
        $scope.statusClass = function(notification) {
            if ( notification.status == 'unread') { 
                return 'gt-notification-unread';
            } else if ( notification.status == 'new') {
                return 'gt-notification-new';
            }
            return '';
        };
        
    });
})();
(function() {

    var abm = angular.module("abm",[]);


    abm.controller("AbmCtrl",function($scope,$rootScope,$routeParams,Grain, Hop, Bottle, Misc,Yeast,Style,sortData) {

        $scope.allConfigs = {
            Style:  {
                data: Style,
                name: "Estilos",
                singular: "Estilo",
                orderBy: "name",
                pageSize: 10,
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre'
                    },{
                        field:'OG_Min',
                        caption: 'OG min'
                    },{
                        field:'OG_Max',
                        caption: 'OG max'
                    },{
                        field:'FG_Min',
                        caption: 'FG min'
                    },{
                        field:'FG_Max',
                        caption: 'FG max'
                    },{
                        field:'IBU_Min',
                        caption: 'IBU min'
                    },{
                        field:'IBU_Max',
                        caption: 'IBU max'
                    },{
                        field:'Colour_Min',
                        caption: 'Color min'
                    },{
                        field:'Colour_Max',
                        caption: 'Color max'
                    },{
                        field:'ABV_Min',
                        caption: '%Alc min'
                    },{
                        field:'ABV_Max',
                        caption: '%Alc max'
                    //},{
                    //    field:'link',
                    //    caption: 'BJCP'
                    },{
                        field:'co2_min',
                        caption: 'CO2 min'
                    },{
                        field:'co2_max',
                        caption: 'CO2 max'
                    //},{
                    //    field:'related',
                    //    caption: 'RateBeer.com'
                    }
                ]
            },
            Yeast:  {
                data: Yeast,
                name: "Levaduras",
                singular: "Levadura",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        width:'70%'
                    },{
                        field:'aa',
                        caption: 'Atenuacion',
                        type: 'number',
                        width:'20%'
                    },{
                        field:'density',
                        caption: 'Densidad',
                        type: 'number',
                        width:'20%'
                    },{
                        field:'packageSize',
                        caption: 'Tamaño Paquete (g)',
                        type: 'number',
                        width:'20%'
                    }
                ]
            },
            Misc:  {
                data: Misc,
                name: "Miscs",
                singular: "Misc",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre'
                    },{
                        field:'type',
                        caption: 'Tipo'
                    },{
                        field:'use',
                        caption: 'Uso'
                    }
                ]
            },
            Bottle:  {
                data: Bottle,
                name: "Botellas",
                singular: "Botella",
                orderBy: "size",
                headers: [
                    {
                        field:'_id',
                        caption: 'ID',
                        width: '25%'
                    },{
                        field:'name',
                        caption: 'Nombre',
                        width: '25%'
                    },{
                        field:'size',
                        caption: 'Tamaño',
                        type: "number",
                        step: "0.01",
                        width: '25%'
                    },{
                        field:'colour',
                        caption: 'Color',
                        type: 'combo',
                        data: ['Ambar', 'Verde', 'Blanca'],
                        width: '25%'
                    }
                ]
            },
            Grain: {
                data: Grain,
                name: "Granos",
                singular: "Grano",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        width: '50%'
                    },{
                        field:'type',
                        caption: 'Tipo',
                        width: '15%'
                    },{
                        field:'colour',
                        caption: 'Color (SRM)',
                        type: 'number',
                        step: 0.1,
                        width: '15%'
                    },{
                        field:'potential',
                        caption: 'Potencial',
                        type: 'number',
                        step: 0.001,
                        width: '15%'
                    },{
                        field:'use',
                        caption: 'Uso',
                        width: '15%'
                    },{
                        field:'excludeIBU',
                        caption: 'Excluye IBU ',
                        width: '15%'
                    }
                ]
            },
            Hop: {
                data: Hop,
                name: "Lupulos",
                singular: "Lupulo",
                orderBy: "name",
                headers: [
                    {
                        field:'name',
                        caption: 'Nombre',
                        width: '70%'
                    },{
                        field:'alpha',
                        caption: 'AA%',
                        type: 'number',
                        step: 0.1,
                        width: '25%'
                    }
                ]
            }
        };

        $scope.entity = $routeParams.entity;

        $scope.config = $scope.allConfigs[$scope.entity];

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: $scope.config.name
        }];

        $scope.getActiveClass = function(tab) {
            if (tab == $scope.entity) {
                return 'active';
            } else {
                return '';
            }
        };

    });

})();

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
        $interval,
        $timeout
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
                return '//'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
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
            $timeout(function() {Stats.query({stats:['singInDate']}, mix); },500);
            $timeout(function() {Stats.query({stats:['date']}, mix); },500);
            $timeout(function() {Stats.query({stats:['modificationDate']}, mix); },500);
            $timeout(function() {Stats.query({stats:['isPublic']}, mix); },500);
            $timeout(function() {Stats.query({stats:['active']}, mix); },500);
            
            // Stats.query({stats:['recipesByUser']}, mix);
            
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

(function() {

    var calculator = angular.module("calculator", ["helper"]);

    calculator.controller("CalculatorCtrl", function($scope,$rootScope) {

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Herramientas'
        }];

        $scope.values = $scope.values || {};

    });

    calculator.directive("calculatorMix", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-mix.html',
            controller: function($scope, BrewCalc) {

                $scope.items = [];

                $scope.add = function() {
                    $scope.items.push({
                        size: 20,
                        gravity: 1.050
                    });
                };

                $scope.remove = function(item) {
                    util.Arrays.remove($scope.items, item);
                };

                $scope.gravity = 0;

                $scope.$watch('items', function() {
                    $scope.gravity = BrewCalc.calculateMix($scope.items);
                }, true);

            }
        };
    });

    calculator.directive("calculatorAbv", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-abv.html',
            controller: function($scope, BrewCalc) {

                $scope.alcohol = {
                    OG: $scope.values.OG || 1.050,
                    FG: $scope.values.FG || 1.010,
                    mode: 'ABV'
                };

                function updateABV() {
                    if ( $scope.alcohol.mode == 'ABV' ) {
                        // console.log("calculate ABV");
                        $scope.alcohol.ABV = BrewCalc.calculateABV($scope.alcohol.OG,$scope.alcohol.FG);

                    } else if ( $scope.alcohol.mode == 'OG' ) {
                        // console.log("calculate OG");
                        $scope.alcohol.OG = BrewCalc.calculateOG($scope.alcohol.FG,$scope.alcohol.ABV);
                    } else if ( $scope.alcohol.mode == 'FG' ) {
                        // console.log("calculate FG");
                        $scope.alcohol.FG = BrewCalc.calculateFG($scope.alcohol.OG,$scope.alcohol.ABV);
                    }
                    $scope.alcohol.attenuation = BrewCalc.attenuation($scope.alcohol.OG,$scope.alcohol.FG);
                }

                $scope.$watch("alcohol.OG+alcohol.FG+alcohol.ABV", function() {
                    $scope.alcohol.OGP = BrewCalc.toPlato($scope.alcohol.OG);
                    $scope.alcohol.FGP = BrewCalc.toPlato($scope.alcohol.FG);
                    updateABV();
                });

                $scope.updateOG = function() {
                    $scope.alcohol.OG = BrewCalc.fromPlato($scope.alcohol.OGP);
                };

                $scope.updateFG = function() {
                    $scope.alcohol.FG = BrewCalc.fromPlato($scope.alcohol.FGP);
                };

            }
        };
    });

    calculator.directive("calculatorHydro", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-hydro.html',
            controller: function($scope, BrewCalc) {

                $scope.hydrometer = {
                    gravity: 1.050,
                    reading: 25,
                    calibration: 15
                };

                function updateValue() {
                    $scope.hydrometer.value = BrewCalc.adjustHydrometer(
                        $scope.hydrometer.gravity,
                        $scope.hydrometer.reading,
                        $scope.hydrometer.calibration);
                    $scope.hydrometer.valueP = BrewCalc.toPlato($scope.hydrometer.value);
                };

                $scope.$watch("hydrometer.gravity+hydrometer.reading+hydrometer.calibration", function() {
                    $scope.hydrometer.gravityP = BrewCalc.toPlato($scope.hydrometer.gravity);
                    updateValue();

                });

                $scope.updateGravity = function() {
                    $scope.hydrometer.gravity = BrewCalc.fromPlato($scope.hydrometer.gravityP);
                };

            }
        };
    });

    calculator.directive("calculatorRefract", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-refract.html',
            controller: function($scope, BrewCalc) {

                $scope.refractometer = {
                    OG: $scope.values.OG || 1.050,
                    FG: 1.025,
                    correction: 1
                };

                function updateValue() {
                    $scope.refractometer.valueP = BrewCalc.adjustRefractometer(
                        $scope.refractometer.OGP,
                        $scope.refractometer.FGP,
                        $scope.refractometer.correction);
                    $scope.refractometer.value = BrewCalc.fromPlato($scope.refractometer.valueP);
                    $scope.refractometer.ABV = BrewCalc.calculateABV($scope.refractometer.OG, $scope.refractometer.value);
                };

                $scope.$watch("refractometer.OG+refractometer.FG+refractometer.correction", function() {
                    $scope.refractometer.OGP = BrewCalc.toPlato($scope.refractometer.OG);
                    $scope.refractometer.FGP = BrewCalc.toPlato($scope.refractometer.FG);
                    updateValue();
                });

                $scope.updateOG = function() {
                    $scope.refractometer.OG = BrewCalc.fromPlato($scope.refractometer.OGP);
                };

                $scope.updateFG = function() {
                    $scope.refractometer.FG = BrewCalc.fromPlato($scope.refractometer.FGP);
                };

            }
        };
    });

    calculator.directive("calculatorDilution", function() {
        return {
            restrict: 'AE',
            templateUrl: 'partial/calculator/calculator-dilution.html',
            controller: function($scope, BrewCalc) {

                $scope.dilution = {
                    currentGrav: 1.075,
                    currentVol: 20,
                    finalGrav: 1.050
                };

                function updateValue() {
                    $scope.dilution.finalVol = BrewCalc.dilution(
                        $scope.dilution.currentGrav,
                        $scope.dilution.currentVol,
                        $scope.dilution.finalGrav);
                    // $scope.refractometer.value = BrewCalc.fromPlato($scope.refractometer.valueP);
                    // $scope.refractometer.ABV = BrewCalc.calculateABV($scope.refractometer.OG, $scope.refractometer.value);
                };

                $scope.$watch("dilution.currentGrav+dilution.currentVol+dilution.finalGrav", function() {
                    $scope.dilution.currentGravP = BrewCalc.toPlato($scope.dilution.currentGrav);
                    $scope.dilution.finalGravP = BrewCalc.toPlato($scope.dilution.finalGrav);
                    updateValue();
                });

                $scope.updateOG = function() {
                    $scope.dilution.currentGrav = BrewCalc.fromPlato($scope.dilution.currentGravP);
                };

                $scope.updateFG = function() {
                    $scope.dilution.finalGrav = BrewCalc.fromPlato($scope.dilution.finalGravP);
                };

            }
        };
    });

    calculator.factory("CalculatorPopup", function($modal,$rootScope) {
        var obj = {
            open : function (show,values) {
                var scope = $rootScope.$new();

                /* Show/Hide */
                scope.show = show || {
                    abv: true,
                    hydrometer: true,
                    refractometer: true,
                    dilution: true,
                    mix: true
                };
                var count = 0;
                angular.forEach(scope.show, function(value, key) {
                    count += value?1:0;
                });
                var windowClass='';
                scope.colClass= 'col-xs-12';
                if ( count != 1 ) {
                    windowClass = 'modal-lg';
                    scope.colClass= 'col-xs-6';
                }

                /* Default Values */
                scope.values = values || {};

                var modalInstance = $modal.open({
                    templateUrl: 'partial/calculator/calculator-popup.html',
                    controller: function($scope, $modalInstance) {
                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    windowClass: windowClass,
                    scope: scope
                });
                return modalInstance.result;
            }
        };
        return obj;
    });




})();

(function() {

	var device = angular.module("device", ['resources']);

	device.controller("DeviceController", function($scope,TempDevice,Recipe) {

		$scope.entity = 'TempDevice';

        
        $scope.config = {
            data: TempDevice,
            name: "Dispositivos",
            singular: "Dispositivo",
            orderBy: "name",
            headers: [{
                    field:'name',
                    caption: 'Nombre'
                },{
                    field:'code',
                    caption: 'Codigo'
                },{
                    field:'recipe_id',
                    caption: 'Receta',
                    type: 'combo-object',
                    comboKey: '_id',
                    comboValue: 'NAME',
                    data: Recipe.query()
                }
            ]
        };

	});

})();
(function() {

    var res = angular.module('resources',[]);

    res.factory('User',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('user/:type:id',{google_id:params}, {
            add: { method: 'POST', params: {}},
            getByGoogleId: {method: 'GET', params: {type:'google_'}, isArray:false},
            addToFavorites: {method: 'PUT', params: {type:'favorite_add'}},
            removeFromFavorites: {method: 'PUT', params: {type:'favorite_drop'}},
            get:{method:'GET',params: {type:'id_'}},
            //findStats: {method: 'GET', params: {type:'stats'}},
            updateSettings: {method: 'PUT', params: {type:'settings'}},
            updatePassword: {method: 'PUT', params: {type:'password'}},
            loginPassword: {method: 'POST', params: {type:'login_password'}}
        });
    });

    res.factory('PublishedRecipe',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('recipe/:operation:id',{google_id:params,id:'@_id'}, {
            query: {method:'GET',params: {operation:'public'}, isArray:true },
            count: {method:'GET', params: {operation:'public_count'}, isArray:false}
        });
    });

    res.factory('Recipe',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('recipe/:operation:id',{google_id:params,id:'@_id'}, {
            findPublic: {method:'GET',params: {operation:'public'}, isArray:true },
            findCollaborated: {method:'GET',params: {operation:'collaborated'}, isArray:true },
            publish: {method:'POST', params: {operation: 'publish_'}},
            state: {method:'POST', params: {operation: 'state_'}},
            publicStyles: {method:'GET', params: {operation: 'public_styles'}, isArray:true},
            count: {method:'GET', params: {operation:'my_count'}, isArray:false},
            tags: {method:'GET', params: {operation:'my_tags'}, isArray:true},
            findByUser: {method:'GET',params: {operation:'by_user_'},isArray:true},
            stats: {method:'GET',params: {operation:'stats'}},
            addComment: {
                method:'PUT',
                params: {operation:'comment'},
                isArray:true },
            getComments: {
                method:'GET',
                params: {operation:'comment'},
                isArray:true },
            removeComment: {
                method:'PUT',
                params: {operation:'remove_comment'},
                isArray:true }
        });
    });

    res.factory('Notification',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('notification/:_id',{google_id:params,_id:"@_id"}, {
            findNews: {method:'GET',params:{_id:'news'},isArray:true}
        });
    });

    res.factory('Stats',function($resource,$rootScope) {
        var params = function() {
            return $rootScope.user ? $rootScope.user.google_id : null;
        };
        return $resource('stats/',{google_id:params}, {
            query: {
                method:'GET',
                params:{},
                isArray:false
            }
        });
    });

    var services = ['Style','Grain','Hop','Yeast','Misc','Bottle','Tag','WaterReport','TempDevice','TempDeviceReport'];
    angular.forEach(services,function(s) {
        res.factory(s,function($resource) {
            return $resource( s[0].toLowerCase() + s.substr(1) + '/:_id',{_id:"@_id"}, {});
        });
    });

    var admin = ['User','Recipe','Action'];
    angular.forEach(admin,function(s) {
        res.factory('Admin' + s,function($resource) {
            return $resource( 'admin/' + s.toLowerCase() + '/:operation:_id',{_id:"@_id"}, {
                count: {method:'GET', params: {operation:'count'}, isArray:false}
            });
        });
    });

})();

(function(exports) {

    function DiffHelper() {
        var ready;
        var result;
        this.excludes = [];

        function parentArray(parent) {
            return {
                parent: parent,
                wrap: function(field) {
                    return parent+"["+field+"]";
                }
            };
        }

        function parentObject(parent) {
            return {
                parent: parent,
                wrap: function(field) {
                    return parent+"."+field;
                }
            };
        }

        this.compareAll = function(obj1,obj2,parent) {
            for( var i in obj1 ) {
                if ( ready.indexOf(i) == -1 ) {
                    ready.push(i);
                    var p;
                    if ( obj1 instanceof Array ) {
                        p = parentArray("$")
                    } else {
                        p = parentObject("$");
                    }
                    this.compare(obj1,obj2,i,parent||p);
                }

            }
        };

        this.compare = function(o1,o2,field,parent) {
            var diff = [];
            if ( o1[field] instanceof Date && o2[field] instanceof Date ) {
                if ( o1[field].getTime() != o2[field].getTime() ) {
                    diff = [parent.wrap(field)];
                }
            } else if ( o1[field] instanceof Array && o2[field] instanceof Array ) {
                var helper = new DiffHelper();
                helper.excludes = this.excludes;
                diff = helper.diff(o1[field],o2[field],parentArray(parent.wrap(field)));
            } else if ( o1[field] instanceof Object && o2[field] instanceof Object ) {
                var helper = new DiffHelper();
                helper.excludes = this.excludes;
                diff = helper.diff(o1[field],o2[field],parentObject(parent.wrap(field)));
            } else if ( o1[field] != o2[field] ) {
                diff = [parent.wrap(field)];
            }
            for ( var i = 0; i<diff.length; i++ ) {
                var fail = false;
                for ( var ri=0; ri<this.excludes.length; ri++) {
                    var reg = new RegExp(this.excludes[ri]);
                    var fail = fail || reg.test(diff[i]);
                }
                if ( !fail ) {
                    result.push(diff[i]);
                }
            }
        };

        this.diff = function(obj1,obj2,parent) {
            ready = [];
            result = [];
            this.compareAll(obj1,obj2,parent);
            this.compareAll(obj2,obj1,parent);
            return result;
        };
    }

    exports.diff = function(obj1,obj2,excludes) {
        var helper = new DiffHelper();
        helper.excludes = excludes || [];
        return helper.diff(obj1,obj2);
    };

    /**
     * Heleper class to manage arrays
     */
    exports.Arrays = {
        remove: function(array,object,comparator) {
            if ( comparator ) {
                var index = -1;
                for ( var i=0; i<array.length; i++) {
                    if ( comparator(object, array[i]) == 0 ) {
                        index = i;
                        break;
                    }
                }
                if ( index !== -1 ) {
                    array.splice(index,1);
                }
                return index;
            } else {
                var index = array.indexOf(object);
                if ( index !== -1 ) {
                    array.splice(index,1);
                }
                return index;
            }
        },
        filter: function(array, comparator) {
            var result = [];
            for (var i=0; i<array.length; i++) {
                if ( comparator(array[i]) == 0 ) {
                    result.push(array[i]);
                }
            }
            return result;
        }
    };

    exports.formatDate = function(date,defaultFormatter) {
        date = new Date(date);
        //Fecha de hoy en segundos
        var today = new Date().getTime()/1000;
        //Fecha del comentario en segundos
        var dateSec = date.getTime()/1000;

        //Diferencia en segundos
        var diffSec = today-dateSec;

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        var tomorroy = new Date();
        tomorroy.setDate(tomorroy.getDate()+1);

        if ( diffSec < 0 ) { //En el futuro
            if ( diffSec>-10) {
                return "Ahora";
            } else if ( diffSec>-60) {
                return "En menos de un minuto";
            } else if (diffSec > -(60*60)) { // Si es menos de una hora
                return "En " + Math.round(-diffSec/60) + " minutos";
            } else if ( date.getDate() == new Date().getDate() &&
                date.getMonth() == new Date().getMonth() &&
                date.getYear() == new Date().getYear()) { //si aun es el mismo dia, pero mas adelante
                return "En " + Math.floor(-diffSec/60/60) + ":" + exports.pad(Math.floor((-diffSec/60) % 60),2) + " Horas";
            } else if (date.getDate() == tomorroy.getDate() &&
                date.getMonth() == tomorroy.getMonth() &&
                date.getYear() == tomorroy.getYear()) { // Si sera mañana
                return "Mañana " + defaultFormatter(date,'HH:mm');
            }  else {
                var days = -diffSec/60/60/24;
                var years = Math.floor(days / 365);
                var daysLeft = Math.floor(days % 365);
                var months = Math.floor(daysLeft / 30);
                var daysLeftMonth = Math.floor(daysLeft % 30);
                return 'En $years$months$days$hours'
                .replace('$years', yearText(years))
                .replace('$months', monthsText(months,years))
                .replace('$days', daysText(daysLeftMonth, months, years))
                .replace('$hours', hoursText(Math.floor(-diffSec/60/60 % 24), daysLeftMonth, months, years));
            }
        } else {// en el pasado
            if (diffSec<10) { // Si es menos de un minuto
                return "Ahora";
            } else if (diffSec<60) { // Si es menos de un minuto
                return "Hace menos de un minuto";
            } else if (diffSec < (60*60)) { // Si es menos de una hora
                return "Hace " + Math.round(diffSec/60) + " minutos";
            } else if (date.getDate() == new Date().getDate() &&
                date.getMonth() == new Date().getMonth() &&
                date.getYear() == new Date().getYear()) { //si aun es el mismo dia
                // return "Hoy" + " hace " + Math.round(diffSec/60/60) + " horas";
                return "Hoy" + " hace " + Math.floor(diffSec/60/60) + ":" + exports.pad(Math.floor((diffSec/60) % 60),2) + " Horas";
            } else if (date.getDate() == yesterday.getDate() &&
                date.getMonth() == yesterday.getMonth() &&
                date.getYear() == yesterday.getYear()) { // Si fue durane el dia de ayer
                return "Ayer " + defaultFormatter(date,'HH:mm');
            } else {
                var days = diffSec/60/60/24;
                var years = Math.floor(days / 365);
                var daysLeft = Math.floor(days % 365);
                var months = Math.floor(daysLeft / 30);
                var daysLeftMonth = Math.floor(daysLeft % 30);
                return 'Hace $years$months$days$hours'
                    .replace('$years', yearText(years))
                    .replace('$months', monthsText(months,years))
                    .replace('$days', daysText(daysLeftMonth, months, years))
                    .replace('$hours', hoursText(Math.floor(diffSec/60/60 % 24), daysLeftMonth, months, years));
            }
        }

    };

    function hoursText(hours, days, months, years) {
        if ( months > 0 || years > 0 ) return '';
        //FIXME, ver si conviene solo mostar la hora cuando son menos de 10 dias
        if ( hours > 1 ) {
            return ', ' + hours + ' horas';
        } else if ( hours === 1 ) {
            return ', 1 hora';
        } else {
            return '';
        }
    }

    function yearText(years) {
        if ( years > 1 ) {
            return years + ' años';
        } else if ( years === 1 ) {
            return '1 año';
        } else {
            return '';
        }
    }

    function daysText(days, months, years) {
        if ( days > 1 ) {
            return colon(months, years) + days + ' dias';
        } else if ( days === 1 ) {
            return colon(months, years) + '1 dia';
        } else {
            return '';
        }
    }

    function colon(value, value2) {
        if ( value !== 0 || (value2 && value2 !== 0) ) {
            return ', ';
        } else {
            return '';
        }
    }

    function monthsText(months,years) {
        if ( months > 1 ) {
            return colon(years) + months + ' meses';
        } else if ( months === 1 ) {
            return colon(years) + '1 mes';
        } else {
            return '';
        }
    }

    exports.pad = function(value,zeros) {
        value = value.toString();
        if (value.length > zeros) {
            return value;
        } else {
            var result = value;
            for ( var i=0; i<zeros-value.length; i++) {
                result = "0" + result;
            }
            return result;
        }
    }

})(typeof exports === 'undefined'? this['util'] = {} : exports );

/**
 * bfHydrometer
 */
(function (exports) {

    function recalculate(hydro, temp, calibration) {
        var tempunit = "C";
        if (tempunit == "F") {
            temp = fahrenheitToCelsius(temp);
            calibration = fahrenheitToCelsius(calibration)
        }
        var difference = calculateHydrometerCorrection(temp, calibration);
        var result = rounddecimal(difference + hydro, 3);
        return result;
    }
    exports.recalculate = recalculate;

    function isNumber(s) {
        if (s === null) {
            return false
        }
        if (s === 0) {
            return true
        }
        if (s == '') {
            return false
        }
        if (isNaN(s)) {
            return false
        }
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (!((c >= "0") && (c <= "9")) && c != '.') {
                return false
            }
        }
        return true
    }

    function calculateHydrometerCorrection(temp, calibration) {
        temp = parseFloat(temp);
        calibration = parseFloat(calibration);
        if (temp < 0 || temp > 71) {
            return 0
        }
        if (calibration < 10 || calibration > 24) {
            return 0
        }
        var C = [];
        var delta = [];
        for (var i = 0; i <= 71; i++) {
            C[i] = i
        }
        var calibrationOffset = 15 - Math.round(calibration);
        var difference = 0;
        delta[0] = -0.0009;
        delta[1] = -0.0009;
        delta[2] = -0.0009;
        delta[3] = -0.0009;
        delta[4] = -0.0009;
        delta[5] = -0.0009;
        delta[6] = -0.0008;
        delta[7] = -0.0008;
        delta[8] = -0.0007;
        delta[9] = -0.0007;
        delta[10] = -0.0006;
        delta[11] = -0.0005;
        delta[12] = -0.0004;
        delta[13] = -0.0003;
        delta[14] = -0.0001;
        delta[15] = 0;
        delta[16] = 0.0002;
        delta[17] = 0.0003;
        delta[18] = 0.0005;
        delta[19] = 0.0007;
        delta[20] = 0.0009;
        delta[21] = 0.0011;
        delta[22] = 0.0013;
        delta[23] = 0.0016;
        delta[24] = 0.0018;
        delta[25] = 0.0021;
        delta[26] = 0.0023;
        delta[27] = 0.0026;
        delta[28] = 0.0029;
        delta[29] = 0.0032;
        delta[30] = 0.0035;
        delta[31] = 0.0038;
        delta[32] = 0.0041;
        delta[33] = 0.0044;
        delta[34] = 0.0047;
        delta[35] = 0.0051;
        delta[36] = 0.0054;
        delta[37] = 0.0058;
        delta[38] = 0.0061;
        delta[39] = 0.0065;
        delta[40] = 0.0069;
        delta[41] = 0.0073;
        delta[42] = 0.0077;
        delta[43] = 0.0081;
        delta[44] = 0.0085;
        delta[45] = 0.0089;
        delta[46] = 0.0093;
        delta[47] = 0.0097;
        delta[48] = 0.0102;
        delta[49] = 0.0106;
        delta[50] = 0.0110;
        delta[51] = 0.0114;
        delta[52] = 0.0118;
        delta[53] = 0.0122;
        delta[54] = 0.0126;
        delta[55] = 0.0130;
        delta[56] = 0.0135;
        delta[57] = 0.0140;
        delta[58] = 0.0145;
        delta[59] = 0.0150;
        delta[60] = 0.0155;
        delta[61] = 0.0160;
        delta[62] = 0.0165;
        delta[63] = 0.0171;
        delta[64] = 0.0177;
        delta[65] = 0.0183;
        delta[66] = 0.0189;
        delta[67] = 0.0195;
        delta[68] = 0.0201;
        delta[69] = 0.0207;
        delta[70] = 0.0213;
        delta[71] = 0.0219;
        delta[72] = 0.0225;
        delta[73] = 0.0231;
        delta[74] = 0.0237;
        delta[75] = 0.0243;
        delta[76] = 0.0249;
        delta[77] = 0.0255;
        delta[78] = 0.0261;
        delta[79] = 0.0267;
        delta[80] = 0.0273;
        for (i = 0; i < C.length; i++) {
            if (C[i] == temp) {
                var calibrationOffsetBounded = calibrationOffset;
                if ((i + calibrationOffsetBounded) < 0) {
                    calibrationOffsetBounded = 0
                }
                difference = delta[i + calibrationOffsetBounded];
                break
            }
            if (temp >= C[i] && temp < C[i + 1]) {
                var calibrationOffsetBounded = calibrationOffset;
                if ((i + calibrationOffsetBounded) < 0) {
                    calibrationOffsetBounded = 0
                }
                difference = (delta[i + calibrationOffsetBounded] + delta[i + calibrationOffsetBounded + 1]) / 2;
                break
            }
        }
        return difference
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }

    function fahrenheitToCelsius(fahrenheit) {
        fahrenheit = parseFloat(fahrenheit);
        if (fahrenheit === '') {
            return false
        }
        if (isNaN(fahrenheit)) {
            return false
        }
        return (5 / 9) * (fahrenheit - 32)
    }
})(typeof exports === 'undefined'? this['bfHydrometer'] = {} : exports );

/**
 * bfRefractometer
 */
(function(exports) {


    function recalculate(og2, fg2, wortcorrection2) {
        var part2ogunit = "brixwri";

        var part2OGInBrix;
        var part2OGInSG;
        if (part2ogunit == "brixwri") {
            part2OGInBrix = og2 / wortcorrection2;
            part2OGInSG = convertPlatoToGravity(part2OGInBrix)
        }
        if (part2ogunit == "plato") {
            part2OGInBrix = og2;
            part2OGInSG = convertPlatoToGravity(og2)
        }
        if (part2ogunit == "sg") {
            part2OGInBrix = convertGravityToPlato(og2, 10);
            part2OGInSG = og2
        }
        var part2CorrectedFGInBrix = fg2 / wortcorrection2;
        var part2FGInSG = getFGFromBrix(part2OGInBrix, part2CorrectedFGInBrix);
        var part2FGInBrix = convertGravityToPlato(part2FGInSG, 10);

        // console.log("divPart2OGCorrectedBrix",rounddecimal(part2OGInBrix, 2) + " ºP, " + rounddecimal(part2OGInSG, 3));
        var valueStr = rounddecimal(part2FGInBrix, 2) + " ºP, " + rounddecimal(part2FGInSG, 3);
        // console.log("divPart2FGCorrectedBrix",valueStr);
        var abw = 76.08 * (part2OGInSG - part2FGInSG) / (1.775 - part2OGInSG);
        var abv = abw * (part2FGInSG / 0.794);
        // console.log("divPart2ABV",rounddecimal(abv, 2) + "%");
        return part2FGInBrix;
    }
    exports.recalculate = recalculate;


    function updateOGScale() {
        setVars();
        if (part2ogunit == "sg") {
            document.calc.txtPart2og.value = "1.048"
        } else {
            document.calc.txtPart2og.value = "12"
        }
    }

    function isNumber(s) {
        if (s === null) {
            return false
        }
        if (s === 0) {
            return true
        }
        if (s == '') {
            return false
        }
        if (isNaN(s)) {
            return false
        }
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (!((c >= "0") && (c <= "9")) && c != '.') {
                return false
            }
        }
        return true
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }

    function convertPlatoToGravity(plato) {
        return (plato / (258.6 - ((plato / 258.2) * 227.1))) + 1
    }

    function convertGravityToPlato(sg, n) {
        if (!n) {
            n = 1
        }
        var plato = (-1 * 616.868) + (1111.14 * sg) - (630.272 * Math.pow(sg, 2)) + (135.997 * Math.pow(sg, 3));
        return rounddecimal(plato, n)
    }

    function getFGFromBrix(brixOg, brixFg) {
        return 1.0000 - 0.0044993 * brixOg + 0.011774 * brixFg + 0.00027581 * Math.pow(brixOg, 2) - 0.0012717 * Math.pow(brixFg, 2) - 0.0000072800 * Math.pow(brixOg, 3) + 0.000063293 * Math.pow(brixFg, 3)
    }

    function resetform() {
        document.calc.reset();
        setVars();
        recalculate()
    }
})(typeof exports === 'undefined'? this['bfRefractometer'] = {} : exports );

/**
 * bfDilution
 */
(function(exports) {

    var currentVolume2 = 7.5;
    var currentGravity2 = 1.035;
    var targetVolume = 5.5;

    // function setVars() {
    //     currentVolume = document.calc.txtcurrentvolume.value;
    //     currentGravity = document.calc.txtcurrentgravity.value;
    //     desiredGravity = document.calc.txtdesiredgravity.value;
    //     currentVolume2 = document.calc.txtcurrentvolume2.value;
    //     currentGravity2 = document.calc.txtcurrentgravity2.value;
    //     targetVolume = document.calc.txttargetvolume.value
    // }

    function recalculate(currentVolume, currentGravity, desiredGravity) {
        // var currentVolume = 3.5;
        // var currentGravity = 1.075;
        // var desiredGravity = 1.05;

        var newVolume = ((currentGravity - 1) / (desiredGravity - 1)) * currentVolume;
        newVolume = rounddecimal(newVolume, 2);
        if (isNaN(newVolume)) {
            newVolume = 0
        }
        // $('#divNewVolume').html(newVolume);
        // console.log("newVolume",newVolume);
        return newVolume;
        // var difference = rounddecimal(newVolume - currentVolume, 2);
        // console.log("difference",difference);
        // if (difference >= 0) {
        //     $('#divVolumeDifference').html("<span style='color: green;'>" + difference + "</span>")
        // } else {
        //     $('#divVolumeDifference').html("<span style='color: red;'>" + difference + "</span>")
        // }
    }
    exports.recalculate = recalculate;

    function recalculate2() {
        var newGravity = (currentGravity2 - 1) * (currentVolume2 / targetVolume);
        newGravity = newGravity + 1;
        newGravity = rounddecimal(newGravity, 3);
        if (isNaN(newGravity)) {
            newGravity = 0
        }
        $('#divNewGravity').html(newGravity);
        var difference = rounddecimal(newGravity - currentGravity2, 3);
        if (difference >= 0) {
            $('#divGravityDifference').html("<span style='color: green;'>" + difference + "</span>")
        } else {
            $('#divGravityDifference').html("<span style='color: red;'>" + difference + "</span>")
        }
    }

    function checkInput2() {
        setVars();
        if (!isNumber(currentVolume2)) {
            alert('Wort Volume must be a number.');
            return false
        }
        if (currentVolume2 <= 0) {
            alert('Current Volume must be greater than zero.');
            return false
        }
        if (!isNumber(currentGravity2)) {
            alert('Current Gravity must be a number (format 1.xxx).');
            return false
        }
        if (currentGravity2 <= 1) {
            alert('Current Gravity must be greater than 1.00.');
            return false
        }
        if (!isNumber(targetVolume)) {
            alert('Target Volume must be a number.');
            return false
        }
        if (targetVolume <= 0) {
            alert('Target Volume must be greater than zero.');
            return false
        }
        return true
    }

    function isNumber(s) {
        if (s === null) {
            return false
        }
        if (s === 0) {
            return true
        }
        if (s == '') {
            return false
        }
        if (isNaN(s)) {
            return false
        }
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (!((c >= "0") && (c <= "9")) && c != '.') {
                return false
            }
        }
        return true
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }
})(typeof exports === 'undefined'? this['bfDilution'] = {} : exports );

/**
 * bfYeast
 */
(function(exports) {

    /**
     * @param wortVolume Liters
     * @param wortGravity in gravity units
     * @param pitchRate grams of yeast by liters
     * @param yeastType 'dry'||'liquid'||'slurry'
     * @param yeast_dry_grams grams of yeast
     * @param yeast_dry_cells_per_gram density of yeast
     *
     * @return {
     *  yeastNeeded yeast you need
     *  yeastCount actual amout of yeast
     *  yeastDifference difference (>0 is ok, <0 you need more)
     *  actualPitchRate actual pitch rate
     * }
     */
    function recalculate(
        wortVolume,
        wortGravity,
        pitchRate,
        yeastType,
        yeast_dry_grams,
        yeast_dry_cells_per_gram
    ) {
        var millilitersOfWort = wortVolume * 1000;
        var wortPlato = convertGravityToPlato(wortGravity, 10)

        var yeastNeeded = pitchRate * millilitersOfWort * wortPlato;
        yeastNeeded = yeastNeeded / 1000;
        //RES: Target Pitch Rate Cells
        yeastNeeded = rounddecimal(yeastNeeded, 0); //billion cells

        yeastCount = 0;
        if (yeastType == 'dry') {
            yeastCount = yeast_dry_cells_per_gram * yeast_dry_grams
        }
        //Dont use yet
        if (yeastType == 'liquid') {
            var daysOld = Math.floor((new Date() - Date.parse(yeast_liquid_mfg_date)) / 86400000);
            if (daysOld < 0) {
                daysOld = 0
            }
            var dayString = "days";
            if (daysOld == 1) {
                dayString = "day"
            }
            var viability = 100 - (daysOld * 0.7);
            if (viability < 0) {
                viability = 0
            }
            viability = rounddecimal(viability, 0);
            $('#yeast_viability').html("Yeast is " + daysOld + " " + dayString + " old, the viability is estimated at " + viability + "%.");
            yeastCount = 100 * (viability / 100) * yeast_liquid_packs
        }
        //Dont use yet
        if (yeastType == 'slurry') {
            yeastCount = yeast_slurry_density * yeast_slurry_amount * 1000
        }

        //RES: Cells Available
        yeastCount = rounddecimal(yeastCount, 0);

        //RES: Difference
        var yeastDifference = yeastCount - yeastNeeded;

        var actualPitchRate = ((yeastCount * 1000) / wortPlato) / millilitersOfWort;
        //RES: Pitch Rate As-Is
        actualPitchRate = rounddecimal(actualPitchRate, 2);

        //Here goes starter calculations (See original JS)

        return {
            yeastNeeded: yeastNeeded,
            yeastCount: yeastCount,
            yeastDifference: yeastDifference,
            actualPitchRate: actualPitchRate
        }
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }

    function convertGravityToPlato(sg, n) {
        if (!n) {
            n = 1
        }
        var plato = (-1 * 616.868) + (1111.14 * sg) - (630.272 * Math.pow(sg, 2)) + (135.997 * Math.pow(sg, 3));
        return rounddecimal(plato, n)
    }

    exports.recalculate = recalculate;

})(typeof exports === 'undefined'? this['bfYeast'] = {} : exports );

/**
 * bfWater
 */
(function(exports) {

    var e = 2.718281828459045235;


    /**
    * @param in {
    *   dilution  Numeric % of dilution
    *   mashvolume Numeric
    *   mashunits gallons / quarts / liters
    *   source  Numeric[0..7] (source[6] is out)
    *   target Numeric[0..7] (target[6] is out)
    *   CaCO3 Numeric
    *   NaHCO3 Numeric
    *   CaSO4 Numeric
    *   CaCl2 Numeric
    *   MgSO4 Numeric
    *   NaCl Numeric
    * }
    * @param out {
    *   diluted: same as startwater but for read
    * }
    */
    function recalculate(input, output) {
        input.mashunits = input.mashunits || 'liters';
        var mashvolume = input.mashvolume;
        if ( input.mashunits === 'quarts' ) {
            mashvolume = mashvolume * 0.25;
        }
        if ( input.mashunits === 'liters' ) {
            mashvolume = mashvolume * 0.264172052;
        }
        output.startwater = new Array(6);
        for (i = 0; i <= 5; i++) {
            output.diluted[i] = rounddecimal(input.source[i] * ((100 - input.dilution) / 100), 0);
            // diluteddiv[i].innerHTML = rounddecimal(diluted[i], 0);
            output.startwater[i] = input.source[i] * ((100 - input.dilution) / 100)
        }
        for (i = 0; i <= 5; i++) {
            output.diff[i] = rounddecimal(output.startwater[i] - input.target[i], 0)
        }
        input.source[6] = rounddecimal((input.source[5] * (50 / 61)), 0);
        output.diluted[6] = rounddecimal(((input.source[5] * ((100 - input.dilution) / 100)) * (50 / 61)), 0);
        // diluteddiv[6].innerHTML = rounddecimal(diluted[6], 0);
        input.target[6] = rounddecimal((input.target[5] * (50 / 61)), 0);
        output.diff[6] = rounddecimal(((input.source[5] - input.target[5]) * (50 / 61)), 0);
        if (input.CaCO3 > 0) {
            output.CaCO3_tsp = input.CaCO3 / 3.8;
        } else {
            output.CaCO3_tsp = 0;
        }
        if (input.NaHCO3 > 0) {
            output.NaHCO3_tsp = input.NaHCO3 / 4.4;
        } else {
            output.NaHCO3_tsp = 0;
        }
        if (input.CaSO4 > 0) {
            output.CaSO4_tsp = input.CaSO4 / 4;
        } else {
            output.CaSO4_tsp = 0;
        }
        if (input.CaCl2 > 0) {
            output.CaCl2_tsp = input.CaCl2 / 3.4;
        } else {
            output.CaCl2_tsp = 0;
        }
        if (input.MgSO4 > 0) {
            output.MgSO4_tsp = input.MgSO4 / 4.5;
        } else {
            output.MgSO4_tsp = 0;
        }
        if (input.NaCl > 0) {
            output.NaCl_tsp = input.NaCl / 6;
        } else {
            output.NaCl_tsp = 0;
        }
        var adjCa = 0;
        var adjMg = 0;
        var adjSO4 = 0;
        var adjNa = 0;
        var adjCl = 0;
        var adjHCO3 = 0;
        var CaCO3 = input.CaCO3 / 2;
        if (CaCO3 > 0) {
            adjCa = adjCa + ((105 * CaCO3) / mashvolume);
            adjHCO3 = adjHCO3 + ((321 * CaCO3) / mashvolume)
        }
        if (input.NaHCO3 > 0) {
            adjNa = adjNa + ((75 * input.NaHCO3) / mashvolume);
            adjHCO3 = adjHCO3 + ((191 * input.NaHCO3) / mashvolume)
        }
        if (input.CaSO4 > 0) {
            adjCa = adjCa + ((61.5 * input.CaSO4) / mashvolume);
            adjSO4 = adjSO4 + ((147.4 * input.CaSO4) / mashvolume)
        }
        if (input.CaCl2 > 0) {
            adjCa = adjCa + ((72 * input.CaCl2) / mashvolume);
            adjCl = adjCl + ((127 * input.CaCl2) / mashvolume)
        }
        if (input.MgSO4 > 0) {
            adjMg = adjMg + ((26 * input.MgSO4) / mashvolume);
            adjSO4 = adjSO4 + ((103 * input.MgSO4) / mashvolume)
        }
        if (input.NaCl > 0) {
            adjNa = adjNa + ((104 * input.NaCl) / mashvolume);
            adjCl = adjCl + ((160 * input.NaCl) / mashvolume)
        }
        output.salts[0] = rounddecimal(adjCa, 0);
        output.salts[1] = rounddecimal(adjMg, 0);
        output.salts[2] = rounddecimal(adjSO4, 0);
        output.salts[3] = rounddecimal(adjNa, 0);
        output.salts[4] = rounddecimal(adjCl, 0);
        output.salts[5] = rounddecimal(adjHCO3, 0);
        output.salts[6] = rounddecimal((adjHCO3 * (50 / 61)), 0);
        output.accuracy = {
            value: 0,
            allin: true
        };
        for (i = 0; i <= 5; i++) {
            var resultinglevel = rounddecimal(parseFloat(rounddecimal(output.diff[i], 10)) + parseFloat(rounddecimal(output.salts[i], 10)), 0);
            output.result[i] = {
                value: resultinglevel,
                range: true
            };
            output.adjusted[i] = rounddecimal(parseFloat(rounddecimal(output.diluted[i], 10)) + parseFloat(rounddecimal(output.salts[i], 10)), 0);
            output.result[i].range = !(resultinglevel < -20 || resultinglevel > 20);
            output.accuracy.value += Math.abs(resultinglevel);
            output.accuracy.allin = output.accuracy.allin && output.result[i].range;
        }
        output.adjusted[6] = rounddecimal((rounddecimal(output.adjusted[5], 10) * (50 / 61)), 0);
        output.result[6] = {
            value: rounddecimal((rounddecimal(output.result[5].value, 10) * (50 / 61)), 0),
            range: true
        };
        output.accuracy.distance = bfUtil.distance(output.adjusted,input.target);
        output.accuracy.value += Math.abs(output.result[6].value);
        var CaValue = rounddecimal(output.adjusted[0], 10);
        if (CaValue < 50) {
            output.Ca_balance = Balance.LOW;
        }
        if (CaValue >= 50 && CaValue <= 150) {
            output.Ca_balance = Balance.NORMAL;
        }
        if (CaValue > 150) {
            output.Ca_balance = Balance.HIGH;
        }
        if (CaValue > 250) {
            output.Ca_balance = Balance.HARMFUL;
        }
        var MgValue = rounddecimal(output.adjusted[1], 10);
        if (MgValue >= 0 && MgValue <= 30) {
            output.Mg_balance = Balance.NORMAL;
        }
        if (MgValue > 30) {
            output.Mg_balance = Balance.HIGH;
        }
        if (MgValue > 50) {
            output.Mg_balance = Balance.HARMFUL;
        }
        var SO4Value = rounddecimal(output.adjusted[2], 10);
        if (SO4Value < 50) {
            output.SO4_balance = Balance.LOW;
        }
        if (SO4Value >= 50 && SO4Value <= 150) {
            output.SO4_balance = Balance.NORMAL;
        }
        if (SO4Value > 150 && SO4Value <= 350) {
            output.SO4_balance = Balance.NORMAL;
        }
        if (SO4Value > 350) {
            output.SO4_balance = Balance.HIGH;
        }
        if (SO4Value > 750) {
            output.SO4_balance = Balance.HARMFUL;
        }
        var NaValue = rounddecimal(output.adjusted[3], 10);
        if (NaValue >= 0 && NaValue <= 150) {
            output.Na_balance = Balance.NORMAL;
        }
        if (NaValue > 150) {
            output.Na_balance = Balance.HIGH;
        }
        if (NaValue > 200) {
            output.Na_balance = Balance.HARMFUL;
        }
        var ClValue = rounddecimal(output.adjusted[4], 10);
        if (ClValue >= 0 && ClValue <= 250) {
            output.Cl_balance = Balance.NORMAL;
        }
        if (ClValue > 250) {
            output.Cl_balance = Balance.HIGH;
        }
        if (ClValue > 300) {
            output.Cl_balance = Balance.HARMFUL;
        }
        if (ClValue <= 0) {
            ClValue = 1
        }
        var SO4Clratio = SO4Value / ClValue;
        if (SO4Clratio > 0 && SO4Clratio <= 0.5) {
            output.SO4Cl_balance = Ratio.HIGHLY_MALTY;
        }
        if (SO4Clratio > 0.5 && SO4Clratio <= 0.7) {
            output.SO4Cl_balance = Ratio.MALTY;
        }
        if (SO4Clratio > 0.7 && SO4Clratio <= 1.3) {
            output.SO4Cl_balance = Ratio.BALANCE;
        }
        if (SO4Clratio > 1.3 && SO4Clratio <= 2) {
            output.SO4Cl_balance = Ratio.BITTER;
        }
        if (SO4Clratio > 2) {
            output.SO4Cl_balance = Ratio.HIGHLY_BITTER;
        }
        if (ClValue <= 5 && SO4Value <= 5) {
            output.SO4Cl_balance = Ratio.LOW_VALUES;
        }
        var AlkalinityValue = rounddecimal(output.adjusted[6], 10);
        if (AlkalinityValue >= 0 && AlkalinityValue <= 50) {
            output.Alkalinity_balance = Alkalinity.PALE;
        }
        if (AlkalinityValue > 50 && AlkalinityValue <= 150) {
            output.Alkalinity_balance = Alkalinity.AMBER;
        }
        if (AlkalinityValue > 150 && AlkalinityValue <= 300) {
            output.Alkalinity_balance = Alkalinity.DARK;
        }
        if (AlkalinityValue > 300) {
            output.Alkalinity_balance = Alkalinity.HIGH;
        }
    }

    function dummyOutput() {
        return {
            diluted: new Array(6),
            diff: new Array(6),
            salts: new Array(6),
            result: new Array(6),
            adjusted: new Array(6)
        };
    }

    function suggest(input, output) {
        var best = {
            CaCO3: 0,
            lastCaCO3: 0,
            NaHCO3: 0,
            lastNaHCO3: 0,
            CaSO4: 0,
            lastCaSO4: 0,
            CaCl2: 0,
            lastCaCl2: 0,
            MgSO4: 0,
            lastMgSO4: 0,
            NaCl: 0,
            lastNaCl: 0,
            distance: 10000,
            calculations: 0
        };

        function setBest(input, output) {
            best.CaCO3= input.CaCO3;
            best.NaHCO3= input.NaHCO3;
            best.CaSO4= input.CaSO4;
            best.CaCl2= input.CaCl2;
            best.MgSO4= input.MgSO4;
            best.NaCl= input.NaCl;
            best.distance = output.accuracy.distance;
        }

        best.lastCaCO3 = 10000;
        for ( input.CaCO3=0; input.CaCO3<1000; input.CaCO3++ ) {
            best.lastNaHCO3 = 10000
            for ( input.NaHCO3=0; input.NaHCO3<1000; input.NaHCO3++ ) {
                best.lastCaSO4 = 10000;
                for ( input.CaSO4=0; input.CaSO4<1000; input.CaSO4++ ) {
                    best.lastCaCl2 = 10000;
                    for ( input.CaCl2=0; input.CaCl2<1000; input.CaCl2++ ) {
                        best.lastMgSO4 = 10000;
                        for ( input.MgSO4=0; input.MgSO4<1000; input.MgSO4++ ) {
                            best.lastNaCl = 10000;
                            for ( input.NaCl=0; input.NaCl<1000; input.NaCl++ ) {
                                console.log('input', input.CaCO3, input.NaHCO3, input.CaSO4, input.CaCl2, input.MgSO4, input.NaCl);
                                var output = dummyOutput();
                                recalculate(input,output);
                                best.calculations++;
                                console.log('distance', output.accuracy.distance);
                                if ( output.accuracy.distance > best.lastNaCl ) {
                                    break;
                                }
                                best.lastNaCl = output.accuracy.distance;

                                if ( output.accuracy.distance<best.distance ) {
                                    setBest(input, output);
                                }
                            }
                            if ( best.lastNaCl > best.lastMgSO4 ) {
                                break;
                            }
                            best.lastMgSO4 = best.lastNaCl;
                        }
                        if ( best.lastMgSO4 > best.lastCaCl2 ) {
                            break;
                        }
                        best.lastCaCl2 = best.lastMgSO4;
                    }
                    if ( best.lastCaCl2 > best.lastCaSO4 ) {
                        break;
                    }
                    best.lastCaSO4 = best.lastCaCl2;
                }
                if ( best.lastCaSO4 > best.lastNaHCO3 ) {
                    break;
                }
                best.lastNaHCO3 = best.lastCaSO4;
            }
            if ( best.lastNaHCO3 > best.lastCaCO3 ) {
                break;
            }
            best.lastCaCO3 = best.lastNaHCO3;
        }
        return best;
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }


    var Balance = {
        LOW: 'LOW',
        HIGH: 'HIGH',
        NORMAL: 'NORMAL',
        HARMFUL: 'HARMFUL'
    };

    var Ratio = {
        HIGHLY_MALTY: 'HIGHLY_MALTY',
        MALTY: 'MALTY',
        BALANCE: 'BALANCE',
        BITTER: 'BITTER',
        HIGHLY_BITTER: 'HIGHLY_BITTER',
        LOW_VALUES: 'LOW_VALUES'
    };

    var Alkalinity = {
        PALE: 'PALE',
        AMBER: 'AMBER',
        DARK: 'DARK',
        HIGH: 'HIGH'
    };

    exports.recalculate = recalculate;
    exports.rounddecimal = rounddecimal;
    exports.Balance = Balance;
    exports.Ratio = Ratio;
    exports.Alkalinity = Alkalinity;
    exports.suggest = suggest;


})(typeof exports === 'undefined'? this['bfWater'] = {} : exports );

/**
* bfUtil
*/
(function(exports){

    exports.distance = function(p1, p2) {
        // console.log('p1',p1);
        // console.log('p2',p2);
        var result = 0;
        for ( var i=0; i<p1.length; i++ ) {
            result += Math.pow(p1[i]-p2[i],2);
        }
        return exports.rounddecimal(Math.sqrt(result),2);
    };

    exports.rounddecimal = function(n, places) {
        return Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
    };

})(typeof exports === 'undefined'? this['bfUtil'] = {} : exports );


var data = angular.module('data',[]);

data.factory("HopForm",function() {
    return {
        query: function() {
            return [
                {
                    name:'Pellet',
                    utilization: 1
                },{
                    name:'Whole Leaf',
                    utilization: 0.9
                },{
                    name:'Plug',
                    utilization: 0.92
                }];
        }
    };
});

data.factory("HopUse",function() {
    return {
        query: function() {
            return [
                {
                    name:'Boil',
                    utilization: 1
                },{
                    name:'First Wort',
                    utilization: 1.1
                },{
                    name:'Dry Hop',
                    utilization: 0
                },{
                    name:'Aroma',
                    utilization: 0.5
                },{
                    name:'Mash',
                    utilization: 0.2
                }
            ];
        }
    };
});

data.factory("FermentableUses",function() {
    return {
        defaultValue: 'Mash',
        valueOf: function(name) {
            for ( var i=0; i<this.query().length; i++ ) {
                if ( name === this.query()[i].name ) {
                    return this.query()[i];
                }
            }
            return null;
        },
        query: function() {
            return [
                {
                    name:'Mash',
                    mash: true
                },{
                    name:'Recirculating',
                    mash: true
                },{
                    name:'Boil',
                    mash: false
                },{
                    name:'Fermentation',
                    mash: false
                }
            ];
        }
    };
});

data.factory("MiscType",function() {
    return {
        query: function() {
            return ['Fining',
                    'Water Agent',
                    'Spice',
                    'Other',
                    'Herb',
                    'Flavor'];
        }
    };
});

data.factory("MiscUse",function() {
    return {
        query: function() {
            return ['Boil',
                    'Mash',
                    'Licor',
                    'Primary',
                    'Secondary'];
        }
    };
});

data.factory('PitchRate', function() {
    return {
        query: function() {
            return [
                {value:0.35, name:'MFG Recomendado 0.35 (Ale, levadura fresca)'},
                {value:0.5, name:'MFG Recommendado+ 0.5 (Ale, levadura fresca)'},
                {value:0.75 , name:'Pro Brewer 0.75 (Ale)'},
                {value:1.0, name:'Pro Brewer 1.0 (Ale, Alta densidad)'},
                {value:1.25, name:'Pro Brewer 1.25 (Ale, or Alta densidad)'},
                {value:1.5, name:'Pro Brewer 1.5 (Lager)'},
                {value:1.75, name:'Pro Brewer 1.75 (Lager)'},
                {value:2.0, name:'Pro Brewer 2.0 (Lager alta densidad)'}
            ];
        }
    };
});

data.factory('State', function() {
    return {
        valueOf: function(name) {
            for ( var i=0; i<this.query().length; i++ ) {
                if ( name === this.query()[i].value ) {
                    return this.query()[i];
                }
            }
            return null;
        },
        query: function() {
            return [
                {value:'wish', name:'Deseo'},
                {value:'draft', name:'Borrador'},
                {value:'ready', name:'Lista'},
                {value:'running', name:'En Curso'},
                {value:'finished', name:'Finalizada'},
                {value:'archived', name:'Archivada'}
            ];
        }
    };
});

(function() {

	var settings = angular.module("settings", []);

    settings.controller("SettingsWaterDetailCtrl", function($scope,WaterReport,$routeParams,$rootScope,alertFactory,$location) {

        $rootScope.$watch('user',function(user) {
            if ( !user) return;
            if ($routeParams.waterId) {
                console.log("INFO", "Edit Water report");
                $scope.water = WaterReport.get({_id: $routeParams.waterId});
            } else {
                console.log("INFO", "New Water report");
                $scope.water = new WaterReport({
                    date: new Date(),
                    name: 'Mi Reporte de agua',
                    owner: $scope.user._id,
                    cations: {},
                    anions: {}
                });
            }
        });

		$scope.canEdit = function() {
			return $rootScope.user && $rootScope.user._id === $scope.water.owner;
		};

        $scope.save = function() {
            $scope.water.$save(function(saved) {
                alertFactory.create('success','Reporte de agua Guardado!');
                $location.path('/settings/water/' + saved._id)
            });
        };
    });

    settings.controller("SettingsWaterCtrl", function($scope,WaterReport,$rootScope,$timeout) {
        $rootScope.$watch('user',function(user) {
            if (user) {
                $scope.reports = WaterReport.query();
            }
        });


        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Agua'
        }];

        $scope.removeReport = function(report) {
            $('#confirmation'+report._id).modal('hide');
            $timeout(function() {
                report.$remove(function() {
                    $scope.reports = WaterReport.query();
                });
            },500);
        };
    });

	settings.controller("UserSettingsCtrl",function($scope,User,$rootScope,PitchRate) {

        $rootScope.$watch('user',function(user) {
            if ( !user) return;
            $scope.user.settings.defaultValues.pitchRate = $scope.user.settings.defaultValues.pitchRate || 0.75;
        });
		
        $scope.inputType = 'password';
        $scope.toggleAccessInput = function() {
            if ( $scope.inputType === 'password' ) {
                $scope.inputType = 'text';
            } else {
                $scope.inputType = 'password';
            }
        };

        $scope.disconnectUser = function() {
            var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
                gapi.auth.getToken().access_token;
            // Realiza una solicitud GET asíncrona.
            $.ajax({
                type: 'GET',
                url: revokeUrl,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(nullResponse) {
                    $rootScope.user = undefined;
                    $scope.$apply();
                },
                error: function(e) {
                    // Gestiona el error
                    // console.log(e);
                    // Puedes indicar a los usuarios que se desconecten de forma manual si se produce un error
                    // https://plus.google.com/apps
                }
            });
        };

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Configuracion'
        }];

		$scope.pitchRates = PitchRate.query();

        $scope.notifications = [];
        $scope.save = function() {
            //$scope.user.settings.defaultValues = $scope.dv;
			$scope.user.settings.defaultValues.pitchRate = parseFloat($scope.user.settings.defaultValues.pitchRate);
            User.updateSettings($scope.user, function() {
                $scope.notifications.push({
                    type:'success',
                    title:'Configuracion guardada!',
                    text:'Tus cambios han sido guardados con exito!'
                });
            });

        };
    });


    settings.controller("SettingsTabCtrl",function($scope) {
        $scope.sortTabs = ['data'];
        $scope.tabs = {
            data: {
                title: 'Datos',
                template: 'data'
            },
            water: {
                title: 'Ajuste Agua',
                template: 'water'
            }
        };

        $scope.selectedTab = 'data';

        $scope.changeTab = function(tab) {
            $scope.selectedTab=tab;
            $scope.$parent.notifications = [];
        };
    });

})();

(function() {
    var water = angular.module('water',['helper']);

    water.directive("waterReport", function() {
      return {
          restrict:'AE',
          scope : {
              water: '&'
          },
          templateUrl: "partial/water/water-report.html",
          controller: function($scope, BrewCalc, $rootScope) {

            $scope.canEdit = function() {
                return $rootScope.user && $rootScope.user._id === $scope.water().owner;
            };

            $scope.BrewCalc = BrewCalc;
            // $scope.totalCations = BrewCalc.totalCations;
            // $scope.totalAnions = BrewCalc.totalAnions;
            // $scope.waterBalance = BrewCalc.waterBalance;

            $scope.report={};

            //Set rows for a water report
            $scope.report.rows = [{
               cation: {
                   caption: "Calcio(Ca)",
                   name: "calcium",
                   title: "Calcium content can vary depending on the water source.  Calcium content is sometimes reported (as CaCO3) and must be converted to (ppm) by multiplying by 0.401 for use in this program.  If hardness and calcium values are provided in the water report, check the Hardness results shown below and compare to the Hardness shown in the water report.  If they don't closely agree, there may be an error in the input units. Use the calculator below to try converting the calcium concentration to the proper ppm units.  "
               },
               anion: {
                   caption: "Bicarbonato (HCO3)",
                   name: "bicarbonate",
                   title: "Bicarbonate is typically the predominant Alkalinity producer at typical drinking water pH between 6.5 and 10.5.   Bicarbonate is frequently reported (as CaCO3) units.  This must be converted to (ppm) by multiplying by 1.22 for use in this program.   If the report does not balance, check the reporting units and convert as necessary.  Check the alkalinity result below and compare to the alkalinity from the water report.  If they don't match very well, there may be a units error.  Use the calculator below.  "
               }
            },{
               cation: {
                   caption: "Magnesio (Mg)",
                   name: "magnesium",
                   title: "Magnesium is typically low in most drinking water and is almost always at lower concentration than Calcium.  Magnesium is sometimes reported (as CaCo3) and must be converted to (ppm) by multiplying by 0.243 for use in this program.  If hardness and magnesium values are given in the water report, check the Hardness results shown below and compare to the Hardness shown in the water report.  If they don't closely agree, there may be an error in the input units.  Use the calculator below to try converting the magnesium concentration to proper ppm units."
               },
               anion: {
                   caption: "Carbonato (CO3)",
                   name: "carbonate",
                   title: "Most drinking water supplies typically have a pH of less than 9.  Carbonate ion does not exist in water with pH below 8 and is a minor component in water with its pH between 8 and 9.  Carbonate may be reported in (as CaCO3) units and must be converted to (ppm) by multiplying by 0.60 for use in this program.   If the water supply pH is below 9, Carbonate can be assumed to be Zero with little error.  This is a component that can be ignored if the concentration is unknown."
               }
            },{
               cation: {
                   caption: "Sodio (Na)",
                   name: "sodium",
                   title: "Sodium content in drinking water is highly variable.  Low to moderate sodium is an important factor in producing good beer.  This is a component that should not be ignored."
               },
               anion: {
                   caption: "Sulfato (SO4)",
                   name: "sulfate",
                   title: "Sulfate is an important flavor component in brewing water.  If the water report result is presented in (SO4-S) units, that value must be multiplied by 3 for use in this program.  Use the calculator."
               }
            },{
               cation: {
                   caption: "Potasion (K)",
                   name: "potassium",
                   title: "Potassium is typically low in most drinking water.  If the Potassium content is unknown, enter Zero.  This is a water component that can be ignored for most water sources."
               },
               anion: {
                   caption: "Cloruros (Cl)",
                   name: "chloride",
                   title: "Chloride is an important flavor component in brewing water.  It is not the same as Chlorine.  Do not enter Chlorine concentration here.  Chlorine is a common water disinfectant and typically ranges from about 1 to 3 ppm in most municipal water supplies.   Chloride concentration is typically much higher than that."
               }
            },{
               cation: {
                   caption: "Hierro (Fe)",
                   name: "iron",
                   title: 'Iron is typically at low concentration (<0.3 ppm) in good brewing water.  Iron greater than this concentration may be tasted in the water and beer.  If the Iron concentration is not known, enter Zero.  This is a water component that can be ignored in this input table if its concentration is not known.'
               },
               anion: {
                   caption: "Nitratos (NO3)",
                   name: "nitrate",
                   title: "Nitrate is typically low in most drinking water.  If the result is presented in (NO3-N) units, it must be multiplied by 4.43 for use in this program.  Enter Zero if this concentration is not known.  This is a component that can be ignored if its concentration is unknown. Nitrate should typically be less than 10 ppm for potable water."
               }
            },{
               cation: {},
               anion: {
                   caption: "Nitritos (NO2)",
                   name: "nitrite",
                   title: "Nitrite is typically low in most drinking water.  Enter Zero if this concentration is not known.  This is a component that can be ignored if its concentration is unknown."
               }
            },{
               cation: {},
               anion: {
                   caption: "Fluor (F)",
                   name: "fluoride",
                   title: "Fluoride is typically at low concentrations in drinking water.  Enter Zero if the concentration is not known.  This is a component that can be ignored if its concentration is unknown."
               }
            }];
          }
      };
    });
})();

(function() {
    var env = angular.module("env", []);

    env.constant("version",'1.2.0-SNAP');
    env.constant("env",'1.2.0-SNAP');
    env.constant("color",'success');


})();

// ========================================================================
//  XML.ObjTree -- XML source code from/to JavaScript object like E4X
// ========================================================================

if ( typeof(XML) == 'undefined' ) XML = function() {};

//  constructor

XML.ObjTree = function () {
    return this;
};

//  class variables

XML.ObjTree.VERSION = "0.24";

//  object prototype

XML.ObjTree.prototype.xmlDecl = '<?xml version="1.0" encoding="UTF-8" ?>\n';
XML.ObjTree.prototype.attr_prefix = '-';
XML.ObjTree.prototype.overrideMimeType = 'text/xml';

//  method: parseXML( xmlsource )

XML.ObjTree.prototype.parseXML = function ( xml ) {
    var root;
    if ( window.DOMParser ) {
        var xmldom = new DOMParser();
//      xmldom.async = false;           // DOMParser is always sync-mode
        var dom = xmldom.parseFromString( xml, "application/xml" );
        if ( ! dom ) return;
        root = dom.documentElement;
    } else if ( window.ActiveXObject ) {
        xmldom = new ActiveXObject('Microsoft.XMLDOM');
        xmldom.async = false;
        xmldom.loadXML( xml );
        root = xmldom.documentElement;
    }
    if ( ! root ) return;
    return this.parseDOM( root );
};

//  method: parseHTTP( url, options, callback )

XML.ObjTree.prototype.parseHTTP = function ( url, options, callback ) {
    var myopt = {};
    for( var key in options ) {
        myopt[key] = options[key];                  // copy object
    }
    if ( ! myopt.method ) {
        if ( typeof(myopt.postBody) == "undefined" &&
             typeof(myopt.postbody) == "undefined" &&
             typeof(myopt.parameters) == "undefined" ) {
            myopt.method = "get";
        } else {
            myopt.method = "post";
        }
    }
    if ( callback ) {
        myopt.asynchronous = true;                  // async-mode
        var __this = this;
        var __func = callback;
        var __save = myopt.onComplete;
        myopt.onComplete = function ( trans ) {
            var tree;
            if ( trans && trans.responseXML && trans.responseXML.documentElement ) {
                tree = __this.parseDOM( trans.responseXML.documentElement );
            } else if ( trans && trans.responseText ) {
                tree = __this.parseXML( trans.responseText );
            }
            __func( tree, trans );
            if ( __save ) __save( trans );
        };
    } else {
        myopt.asynchronous = false;                 // sync-mode
    }
    var trans;
    if ( typeof(HTTP) != "undefined" && HTTP.Request ) {
        myopt.uri = url;
        var req = new HTTP.Request( myopt );        // JSAN
        if ( req ) trans = req.transport;
    } else if ( typeof(Ajax) != "undefined" && Ajax.Request ) {
        var req = new Ajax.Request( url, myopt );   // ptorotype.js
        if ( req ) trans = req.transport;
    }
//  if ( trans && typeof(trans.overrideMimeType) != "undefined" ) {
//      trans.overrideMimeType( this.overrideMimeType );
//  }
    if ( callback ) return trans;
    if ( trans && trans.responseXML && trans.responseXML.documentElement ) {
        return this.parseDOM( trans.responseXML.documentElement );
    } else if ( trans && trans.responseText ) {
        return this.parseXML( trans.responseText );
    }
}

//  method: parseDOM( documentroot )

XML.ObjTree.prototype.parseDOM = function ( root ) {
    if ( ! root ) return;

    this.__force_array = {};
    if ( this.force_array ) {
        for( var i=0; i<this.force_array.length; i++ ) {
            this.__force_array[this.force_array[i]] = 1;
        }
    }

    var json = this.parseElement( root );   // parse root node
    if ( this.__force_array[root.nodeName] ) {
        json = [ json ];
    }
    if ( root.nodeType != 11 ) {            // DOCUMENT_FRAGMENT_NODE
        var tmp = {};
        tmp[root.nodeName] = json;          // root nodeName
        json = tmp;
    }
    return json;
};

//  method: parseElement( element )

XML.ObjTree.prototype.parseElement = function ( elem ) {
    //  COMMENT_NODE
    if ( elem.nodeType == 7 ) {
        return;
    }

    //  TEXT_NODE CDATA_SECTION_NODE
    if ( elem.nodeType == 3 || elem.nodeType == 4 ) {
        var bool = elem.nodeValue.match( /[^\x00-\x20]/ );
        if ( bool == null ) return;     // ignore white spaces
        return elem.nodeValue;
    }

    var retval;
    var cnt = {};

    //  parse attributes
    if ( elem.attributes && elem.attributes.length ) {
        retval = {};
        for ( var i=0; i<elem.attributes.length; i++ ) {
            var key = elem.attributes[i].nodeName;
            if ( typeof(key) != "string" ) continue;
            var val = elem.attributes[i].nodeValue;
            if ( ! val ) continue;
            key = this.attr_prefix + key;
            if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
            cnt[key] ++;
            this.addNode( retval, key, cnt[key], val );
        }
    }

    //  parse child nodes (recursive)
    if ( elem.childNodes && elem.childNodes.length ) {
        var textonly = true;
        if ( retval ) textonly = false;        // some attributes exists
        for ( var i=0; i<elem.childNodes.length && textonly; i++ ) {
            var ntype = elem.childNodes[i].nodeType;
            if ( ntype == 3 || ntype == 4 ) continue;
            textonly = false;
        }
        if ( textonly ) {
            if ( ! retval ) retval = "";
            for ( var i=0; i<elem.childNodes.length; i++ ) {
                retval += elem.childNodes[i].nodeValue;
            }
        } else {
            if ( ! retval ) retval = {};
            for ( var i=0; i<elem.childNodes.length; i++ ) {
                var key = elem.childNodes[i].nodeName;
                if ( typeof(key) != "string" ) continue;
                var val = this.parseElement( elem.childNodes[i] );
                if ( ! val ) continue;
                if ( typeof(cnt[key]) == "undefined" ) cnt[key] = 0;
                cnt[key] ++;
                this.addNode( retval, key, cnt[key], val );
            }
        }
    }
    return retval;
};

//  method: addNode( hash, key, count, value )

XML.ObjTree.prototype.addNode = function ( hash, key, cnts, val ) {
    if ( this.__force_array[key] ) {
        if ( cnts == 1 ) hash[key] = [];
        hash[key][hash[key].length] = val;      // push
    } else if ( cnts == 1 ) {                   // 1st sibling
        hash[key] = val;
    } else if ( cnts == 2 ) {                   // 2nd sibling
        hash[key] = [ hash[key], val ];
    } else {                                    // 3rd sibling and more
        hash[key][hash[key].length] = val;
    }
};

//  method: writeXML( tree )

XML.ObjTree.prototype.writeXML = function ( tree ) {
    var xml = this.hash_to_xml( null, tree );
    return this.xmlDecl + xml;
};

//  method: hash_to_xml( tagName, tree )

XML.ObjTree.prototype.hash_to_xml = function ( name, tree ) {
    var elem = [];
    var attr = [];
    for( var key in tree ) {
        if ( ! tree.hasOwnProperty(key) ) continue;
        var val = tree[key];
        if ( key.charAt(0) != this.attr_prefix ) {
            if ( typeof(val) == "undefined" || val == null ) {
                elem[elem.length] = "<"+key+" />";
            } else if ( typeof(val) == "object" && val.constructor == Array ) {
                elem[elem.length] = this.array_to_xml( key, val );
            } else if ( typeof(val) == "object" ) {
                elem[elem.length] = this.hash_to_xml( key, val );
            } else {
                elem[elem.length] = this.scalar_to_xml( key, val );
            }
        } else {
            attr[attr.length] = " "+(key.substring(1))+'="'+(this.xml_escape( val ))+'"';
        }
    }
    var jattr = attr.join("");
    var jelem = elem.join("");
    if ( typeof(name) == "undefined" || name == null ) {
        // no tag
    } else if ( elem.length > 0 ) {
        if ( jelem.match( /\n/ )) {
            jelem = "<"+name+jattr+">\n"+jelem+"</"+name+">\n";
        } else {
            jelem = "<"+name+jattr+">"  +jelem+"</"+name+">\n";
        }
    } else {
        jelem = "<"+name+jattr+" />\n";
    }
    return jelem;
};

//  method: array_to_xml( tagName, array )

XML.ObjTree.prototype.array_to_xml = function ( name, array ) {
    var out = [];
    for( var i=0; i<array.length; i++ ) {
        var val = array[i];
        if ( typeof(val) == "undefined" || val == null ) {
            out[out.length] = "<"+name+" />";
        } else if ( typeof(val) == "object" && val.constructor == Array ) {
            out[out.length] = this.array_to_xml( name, val );
        } else if ( typeof(val) == "object" ) {
            out[out.length] = this.hash_to_xml( name, val );
        } else {
            out[out.length] = this.scalar_to_xml( name, val );
        }
    }
    return out.join("");
};

//  method: scalar_to_xml( tagName, text )

XML.ObjTree.prototype.scalar_to_xml = function ( name, text ) {
    if ( name == "#text" ) {
        return this.xml_escape(text);
    } else {
        return "<"+name+">"+this.xml_escape(text)+"</"+name+">\n";
    }
};

//  method: xml_escape( text )

XML.ObjTree.prototype.xml_escape = function ( text ) {
    return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
};

/*
// ========================================================================

=head1 NAME

XML.ObjTree -- XML source code from/to JavaScript object like E4X

=head1 SYNOPSIS

    var xotree = new XML.ObjTree();
    var tree1 = {
        root: {
            node: "Hello, World!"
        }
    };
    var xml1 = xotree.writeXML( tree1 );        // object tree to XML source
    alert( "xml1: "+xml1 );

    var xml2 = '<?xml version="1.0"?><response><error>0</error></response>';
    var tree2 = xotree.parseXML( xml2 );        // XML source to object tree
    alert( "error: "+tree2.response.error );

=head1 DESCRIPTION

XML.ObjTree class is a parser/generater between XML source code
and JavaScript object like E4X, ECMAScript for XML.
This is a JavaScript version of the XML::TreePP module for Perl.
This also works as a wrapper for XMLHTTPRequest and successor to JKL.ParseXML class
when this is used with prototype.js or JSAN's HTTP.Request class.

=head2 JavaScript object tree format

A sample XML source:

    <?xml version="1.0" encoding="UTF-8"?>
    <family name="Kawasaki">
        <father>Yasuhisa</father>
        <mother>Chizuko</mother>
        <children>
            <girl>Shiori</girl>
            <boy>Yusuke</boy>
            <boy>Kairi</boy>
        </children>
    </family>

Its JavaScript object tree like JSON/E4X:

    {
        'family': {
            '-name':    'Kawasaki',
            'father':   'Yasuhisa',
            'mother':   'Chizuko',
            'children': {
                'girl': 'Shiori'
                'boy': [
                    'Yusuke',
                    'Kairi'
                ]
            }
        }
    };

Each elements are parsed into objects:

    tree.family.father;             # the father's given name.

Prefix '-' is inserted before every attributes' name.

    tree.family["-name"];           # this family's family name

A array is used because this family has two boys.

    tree.family.children.boy[0];    # first boy's name
    tree.family.children.boy[1];    # second boy's name
    tree.family.children.girl;      # (girl has no other sisiters)

=head1 METHODS

=head2 xotree = new XML.ObjTree()

This constructor method returns a new XML.ObjTree object.

=head2 xotree.force_array = [ "rdf:li", "item", "-xmlns" ];

This property allows you to specify a list of element names
which should always be forced into an array representation.
The default value is null, it means that context of the elements
will determine to make array or to keep it scalar.

=head2 xotree.attr_prefix = '@';

This property allows you to specify a prefix character which is
inserted before each attribute names.
Instead of default prefix '-', E4X-style prefix '@' is also available.
The default character is '-'.
Or set '@' to access attribute values like E4X, ECMAScript for XML.
The length of attr_prefix must be just one character and not be empty.

=head2 xotree.xmlDecl = '';

This library generates an XML declaration on writing an XML code per default.
This property forces to change or leave it empty.

=head2 tree = xotree.parseXML( xmlsrc );

This method loads an XML document using the supplied string
and returns its JavaScript object converted.

=head2 tree = xotree.parseDOM( domnode );

This method parses a DOM tree (ex. responseXML.documentElement)
and returns its JavaScript object converted.

=head2 tree = xotree.parseHTTP( url, options );

This method loads a XML file from remote web server
and returns its JavaScript object converted.
XMLHTTPRequest's synchronous mode is always used.
This mode blocks the process until the response is completed.

First argument is a XML file's URL
which must exist in the same domain as parent HTML file's.
Cross-domain loading is not available for security reasons.

Second argument is options' object which can contains some parameters:
method, postBody, parameters, onLoading, etc.

This method requires JSAN's L<HTTP.Request> class or prototype.js's Ajax.Request class.

=head2 xotree.parseHTTP( url, options, callback );

If a callback function is set as third argument,
XMLHTTPRequest's asynchronous mode is used.

This mode calls a callback function with XML file's JavaScript object converted
after the response is completed.

=head2 xmlsrc = xotree.writeXML( tree );

This method parses a JavaScript object tree
and returns its XML source generated.

=head1 EXAMPLES

=head2 Text node and attributes

If a element has both of a text node and attributes
or both of a text node and other child nodes,
text node's value is moved to a special node named "#text".

    var xotree = new XML.ObjTree();
    var xmlsrc = '<span class="author">Kawasaki Yusuke</span>';
    var tree = xotree.parseXML( xmlsrc );
    var class = tree.span["-class"];        # attribute
    var name  = tree.span["#text"];         # text node

=head2 parseHTTP() method with HTTP-GET and sync-mode

HTTP/Request.js or prototype.js must be loaded before calling this method.

    var xotree = new XML.ObjTree();
    var url = "http://example.com/index.html";
    var tree = xotree.parseHTTP( url );
    xotree.attr_prefix = '@';                   // E4X-style
    alert( tree.html["@lang"] );

This code shows C<lang=""> attribute from a X-HTML source code.

=head2 parseHTTP() method with HTTP-POST and async-mode

Third argument is a callback function which is called on onComplete.

    var xotree = new XML.ObjTree();
    var url = "http://example.com/mt-tb.cgi";
    var opts = {
        postBody:   "title=...&excerpt=...&url=...&blog_name=..."
    };
    var func = function ( tree ) {
        alert( tree.response.error );
    };
    xotree.parseHTTP( url, opts, func );

This code send a trackback ping and shows its response code.

=head2 Simple RSS reader

This is a RSS reader which loads RDF file and displays all items.

    var xotree = new XML.ObjTree();
    xotree.force_array = [ "rdf:li", "item" ];
    var url = "http://example.com/news-rdf.xml";
    var func = function( tree ) {
        var elem = document.getElementById("rss_here");
        for( var i=0; i<tree["rdf:RDF"].item.length; i++ ) {
            var divtag = document.createElement( "div" );
            var atag = document.createElement( "a" );
            atag.href = tree["rdf:RDF"].item[i].link;
            var title = tree["rdf:RDF"].item[i].title;
            var tnode = document.createTextNode( title );
            atag.appendChild( tnode );
            divtag.appendChild( atag );
            elem.appendChild( divtag );
        }
    };
    xotree.parseHTTP( url, {}, func );

=head2  XML-RPC using writeXML, prototype.js and parseDOM

If you wish to use prototype.js's Ajax.Request class by yourself:

    var xotree = new XML.ObjTree();
    var reqtree = {
        methodCall: {
            methodName: "weblogUpdates.ping",
            params: {
                param: [
                    { value: "Kawa.net xp top page" },  // 1st param
                    { value: "http://www.kawa.net/" }   // 2nd param
                ]
            }
        }
    };
    var reqxml = xotree.writeXML( reqtree );       // JS-Object to XML code
    var url = "http://example.com/xmlrpc";
    var func = function( req ) {
        var resdom = req.responseXML.documentElement;
        xotree.force_array = [ "member" ];
        var restree = xotree.parseDOM( resdom );   // XML-DOM to JS-Object
        alert( restree.methodResponse.params.param.value.struct.member[0].value.string );
    };
    var opt = {
        method:         "post",
        postBody:       reqxml,
        asynchronous:   true,
        onComplete:     func
    };
    new Ajax.Request( url, opt );

=head1 AUTHOR

Yusuke Kawasaki http://www.kawa.net/

=head1 COPYRIGHT AND LICENSE

Copyright (c) 2005-2006 Yusuke Kawasaki. All rights reserved.
This program is free software; you can redistribute it and/or
modify it under the Artistic license. Or whatever license I choose,
which I will do instead of keeping this documentation like it is.

=cut
// ========================================================================
*/

(function() {

    var gt = angular.module('gt.abm',[]);

    gt.constant("PAGE_SIZE",10);

    function getValue(entity,field) {
        var value;
        if ( field.indexOf(".") != -1 ) {
            var chain = field.split(".");

            for ( var i=0; i<chain.length; i++) {
                if (entity) {
                    entity = entity[chain[i]];
                }
            }
            value = entity||'-';
        } else {
            value = entity[field];
        }
        return value;
    }

    gt.filter("pageFilter",function(PAGE_SIZE) {
        return function(rows,page,pageSize) {
            var from = (page-1)*(pageSize||PAGE_SIZE);
            var to = from + (pageSize||PAGE_SIZE);
            return rows.slice(from,to);
        };
    });

    function convert(value,ic) {
        if (ic) {
            return value.toLowerCase();
        } else {
            return value;
        }
    }

    var fixedFilters = {
        equal: function(fieldName,value,ic) {
            return function(item) {
                return convert(getValue(item,fieldName),ic) == convert(value,ic) ? 0 : -1;
            };
        },
        like: function(fieldName,value,ic) {
            return function(item) {
                var patt = new RegExp(".*"+convert(value,ic)+".*");

                return patt.exec(convert(getValue(item,fieldName),ic)) != null ? 0 : -1;
            };
        },
        searchIn: function(fieldName,value,ic,type) {
            return function(item) {
                if ( !type || type == 'value') {
                    return value.indexOf(getValue(item,fieldName)) != -1  ? 0 : -1;
                } else {
                    var list = getValue(item,fieldName);
                    var ret = 0;
                    angular.forEach(value,function(l) {
                        if ( list.indexOf(l) == -1 ) {
                            ret = -1;
                        }
                    });
                    return ret;
                }

            };
        }
    };

    gt.filter("textFilter", function($filter,$timeout) {
        return function(rows, criteria) {
            return $filter('filter')(rows,criteria);
        };
    });

    gt.filter("advanced",function() {
        return function(rows,filterData) {
            if ( !rows) return rows;

            if (!filterData) {
                return rows;
            } else {
                var filters = [];
                angular.forEach(filterData,function(filter,field){
                    if (filter.type != 'list' && filter.value || (filter.type == 'list' && filter.value && filter.value.length != 0) ) {
                        var f = fixedFilters[filter.comparator](field,filter.value,filter.ignoreCase,filter.type);
                        filters.push(f);
                    }
                });

                angular.forEach(filters,function(f) {
                    rows = util.Arrays.filter(rows,f);
                });
                return rows;
            }

        };
    });

    // var templateDir = "abm";

    gt.run(function($templateCache,abm) {
        $templateCache.put(abm.templateDir +"/abm-checkbox.html",
            '<div class="checkbox" style="margin-bottom: 0;">'+
                '<input type="checkbox" ng-model="value[header.field]" />'+
            '</div>');
        $templateCache.put(abm.templateDir +"/abm-value.html",'<span ng-class="header.class(row)">{{getValue(row,header)}}</span>');
        $templateCache.put(abm.templateDir +"/abm-link.html",
            '<a href="{{header.href(row)}}" ng-class="header.class(row)">' +
                '{{getValue(row,header)}}' +
            '</a>');
    });

    gt.directive('gtTable', function($compile, $rootScope, sortData, PAGE_SIZE, abm) {
        return {
            restrict : 'EA',
            replace : true,
            scope : {
                config: '&',
                entity: '&',
                canRemove: '=',
                canEdit: '=',
                canAdd: '=',
                context: '&',
                filterData: '=',
                searchCriteria: '=?'
            },
            templateUrl: abm.templateDir +'/abm.html',
            link : function(scope, element, attrs) {

            },
            controller: function($scope,$timeout) {

                $scope.emptyResultText = $scope.config().emptyResultText || "La busqueda no ha devuelto ningun resultado";

                $scope.searchCriteria = $scope.searchCriteria || "";
                $scope._searchCriteria = $scope.searchCriteria;

                var activeTimeout = null;

                $scope.search = function() {
                    if ( activeTimeout ) $timeout.cancel(activeTimeout);
                    activeTimeout = $timeout(function() {
                        $scope.searchCriteria = $scope._searchCriteria;
                    },500);
                };

                $scope.clearSearch = function() {
                    $scope.searchCriteria = ""
                    $scope._searchCriteria = "";
                };

                $scope.sort = sortData($scope.config().orderBy,$scope.config().orderDir||"",$scope.config().sort);

                $scope.getActiveClass = function(tab) {
                    if (tab == $scope.entity()) {
                        return 'active';
                    } else {
                        return '';
                    }
                };

                $scope.urlTemplate = function(filter) {
                    return abm.templateDir + '/abm-filter-' + filter.type + ".html";
                };

                $scope.getHeaderStyle = function(header) {
                    var style = header.headerStyle || {};
                    if ( header.width ) {
                        style.width= header.width;
                    }
                    return style;
                };

                $scope.addNew = function() {
                    $scope.rows.push({_draft:true});
                    $scope.page = $scope.getPageCount($scope.rows.length);
                };

                $scope.edit_id = null;

                $scope.isEditing = function(row) {
                    return row._id == $scope.edit_id;
                };


                $scope.valueTemplate = function(row,header) {
                    if ( $scope.isEditing(row) && !header.readonly) {
                        if ( !header.type || header.type == 'text' || header.type == 'number'  ) {
                            return abm.templateDir + '/abm-input.html';
                        } else if ( header.type == 'checkbox' ) {
                            return abm.templateDir + '/abm-checkbox.html';
                        } else if ( header.type == 'combo' ) {
                            return abm.templateDir + '/abm-combo.html';
                        } else if ( header.type == 'combo-object' ) {
                            return abm.templateDir + '/abm-combo-object.html';
                        } else {
                            return abm.templateDir + '/abm-input.html';
                        }
                    } else if (header.valueTemplateUrl) {
                        return header.valueTemplateUrl;
                    } else if ( header.type == 'checkbox' ) {
                        return abm.templateDir + '/abm-value-checkbox.html';
                    } else if ( header.type == 'link' ) {
                        return abm.templateDir + '/abm-link.html';
                    } else {
                        return abm.templateDir + '/abm-value.html';
                    }
                };

                $scope.edit = function(row) {
                    $scope.edit_id = row._id;
                };

                $scope.copy = function(row) {
                    return angular.copy(row);
                };

                $scope.getValue = function(entity,header) {
                    var value;
                    if ( header.field.indexOf(".") != -1 ) {
                        var chain = header.field.split(".");

                        for ( var i=0; i<chain.length; i++) {
                            if (entity) {
                                entity = entity[chain[i]];
                            }
                        }
                        value = entity||'-';
                    } else {
                        value = entity[header.field];
                    }
                    if ( header.format ) {
                        return header.format(value);
                    } else {
                        return value;
                    }
                };

                $scope.remove = function(row) {
                    var clean = function() {
                        util.Arrays.remove($scope.rows,row);
                    };
                    if (!row.$delete) {
                        $scope.config().data.remove(row,clean);
                    } else {
                        row.$delete(clean);
                    }
                };

                $scope.cancel = function (row,value) {
                    if (row._draft){
                        util.Arrays.remove($scope.rows,row);
                    } else {
                        angular.forEach($scope.config().headers,function(h) {
                            value[h.field] = row[h.field];
                        });
                    }
                    $scope.edit_id = null;
                };

                $scope.save = function(value,row) {
                    angular.forEach($scope.config().headers,function(h) {
                        row[h.field] = value[h.field];
                    });
                    if ( row._id ) {
                        if (!row.$save) {
                            $scope.config().data.save(row);
                        } else {
                            row.$save();
                        }
                        $scope.edit_id = null;
                    } else {
                        $scope.config().data.save(row, function(n) {
                            row._id = n._id;
                        });
                    }
                };

                $scope.loading = true;
                $scope.page = 1;
                $scope.rows = $scope.config().data.query(
                    $scope.config().serverFilter||{},
                    function() {
                        $scope.loading = false;
                    }
                );

                $scope.pageSize = function() {
                    return $scope.config().pageSize || PAGE_SIZE;
                };

                $scope.getPageCount = function(length) {
                    var pageSize = $scope.pageSize();
                    return Math.ceil(length/pageSize);
                };
            }
        };
    });

    gt.provider("abm", function() {
        var service = {
            templateDir: "abm"
        };

        this.setTemplateDir = function(dir) {
            service.templateDir = dir;
        };

        this.$get = function() {
            return service;
        };
    });


    gt.factory("sortData",function() {
        return function(startField, startAsc, startSort) {
            var data = {
                sort: startSort,
                asc: startAsc,
                field: startField,
                orderStyle:{},
                orderBy: function() {
                    if ( this.sort ) {
                        return this.sort;
                    } else  {
                        return this.field;
                    }
                },
                reverse: function() {
                    return this.asc || this.asc == '-';
                },
                resort: function(field, sort) {
                    if ( field == this.field) {
                        if (this.asc == '-' ) {
                            this.asc = '';
                            this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
                        } else {
                            this.asc = '-';
                            this.orderStyle[field] = 'glyphicon glyphicon-chevron-down';
                        }
                    } else {
                        angular.forEach(this.orderStyle, function(style ,key) {
                            data.orderStyle[key] = '';
                        });
                        this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
                        this.sort = sort;
                        this.field = field;
                        this.asc = '';
                    }
                }
            };
            if ( startAsc == '-') {
                data.orderStyle[startField] = 'glyphicon glyphicon-chevron-down';
            } else {
                data.orderStyle[startField] = 'glyphicon glyphicon-chevron-up';
            }

            return data;
        };
    });

})();

(function() {

	var observer = angular.module("observer", []);

    observer.run(function($location,pushListener) {
        // pushListener.socket = io.connect('http://'+$location.host());
    });

    observer.factory("pushListener", function() {
        return {
            on: function(id, callback) {
                // this.socket.on(id, callback);
            },
            off: function(id, fn) {
                // if ( fn ) {
                //     this.socket.removeListener(id,fn);
                // } else {
                //     this.socket.removeAllListeners(id);
                // }
            }
        };
    });


})();

/* JSONPath 0.8.0 - XPath for JSON
 * http://code.google.com/p/jsonpath/wiki/Javascript
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
function jsonPath(obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
} 
