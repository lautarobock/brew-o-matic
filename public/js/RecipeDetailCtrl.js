(function() {
    var index = angular.module('index');

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

        $scope.changeHop = function() {
            var amount = 0;
            var ibu = 0;
            angular.forEach($scope.recipe.HOPS.HOP,function(hop) {
                amount += hop.AMOUNT;
                ibu += $scope.hopIBU(hop);
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

        $scope.sharedUrl = function(_id) {
            return 'http://'+$location.host() + ":" + $location.port() + '/share.html#/' + _id;
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
            } else {
                //var recipe = new Recipe($scope.recipe);
                if (!$scope.recipe.$save) {
                    $scope.recipe = new Recipe($scope.recipe);
                }
                $scope.recipe.$save(function(saved){
                    $scope.notifications.push({
                        type:'success',
                        title:'Receta Guardada!',
                        text:'Ya puedes acceder a esta receta desde cualquier lugar!'
                    });
                    $location.path('/recipe/edit/' + saved._id) 
                });                        
            }
        };
        
        if ( $routeParams.recipeId ) {
            $scope.recipe = Recipe.get({id:$routeParams.recipeId},function() {
                if ( $location.path().indexOf('/recipe/clone') == 0) {
                    $scope.recipe.cloneFrom = $scope.recipe._id;
                    $scope.recipe._id = undefined;
                    $scope.recipe.date = new Date();
                    $scope.recipe.isPublic = false;
                }
                $scope.changeYeast();
            });
        } else {
            $scope.recipe = new Recipe({
                "GrainCalcMethod": "2",
                date: new Date(),
                totalAmount: 0,
                totalHop: 0,
                CALCCOLOUR: 0,
                BATCH_SIZE: 20,
                EFFICIENCY: 65,
                OG: 1,
                CALCIBU: 0,
                FG: 1,
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
                }
            });
            $scope.changeYeast();
        }
        
        $scope.gravityBarValue = function(grav,max) {
            return BrewHelper.toPpg(grav) / max * 100;
        }
        
        
    });
})();
