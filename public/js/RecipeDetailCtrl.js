(function() {
    var index = angular.module('index');


    index.controller("RecipeTabCtrl",function($scope) {
        $scope.sortTabs = ['main','mash','boil','fermentation'];
        $scope.tabs = {
            main: {
                title: 'Recipe',
                template: 'recipe-detail-main'
            },
            mash: {
                title: 'Macerado',
                template: 'recipe-mash'
            },
            boil: {
                title: 'Hervido',
                template: 'recipe-boil'
            },
            fermentation: {
                title: 'Fermentacion',
                template: 'recipe-fermentation'
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
    
    index.controller("RecipeDetailCtrl",
                     function (
                               $scope,
                               BrewHelper,
                               Grain,
                               Hop,
                               HopUse,
                               HopForm,
                               Yeast,
                               Style,
                               Misc,
                               MiscType,
                               MiscUse,
                               $routeParams,
                               $rootScope,
                               Recipe,
                               $location) {

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Recipe'
        }];

        $scope.grains = Grain.query();

        $scope.hops = Hop.query();
        
        $scope.hopUses = HopUse.query();
        
        $scope.hopForms = HopForm.query();

        $scope.yeasts = Yeast.query();
        
        $scope.miscs = Misc.query();
        
        $scope.styles = Style.query();
        
        $scope.miscTypes = MiscType.query();
        
        $scope.miscUses = MiscUse.query();

        //Helper functions
        
        $scope.round1 = function(value) {
            return BrewHelper.round(value,10);
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
                "PERCENTAGE": 100
            });
            $scope.changeAmount();
        };

        $scope.batchSizeBlur = function() {
            if ( (!$scope.recipe.BATCH_SIZE || $scope.recipe.BATCH_SIZE == 0) && $scope.tempAmount ) {
                $scope.recipe.BATCH_SIZE = $scope.tempAmount;
            }
        };

        $scope.tempAmount = null;

        $scope.$watch("recipe.BATCH_SIZE", function(newValue,oldValue) {
            if ( !oldValue || !$scope.recipe || !$scope.recipe.FERMENTABLES ) return;
            
            if ( !newValue || newValue == 0) {
                $scope.tempAmount = oldValue;
                return;
            }
            
            if ( !$scope.recipe.fixIngredients || $scope.recipe.fixIngredients == '0' ) {
                var cohef = newValue / oldValue;
                
                //Ajusto los ingredientes antes de re-hacer los calculos
                
                //Maltas
                var newTotalAmount = $scope.recipe.totalAmount * cohef;
                angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                    f.AMOUNT = BrewHelper.round((f.PERCENTAGE/100)*newTotalAmount,1000); ;
                });
                
                //Lupulos
                var newTotalHop = $scope.recipe.totalHop * cohef;
                angular.forEach($scope.recipe.HOPS.HOP,function(hop) {
                    var percentage = $scope.hopPercentage(hop,$scope.recipe.totalHop);
                    hop.AMOUNT = BrewHelper.round((percentage/100)*newTotalHop,10000); ;
                });
            }
            $scope.changeAmount();
        });
       
        
        /**
         * si fijo la OG, al aumentar los litros debo aumentar materiales en la misma proporcion.
         */
        $scope.changeAmount = function() {
            var amount = 0;
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                amount += f.AMOUNT;
            });
            $scope.recipe.totalAmount = amount;

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
            angular.forEach($scope.recipe.FERMENTABLES.FERMENTABLE,function(f) {
                og += BrewHelper.toLbs(f.AMOUNT) * BrewHelper.toPpg(f.POTENTIAL) * ($scope.recipe.EFFICIENCY/100)
                    / BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            });
            $scope.recipe.OG = BrewHelper.toPotential(og);

            //Calculo el agua para el macerado en
            $scope.recipe.StrikeWater=BrewHelper.round($scope.recipe.WatertoGrainRatio*$scope.recipe.totalAmount,10);

            $scope.changeHop();
        };

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
            var U = BrewHelper.calculateU($scope.recipe.OG,hop.TIME);
            var baseIBU = BrewHelper.toOz(hop.AMOUNT)*hop.ALPHA*U*(7489/100)/BrewHelper.toGal($scope.recipe.BATCH_SIZE);
            //add or remove by utilization (ej: mash use 20%)
            return baseIBU * getUtilization(hop.USE,$scope.hopUses) * getUtilization(hop.FORM,$scope.hopForms);
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

        $scope.calculateSgBeforeBoil = function(BOIL_TIME, PercentEvap, OG) {
            //Porcentaje evaporado en todo el tiempo
            //TODO, esto en realidad deberia hacerse hora por hora (no es lo mismo)
            var percentageEvap = (BOIL_TIME/60)*PercentEvap/100;
            return BrewHelper.toPotential(BrewHelper.toPpg(OG) * (1-percentageEvap));
        };
        
        $scope.calculateBoilSize = function(BATCH_SIZE, TrubChillerLosses, BOIL_TIME, PercentEvap, TopUpWater) {
            var ltsAfterBoil = BATCH_SIZE/0.94+TrubChillerLosses;
            
            //Porcentaje evaporado en todo el tiempo
            //TODO, esto en realidad deberia hacerse hora por hora (no es lo mismo)
            var percentageEvap = (BOIL_TIME/60)*PercentEvap/100;
            var tuw = TopUpWater ? TopUpWater : 0;
            return ltsAfterBoil / ( 1 - percentageEvap ) + tuw;
        };
        
        $scope.save = function() {
            if ( !angular.isDefined($scope.recipe.NAME) ) {
                $scope.notifications.push({
                    type:'danger',
                    title:'Nombre obligatorio',
                    text:'La receta debe tener un nombre'
                });
            } else {
                //var recipe = new Recipe($scope.recipe);
                if (!$scope.recipe.$save) {
                    $scope.recipe = new Recipe($scope.recipe);
                }
                $scope.recipe.BOIL_SIZE = $scope.calculateBoilSize($scope.recipe.BATCH_SIZE, $scope.recipe.TrubChillerLosses, $scope.recipe.BOIL_TIME, $scope.recipe.PercentEvap, $scope.recipe.TopUpWater);
                
                $scope.recipe.$save(function(saved){
                    $scope.notifications.push({
                        type:'success',
                        title:'Receta Guardada!',
                        text:'Ya puedes acceder a esta receta desde cualquier lugar!'
                    });
                    $location.path('/recipe/edit/' + saved._id) 
                },function(error) {
                    $scope.notifications.push({
                        type:'danger',
                        title:'Error!',
                        text:error.data.error
                    });
                });
            }
        };
        
        if ( $routeParams.recipeId ) {
            $scope.recipe = Recipe.get({id:$routeParams.recipeId},function() {
                if ( $location.path().indexOf('/recipe/clone') == 0) {
                    $scope.recipe.cloneFrom = $scope.recipe._id;
                    $scope.recipe._id = undefined;
                    $scope.recipe.date = new Date();
                    $scope.recipe.starredBy = [];
                    $scope.recipe.clonedBy = [];
                    $scope.recipe.isPublic = false;
                    //Al clonar elimino los comentarios de la original
                    $scope.recipe.comments = [];
                }
                $scope.changeYeast();
                //$scope.$emit("recipeLoaded");
            });
        } else {
            $scope.recipe = new Recipe({
                "GrainCalcMethod": "2",
                fixIngredients: "1",
                date: new Date(),
                totalAmount: 0,
                totalHop: 0,
                CALCCOLOUR: 0,
                BATCH_SIZE: 20,
                EFFICIENCY: 65,
                OG: 1,
                CALCIBU: 0,
                FG: 1,
                BOIL_TIME: 90,
                GrainAbsorbtion: 0.9,
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
                        "ATTENUATION": 75
                    }]
                },
                MISCS: {
                    MISC: []
                },
                fermentation: {
                    view: 'expand',
                    stages: []
                },
                WatertoGrainRatio: 3,
                mashTemp: 66,
                lossMashTemp: 0,
                GrainTemp: 25,
                SpargeDeadSpace: 0,
                SpargeTempDesired: 75,
                TopUpWater: 0,
                PercentEvap: 10,
                TrubChillerLosses: 0
            });
            $scope.changeYeast();
        }
        
        $scope.tabLink = function(tab) {
            var base = "#/recipe/edit/" + $scope.recipe._id;
            if ( tab == 'mash') {
                return base + "/mash";
            }
            return base;
        };
        
        $scope.gravityBarValue = function(grav,max) {
            return BrewHelper.toPpg(grav) / max * 100;
        }
       
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
                        scope.recipe.BATCH_SIZE = parseFloat(scope.recipe.BATCH_SIZE);
                        scope.recipe.EFFICIENCY = parseFloat(scope.recipe.EFFICIENCY);
                        scope.recipe.OG = parseFloat(scope.recipe.OG);
                        scope.recipe.FG = parseFloat(scope.recipe.FG);
                        scope.recipe.CALCIBU = parseFloat(scope.recipe.CALCIBU);
                        scope.recipe.BOIL_SIZE = parseFloat(scope.recipe.BOIL_SIZE);
                        scope.recipe.BOIL_TIME = parseFloat(scope.recipe.BOIL_TIME);
                        scope.recipe.PRIMARY_TEMP = parseFloat(scope.recipe.PRIMARY_TEMP);
                        
                        scope.recipe.totalAmount = 0;
                        function convertFerm(ferm) {
                            ferm.AMOUNT = parseFloat(ferm.AMOUNT);
                            ferm.COLOR = parseFloat(ferm.COLOR);
                            ferm.POTENTIAL = parseFloat(ferm.POTENTIAL);
                            ferm.PERCENTAGE = parseFloat(ferm.PERCENTAGE);
                            scope.recipe.totalAmount += ferm.AMOUNT;
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
                        
                        scope.recipe.YEASTS.YEAST = [scope.recipe.YEASTS.YEAST];
                        scope.recipe.YEASTS.YEAST[0].ATTENUATION = parseFloat(scope.recipe.YEASTS.YEAST[0].ATTENUATION);
                        scope.recipe.GrainCalcMethod = '2';
                        scope.changeYeast();
                        scope.recipe.date = new Date();
                        scope.$apply();
                    };
                })(f);
                reader.readAsText(f);
            }
        };
    });
})();
