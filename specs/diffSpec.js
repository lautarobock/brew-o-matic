describe("Diff", function() {

	var obj1 = {
		name: "Jose"
	};

	var obj2 = {
		name: "Raul"
	};

	var obj3 = {
		name: "Raul"
	};

	var obj4 = {
	};
	
	var big1 = {
		value1: 'value1',
		value2: 'value2',
		value3: 3,
		value4: 4.6,
	};

	var big2 = {
		value1: 'value1',
		value2: 'value2',
		value3: 3,
		value4: 4.6,
	};

	var big3 = {
		value1: 'value1',
		value3: 2,
		value4: 4.6,
	};

	var date1 = {
		today: new Date(0)
	};

	var date2 = {
		today: new Date(0)
	};

	var complex1 = {
		address: {
			street: 'Freneria',
			number: 12
		}
	};

	var complex2 = {
		address: {
			street: 'Freneria',
			number: 12
		}
	};

	var complex3 = {
		address: {
			street: 'Carrer Freneria',
			number: 12
		}
	};

	var complex4 = {
		address: {
			street: 'Carrer Freneria',
		}
	};

	it("Should detect diferences in fist level simple attributes", function() {
		
		var diff = util.diff(obj1,obj2);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.name");

		diff = util.diff(obj2,obj3);
		expect(diff.length).toBe(0);
	});

	it("Should detect empty right values", function() {

		var diff = util.diff(obj1,obj4);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.name");
	});

	it("Should detect empty left values", function() {

		var diff = util.diff(obj4,obj1);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.name");
	});

	it("Should detect in more than one diferences",function() {

		var diff = util.diff(big1,big2);
		expect(diff.length).toBe(0);

		var diff = util.diff(big1,big3);
		expect(diff.length).toBe(2);
		expect(diff[0]).toBe("$.value2");
		expect(diff[1]).toBe("$.value3");
	});

	it("Should detect diferences in Date",function() {
		var diff = util.diff(date1,date2);
		expect(diff.length).toBe(0);
	});

	it("Should detect diferences in complex object", function() {
		var diff = util.diff(complex1,complex2);
		expect(diff.length).toBe(0);

		diff = util.diff(complex1,complex3);
		expect(diff.length).toBe(1);
		expect(diff[0]).toBe("$.address.street");

		diff = util.diff(complex1,complex4);
		expect(diff.length).toBe(2);
		expect(diff.indexOf("$.address.street")).not.toBe(-1);
		expect(diff.indexOf("$.address.number")).not.toBe(-1);
	});

});