(function() {

    var gt = angular.module('gt.abm',[]);

    gt.constant("PAGE_SIZE",10);
    
    gt.filter("pageFilter",function(PAGE_SIZE) {
        return function(rows,page) {
            var from = (page-1)*PAGE_SIZE;
            var to = from + PAGE_SIZE;
            return rows.slice(from,to);
        };
    });


    gt.directive('gtTable', function($compile, $rootScope, sortData, PAGE_SIZE) {
        return {
            restrict : 'EA',
            replace : true,
            scope : {
                config: '&',
                entity: '&'
            },
            templateUrl: 'template/abm.html',
            link : function(scope, element, attrs) {
                
            },
            controller: function($scope) {
                
                $scope.sort = sortData($scope.config().orderBy,"");
                
                $scope.getActiveClass = function(tab) {
                    if (tab == $scope.entity()) {
                        return 'active';
                    } else {
                        return '';
                    }
                };
                
                $scope.addNew = function() {
                    $scope.rows.push({_draft:true});
                    $scope.page = $scope.getPageCount($scope.rows.length);
                };
                
                $scope.edit_id = null;
                
                $scope.edit = function(row) {
                    $scope.edit_id = row._id;
                };
                
                $scope.copy = function(row) {
                    return angular.copy(row);
                };
                
                $scope.getValue = function(entity,field) {
                    if ( field.indexOf(".") != -1 ) {
                        var chain = field.split(".");
                        
                        for ( var i=0; i<chain.length; i++) {
                            entity = entity[chain[i]];
                        }
                        return entity;
                    } else {
                        return entity[field];
                    }
                };
                
                $scope.remove = function(row) {
                    var clean = function() {
                        util.Arrays.remove($scope.rows,row);
                    };
                    if (!row.$delete) {
                        $scope.config().data.delete(row,clean);
                    } else {
                        row.$delete(clean);    
                    }
                };
                
                $scope.cancel = function (row,value) {
                    if (row._draft){
                        util.Arrays.remove($scope.rows,row);
                    } else {
                        angular.forEach($scope.config().headers,function(h) {
                            value[h.field] = row[h.field];
                        });                
                    }
                    $scope.edit_id = null;
                };
                
                $scope.save = function(value,row) {
                    angular.forEach($scope.config().headers,function(h) {
                        row[h.field] = value[h.field];
                    });
                    if ( row._id ) {
                        if (!row.$save) {
                            $scope.config().data.save(row);
                        } else {
                            row.$save();    
                        }
                        $scope.edit_id = null;
                    } else {
                        $scope.config().data.save(row, function(n) {
                            row._id = n._id;
                        });
                    }
                };
        
                $scope.page = 1;
                $scope.rows = $scope.config().data.query();
                
                $scope.pageSize = function() {
                    return $scope.config().pageSize || PAGE_SIZE;
                };
                
                $scope.getPageCount = function(length) {
                    var pageSize = $scope.pageSize();
                    return Math.ceil(length/pageSize);
                };
            }
        };
    });

})();
