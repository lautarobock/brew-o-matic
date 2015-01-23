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
