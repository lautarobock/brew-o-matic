(function() {

    var gt = angular.module('gt.abm',[]);

    gt.constant("PAGE_SIZE",10);
    
    function getValue(entity,field) {
        var value;
        if ( field.indexOf(".") != -1 ) {
            var chain = field.split(".");
            
            for ( var i=0; i<chain.length; i++) {
                if (entity) {
                    entity = entity[chain[i]];    
                }
            }
            value = entity||'-';
        } else {
            value = entity[field];
        }
        return value;
    }
    
    gt.filter("pageFilter",function(PAGE_SIZE) {
        return function(rows,page,pageSize) {
            var from = (page-1)*(pageSize||PAGE_SIZE);
            var to = from + (pageSize||PAGE_SIZE);
            return rows.slice(from,to);
        };
    });

    function convert(value,ic) {
        if (ic) {
            return value.toLowerCase();
        } else {
            return value;
        }
    }
    
    var fixedFilters = {
        equal: function(fieldName,value,ic) {
            return function(item) {
                return convert(getValue(item,fieldName),ic) == convert(value,ic) ? 0 : -1;
            };
        },
        like: function(fieldName,value,ic) {
            return function(item) {
                var patt = new RegExp(".*"+convert(value,ic)+".*");
                
                return patt.exec(convert(getValue(item,fieldName),ic)) != null ? 0 : -1;
            };
        },
        in: function(fieldName,value,ic,type) {
            return function(item) {
                if ( !type || type == 'value') {
                    return value.indexOf(getValue(item,fieldName)) != -1  ? 0 : -1;
                } else {
                    var list = getValue(item,fieldName);
                    var ret = 0;
                    angular.forEach(value,function(l) {
                        if ( list.indexOf(l) == -1 ) {
                            ret = -1;
                        }
                    });
                    return ret;
                }

            };
        }
    };
    
    gt.filter("advanced",function() {
        return function(rows,filterData) {
            if ( !rows) return rows;
            
            if (!filterData) {
                return rows;
            } else {
                var filters = [];
                angular.forEach(filterData,function(filter,field){
                    if (filter.type != 'list' && filter.value || (filter.type == 'list' && filter.value && filter.value.length != 0) ) {
                        var f = fixedFilters[filter.comparator](field,filter.value,filter.ignoreCase,filter.type);
                        filters.push(f);
                    }
                });
                
                angular.forEach(filters,function(f) {
                    rows = util.Arrays.filter(rows,f);
                });
                return rows;
            }
            
        };
    });
    
    gt.directive('gtTable', function($compile, $rootScope, sortData, PAGE_SIZE) {
        return {
            restrict : 'EA',
            replace : true,
            scope : {
                config: '&',
                entity: '&',
                canRemove: '=',
                canEdit: '=',
                canAdd: '=',
                context: '&'
            },
            templateUrl: 'template/abm.html',
            link : function(scope, element, attrs) {
                
            },
            controller: function($scope) {
                
                $scope.sort = sortData($scope.config().orderBy,$scope.config().orderDir||"");
                
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

                $scope.isEditing = function(row) {
                    return row._id == $scope.edit_id;
                };

                $scope.valueTemplate = function(row,header) {
                    if ( $scope.isEditing(row) && !header.readonly) {
                        if ( !header.type || header.type == 'text' || header.type == 'number'  ) {
                            return 'template/abm-input.html';
                        } if ( header.type == 'checkbox' ) {
                            return 'template/abm-checkbox.html';
                        } if ( header.type == 'combo' ) {
                            return 'template/abm-combo.html';
                        } else {
                            return 'template/abm-input.html';
                        }
                    } else if (header.valueTemplateUrl) {
                        return header.valueTemplateUrl;
                    } else if ( header.type == 'checkbox' ) {
                        return 'template/abm-value-checkbox.html';
                    } else {
                        return 'template/abm-value.html';
                    }
                };
                
                $scope.edit = function(row) {
                    $scope.edit_id = row._id;
                };
                
                $scope.copy = function(row) {
                    return angular.copy(row);
                };
                
                $scope.getValue = function(entity,header) {
                    var value;
                    if ( header.field.indexOf(".") != -1 ) {
                        var chain = header.field.split(".");
                        
                        for ( var i=0; i<chain.length; i++) {
                            if (entity) {
                                entity = entity[chain[i]];    
                            }
                        }
                        value = entity||'-';
                    } else {
                        value = entity[header.field];
                    }
                    if ( header.format ) {
                        return header.format(value);    
                    } else {
                        return value;    
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

    gt.factory("sortData",function() {
        return function(startField, startAsc) {
            var data = {
                asc: startAsc,
                field: startField,
                orderStyle:{},
                orderBy: function() {
                    return this.asc+this.field;
                },
                resort: function(field) {
                    if ( field == this.field) {
                        if (this.asc == '-' ) {
                            this.asc = '';
                            this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
                        } else {
                            this.asc = '-';
                            this.orderStyle[field] = 'glyphicon glyphicon-chevron-down';
                        }
                    } else {
                        angular.forEach(this.orderStyle, function(style ,key) {
                            data.orderStyle[key] = '';
                        });
                        this.orderStyle[field] = 'glyphicon glyphicon-chevron-up';
                        this.field = field;
                        this.asc = '';
                    }
                }
            };
            if ( startAsc == '-') {
                data.orderStyle[startField] = 'glyphicon glyphicon-chevron-down';
            } else {
                data.orderStyle[startField] = 'glyphicon glyphicon-chevron-up';
            }

            return data;
        };
    });

})();
