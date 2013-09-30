
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
                },
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

data.factory("Style",function() {
    return {
        query: function() {
            return [
                {
                  "name": "American Amber Ale",
                  "OG_Min": 1.045,
                  "OG_Max": 1.060,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 25,
                  "IBU_Max": 40,
                  "Colour_Min": 10,
                  "Colour_Max": 17,
                  "ABV_Min": 4.5,
                  "ABV_Max": 6.0,
                  "link": "http://www.bjcp.org/2008styles/style10.php#1b"
                },
                {
                  "name": "American Barleywine",
                  "OG_Min": 1.080,
                  "OG_Max": 1.120,
                  "FG_Min": 1.016,
                  "FG_Max": 1.030,
                  "IBU_Min": 50,
                  "IBU_Max": 120,
                  "Colour_Min": 10,
                  "Colour_Max": 19,
                  "ABV_Min": 8.0,
                  "ABV_Max": 12.0,
                  "link": "http://www.bjcp.org/2008styles/style19.php#1c"
                },
                {
                  "name": "American Brown Ale",
                  "OG_Min": 1.045,
                  "OG_Max": 1.060,
                  "FG_Min": 1.010,
                  "FG_Max": 1.016,
                  "IBU_Min": 20,
                  "IBU_Max": 40,
                  "Colour_Min": 18,
                  "Colour_Max": 35,
                  "ABV_Min": 4.3,
                  "ABV_Max": 6.2
                },
                {
                  "name": "American IPA",
                  "OG_Min": 1.056,
                  "OG_Max": 1.075,
                  "FG_Min": 1.010,
                  "FG_Max": 1.018,
                  "IBU_Min": 40,
                  "IBU_Max": 70,
                  "Colour_Min": 6,
                  "Colour_Max": 15,
                  "ABV_Min": 5.5,
                  "ABV_Max": 7.5
                },
                {
                  "name": "American Pale Ale",
                  "OG_Min": 1.045,
                  "OG_Max": 1.060,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 30,
                  "IBU_Max": 45,
                  "Colour_Min": 5,
                  "Colour_Max": 14,
                  "ABV_Min": 4.5,
                  "ABV_Max": 6.0
                },
                {
                  "name": "American Stout",
                  "OG_Min": 1.050,
                  "OG_Max": 1.075,
                  "FG_Min": 1.010,
                  "FG_Max": 1.022,
                  "IBU_Min": 35,
                  "IBU_Max": 75,
                  "Colour_Min": 30,
                  "Colour_Max": 40,
                  "ABV_Min": 5.0,
                  "ABV_Max": 7.0
                },
                {
                  "name": "American Wheat or Rye Beer",
                  "OG_Min": 1.040,
                  "OG_Max": 1.055,
                  "FG_Min": 1.008,
                  "FG_Max": 1.013,
                  "IBU_Min": 15,
                  "IBU_Max": 30,
                  "Colour_Min": 3,
                  "Colour_Max": 6,
                  "ABV_Min": 4.0,
                  "ABV_Max": 5.5
                },
                {
                  "name": "Australian Dark/Old Ale",
                  "OG_Min": 1.040,
                  "OG_Max": 1.050,
                  "FG_Min": 1.010,
                  "FG_Max": 1.016,
                  "IBU_Min": 15,
                  "IBU_Max": 20,
                  "Colour_Min": 19,
                  "Colour_Max": 35,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.3
                },
                {
                  "name": "Australian Lager",
                  "OG_Min": 1.040,
                  "OG_Max": 1.050,
                  "FG_Min": 1.004,
                  "FG_Max": 1.010,
                  "IBU_Min": 10,
                  "IBU_Max": 20,
                  "Colour_Min": 2,
                  "Colour_Max": 6,
                  "ABV_Min": 4.2,
                  "ABV_Max": 5.1
                },
                {
                  "name": "Australian Light Lager",
                  "OG_Min": 1.028,
                  "OG_Max": 1.035,
                  "FG_Min": 1.004,
                  "FG_Max": 1.008,
                  "IBU_Min": 10,
                  "IBU_Max": 15,
                  "Colour_Min": 2,
                  "Colour_Max": 4,
                  "ABV_Min": 2.8,
                  "ABV_Max": 3.5
                },
                {
                  "name": "Australian Pale Ale",
                  "OG_Min": 1.0435,
                  "OG_Max": 1.050,
                  "FG_Min": 1.004,
                  "FG_Max": 1.006,
                  "IBU_Min": 25,
                  "IBU_Max": 40,
                  "Colour_Min": 5,
                  "Colour_Max": 9,
                  "ABV_Min": 4.2,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Australian Premium Lager",
                  "OG_Min": 1.045,
                  "OG_Max": 1.055,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 15,
                  "IBU_Max": 25,
                  "Colour_Min": 2,
                  "Colour_Max": 6,
                  "ABV_Min": 4.7,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Baltic Porter",
                  "OG_Min": 1.060,
                  "OG_Max": 1.090,
                  "FG_Min": 1.016,
                  "FG_Max": 1.024,
                  "IBU_Min": 20,
                  "IBU_Max": 40,
                  "Colour_Min": 17,
                  "Colour_Max": 30,
                  "ABV_Min": 5.5,
                  "ABV_Max": 9.5
                },
                {
                  "name": "Belgian Blond Ale",
                  "OG_Min": 1.062,
                  "OG_Max": 1.075,
                  "FG_Min": 1.008,
                  "FG_Max": 1.018,
                  "IBU_Min": 15,
                  "IBU_Max": 30,
                  "Colour_Min": 4,
                  "Colour_Max": 7,
                  "ABV_Min": 6.0,
                  "ABV_Max": 7.5
                },
                {
                  "name": "Belgian Dark Strong Ale",
                  "OG_Min": 1.075,
                  "OG_Max": 1.110,
                  "FG_Min": 1.010,
                  "FG_Max": 1.024,
                  "IBU_Min": 20,
                  "IBU_Max": 35,
                  "Colour_Min": 12,
                  "Colour_Max": 22,
                  "ABV_Min": 8.0,
                  "ABV_Max": 11.0
                },
                {
                  "name": "Belgian Dubbel",
                  "OG_Min": 1.062,
                  "OG_Max": 1.075,
                  "FG_Min": 1.008,
                  "FG_Max": 1.018,
                  "IBU_Min": 15,
                  "IBU_Max": 25,
                  "Colour_Min": 10,
                  "Colour_Max": 17,
                  "ABV_Min": 6.0,
                  "ABV_Max": 7.6
                },
                {
                  "name": "Belgian Golden Strong Ale",
                  "OG_Min": 1.070,
                  "OG_Max": 1.095,
                  "FG_Min": 1.005,
                  "FG_Max": 1.016,
                  "IBU_Min": 22,
                  "IBU_Max": 35,
                  "Colour_Min": 3,
                  "Colour_Max": 6,
                  "ABV_Min": 7.5,
                  "ABV_Max": 10.5
                },
                {
                  "name": "Belgian Pale Ale",
                  "OG_Min": 1.048,
                  "OG_Max": 1.054,
                  "FG_Min": 1.010,
                  "FG_Max": 1.014,
                  "IBU_Min": 20,
                  "IBU_Max": 30,
                  "Colour_Min": 8,
                  "Colour_Max": 14,
                  "ABV_Min": 4.8,
                  "ABV_Max": 5.5
                },
                {
                  "name": "Belgian Specialty Ale",
                  "OG_Min": 1.030,
                  "OG_Max": 1.080,
                  "FG_Min": 1.006,
                  "FG_Max": 1.019,
                  "IBU_Min": 15,
                  "IBU_Max": 140,
                  "Colour_Min": 3,
                  "Colour_Max": 50,
                  "ABV_Min": 3.0,
                  "ABV_Max": 9.0
                },
                {
                  "name": "Belgian Tripel",
                  "OG_Min": 1.075,
                  "OG_Max": 1.085,
                  "FG_Min": 1.008,
                  "FG_Max": 1.014,
                  "IBU_Min": 20,
                  "IBU_Max": 40,
                  "Colour_Min": 4.5,
                  "Colour_Max": 7,
                  "ABV_Min": 7.5,
                  "ABV_Max": 9.5
                },
                {
                  "name": "Berliner Weisse",
                  "OG_Min": 1.028,
                  "OG_Max": 1.032,
                  "FG_Min": 1.003,
                  "FG_Max": 1.006,
                  "IBU_Min": 3,
                  "IBU_Max": 8,
                  "Colour_Min": 2,
                  "Colour_Max": 3,
                  "ABV_Min": 2.8,
                  "ABV_Max": 3.8
                },
                {
                  "name": "Biere de Garde",
                  "OG_Min": 1.060,
                  "OG_Max": 1.080,
                  "FG_Min": 1.008,
                  "FG_Max": 1.016,
                  "IBU_Min": 18,
                  "IBU_Max": 28,
                  "Colour_Min": 6,
                  "Colour_Max": 19,
                  "ABV_Min": 6.0,
                  "ABV_Max": 8.5
                },
                {
                  "name": "Blonde Ale",
                  "OG_Min": 1.038,
                  "OG_Max": 1.054,
                  "FG_Min": 1.008,
                  "FG_Max": 1.013,
                  "IBU_Min": 15,
                  "IBU_Max": 28,
                  "Colour_Min": 3,
                  "Colour_Max": 6,
                  "ABV_Min": 3.8,
                  "ABV_Max": 5.5
                },
                {
                  "name": "Bohemian Pilsener",
                  "OG_Min": 1.044,
                  "OG_Max": 1.056,
                  "FG_Min": 1.013,
                  "FG_Max": 1.017,
                  "IBU_Min": 35,
                  "IBU_Max": 45,
                  "Colour_Min": 3.5,
                  "Colour_Max": 6,
                  "ABV_Min": 4.2,
                  "ABV_Max": 5.4
                },
                {
                  "name": "Brown Porter",
                  "OG_Min": 1.040,
                  "OG_Max": 1.052,
                  "FG_Min": 1.008,
                  "FG_Max": 1.014,
                  "IBU_Min": 18,
                  "IBU_Max": 35,
                  "Colour_Min": 20,
                  "Colour_Max": 30,
                  "ABV_Min": 4.0,
                  "ABV_Max": 5.4
                },
                {
                  "name": "Cascadian Dark Ale",
                  "OG_Min": 1.060,
                  "OG_Max": 1.075,
                  "FG_Min": 1.008,
                  "FG_Max": 1.016,
                  "IBU_Min": 60,
                  "IBU_Max": 90,
                  "Colour_Min": 30,
                  "Colour_Max": 40,
                  "ABV_Min": 5.5,
                  "ABV_Max": 8.5
                },
                {
                  "name": "California Common Beer",
                  "OG_Min": 1.048,
                  "OG_Max": 1.054,
                  "FG_Min": 1.011,
                  "FG_Max": 1.014,
                  "IBU_Min": 30,
                  "IBU_Max": 45,
                  "Colour_Min": 10,
                  "Colour_Max": 14,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.5
                },
                {
                  "name": "Christmas/Winter Specialty Spiced Beer",
                  "OG_Min": 1.030,
                  "OG_Max": 1.110,
                  "FG_Min": 1.005,
                  "FG_Max": 1.025,
                  "IBU_Min": 0,
                  "IBU_Max": 70,
                  "Colour_Min": 5,
                  "Colour_Max": 50,
                  "ABV_Min": 2.5,
                  "ABV_Max": 12.0
                },
                {
                  "name": "Classic American Pilsner",
                  "OG_Min": 1.044,
                  "OG_Max": 1.060,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 25,
                  "IBU_Max": 40,
                  "Colour_Min": 3,
                  "Colour_Max": 6,
                  "ABV_Min": 4.5,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Classic Rauchbier",
                  "OG_Min": 1.050,
                  "OG_Max": 1.057,
                  "FG_Min": 1.012,
                  "FG_Max": 1.016,
                  "IBU_Min": 20,
                  "IBU_Max": 30,
                  "Colour_Min": 12,
                  "Colour_Max": 22,
                  "ABV_Min": 4.8,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Cream Ale",
                  "OG_Min": 1.042,
                  "OG_Max": 1.055,
                  "FG_Min": 1.006,
                  "FG_Max": 1.012,
                  "IBU_Min": 15,
                  "IBU_Max": 20,
                  "Colour_Min": 2.5,
                  "Colour_Max": 5,
                  "ABV_Min": 4.2,
                  "ABV_Max": 5.6
                },
                {
                  "name": "Dark American Lager",
                  "OG_Min": 1.044,
                  "OG_Max": 1.056,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 8,
                  "IBU_Max": 20,
                  "Colour_Min": 14,
                  "Colour_Max": 22,
                  "ABV_Min": 4.2,
                  "ABV_Max": 6
                },
                {
                  "name": "Doppelbock",
                  "OG_Min": 1.072,
                  "OG_Max": 1.112,
                  "FG_Min": 1.016,
                  "FG_Max": 1.024,
                  "IBU_Min": 16,
                  "IBU_Max": 26,
                  "Colour_Min": 6,
                  "Colour_Max": 25,
                  "ABV_Min": 7.0,
                  "ABV_Max": 10.0
                },
                {
                  "name": "Dortmunder Export",
                  "OG_Min": 1.048,
                  "OG_Max": 1.056,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 23,
                  "IBU_Max": 30,
                  "Colour_Min": 4,
                  "Colour_Max": 6,
                  "ABV_Min": 4.8,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Dry Stout",
                  "OG_Min": 1.036,
                  "OG_Max": 1.050,
                  "FG_Min": 1.007,
                  "FG_Max": 1.011,
                  "IBU_Min": 30,
                  "IBU_Max": 45,
                  "Colour_Min": 25,
                  "Colour_Max": 40,
                  "ABV_Min": 4.0,
                  "ABV_Max": 5.0
                },
                {
                  "name": "Dunkelweizen",
                  "OG_Min": 1.044,
                  "OG_Max": 1.056,
                  "FG_Min": 1.010,
                  "FG_Max": 1.014,
                  "IBU_Min": 10,
                  "IBU_Max": 18,
                  "Colour_Min": 14,
                  "Colour_Max": 23,
                  "ABV_Min": 4.3,
                  "ABV_Max": 5.6
                },
                {
                  "name": "Dusseldorf Altbier",
                  "OG_Min": 1.046,
                  "OG_Max": 1.054,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 35,
                  "IBU_Max": 50,
                  "Colour_Min": 11,
                  "Colour_Max": 17,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.2
                },
                {
                  "name": "Eisbock",
                  "OG_Min": 1.078,
                  "OG_Max": 1.120,
                  "FG_Min": 1.020,
                  "FG_Max": 1.035,
                  "IBU_Min": 25,
                  "IBU_Max": 35,
                  "Colour_Min": 18,
                  "Colour_Max": 30,
                  "ABV_Min": 9,
                  "ABV_Max": 14.0
                },
                {
                  "name": "English Barleywine",
                  "OG_Min": 1.080,
                  "OG_Max": 1.120,
                  "FG_Min": 1.018,
                  "FG_Max": 1.030,
                  "IBU_Min": 35,
                  "IBU_Max": 70,
                  "Colour_Min": 8,
                  "Colour_Max": 22,
                  "ABV_Min": 8.0,
                  "ABV_Max": 12.0
                },
                {
                  "name": "English IPA",
                  "OG_Min": 1.050,
                  "OG_Max": 1.075,
                  "FG_Min": 1.010,
                  "FG_Max": 1.018,
                  "IBU_Min": 40,
                  "IBU_Max": 60,
                  "Colour_Min": 8,
                  "Colour_Max": 14,
                  "ABV_Min": 5.0,
                  "ABV_Max": 7.5
                },
                {
                  "name": "Extra Special/Strong Bitter (English Pale Ale)",
                  "OG_Min": 1.048,
                  "OG_Max": 1.060,
                  "FG_Min": 1.010,
                  "FG_Max": 1.016,
                  "IBU_Min": 30,
                  "IBU_Max": 50,
                  "Colour_Min": 6,
                  "Colour_Max": 18,
                  "ABV_Min": 4.6,
                  "ABV_Max": 6.2
                },
                {
                  "name": "Flanders Brown Ale/Oud Bruin",
                  "OG_Min": 1.040,
                  "OG_Max": 1.074,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 20,
                  "IBU_Max": 25,
                  "Colour_Min": 15,
                  "Colour_Max": 22,
                  "ABV_Min": 4.0,
                  "ABV_Max": 8.0
                },
                {
                  "name": "Flanders Red Ale",
                  "OG_Min": 1.048,
                  "OG_Max": 1.057,
                  "FG_Min": 1.002,
                  "FG_Max": 1.012,
                  "IBU_Min": 10,
                  "IBU_Max": 25,
                  "Colour_Min": 10,
                  "Colour_Max": 16,
                  "ABV_Min": 4.6,
                  "ABV_Max": 6.5
                },
                {
                  "name": "Foreign Extra Stout",
                  "OG_Min": 1.056,
                  "OG_Max": 1.075,
                  "FG_Min": 1.010,
                  "FG_Max": 1.018,
                  "IBU_Min": 30,
                  "IBU_Max": 70,
                  "Colour_Min": 30,
                  "Colour_Max": 40,
                  "ABV_Min": 5.5,
                  "ABV_Max": 8.0
                },
                {
                  "name": "Fruit Beer",
                  "OG_Min": 1.030,
                  "OG_Max": 1.110,
                  "FG_Min": 1.004,
                  "FG_Max": 1.024,
                  "IBU_Min": 5,
                  "IBU_Max": 70,
                  "Colour_Min": 3,
                  "Colour_Max": 50,
                  "ABV_Min": 2.5,
                  "ABV_Max": 12.0
                },
                {
                  "name": "Fruit Lambic",
                  "OG_Min": 1.040,
                  "OG_Max": 1.060,
                  "FG_Min": 1.000,
                  "FG_Max": 1.010,
                  "IBU_Min": 0,
                  "IBU_Max": 10,
                  "Colour_Min": 3,
                  "Colour_Max": 7,
                  "ABV_Min": 5.0,
                  "ABV_Max": 7.0
                },
                {
                  "name": "German Pilsner (Pils)",
                  "OG_Min": 1.044,
                  "OG_Max": 1.050,
                  "FG_Min": 1.008,
                  "FG_Max": 1.013,
                  "IBU_Min": 25,
                  "IBU_Max": 45,
                  "Colour_Min": 2,
                  "Colour_Max": 5,
                  "ABV_Min": 4.4,
                  "ABV_Max": 5.2
                },
                {
                  "name": "Gueuze",
                  "OG_Min": 1.040,
                  "OG_Max": 1.060,
                  "FG_Min": 1.000,
                  "FG_Max": 1.006,
                  "IBU_Min": 0,
                  "IBU_Max": 10,
                  "Colour_Min": 3,
                  "Colour_Max": 7,
                  "ABV_Min": 5.0,
                  "ABV_Max": 8.0
                },
                {
                  "name": "Imperial IPA",
                  "OG_Min": 1.075,
                  "OG_Max": 1.090,
                  "FG_Min": 1.010,
                  "FG_Max": 1.020,
                  "IBU_Min": 60,
                  "IBU_Max": 120,
                  "Colour_Min": 8,
                  "Colour_Max": 15,
                  "ABV_Min": 7.5,
                  "ABV_Max": 10.0
                },
                {
                  "name": "Imperial Stout",
                  "OG_Min": 1.075,
                  "OG_Max": 1.115,
                  "FG_Min": 1.018,
                  "FG_Max": 1.030,
                  "IBU_Min": 50,
                  "IBU_Max": 90,
                  "Colour_Min": 30,
                  "Colour_Max": 40,
                  "ABV_Min": 8.0,
                  "ABV_Max": 12.0
                },
                {
                  "name": "Irish Red Ale",
                  "OG_Min": 1.044,
                  "OG_Max": 1.060,
                  "FG_Min": 1.010,
                  "FG_Max": 1.016,
                  "IBU_Min": 17,
                  "IBU_Max": 28,
                  "Colour_Min": 9,
                  "Colour_Max": 18,
                  "ABV_Min": 4.0,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Kolsch",
                  "OG_Min": 1.044,
                  "OG_Max": 1.050,
                  "FG_Min": 1.007,
                  "FG_Max": 1.011,
                  "IBU_Min": 20,
                  "IBU_Max": 30,
                  "Colour_Min": 3.5,
                  "Colour_Max": 5,
                  "ABV_Min": 4.4,
                  "ABV_Max": 5.2
                },
                {
                  "name": "Lite American Lager",
                  "OG_Min": 1.028,
                  "OG_Max": 1.040,
                  "FG_Min": 0.998,
                  "FG_Max": 1.008,
                  "IBU_Min": 8,
                  "IBU_Max": 12,
                  "Colour_Min": 2,
                  "Colour_Max": 3,
                  "ABV_Min": 2.8,
                  "ABV_Max": 4.2
                },
                {
                  "name": "Maibock/Helles Bock",
                  "OG_Min": 1.064,
                  "OG_Max": 1.072,
                  "FG_Min": 1.011,
                  "FG_Max": 1.018,
                  "IBU_Min": 23,
                  "IBU_Max": 35,
                  "Colour_Min": 6,
                  "Colour_Max": 11,
                  "ABV_Min": 6.3,
                  "ABV_Max": 7.4
                },
                {
                  "name": "Mild",
                  "OG_Min": 1.030,
                  "OG_Max": 1.038,
                  "FG_Min": 1.008,
                  "FG_Max": 1.013,
                  "IBU_Min": 10,
                  "IBU_Max": 25,
                  "Colour_Min": 12,
                  "Colour_Max": 25,
                  "ABV_Min": 2.8,
                  "ABV_Max": 4.5
                },
                {
                  "name": "Munich Dunkel",
                  "OG_Min": 1.048,
                  "OG_Max": 1.056,
                  "FG_Min": 1.010,
                  "FG_Max": 1.016,
                  "IBU_Min": 18,
                  "IBU_Max": 28,
                  "Colour_Min": 14,
                  "Colour_Max": 28,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.6
                },
                {
                  "name": "Munich Helles",
                  "OG_Min": 1.045,
                  "OG_Max": 1.051,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 16,
                  "IBU_Max": 22,
                  "Colour_Min": 3,
                  "Colour_Max": 5,
                  "ABV_Min": 4.7,
                  "ABV_Max": 5.4
                },
                {
                  "name": "North German Altbier",
                  "OG_Min": 1.046,
                  "OG_Max": 1.054,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 25,
                  "IBU_Max": 40,
                  "Colour_Min": 13,
                  "Colour_Max": 19,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.2
                },
                {
                  "name": "Northern English Brown Ale",
                  "OG_Min": 1.040,
                  "OG_Max": 1.052,
                  "FG_Min": 1.008,
                  "FG_Max": 1.013,
                  "IBU_Min": 20,
                  "IBU_Max": 30,
                  "Colour_Min": 12,
                  "Colour_Max": 22,
                  "ABV_Min": 4.2,
                  "ABV_Max": 5.4
                },
                {
                  "name": "Oatmeal Stout",
                  "OG_Min": 1.048,
                  "OG_Max": 1.065,
                  "FG_Min": 1.010,
                  "FG_Max": 1.018,
                  "IBU_Min": 25,
                  "IBU_Max": 40,
                  "Colour_Min": 22,
                  "Colour_Max": 40,
                  "ABV_Min": 4.2,
                  "ABV_Max": 5.9
                },
                {
                  "name": "Oktoberfest/Marzen",
                  "OG_Min": 1.050,
                  "OG_Max": 1.057,
                  "FG_Min": 1.012,
                  "FG_Max": 1.016,
                  "IBU_Min": 20,
                  "IBU_Max": 28,
                  "Colour_Min": 7,
                  "Colour_Max": 14,
                  "ABV_Min": 4.8,
                  "ABV_Max": 5.7
                },
                {
                  "name": "Old Ale",
                  "OG_Min": 1.060,
                  "OG_Max": 1.090,
                  "FG_Min": 1.015,
                  "FG_Max": 1.022,
                  "IBU_Min": 30,
                  "IBU_Max": 60,
                  "Colour_Min": 10,
                  "Colour_Max": 22,
                  "ABV_Min": 6.0,
                  "ABV_Max": 9.0
                },
                {
                  "name": "Other Smoked Beer",
                  "OG_Min": 1.030,
                  "OG_Max": 1.110,
                  "FG_Min": 1.006,
                  "FG_Max": 1.024,
                  "IBU_Min": 5,
                  "IBU_Max": 70,
                  "Colour_Min": 5,
                  "Colour_Max": 50,
                  "ABV_Min": 2.5,
                  "ABV_Max": 12.0
                },
                {
                  "name": "Premium American Lager",
                  "OG_Min": 1.046,
                  "OG_Max": 1.056,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 15,
                  "IBU_Max": 25,
                  "Colour_Min": 2,
                  "Colour_Max": 6,
                  "ABV_Min": 4.6,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Robust Porter",
                  "OG_Min": 1.048,
                  "OG_Max": 1.065,
                  "FG_Min": 1.012,
                  "FG_Max": 1.016,
                  "IBU_Min": 25,
                  "IBU_Max": 50,
                  "Colour_Min": 22,
                  "Colour_Max": 35,
                  "ABV_Min": 4.8,
                  "ABV_Max": 6.5
                },
                {
                  "name": "Roggenbier (German Rye Beer)",
                  "OG_Min": 1.046,
                  "OG_Max": 1.056,
                  "FG_Min": 1.010,
                  "FG_Max": 1.014,
                  "IBU_Min": 10,
                  "IBU_Max": 20,
                  "Colour_Min": 14,
                  "Colour_Max": 19,
                  "ABV_Min": 4.5,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Saison",
                  "OG_Min": 1.048,
                  "OG_Max": 1.065,
                  "FG_Min": 1.002,
                  "FG_Max": 1.012,
                  "IBU_Min": 20,
                  "IBU_Max": 35,
                  "Colour_Min": 5,
                  "Colour_Max": 14,
                  "ABV_Min": 5.0,
                  "ABV_Max": 7.0
                },
                {
                  "name": "Schwarzbier",
                  "OG_Min": 1.046,
                  "OG_Max": 1.052,
                  "FG_Min": 1.010,
                  "FG_Max": 1.016,
                  "IBU_Min": 22,
                  "IBU_Max": 32,
                  "Colour_Min": 17,
                  "Colour_Max": 30,
                  "ABV_Min": 4.4,
                  "ABV_Max": 5.4
                },
                {
                  "name": "Scottish Light 60/-",
                  "OG_Min": 1.030,
                  "OG_Max": 1.035,
                  "FG_Min": 1.010,
                  "FG_Max": 1.013,
                  "IBU_Min": 10,
                  "IBU_Max": 20,
                  "Colour_Min": 9,
                  "Colour_Max": 17,
                  "ABV_Min": 2.5,
                  "ABV_Max": 3.2
                },
                {
                  "name": "Scottish Light 70/-",
                  "OG_Min": 1.035,
                  "OG_Max": 1.040,
                  "FG_Min": 1.010,
                  "FG_Max": 1.013,
                  "IBU_Min": 10,
                  "IBU_Max": 25,
                  "Colour_Min": 9,
                  "Colour_Max": 17,
                  "ABV_Min": 3.2,
                  "ABV_Max": 3.9
                },
                {
                  "name": "Scottish Light 80/-",
                  "OG_Min": 1.040,
                  "OG_Max": 1.054,
                  "FG_Min": 1.010,
                  "FG_Max": 1.015,
                  "IBU_Min": 15,
                  "IBU_Max": 30,
                  "Colour_Min": 9,
                  "Colour_Max": 17,
                  "ABV_Min": 3.9,
                  "ABV_Max": 5.0
                },
                {
                  "name": "Southern English Brown Ale",
                  "OG_Min": 1.033,
                  "OG_Max": 1.042,
                  "FG_Min": 1.011,
                  "FG_Max": 1.014,
                  "IBU_Min": 12,
                  "IBU_Max": 20,
                  "Colour_Min": 19,
                  "Colour_Max": 35,
                  "ABV_Min": 2.8,
                  "ABV_Max": 4.1
                },
                {
                  "name": "Special/Best/Premium Bitter",
                  "OG_Min": 1.040,
                  "OG_Max": 1.048,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 25,
                  "IBU_Max": 40,
                  "Colour_Min": 5,
                  "Colour_Max": 16,
                  "ABV_Min": 3.8,
                  "ABV_Max": 4.6
                },
                {
                  "name": "Specialty Beer",
                  "OG_Min": 1.030,
                  "OG_Max": 1.110,
                  "FG_Min": 1.006,
                  "FG_Max": 1.024,
                  "IBU_Min": 5,
                  "IBU_Max": 70,
                  "Colour_Min": 5,
                  "Colour_Max": 50,
                  "ABV_Min": 2.5,
                  "ABV_Max": 12.0
                },
                {
                  "name": "Spice, Herb, or Vegetable Beer",
                  "OG_Min": 1.030,
                  "OG_Max": 1.110,
                  "FG_Min": 1.005,
                  "FG_Max": 1.025,
                  "IBU_Min": 0,
                  "IBU_Max": 70,
                  "Colour_Min": 5,
                  "Colour_Max": 50,
                  "ABV_Min": 2.5,
                  "ABV_Max": 12.0
                },
                {
                  "name": "Standard American Lager",
                  "OG_Min": 1.040,
                  "OG_Max": 1.050,
                  "FG_Min": 1.004,
                  "FG_Max": 1.010,
                  "IBU_Min": 8,
                  "IBU_Max": 15,
                  "Colour_Min": 2,
                  "Colour_Max": 4,
                  "ABV_Min": 4.2,
                  "ABV_Max": 5.3
                },
                {
                  "name": "Standard/Ordinary Bitter",
                  "OG_Min": 1.032,
                  "OG_Max": 1.040,
                  "FG_Min": 1.007,
                  "FG_Max": 1.011,
                  "IBU_Min": 25,
                  "IBU_Max": 35,
                  "Colour_Min": 4,
                  "Colour_Max": 14,
                  "ABV_Min": 3.2,
                  "ABV_Max": 3.8
                },
                {
                  "name": "Straight (Unblended) Lambic",
                  "OG_Min": 1.040,
                  "OG_Max": 1.054,
                  "FG_Min": 1.001,
                  "FG_Max": 1.010,
                  "IBU_Min": 0,
                  "IBU_Max": 10,
                  "Colour_Min": 3,
                  "Colour_Max": 7,
                  "ABV_Min": 5.0,
                  "ABV_Max": 6.5
                },
                {
                  "name": "Strong Scotch Ale",
                  "OG_Min": 1.070,
                  "OG_Max": 1.130,
                  "FG_Min": 1.018,
                  "FG_Max": 1.056,
                  "IBU_Min": 17,
                  "IBU_Max": 35,
                  "Colour_Min": 14,
                  "Colour_Max": 25,
                  "ABV_Min": 6.5,
                  "ABV_Max": 10.0
                },
                {
                  "name": "Sweet Stout",
                  "OG_Min": 1.044,
                  "OG_Max": 1.060,
                  "FG_Min": 1.012,
                  "FG_Max": 1.024,
                  "IBU_Min": 20,
                  "IBU_Max": 40,
                  "Colour_Min": 30,
                  "Colour_Max": 40,
                  "ABV_Min": 4.0,
                  "ABV_Max": 6.0
                },
                {
                  "name": "Traditional Bock",
                  "OG_Min": 1.064,
                  "OG_Max": 1.072,
                  "FG_Min": 1.013,
                  "FG_Max": 1.019,
                  "IBU_Min": 20,
                  "IBU_Max": 27,
                  "Colour_Min": 14,
                  "Colour_Max": 22,
                  "ABV_Min": 6.3,
                  "ABV_Max": 7.2
                },
                {
                  "name": "Vienna Lager",
                  "OG_Min": 1.046,
                  "OG_Max": 1.052,
                  "FG_Min": 1.010,
                  "FG_Max": 1.014,
                  "IBU_Min": 18,
                  "IBU_Max": 30,
                  "Colour_Min": 10,
                  "Colour_Max": 16,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.5
                },
                {
                  "name": "Weizen/Weissbier",
                  "OG_Min": 1.044,
                  "OG_Max": 1.052,
                  "FG_Min": 1.010,
                  "FG_Max": 1.014,
                  "IBU_Min": 8,
                  "IBU_Max": 15,
                  "Colour_Min": 2,
                  "Colour_Max": 8,
                  "ABV_Min": 4.3,
                  "ABV_Max": 5.6
                },
                {
                  "name": "Weizenbock",
                  "OG_Min": 1.064,
                  "OG_Max": 1.090,
                  "FG_Min": 1.015,
                  "FG_Max": 1.022,
                  "IBU_Min": 15,
                  "IBU_Max": 30,
                  "Colour_Min": 12,
                  "Colour_Max": 25,
                  "ABV_Min": 6.5,
                  "ABV_Max": 8.0
                },
                {
                  "name": "Witbier",
                  "OG_Min": 1.044,
                  "OG_Max": 1.052,
                  "FG_Min": 1.008,
                  "FG_Max": 1.012,
                  "IBU_Min": 10,
                  "IBU_Max": 20,
                  "Colour_Min": 2,
                  "Colour_Max": 4,
                  "ABV_Min": 4.5,
                  "ABV_Max": 5.5
                },
                {
                  "name": "Wood-Aged Beer",
                  "OG_Min": 1.030,
                  "OG_Max": 1.110,
                  "FG_Min": 1.006,
                  "FG_Max": 1.024,
                  "IBU_Min": 5,
                  "IBU_Max": 70,
                  "Colour_Min": 5,
                  "Colour_Max": 50,
                  "ABV_Min": 2.5,
                  "ABV_Max": 12.0
                }
              ];
        }
    };
});

data.factory("Misc",function() {
    return {
        query: function() {
            return [
                {
                  "name": "Black Pepper",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Calcium Chloride",
                  "type": "Water Agent",
                  "use": "Mash"
                },
                {
                  "name": "Caraway Seed",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Cardamom Seed",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Chamomile",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Chili Pepper",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Cinnamon",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Cinnamon Stick",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Citric Acid",
                  "type": "Water Agent",
                  "use": "Mash"
                },
                {
                  "name": "Cocoa Powder",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Coriander Seed",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Corriander Seed",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Dried Elderberries",
                  "type": "Other",
                  "use": "Secondary"
                },
                {
                  "name": "Dried Elderflowers",
                  "type": "Other",
                  "use": "Secondary"
                },
                {
                  "name": "Epsom Salt (MgSO4)",
                  "type": "Water Agent",
                  "use": "Mash"
                },
                {
                  "name": "Fennel Seed",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Gelatin",
                  "type": "Fining",
                  "use": "Secondary"
                },
                {
                  "name": "Ginger Root",
                  "type": "Herb",
                  "use": "Boil"
                },
                {
                  "name": "Grains of Paradise",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Gypsum (Calcium Sulfate)",
                  "type": "Water Agent",
                  "use": "Mash"
                },
                {
                  "name": "Irish Moss",
                  "type": "Fining",
                  "use": "Boil"
                },
                {
                  "name": "Isinglass (Liquid)",
                  "type": "Fining",
                  "use": "Secondary"
                },
                {
                  "name": "Jamaican Peper",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Juniper Berries",
                  "type": "Other",
                  "use": "Secondary"
                },
                {
                  "name": "Lactic Acid",
                  "type": "Water Agent",
                  "use": "Mash"
                },
                {
                  "name": "Lavender",
                  "type": "Herb",
                  "use": "Boil"
                },
                {
                  "name": "Licorice Root",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Malto-Dextrine",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Mugwort",
                  "type": "Herb",
                  "use": "Boil"
                },
                {
                  "name": "Oak Chips",
                  "type": "Flavor",
                  "use": "Secondary"
                },
                {
                  "name": "Orange Peel",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Papain",
                  "type": "Fining",
                  "use": "Secondary"
                },
                {
                  "name": "PH 5.2",
                  "type": "Water Agent",
                  "use": "Mash"
                },
                {
                  "name": "Polyclar",
                  "type": "Fining",
                  "use": "Secondary"
                },
                {
                  "name": "Red Peper",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Rosemary",
                  "type": "Herb",
                  "use": "Boil"
                },
                {
                  "name": "Spruce Tips",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Star Anise",
                  "type": "Spice",
                  "use": "Boil"
                },
                {
                  "name": "Vanilla",
                  "type": "Other",
                  "use": "Boil"
                },
                {
                  "name": "Whirlfloc Tablet",
                  "type": "Fining",
                  "use": "Boil"
                },
                {
                  "name": "Yarrow",
                  "type": "Herb",
                  "use": "Boil"
                },
                {
                  "name": "Yeast Nutrient",
                  "type": "Other",
                  "use": "Boil"
                }
              ];
        }
    };
});

data.factory("Yeast",function() {
    return {
        query: function() {
            return [
                    {
                      "name": "Ale yeast",
                      "aa": 75.0
                    },
                    {
                      "name": "Lager yeast",
                      "aa": 75.0
                    },
                    {
                      "name": "Safbrew T-58",
                      "aa": 75.0
                    },
                    {
                      "name": "Safbrew S-33",
                      "aa": 75.0
                    },
                    {
                      "name": "Safbrew WB-06",
                      "aa": 75.0
                    },
                    {
                      "name": "Safale S-04",
                      "aa": 75.0
                    },
                    {
                      "name": "Safale US-05",
                      "aa": 78.0
                    },
                    {
                      "name": "Safale K-97",
                      "aa": 75.0
                    },
                    {
                      "name": "Saflager S-23",
                      "aa": 75.0
                    },
                    {
                      "name": "Saflager S-189",
                      "aa": 75.0
                    },
                    {
                      "name": "Saflager W-34/70",
                      "aa": 75.0
                    },
                    {
                      "name": "Safeale S-04",
                      "aa": 75.0
                    },
                    {
                      "name": "Danstar Munich",
                      "aa": 75.0
                    },
                    {
                      "name": "Danstar Nottingham",
                      "aa": 82.0
                    },
                    {
                      "name": "Danstar Bry-97",
                      "aa": 80.0
                    },
                    {
                      "name": "Danstar Windsor",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1007 - German Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1010 - American Wheat",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1028 - London Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1056 - American Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1084 - Irish Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1098 - British Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1099 - Whitbread Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1187 - Ringwood Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1272 - American Ale II",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1275 - Thames Valley Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1318 - London Ale III",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1332 - Northwest Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1335 - British Ale II",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1338 - European Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1469 - West Yorkshire Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1728 - Scottish Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1968 - London ESB Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2565 - Kölsch",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2000 - Budvar Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2001 - Urquell Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2007 - Pilsen Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2035 - American Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2042 - Danish Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2112 - California Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2124 - Bohemian Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2206 - Bavarian Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2278 - Czech Pils",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2308 - Munich Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 2633 - Octoberfest Lager Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1214 - Belgian Abbey",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1388 - Belgian Strong Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 1762 - Belgian Abbey II",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3056 - Bavarian Wheat Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3068 - Weihenstephan Weizen",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3278 - Belgian Lambic Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3333 - German Wheat",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3463 - Forbidden Fruit",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3522 - Belgian Ardennes",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3638 - Bavarian Wheat",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3724 - Belgian Saison",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3787 - Trappist High Gravity",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3942 - Belgian Wheat",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 3944 - Belgian Witbier",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 5112 - Brettanomyces bruxellensis",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 5335 - Lactobacillus",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 5526 - Brettanomyces lambicus",
                      "aa": 75.0
                    },
                    {
                      "name": "Wyeast 5733 - Pediococcus",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP001 - California Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP002 - English Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP004 - Irish Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP005 - British Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP006 - Bedford British",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP007 - Dry English Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP008 - East Coast Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP009 - Australian Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP011 - European Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP013 - London Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP022 - Essex Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP023 - Burton Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP026 - Premium Bitter Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP028 - Edinburgh Scottish Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP029 - German Ale/Kolsch",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP036 - Dusseldorf Alt",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP037 - Yorkshire Square Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP038 - Manchester Ale Yeast",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP039 - Nottingham Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP041 - Pacific Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP060 - American Ale Yeast Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP072 - French Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP080 - Cream Ale Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP099 - Super High Gravity Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP300 - Hefeweizen Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP320 - American Hefeweizen Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP351 - Bavarian Weizen",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP380 - Hefeweizen IV Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP400 - Belgian Wit Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP410 - Belgian Wit II Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP500 - Trappist Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP510 - Belgian Bastogne Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP515 - Antwerp Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP530 - Abbey Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP540 - Abbey IV Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP545 - Belgian Strong Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP550 - Belgian Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP565 - Belgian Saison I",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP566 - Belgian Saison II",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP568 - Belgian Style Saison Ale Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP570 - Belgian Golden Ale",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP575 - Belgian Style Ale Blend",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP800 - Pilsner Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP802 - Czech Budejovice Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP810 - San Francisco Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP820 - Oktoberfest/Märzen Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP830 - German Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP833 - German Bock Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP838 - Southern German Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP840 - American Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP862 - Cry Havoc",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP885 - Zurich Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP940 - Mexican Lager",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP645 - Brettanomyces claussenii",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP650 - Brettanomyces bruxellensis",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP653 - Brettanomyces lambicus",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP655 - Belgian Sour Mix 1",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP675 - Malolactic Bacteria",
                      "aa": 75.0
                    },
                    {
                      "name": "WLP677 - Lactobacillus Bacteria",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-09 - AMERICAN ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-10 - AMERICAN SIERRA ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-11 - ENGLISH LONDON ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-12 - IRISH ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-13 - ENGLISH RINGWOOD",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-14 - ENGLISH LONDON OAK",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-15 - ENGLISH THAMES ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-16 - GERMAN KOLSCH",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-17 - BREWER’S MATE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-18 - GERMAN HEFEWEIZEN",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-19 - BELGIAN WHITE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-20 - BELGIAN TRAPPIST ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-21 - BELGIAN ACHOUFFE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-22 - BELGIAN SAISON",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-23 - CZECH LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-24 - CZECH PILSENER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-25 - AMERICAN LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-26 - GERMAN OCTOBERFEST",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-27 - GERMAN STH BAVARIAN",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-28 - STH GERMAN LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-29 - WEST EUROPEAN LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-30 - BRETTANOMYCES CLAUSSENII",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-31 - BRETTANOMYCES BRUXELLENSIS",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-32 - BRETTANOMYCES LAMBICUS",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-33 - BELGIAN SOUR MIX I",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-34 - MALOLACTIC CULTURE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-35 - LACTOBACILLUS CULTURE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-41 - GERMAN WHEAT",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-42 - BELGIAN WHEAT",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-43 - BELGIAN WIT",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-44 - GERMAN BAVARIAN",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-45 - GERMAN HEFEWEISSE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-46 - GERMAN MARZEN",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-47 - GERMAN ALTBIER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-48 - LONDON ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-60 - AMERICAN WHEAT",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-61 - ENGLISH ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-62 - CALIFORNIAN ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-63 - IRISH STOUT",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-64 - BRITISH DRY ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-65 - WHITBREAD ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-66 - ENGLISH RINGWOOD",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-67 - BELGIAN TRAPPIST",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-68 - CALIFORNIAN NUT ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-69 - ENGLISH THAMES ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-70 - NORTHWEST ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-71 - EUROPEAN ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-72 - BELGIAN GOLDEN ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-73 - BELGIAN ABBEY AL",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-74 - ENGLISH PALE ALE",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-75 - URQUELL PILSENER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-76 - AMERICAN LAGER II",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-77 - DANISH LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-78 - SAN FRANCISCO LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-79 - GERMAN LAGER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-80 - GERMAN DOPPLEBOCK",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-81 - CZECH PILSENER",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-82 - GERMAN LAGER II",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-83 - GERMAN KOLSCH",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-84 - BELGIAN LAMBIC BLEND",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-85 - BELGIAN TRIPPEL",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-86 - BELGIAN SAISON ALE II",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-87 - BELGIAN TRAPPIST ALE II",
                      "aa": 75.0
                    },
                    {
                      "name": "PRO-88 - CANADIAN ALE",
                      "aa": 75.0
                    }
                  ];
        }
    };
});

data.factory("Hop",function() {
    return {
        query: function() {
            return [
                {
                  "name": "Admiral",
                  "alpha": 10.6
                },
                {
                  "name": "Ahtanum",
                  "alpha": 5.2
                },
                {
                  "name": "Amarillo",
                  "alpha": 8.6
                },
                {
                  "name": "Aquila",
                  "alpha": 6.5
                },
                {
                  "name": "B Saaz",
                  "alpha": 6.8
                },
                {
                  "name": "Banner",
                  "alpha": 10.0
                },
                {
                  "name": "Boadicea",
                  "alpha": 7.1
                },
                {
                  "name": "Bramling Cross",
                  "alpha": 5.1
                },
                {
                  "name": "Brewers Gold",
                  "alpha": 5.0
                },
                {
                  "name": "Bullion",
                  "alpha": 9.5
                },
                {
                  "name": "Cascade Arg",
                  "alpha": 7.8
                },
                {
                  "name": "Cascade USA",
                  "alpha": 5.5
                },
                {
                  "name": "Centennial",
                  "alpha": 9.7
                },
                {
                  "name": "Challenger",
                  "alpha": 6.1
                },
                {
                  "name": "Chinook",
                  "alpha": 11.4
                },
                {
                  "name": "Citra",
                  "alpha": 11.1
                },
                {
                  "name": "Cluster",
                  "alpha": 5.7
                },
                {
                  "name": "Columbia",
                  "alpha": 5.5
                },
                {
                  "name": "Columbus",
                  "alpha": 14.2
                },
                {
                  "name": "Cornet",
                  "alpha": 9.5
                },
                {
                  "name": "Crystal",
                  "alpha": 4.3
                },
                {
                  "name": "D Saaz",
                  "alpha": 5.4
                },
                {
                  "name": "Delta",
                  "alpha": 5
                },
                {
                  "name": "East Kent Golding",
                  "alpha": 4.7
                },
                {
                  "name": "Eroica",
                  "alpha": 2.4
                },
                {
                  "name": "First Gold",
                  "alpha": 7.9
                },
                {
                  "name": "Fuggles",
                  "alpha": 5.7
                },
                {
                  "name": "Galaxy",
                  "alpha": 13.4
                },
                {
                  "name": "Galena",
                  "alpha": 12.5
                },
                {
                  "name": "Galena",
                  "alpha": 5.8
                },
                {
                  "name": "Green Bullet",
                  "alpha": 13.6
                },
                {
                  "name": "Hallertau Aroma",
                  "alpha": 8.1
                },
                {
                  "name": "Hallertau Mittlefrueh",
                  "alpha": 6.3
                },
                {
                  "name": "Hallertau Tradition",
                  "alpha": 5.7
                },
                {
                  "name": "Herald",
                  "alpha": 12.0
                },
                {
                  "name": "Hersbrucker",
                  "alpha": 2.8
                },
                {
                  "name": "Horizon",
                  "alpha": 13.0
                },
                {
                  "name": "Liberty",
                  "alpha": 4.5
                },
                {
                  "name": "Lublin",
                  "alpha": 5.0
                },
                {
                  "name": "Magnum",
                  "alpha": 12.5
                },
                {
                  "name": "Mapuche",
                  "alpha": 7.7
                },
                {
                  "name": "Marco Polo",
                  "alpha": 12.0
                },
                {
                  "name": "Millennium",
                  "alpha": 14.4
                },
                {
                  "name": "Mt. Hood",
                  "alpha": 5.2
                },
                {
                  "name": "Nelson Sauvin",
                  "alpha": 11.5
                },
                {
                  "name": "Newport",
                  "alpha": 11.0
                },
                {
                  "name": "Northdown",
                  "alpha": 8.1
                },
                {
                  "name": "Northern Brewer",
                  "alpha": 9.6
                },
                {
                  "name": "Nugget",
                  "alpha": 12
                },
                {
                  "name": "Opal",
                  "alpha": 10.0
                },
                {
                  "name": "Orion",
                  "alpha": 7.2
                },
                {
                  "name": "Pacific Gem",
                  "alpha": 13.7
                },
                {
                  "name": "Pacific Hallertau",
                  "alpha": 5.8
                },
                {
                  "name": "Pacific Jade",
                  "alpha": 15.2
                },
                {
                  "name": "Palisade",
                  "alpha": 7.3
                },
                {
                  "name": "Perle",
                  "alpha": 6.0
                },
                {
                  "name": "Phoenix",
                  "alpha": 8.0
                },
                {
                  "name": "Pilgrim",
                  "alpha": 10.4
                },
                {
                  "name": "Pioneer",
                  "alpha": 9.5
                },
                {
                  "name": "Pride of Ringwood",
                  "alpha": 8.3
                },
                {
                  "name": "Progress",
                  "alpha": 7.3
                },
                {
                  "name": "Saaz",
                  "alpha": 3.6
                },
                {
                  "name": "Santiam",
                  "alpha": 6.7
                },
                {
                  "name": "Saphire",
                  "alpha": 4.5
                },
                {
                  "name": "Simcoe",
                  "alpha": 12.2
                },
                {
                  "name": "Smaragd",
                  "alpha": 8.0
                },
                {
                  "name": "Sorachi",
                  "alpha": 11.8
                },
                {
                  "name": "Southern Cross",
                  "alpha": 14.8
                },
                {
                  "name": "Spalt",
                  "alpha": 4.0
                },
                {
                  "name": "Sterling",
                  "alpha": 7.5
                },
                {
                  "name": "Stickebract",
                  "alpha": 14.0
                },
                {
                  "name": "Strisselspalt",
                  "alpha": 2.0
                },
                {
                  "name": "Styrian Golding",
                  "alpha": 4.4
                },
                {
                  "name": "Sun",
                  "alpha": 14.0
                },
                {
                  "name": "Super Alpha",
                  "alpha": 12.0
                },
                {
                  "name": "Super Pride",
                  "alpha": 13.0
                },
                {
                  "name": "Target",
                  "alpha": 9.0
                },
                {
                  "name": "Tarus",
                  "alpha": 13.0
                },
                {
                  "name": "Tettnanger",
                  "alpha": 4.0
                },
                {
                  "name": "Tomahawk",
                  "alpha": 14.5
                },
                {
                  "name": "Topaz",
                  "alpha": 16.2
                },
                {
                  "name": "Tradition",
                  "alpha": 6.0
                },
                {
                  "name": "Ultra",
                  "alpha": 3.3
                },
                {
                  "name": "Vanguard",
                  "alpha": 5.0
                },
                {
                  "name": "Warrior",
                  "alpha": 15.8
                },
                {
                  "name": "Willamette",
                  "alpha": 7.1
                },
                {
                  "name": "Zeus",
                  "alpha": 13.5
                }
              ]
        }
    }; 
});

data.factory("Grain",function() {
    return {
        query: function() {
            return [
                {
                  "name": "Acidulated Malt",
                  "type": "Grain",
                  "colour": 1.8,
                  "potential": 1.030
                },
                {
                  "name": "Amber Malt",
                  "type": "Grain",
                  "colour": 22.0,
                  "potential": 1.035
                },
                {
                  "name": "American 2-Row",
                  "type": "Grain",
                  "colour": 1.8,
                  "potential": 1.037
                },
                {
                  "name": "American 6-Row",
                  "type": "Grain",
                  "colour": 1.8,
                  "potential": 1.035
                },
                {
                  "name": "Aromatic Malt",
                  "type": "Grain",
                  "colour": 20.0,
                  "potential": 1.036
                },
                {
                  "name": "Biscuit",
                  "type": "Grain",
                  "colour": 25.0,
                  "potential": 1.036
                },
                {
                  "name": "Black Malt",
                  "type": "Grain",
                  "colour": 600.0,
                  "potential": 1.034
                },
                {
                  "name": "Black Patent",
                  "type": "Grain",
                  "colour": 525.0,
                  "potential": 1.025
                },
                {
                  "name": "Black Roasted Barley",
                  "type": "Grain",
                  "colour": 500.0,
                  "potential": 1.025
                },
                {
                  "name": "Brown Malt",
                  "type": "Grain",
                  "colour": 70.0,
                  "potential": 1.032
                },
                {
                  "name": "Brown Sugar, Dark",
                  "type": "Sugar",
                  "colour": 50.0,
                  "potential": 1.046
                },
                {
                  "name": "Brown Sugar, Light",
                  "type": "Sugar",
                  "colour": 8.0,
                  "potential": 1.046
                },
                {
                  "name": "Candi Sugar, Amber",
                  "type": "Sugar",
                  "colour": 75.0,
                  "potential": 1.036
                },
                {
                  "name": "Candi Sugar, Clear",
                  "type": "Sugar",
                  "colour": 0.5,
                  "potential": 1.036
                },
                {
                  "name": "Candi Sugar, Dark",
                  "type": "Sugar",
                  "colour": 275.0,
                  "potential": 1.036
                },
                {
                  "name": "Cane Sugar",
                  "type": "Sugar",
                  "colour": 0.0,
                  "potential": 1.046
                },
                {
                  "name": "Caraamber",
                  "type": "Grain",
                  "colour": 36.0,
                  "potential": 1.037
                },
                {
                  "name": "Caraaroma",
                  "type": "Grain",
                  "colour": 130.0,
                  "potential": 1.035
                },
                {
                  "name": "Carafa I malt",
                  "type": "Grain",
                  "colour": 320.0,
                  "potential": 1.036
                },
                {
                  "name": "Carafa II malt",
                  "type": "Grain",
                  "colour": 415.0,
                  "potential": 1.036
                },
                {
                  "name": "Carafa III malt",
                  "type": "Grain",
                  "colour": 525.0,
                  "potential": 1.036
                },
                {
                  "name": "Carahell",
                  "type": "Grain",
                  "colour": 13.0,
                  "potential": 1.035
                },
                {
                  "name": "Caramalt",
                  "type": "Grain",
                  "colour": 25.0,
                  "potential": 1.036
                },
                {
                  "name": "Caramunich I",
                  "type": "Grain",
                  "colour": 51.0,
                  "potential": 1.036
                },
                {
                  "name": "Caramunich II",
                  "type": "Grain",
                  "colour": 63.0,
                  "potential": 1.035
                },
                {
                  "name": "Caramunich III",
                  "type": "Grain",
                  "colour": 71.0,
                  "potential": 1.037
                },
                {
                  "name": "Carapils (Dextrine)",
                  "type": "Grain",
                  "colour": 1.0,
                  "potential": 1.033
                },
                {
                  "name": "Carared",
                  "type": "Grain",
                  "colour": 24.0,
                  "potential": 1.036
                },
                {
                  "name": "Caravienna",
                  "type": "Grain",
                  "colour": 20.0,
                  "potential": 1.034
                },
                {
                  "name": "Chocolate",
                  "type": "Grain",
                  "colour": 350.0,
                  "potential": 1.029
                },
                {
                  "name": "Chocolate, Pale",
                  "type": "Grain",
                  "colour": 200.0,
                  "potential": 1.030
                },
                {
                  "name": "Corn Sugar",
                  "type": "Sugar",
                  "colour": 0.0,
                  "potential": 1.046
                },
                {
                  "name": "Crystal 10",
                  "type": "Grain",
                  "colour": 10.0,
                  "potential": 1.035
                },
                {
                  "name": "Crystal 120",
                  "type": "Grain",
                  "colour": 120.0,
                  "potential": 1.033
                },
                {
                  "name": "Crystal 140",
                  "type": "Grain",
                  "colour": 140,
                  "potential": 1.033
                },
                {
                  "name": "Crystal 15",
                  "type": "Grain",
                  "colour": 15.0,
                  "potential": 1.035
                },
                {
                  "name": "Crystal 20",
                  "type": "Grain",
                  "colour": 20.0,
                  "potential": 1.035
                },
                {
                  "name": "Crystal 30",
                  "type": "Grain",
                  "colour": 30.0,
                  "potential": 1.035
                },
                {
                  "name": "Crystal 40",
                  "type": "Grain",
                  "colour": 40.0,
                  "potential": 1.034
                },
                {
                  "name": "Crystal 60",
                  "type": "Grain",
                  "colour": 60.0,
                  "potential": 1.034
                },
                {
                  "name": "Crystal 80",
                  "type": "Grain",
                  "colour": 80.0,
                  "potential": 1.034
                },
                {
                  "name": "Crystal 90",
                  "type": "Grain",
                  "colour": 90.0,
                  "potential": 1.033
                },
                {
                  "name": "Dextrose",
                  "type": "Sugar",
                  "colour": 0.0,
                  "potential": 1.046
                },
                {
                  "name": "Dry Malt Extract - Amber",
                  "type": "Extract",
                  "colour": 12.5,
                  "potential": 1.045
                },
                {
                  "name": "Dry Malt Extract - Dark",
                  "type": "Extract",
                  "colour": 18.0,
                  "potential": 1.044
                },
                {
                  "name": "Dry Malt Extract - Light",
                  "type": "Extract",
                  "colour": 7.5,
                  "potential": 1.045
                },
                {
                  "name": "Flaked Barley",
                  "type": "Grain",
                  "colour": 1.7,
                  "potential": 1.032
                },
                {
                  "name": "Flaked Corn",
                  "type": "Adjunct",
                  "colour": 1.3,
                  "potential": 1.037
                },
                {
                  "name": "Flaked Oats",
                  "type": "Adjunct",
                  "colour": 1.0,
                  "potential": 1.037
                },
                {
                  "name": "Flaked Rice",
                  "type": "Adjunct",
                  "colour": 1.0,
                  "potential": 1.032
                },
                {
                  "name": "Flaked Rye",
                  "type": "Adjunct",
                  "colour": 2.0,
                  "potential": 1.036
                },
                {
                  "name": "Flaked Wheat",
                  "type": "Adjunct",
                  "colour": 1.6,
                  "potential": 1.035
                },
                {
                  "name": "Golden Promise Malt",
                  "type": "Grain",
                  "colour": 3.0,
                  "potential": 1.038
                },
                {
                  "name": "Honey",
                  "type": "Sugar",
                  "colour": 1.0,
                  "potential": 1.035
                },
                {
                  "name": "Honey Malt",
                  "type": "Grain",
                  "colour": 25.0,
                  "potential": 1.037
                },
                {
                  "name": "Liquid Malt Extract - Amber",
                  "type": "Extract",
                  "colour": 9.0,
                  "potential": 1.036
                },
                {
                  "name": "Liquid Malt Extract - Dark",
                  "type": "Extract",
                  "colour": 15.0,
                  "potential": 1.036
                },
                {
                  "name": "Liquid Malt Extract - Light",
                  "type": "Extract",
                  "colour": 5.0,
                  "potential": 1.037
                },
                {
                  "name": "Liquid Malt Extract - Wheat",
                  "type": "Extract",
                  "colour": 3.0,
                  "potential": 1.037
                },
                {
                  "name": "Maris Otter Malt",
                  "type": "Grain",
                  "colour": 4.0,
                  "potential": 1.038
                },
                {
                  "name": "Melanoidin",
                  "type": "Grain",
                  "colour": 30.0,
                  "potential": 1.037
                },
                {
                  "name": "Munich I",
                  "type": "Grain",
                  "colour": 7.1,
                  "potential": 1.038
                },
                {
                  "name": "Munich II",
                  "type": "Grain",
                  "colour": 8.5,
                  "potential": 1.038
                },
                {
                  "name": "Pale Ale Malt",
                  "type": "Grain",
                  "colour": 3.0,
                  "potential": 1.038
                },
                {
                  "name": "Pale Malt",
                  "type": "Grain",
                  "colour": 2.0,
                  "potential": 1.037
                },
                {
                  "name": "Peated Malt",
                  "type": "Grain",
                  "colour": 2.8,
                  "potential": 1.034
                },
                {
                  "name": "Pilsner",
                  "type": "Grain",
                  "colour": 1.7,
                  "potential": 1.037
                },
                {
                  "name": "Rauchmalt",
                  "type": "Grain",
                  "colour": 14.0,
                  "potential": 1.037
                },
                {
                  "name": "Rice Hulls",
                  "type": "Adjunct",
                  "colour": 0.0,
                  "potential": 1.000
                },
                {
                  "name": "Roasted Barley",
                  "type": "Grain",
                  "colour": 450.0,
                  "potential": 1.028
                },
                {
                  "name": "Rye Malt",
                  "type": "Grain",
                  "colour": 3.5,
                  "potential": 1.030
                },
                {
                  "name": "Special Roast",
                  "type": "Grain",
                  "colour": 50.0,
                  "potential": 1.033
                },
                {
                  "name": "Special-B",
                  "type": "Grain",
                  "colour": 180.0,
                  "potential": 1.030
                },
                {
                  "name": "Torrified Wheat",
                  "type": "Grain",
                  "colour": 2.0,
                  "potential": 1.035
                },
                {
                  "name": "Victory",
                  "type": "Grain",
                  "colour": 25.0,
                  "potential": 1.034
                },
                {
                  "name": "Vienna",
                  "type": "Grain",
                  "colour": 3.0,
                  "potential": 1.038
                },
                {
                  "name": "Wheat Malt",
                  "type": "Grain",
                  "colour": 2.0,
                  "potential": 1.038
                },
                {
                  "name": "Wheat Malt, Dark",
                  "type": "Grain",
                  "colour": 7.0,
                  "potential": 1.038
                },
                {
                  "name": "Wheat Roasted",
                  "type": "Grain",
                  "colour": 300,
                  "potential": 1.025
                }
              ];
        }
    };
});