describe("helper Module", function() {

	describe("BrewHelper", function() {

		beforeEach(angular.mock.module("helper"));

		it("Should make conversions", inject(function(BrewHelper) {
   			expect(BrewHelper.toLbs(0.45359)).toBe(1);
   			expect(BrewHelper.toLbs(0)).toBe(0);
   			expect(BrewHelper.toLbs(-0.45359)).toBe(-1);
   			expect(BrewHelper.toLbs(1)).toBe(2.204634140964307);

   			expect(BrewHelper.toOz(1)).toBe(35.274);
   			expect(BrewHelper.toOz(0)).toBe(0);
   			expect(BrewHelper.toOz(0.02834949254408346)).toBe(1);

			expect(BrewHelper.toGal(1)).toBe(0.264172052637296);
   			expect(BrewHelper.toGal(0)).toBe(0);
   			expect(BrewHelper.toGal(3.785411779999999)).toBe(1);   			

   			expect(BrewHelper.toPpg(1.050)).toBe(50);
   			expect(BrewHelper.toPpg(1.000)).toBe(0);
   			expect(BrewHelper.toPpg(0.999)).toBe(-1);

   			expect(BrewHelper.toPotential(50)).toBe(1.050);
   			expect(BrewHelper.toPotential(0)).toBe(1.000);
   			expect(BrewHelper.toPotential(-1)).toBe(0.999);
		}));

		it("Should round and pad numbers", inject(function(BrewHelper) {
   			
			//Round
   			expect(BrewHelper.round(1.001,1)).toBe(1);
   			expect(BrewHelper.round(1.1,1)).toBe(1);

   			expect(BrewHelper.round(1.001,100)).toBe(1);
   			expect(BrewHelper.round(1.1,100)).toBe(1.1);

   			expect(BrewHelper.round(1.1,0)).not.toBe(jasmine.any(Number));

   			expect(BrewHelper.round(1.001,-100)).toBe(1);

   			//Pad
   			expect(BrewHelper.pad(1,0)).toBe("1");
   			expect(BrewHelper.pad(1,1)).toBe("1");
   			expect(BrewHelper.pad(1,2)).toBe("01");
   			expect(BrewHelper.pad(1,3)).toBe("001");
   			expect(BrewHelper.pad(1,-1)).toBe("1");
   			expect(BrewHelper.pad(100,2)).toBe("100");

		}));

		it("Should calculate U value for gravity", inject(function(BrewHelper) {
   			
   			//Two values from matrix
   			expect(BrewHelper.calculateU(1.050,60)).toBe(0.231);
   			expect(BrewHelper.calculateU(1.040,60)).toBe(0.252);

   			//Value to interpolate
   			expect(BrewHelper.calculateU(1.045,60)).toBe((0.252+0.231)/2);
   			expect(BrewHelper.calculateU(1.048,60)).toBe((0.252*2+0.231*8)/10);
   			

   			//To not especified time
   			expect(BrewHelper.calculateU(1.050,65)).toBe(0);
   			expect(BrewHelper.calculateU(1.050,165)).toBe(0);

		}));

		it("Should convert color", inject(function(BrewHelper) {
   			
   			expect(BrewHelper.convertColor(3)).toBe("#FFCA5A");
   			expect(BrewHelper.convertColor(41)).toBe("black");
   			expect(BrewHelper.convertColor(50)).toBe("black");
   			expect(BrewHelper.convertColor(0)).toBe("white");
   			expect(BrewHelper.convertColor(-1)).toBe("white");

		}));
	});

	describe("BrewCalc", function() {
		
		beforeEach(angular.mock.module("helper"));

		var brewCalc;
		beforeEach(inject(function(BrewCalc) {
			brewCalc = BrewCalc;
		}));

		it("Should calculate % evap total", function() {
			expect(brewCalc.evapTotal(60, 10)).toBeCloseTo(0.1,10);
			expect(brewCalc.evapTotal(120, 10)).toBeCloseTo(0.19,10);
			expect(brewCalc.evapTotal(90, 10)).toBeCloseTo(0.145,10);
			expect(brewCalc.evapTotal(0, 10)).toBeCloseTo(0,10);
			expect(brewCalc.evapTotal(60, 100)).toBeCloseTo(1,10);
		});

		it("Should calculate Boil Size", function() {
			expect(brewCalc.calculateBoilSize(20, 0, 60, 10,0)).toBeCloseTo(23.64,1);
			expect(brewCalc.calculateBoilSize(20, 1, 60, 10,0)).toBeCloseTo(24.75,1);
		});

		it("Should calculate initial Mash Volume", function() {
			expect(brewCalc.initialMashVolume(18,6)).toBe(24);
			
		});

		it("Should calculate actual Mash Volume", function() {
			var steps = [{
				infuse: true,
				INFUSE_AMOUNT: 1
			},{
				infuse: true,
				INFUSE_AMOUNT: 1
			}];
			expect(brewCalc.actualMashVolume(0,20,steps)).toBe(21);
			expect(brewCalc.actualMashVolume(1,20,steps)).toBe(22);

			steps = [{
				infuse: false
			},{
				infuse: true,
				INFUSE_AMOUNT: 1
			}];
			expect(brewCalc.actualMashVolume(0,20,steps)).toBe(20);
			expect(brewCalc.actualMashVolume(1,20,steps)).toBe(21);

			steps = [];
			expect(brewCalc.actualMashVolume(-1,20,steps)).toBe(20);
		});

		it("Should calculate estimate Liters", function() {
			var stages = [{
				transferring: true,
				losses: 1
			},{
				transferring: true,
				transferring: 1
			}];
			expect(brewCalc.estimateLiters(0,20,stages)).toBe(20);
			expect(brewCalc.estimateLiters(1,20,stages)).toBe(19);
			expect(function() {
				brewCalc.estimateLiters(2,20,stages);
			}).toThrow();
		});

		it("Should calculate bottled Liters", function() {
			var bottles = [{
				size: 0.5,
				amount: 10,
				carbonatationType:'sugar'
			},{
				size: 0.3,
				amount: 10,
				carbonatationType:'sugar'
			}];

			var volumeByCarbonatationType = {};
			var liters = brewCalc.bottledLiters(volumeByCarbonatationType,bottles);

			expect(liters).toBe(8);
			expect(volumeByCarbonatationType.sugar).toBe(8);

			bottles[0].carbonatationType = 'co2';

			// volumeByCarbonatationType = {};
			liters = brewCalc.bottledLiters(volumeByCarbonatationType,bottles);

			expect(liters).toBe(8);
			expect(volumeByCarbonatationType.sugar).toBe(3);
			expect(volumeByCarbonatationType.co2).toBe(5);

		});

		it("Should fix Empty Values", function() {
			var recipe = {
				totalAmount:5
			};
			brewCalc.fixEmptyValues(recipe);
			expect(recipe.TrubChillerLosses).toBe(0);
			expect(recipe.mashTemp).toBe(66);
			expect(recipe.GrainTemp).toBe(25);
			expect(recipe.SpargeTempDesired).toBe(75);
			expect(recipe.SpargeDeadSpace).toBe(0);
			expect(recipe.lossMashTemp).toBe(0);
			expect(recipe.PercentEvap).toBe(10);
			expect(recipe.WatertoGrainRatio).toBe(3);
			expect(recipe.StrikeWater).toBe(15);
		});
	});

	describe("formatDate", function() {

		beforeEach(angular.mock.module("helper"));

		it("Should create filter to delegate format to util.formatDate", inject(function($filter) {
			var filter = $filter("formatDate");

			spyOn(util,'formatDate');

			var now = new Date();
			filter(now);

			expect(util.formatDate).toHaveBeenCalledWith(now,$filter('date'));
		}));

	});

	describe("TagColor", function() {

		beforeEach(angular.mock.module("helper"));

		it("Should return tag color consistently", inject(function(TagColor) {
			var pepeColor = TagColor("pepe");
			var joseColor = TagColor("jose");
			expect(pepeColor).not.toBe(joseColor);
			expect(pepeColor).toEqual(TagColor("pepe"));
			expect(joseColor).toEqual(TagColor("jose"));
		}));
		
	});
});