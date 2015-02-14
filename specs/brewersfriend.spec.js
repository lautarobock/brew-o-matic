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
});
