describe("indexSpec", function() {

	beforeEach(angular.mock.module('index'));

	it("rootScope", inject(function($rootScope,alertFactory) {
		expect($rootScope.BrewCalc).toBeDefined();
		expect($rootScope.version).toBeDefined();
		expect($rootScope.env).toBeDefined();
		expect($rootScope.color).toBeDefined();
		expect($rootScope.encodeName("Jose%")).toBe(encodeURIComponent("Jose%"));

		//Shared URL
		var ID = "Witbier-12121-12121"
		expect($rootScope.sharedUrl(ID)).toBe('http://server:80/share.html#/Witbier-12121-12121');

		var date = new Date(0);
		expect($rootScope.formatDate(date)).toBe('01/01/1970 01:00');
		
		// date = new Date();
		// expect($rootScope.formatDate(date)).toBe('Ahora');

		date = new Date();
		date.setSeconds(date.getSeconds()-10);
		expect($rootScope.formatDate(date)).toBe('Hace menos de un minuto');

		date = new Date();
		date.setSeconds(date.getSeconds()+10);
		expect($rootScope.formatDate(date)).toBe('En menos de un minuto');

		
		expect($rootScope.getAlerts().length).toBe(0);
		alertFactory.create("danger","Hola","Titulo");
		expect($rootScope.getAlerts().length).toBe(1);

	}));
});