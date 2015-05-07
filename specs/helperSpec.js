describe("helperSpec", function() {

    beforeEach(angular.mock.module('helper'));

    describe('BrewCalc', function() {

        it("Should calculate Gravity from 2 mosts", inject(function(BrewCalc) {
            var items = [{
                size: 20,
                gravity: 1.080
            },{
                size: 20,
                gravity: 1.040
            }];

            var gravity = BrewCalc.calculateMix(items);
            expect(gravity).toBe(1.060);
        }));

        it("Should calculate Gravity from 1 most", inject(function(BrewCalc) {
            var items = [{
                size: 20,
                gravity: 1.080
            }];

            var gravity = BrewCalc.calculateMix(items);
            expect(gravity).toBe(1.080);
        }));

        it("Should calculate Gravity from empty one item", inject(function(BrewCalc) {
            var items = [{}];

            var gravity = BrewCalc.calculateMix(items);
            expect(gravity).toBe(0);
        }));

        it("Should calculate Gravity from empty one item", inject(function(BrewCalc) {
            var items = [{
                size: 0,
                gravity: 0
            }];

            var gravity = BrewCalc.calculateMix(items);
            expect(gravity).toBe(0);
        }));

        it("Should calculate Gravity from none", inject(function(BrewCalc) {
            var items = [];

            var gravity = BrewCalc.calculateMix(items);
            expect(gravity).toBe(0);

            gravity = BrewCalc.calculateMix();
            expect(gravity).toBe(0);
        }));

    });

    describe('BrewHelper', function() {

        it("Should calculate U", inject(function(BrewHelper) {

            var u = BrewHelper.calculateU(1.050,70);
            expect(u).toBe(0.238);

            u = BrewHelper.calculateU(1.050,80);
            expect(u).toBe(0.243);

            u = BrewHelper.calculateU(1.050,75);
            expect(u).toBe(0.2405);

            u = BrewHelper.calculateU(1.070,70);
            expect(u).toBe(0.199);

            u = BrewHelper.calculateU(1.070,80);
            expect(u).toBe(0.203);

            u = BrewHelper.calculateU(1.070,75);
            expect(u).toBe(0.201);

            //Others DO

            var values = {
                '1.030':0.288,
                '1.040':0.2635,
                '1.050':0.2405,
                '1.060':0.22,
                '1.070':0.201,
                '1.080':0.184,
                '1.090':0.168,
                '1.100':0.1535,
                '1.110':0.1405,
                '1.120':0.1285
            };

            for ( var i in values ) {
                u = BrewHelper.calculateU(parseFloat(i),75);
                expect(u).toBe(values[i]);
            }

        }));
    });


});
