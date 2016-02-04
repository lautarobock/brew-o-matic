
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
                    utilization: 0.5
                },{
                    name:'Mash',
                    utilization: 0.2
                }
            ];
        }
    };
});

data.factory("FermentableUses",function() {
    return {
        defaultValue: 'Mash',
        valueOf: function(name) {
            for ( var i=0; i<this.query().length; i++ ) {
                if ( name === this.query()[i].name ) {
                    return this.query()[i];
                }
            }
            return null;
        },
        query: function() {
            return [
                {
                    name:'Mash',
                    mash: true
                },{
                    name:'Recirculating',
                    mash: true
                },{
                    name:'Boil',
                    mash: false
                },{
                    name:'Fermentation',
                    mash: false
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

data.factory('PitchRate', function() {
    return {
        query: function() {
            return [
                {value:0.35, name:'MFG Recomendado 0.35 (Ale, levadura fresca)'},
                {value:0.5, name:'MFG Recommendado+ 0.5 (Ale, levadura fresca)'},
                {value:0.75 , name:'Pro Brewer 0.75 (Ale)'},
                {value:1.0, name:'Pro Brewer 1.0 (Ale, Alta densidad)'},
                {value:1.25, name:'Pro Brewer 1.25 (Ale, or Alta densidad)'},
                {value:1.5, name:'Pro Brewer 1.5 (Lager)'},
                {value:1.75, name:'Pro Brewer 1.75 (Lager)'},
                {value:2.0, name:'Pro Brewer 2.0 (Lager alta densidad)'}
            ];
        }
    };
});

data.factory('State', function() {
    return {
        valueOf: function(name) {
            for ( var i=0; i<this.query().length; i++ ) {
                if ( name === this.query()[i].value ) {
                    return this.query()[i];
                }
            }
            return null;
        },
        query: function() {
            return [
                {value:'wish', name:'Deseo'},
                {value:'draft', name:'Borrador'},
                {value:'ready', name:'Lista'},
                {value:'running', name:'En Curso'},
                {value:'finished', name:'Finalizada'},
                {value:'archived', name:'Archivada'}
            ];
        }
    };
});
