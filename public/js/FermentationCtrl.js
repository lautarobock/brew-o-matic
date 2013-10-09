(function() {
    var index = angular.module('index');

    index.controller("FermentationCtrl", function($scope) {
        $scope.addFermentationStage = function() {
            $scope.recipe.fermentation.stages.push({
                title: null,
                duration: 0, 
                durationMode: 'Dias', 
                transferring: false, //In the end of stage
                losses: 0, //Litros perdidos
                temperature: null,
                temperatureEnd: null,
                action: null// 'Inoculacion', 'Dry-Hop', 'Otro'                
            });
        };

        var today = new Date();
        $scope.simulatedDate_day = today.getDate();
        $scope.simulatedDate_month = today.getMonth() + 1;
        $scope.simulatedDate_year = today.getYear() + 1900;
        
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
        
        $scope.estimateLiters = function($index) {
            var liters = $scope.recipe.BATCH_SIZE;
            for ( var i=0; i<$index; i++ ) {
                var it = $scope.recipe.fermentation.stages[i];
                if ( it.transferring ) {
                    liters -= it.losses;
                }
            }
            return liters;
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
                return {background: '#f5f5f5','border-color':'#f5f5f5'};
            }
        };

        $scope.updateChart = function() {
            var cols = [{
                    "id": "day",
                    "label": "Dias",
                    "type": "number"
                },{
                    "id": "temp",
                    "label": "Temperatura",
                    "type": "number"
                }];
            
            var rows = [];
            var day = 0;
            angular.forEach($scope.recipe.fermentation.stages,function(stage) {
                var duration = stage.duration|0;
                if ( duration != 0) {
                    if (stage.durationMode == 'Horas') {
                        duration = duration/24;
                    }
                    rows.push({
                            "c": [
                                {
                                    "v": day
                                },
                                {
                                    "v": stage.temperature|0,
                                    "f": (stage.temperature|0) + "º (Inicio: " + stage.title + ")"
                                }
                            ]
                        });
                    
                    day += duration;
                    rows.push({
                            "c": [
                                {
                                    "v": day
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
                                    "v": day
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
        
        
    });
        
})();