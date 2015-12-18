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
								'		setTimeout(function() {' +
								'			window.close();' +
								'		},100);' +
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
								'		setTimeout(function() {' +
								'			window.close();' +
								'		},100);' +
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
