(function() {

    var module = angular.module("brew-o-module.controller",[]);

    module.controller("RecipeMashCtrl",function($scope,BrewCalc) {
        
        $scope.styleTitle = function(onFocus) {
            if ( onFocus ) {
                return {background: 'white','border-color':'#ccc'};
            } else {
                return {background: 'white','border-color':'white',cursor:'pointer'};
            }
        };

        /**
         * strikeTemp: temperatura del agua agregada
         * currentT: temp del grano y del agua actual.
         * 
         * addVolume: agua agregada
         * ratio: Empaste previo
         */
        $scope.addWaterVol = function(strikeTemp, currentT,$index, addVolume) {
            //volumen actual (Solo liquido)
            var currentVol = BrewCalc.actualMashVolume(
                        $index,
                        $scope.recipe.StrikeWater,
                        $scope.recipe.MASH.MASH_STEPS.MASH_STEP); 
            /*
             * temp: es la mezcla del agua agregada y la q ya tenemos
             */
            var temp = ((currentVol+addVolume)/currentVol)*(strikeTemp-currentT) + currentT;
            var ratio = (currentVol+addVolume) / $scope.recipe.totalAmount;
            return (temp-currentT)*0.417/ratio + temp;
        };
        
        function restCalc(rest) {
            weight=parseFloat(document.rest.weight.value)
            thick=parseFloat(document.rest.thick.value)
            botvol=parseFloat(document.rest.botvol.value)
            eqvol=parseFloat(document.rest.eqvol.value)
            curtemp=parseFloat(document.rest.curtemp.value)
            tartemp=parseFloat(document.rest.tartemp.value)
            boiltemp=parseFloat(document.rest.boiltemp.value)
            if (weight<=0 | isNaN(weight)) {
                alert("Grain weight must be a number greater than 0!")
                return
                }
            if (thick<=0 | isNaN(thick)) {
                alert("Mash thickness must be a number greater than 0!")
                return
                }
            if (botvol<0 | isNaN(botvol)) {
                alert("Volume below false bottom must be a number greater than or equal to 0!")
                return
                }
            if (eqvol<0 | isNaN(eqvol)) {
                alert("Mash tun equivalent water volume must be a number greater than or equal to 0!")
                return
                }
            if (curtemp<=0 | isNaN(curtemp)) {
                alert("Current temperature must be a number greater than 0!")
                return
                }
            if (tartemp<=0 | isNaN(tartemp)) {
                alert("Target temperature must be a number greater than 0!")
                return
                }
            if (boiltemp<=0 | isNaN(boiltemp)) {
                alert("Temperature of Boiling Water must be a number greater than 0!")
                return
                }
            if (curtemp>=tartemp) {
                alert("Target temperature must be greater than the current temperature.")
                return
                }
            if (curtemp>boiltemp) {
                alert("Current temperature must be lower than boiling temperature!")
                return
                }
            if (tartemp>boiltemp) {
                alert("Target temperature must be lower than boiling (temperature!")
                return
                }
            if (document.rest.measure[0].checked) {
                vol=weight*(.192+thick)+botvol+eqvol
                watvol=vol*(tartemp-curtemp)/(boiltemp-tartemp)
              document.rest.watvol.value=round(watvol,1)+" quarts"
                }
            else {
                vol=weight*(.4+thick)+botvol+eqvol
                watvol=vol*(tartemp-curtemp)/(boiltemp-tartemp)
            document.rest.watvol.value=round(watvol,1)+" liters"
                }		
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
                recirculate: recirculate
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
    module.controller("RecipeBoilCtrl",function($scope,BrewHelper) {

        $scope.calculateSgBeforeBoil = function(BOIL_TIME, PercentEvap, OG) {
            //Porcentaje evaporado en todo el tiempo
            //TODO, esto en realidad deberia hacerse hora por hora (no es lo mismo)
            var percentageEvap = (BOIL_TIME/60)*PercentEvap/100;
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