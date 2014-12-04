(function() {

    var form = angular.module("gt.form", []);

    form.run(['$templateCache',function($templateCache) {
        $templateCache.put("form/input-text.html",
            '<label tooltip="{{dlTooltip}}" tooltip-placement="right" for="{{id}}" class="control-label">{{caption}}</label>' + 
            '<input focus-on="{{id}}" type="text" ng-model="value" class="form-control" ng-class="sizeClass" id="{{id}}" placeholder="{{placeholder}}">'
        );
        
        $templateCache.put("form/input-numeric.html",
            '<label tooltip="{{dlTooltip}}" tooltip-placement="right" for="{{id}}" class="control-label">{{caption}}</label>' + 
            '<input type="number" step="{{step}}" ng-model="value" class="form-control" ng-class="sizeClass" id="{{id}}" placeholder="{{placeholder}}">'
        );
    }]);

    form.directive("dlInputText", function() {
        return {
            restrict : 'EA',
            scope : {
                id: '@',
                value: '=',
                caption: '@',
                dlTooltip: '@',
                placeholder: '@',
                size: '@?'
            },
            templateUrl: 'form/input-text.html',
            link: function(scope) {
                scope.sizeClass = '';
                if ( scope.size ) {
                    scope.sizeClass = 'input-'+scope.size;
                }
            }
        };
    });

    form.directive("dlInputNumber", function() {
        return {
            restrict : 'EA',
            scope : {
                id: '@',
                value: '=',
                caption: '@',
                step: '@',
                dlTooltip: '@',
                placeholder: '@',
                size: '@?'
            },
            templateUrl: 'form/input-numeric.html',
            link: function(scope) {
                scope.sizeClass = '';
                if ( scope.size ) {
                    scope.sizeClass = 'input-'+scope.size;
                }
            }
        };
    });


})();