(function() {

    var module = angular.module("brew-o-module.controller",[]);

    module.controller("RecipeMashCtrl",function($scope,BrewCalc,BrewHelper) {
        
        
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
        
        $scope.totalTime = function() {
            var time = 0;
            angular.forEach($scope.recipe.MASH.MASH_STEPS.MASH_STEP,function(step) {
                time += step.STEP_TIME;
            });
            return time;
        };
        
        $scope.spargeWater = function() {
            return $scope.totalWater()
                    -BrewCalc.actualMashVolume($scope.recipe.MASH.MASH_STEPS.MASH_STEP.length-1,
                                               0,
                                               $scope.recipe.MASH.MASH_STEPS.MASH_STEP)*2
                    -$scope.recipe.StrikeWater
                    -($scope.recipe.TopUpWater||0);
        };
        
        $scope.totalWater = function() {
            return BrewCalc
                        .calculateBoilSize($scope.recipe.BATCH_SIZE,
                                           $scope.recipe.TrubChillerLosses,
                                           $scope.recipe.BOIL_TIME,
                                           $scope.recipe.PercentEvap,
                                           $scope.recipe.TopUpWater)
                    +BrewCalc.actualMashVolume($scope.recipe.MASH.MASH_STEPS.MASH_STEP.length-1,
                                               0,
                                               $scope.recipe.MASH.MASH_STEPS.MASH_STEP)
                    +$scope.recipe.SpargeDeadSpace
                    +$scope.recipe.GrainAbsorbtion*$scope.recipe.totalAmount;
        };
        
        $scope.addWaterVol = function(STEP,$index) {
            
            //Hago los caclulos para el agregado de agua
            var ratio;
            if ( $index == 0 ) {
                ratio = $scope.recipe.WatertoGrainRatio;
            } else {
                var vol = BrewCalc.actualMashVolume($index-1,$scope.recipe.StrikeWater,$scope.recipe.MASH.MASH_STEPS.MASH_STEP);
                ratio = vol/$scope.recipe.totalAmount;
            }
            var botvol = 0.7; //Equivalente en agua del barril (absorcion de temp), por ahora desprecio y dejo en 0.
            //el otro cero es los litros perdidos debejo del FF, que deberia calcularlos antes.
            STEP.INFUSE_AMOUNT = restCalc($scope.recipe.totalAmount,ratio,0,0,STEP.STEP_TEMP,STEP.END_TEMP,STEP.INFUSE_TEMP);
            
            //Calculos para tamaño de la decoccion
            
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
                        BrewCalc.initialMashVolume($scope.recipe.StrikeWater,$scope.recipe.totalAmount),
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
    module.controller("RecipeBoilCtrl",function($scope,BrewHelper,BrewCalc) {

        $scope.calculateSgBeforeBoil = function(BOIL_TIME, PercentEvap, OG) {
            var percentageEvap = BrewCalc.evapTotal(BOIL_TIME,PercentEvap);
            return BrewHelper.toPotential(BrewHelper.toPpg(OG) * (1-percentageEvap));
        };

    });

    /**
     * TabControler
     */
    module.controller("RecipeTabCtrl",function($scope) {
        $scope.sortTabs = ['main','mash','boil','fermentation','bottling'];
        $scope.tabs = {
            main: {
                title: 'Receta',
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