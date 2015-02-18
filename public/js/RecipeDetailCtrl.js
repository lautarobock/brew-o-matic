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
           FermentableUses,
           PitchRate
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
                og += BrewHelper.toLbs(f.AMOUNT) * BrewHelper.toPpg(f.POTENTIAL) * ($scope.recipe.EFFICIENCY/100)
                    / BrewHelper.toGal($scope.recipe.BATCH_SIZE);
                if ( !f.excludeIBU ) {
                    OG_exclude += BrewHelper.toLbs(f.AMOUNT) * BrewHelper.toPpg(f.POTENTIAL) * ($scope.recipe.EFFICIENCY/100)
                    / BrewHelper.toGal($scope.recipe.BATCH_SIZE);
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
                        if ( $location.path().indexOf('/recipe/clone') == 0) {
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
                        BrewCalc.fixEmptyValues($scope.recipe);

                        $scope.changeYeast();
                        //$scope.$emit("recipeLoaded");

                        $rootScope.breadcrumbs = [{
                            link: '#',
                            title: 'Home'
                        },{
                            link: '#',
                            title: 'Receta - ' + $scope.recipe.NAME
                        }];
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
                        WatertoGrainRatio: $scope.user.settings.defaultValues.WatertoGrainRatio,
                        mashTemp: $scope.user.settings.defaultValues.mashTemp,
                        lossMashTemp: $scope.user.settings.defaultValues.lossMashTemp,
                        GrainTemp: $scope.user.settings.defaultValues.GrainTemp,
                        SpargeDeadSpace: $scope.user.settings.defaultValues.SpargeDeadSpace,
                        SpargeTempDesired: $scope.user.settings.defaultValues.SpargeTempDesired,
                        TopUpWater: 0,
                        pitchRate: $scope.user.settings.defaultValues.pitchRate,
                        PercentEvap: $scope.user.settings.defaultValues.PercentEvap,
                        TrubChillerLosses: $scope.user.settings.defaultValues.TrubChillerLosses,
                        isPublic: $scope.user.settings.defaultValues.isPublic,
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
