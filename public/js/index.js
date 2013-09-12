(function() {
    
    var index = angular.module('index', ['ngResource']);
    
    index.controller("ReceiptListCtrl", function ($scope) {
        
    });
 
    index.
        config(['$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/receipt', {templateUrl: 'partial/receipt-list.html',   controller: 'ReceiptListCtrl'}).
                when('/receipt/id:receiptId', {templateUrl: 'partial/receipt-detail.html', controller: 'ReceiptDetailCtrl'}).
                when('/receipt/new', {templateUrl: 'partial/receipt-detail.html', controller: 'ReceiptDetailCtrl'}).
                otherwise({redirectTo: '/receipt'});
    }]);
    
    index.controller("MainController",function($scope,Person) {
        //$scope.$on('fbdata',function(event,args) {
        //    $scope.me = Person.findByFb({fb_id:args.id});
        //});
        $scope.me = {
            name: 'Jose'
        };
    });
    

    index.controller("ReceiptDetailCtrl", function ($scope) {
        
    });
    
    index.factory('Person',function($resource) {
        return $resource('person/fb:fb_id',{fb_id:'@fb_id'}, {
            save: { method: 'PUT', params: {}},
            findByFb: {method: 'GET', params: {}, isArray:false}
        });
    });
})();