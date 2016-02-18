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
			for ( var i=0; i<6; i++ ) {
				expect(output.startwater[i]).toBe(input.source[i]/2);
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

			//diluted is rounded
			for ( var i=0; i<7; i++ ) {
				expect(output.diluted[i]).toBe(bfWater.rounddecimal(input.source[i]*0.9,0));
			}
			//Starwater is diluted exact
			for ( var i=0; i<6; i++ ) {
				expect(output.startwater[i]).toBe(input.source[i]*0.9);
			}
		});

		it('Should calculate specific water profile', function() {
			expect(bfWater.recalculate).toBeDefined();

			var output = {
				diluted: new Array(6),
				diff: new Array(6),
				salts: new Array(6),
				result: new Array(6),
				adjusted: new Array(6)
			};

			var input = {
				dilution: 0,
			    mashvolume: 79,
				// mashunits: 'liters',
			    source: [15,6,42,35,35,75,0],
			    target: [60,5,55,10,95,0,0],
			    CaCO3: 0,
			    NaHCO3: 0,
			    CaSO4: 4,
			    CaCl2: 11,
			    MgSO4: 0,
			    NaCl: 0
			};

			bfWater.recalculate(input,output);

			expect(output.Ca_balance).toBe(bfWater.Balance.NORMAL);
			expect(output.Mg_balance).toBe(bfWater.Balance.NORMAL);
			expect(output.SO4_balance).toBe(bfWater.Balance.NORMAL);
			expect(output.Na_balance).toBe(bfWater.Balance.NORMAL);
			expect(output.Cl_balance).toBe(bfWater.Balance.NORMAL);
			expect(output.SO4Cl_balance).toBe(bfWater.Ratio.MALTY);
			expect(output.Alkalinity_balance).toBe(bfWater.Alkalinity.AMBER);

			expect(output.salts).toEqual([50,0,28,0,67,0,0]);
			expect(output.result[0].value).toBe(5); 	//Ca+2
			expect(output.result[1].value).toBe(1); 	//Mg+2
			expect(output.result[2].value).toBe(15); 	//SO4-2
			expect(output.result[3].value).toBe(25); 	//Na+
			expect(output.result[4].value).toBe(7); 	//Cl-
			expect(output.result[5].value).toBe(75); 	//HCO3-
			expect(output.result[6].value).toBe(61); 	//Alkalinity
			expect(output.result[0].range).toBeTruthy();//Ca+2
			expect(output.result[1].range).toBeTruthy();//Mg+2
			expect(output.result[2].range).toBeTruthy();//SO4-2
			expect(output.result[3].range).toBeFalsy(); //Na+
			expect(output.result[4].range).toBeTruthy();//Cl-
			expect(output.result[5].range).toBeFalsy(); //HCO3-
			expect(output.result[6].range).toBeTruthy();//Alkalinity

			expect(output.adjusted).toEqual([65,6,70,35,102,75,61]);
			expect(output.CaSO4_tsp).toBe(1);
			expect(output.CaCl2_tsp).toBe(3.235294117647059);

			console.log('output',JSON.stringify(output,null,4));
		});
	});
});
