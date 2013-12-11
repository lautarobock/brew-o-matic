
var data = angular.module('data',[]);

data.factory("HopForm",function() {
    return {
        query: function() {
            return [
                {
                    name:'Pellet',
                    utilization: 1
                },{
                    name:'Whole Leaf',
                    utilization: 0.9
                },{
                    name:'Plug',
                    utilization: 0.92
                }];
        }
    };
});

data.factory("HopUse",function() {
    return {
        query: function() {
            return [
                {
                    name:'Boil',
                    utilization: 1
                },{
                    name:'First Wort',
                    utilization: 1.1
                },{
                    name:'Dry Hop',
                    utilization: 0
                },{
                    name:'Aroma',
                    utilization: 0
                },{
                    name:'Mash',
                    utilization: 0.2
                }
                ];
        }
    };
});

data.factory("MiscType",function() {
    return {
        query: function() {
            return ['Fining',
                    'Water Agent',
                    'Spice',
                    'Other',
                    'Herb',
                    'Flavor'];
        }
    };
});

data.factory("MiscUse",function() {
    return {
        query: function() {
            return ['Boil',
                    'Mash',
                    'Secondary'];
        }
    };
});

