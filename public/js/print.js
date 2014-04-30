(function() {

	var print = angular.module("print", []);

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
					        mywindow.document.write('<html><head><title>my div</title>');
					        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
					        mywindow.document.write('<link rel="stylesheet" href="/css/style.css" type="text/css" />');
					        mywindow.document.write('<link rel="stylesheet" href="/css/bootstrap.min.css" type="text/css" />');
					        mywindow.document.write('<link rel="stylesheet" href="/css/bootstrap-theme.min.css" type="text/css" />');
					        mywindow.document.write('</head><body >');
					        mywindow.document.write(angular.element("#print_content").html());
					        mywindow.document.write('</body></html>');

					        mywindow.print();
					        setTimeout(function() {
					        	mywindow.close();	
					        },250);
					        
				            // $modalInstance.close();
				        };

                        $scope.recipe = recipe;
                    },
                    windowClass: 'modal-lg',
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