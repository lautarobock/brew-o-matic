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
            logType: 'SPARGE'
        }, {
            delay: 60,
            detail: 'Finalizar Lavado',
            logType: 'SPARGE'
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
