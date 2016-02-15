describe("brewersfriend", function() {

	describe("bfYeast", function() {
		it("Should use bfYeast", function() {
			var expected = {
				yeastNeeded: 195,
				yeastCount: 110,
				yeastDifference: -85,
				actualPitchRate: 0.42
			};

			var res = bfYeast.recalculate(
				21,
				1.050,
				0.75,
				'dry',
				11,
				10
			);

			expect(res.yeastNeeded).toBe(expected.yeastNeeded);
			expect(res.yeastCount).toBe(expected.yeastCount);
			expect(res.yeastDifference).toBe(expected.yeastDifference);
			expect(res.actualPitchRate).toBe(expected.actualPitchRate);
		});
	});

	describe('bfWater', function() {
		it('Should calculate diluted water', function() {
			var output = {
				diluted: new Array(6),
				diff: new Array(6),
				salts: new Array(6),
				result: new Array(6),
				adjusted: new Array(6)
			};

			var input = {
				dilution:50,
			    mashvolume: 79,
			    source: [15,6,42,35,35,75,0],
			    target: [60,5,55,10,95,0,0],
			    CaCO3: 0,
			    NaHCO3: 0,
			    CaSO4: 0,
			    CaCl2: 0,
			    MgSO4: 0,
			    NaCl: 0
			};

			bfWater.recalculate(input,output);

			for ( var i=0; i<7; i++ ) {
				expect(output.diluted[i]).toBe(bfWater.rounddecimal(input.source[i]/2,0));
			}

		});

		it('Should calculate water profile', function() {
			expect(bfWater.recalculate).toBeDefined();

			var output = {
				diluted: new Array(6),
				diff: new Array(6),
				salts: new Array(6),
				result: new Array(6),
				adjusted: new Array(6)
			};

			var input = {
				dilution:10,
			    mashvolume: 79,
			    source: [15,6,42,35,35,75,0],
			    target: [60,5,55,10,95,0,0],
			    CaCO3: 0,
			    NaHCO3: 0,
			    CaSO4: 0,
			    CaCl2: 0,
			    MgSO4: 0,
			    NaCl: 0
			};

			bfWater.recalculate(input,output);

			console.log('input', JSON.stringify(input,null,4));
			console.log('output',JSON.stringify(output,null,4));
		});
	});
});
