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
            replace : true,
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
