describe("index Module", function() {

	beforeEach(angular.mock.module('index'));

	it("rootScope should respond to some messages", inject(function($rootScope,alertFactory) {
		expect($rootScope.BrewCalc).toBeDefined();
		expect($rootScope.version).toBeDefined();
		expect($rootScope.env).toBeDefined();
		expect($rootScope.color).toBeDefined();
		expect($rootScope.encodeName("Jose%")).toBe(encodeURIComponent("Jose%"));

		//Shared URL
		var ID = "Witbier-12121-12121"
		expect($rootScope.sharedUrl(ID)).toBe('http://server:80/share.html#/Witbier-12121-12121');

		// var date = new Date(0);
		// expect($rootScope.formatDate(date)).toBe('01/01/1970 01:00');
		
		// date = new Date();
		// expect($rootScope.formatDate(date)).toBe('Ahora');

		date = new Date();
		date.setSeconds(date.getSeconds()-50);
		expect($rootScope.formatDate(date)).toBe('Hace menos de un minuto');

		date = new Date();
		date.setSeconds(date.getSeconds()+50);
		expect($rootScope.formatDate(date)).toBe('En menos de un minuto');

		
		expect($rootScope.getAlerts().length).toBe(0);
		alertFactory.create("danger","Hola","Titulo");
		expect($rootScope.getAlerts().length).toBe(1);

	}));
});

describe("MainController", function() {

	beforeEach(angular.mock.module('index'));

	var $scope = null;

	beforeEach(inject(function($controller, $rootScope){
		$scope = $rootScope.$new();

		$controller("MainController", {
			$scope: $scope
		});		
	}));

	it("Should call to Google Log-in", inject(function($controller, $rootScope) {
		googleSignIn = function() {
			console.log("EA EA");
		};

		spyOn(window,"googleSignIn");

		$scope.login();

		expect(window.googleSignIn).toHaveBeenCalled();

		delete googleSignIn;
	}));

	it("Should has an empty breadcrumb", inject(function($controller, $rootScope) {
		expect($rootScope.breadcrumbs.length).toBe(0);
	}));
});

describe("UserSettingsCtrl", function() {

	beforeEach(angular.mock.module('index'));

	var $scope = null;

	beforeEach(inject(function($controller, $rootScope){
		$scope = $rootScope.$new();

		$controller("UserSettingsCtrl", {
			$scope: $scope
		});
	}));

	it("Should has a basic properties", inject(function($rootScope) {
		//Breadcrumb
		expect($rootScope.breadcrumbs.length).toBe(2);
		expect($rootScope.breadcrumbs[1].title).toBe("Configuracion");

		//Notifications
		expect($scope.notifications.length).toBe(0);
	}));

	it("Should can save by User resource", inject(function($rootScope,User) {
		var user = {
			name: 'Jose'
		};
		$rootScope.user = user;
		spyOn(User,"updateSettings").andCallFake(function(user, callback) {
			callback();
		});
		$scope.save();
		expect(User.updateSettings).toHaveBeenCalledWith(user,jasmine.any(Function));
		expect($scope.notifications.length).toBe(1);
	}));

	it("Should has a disconnectUser method", function() {
		expect($scope.disconnectUser).toBeDefined();
	});
});

describe("HomeCtrl", function() {

	beforeEach(angular.mock.module('index'));
	
	var $scope = null;

	beforeEach(inject(function($controller, $rootScope){
		$scope = $rootScope.$new();

		$controller("HomeCtrl", {
			$scope: $scope
		});
	}));


	it("Should add to favorites some recipe", inject(function (User,$rootScope) {
		var recipe = {
			NAME: 'My Recipe'
		};
		$rootScope.user = {
			name: "Jose"
		}

		spyOn(User,'addToFavorites').andCallFake(function(recipe,callback) {
			callback({
				favorites: [recipe]
			});
		});

		$scope.addFavorites(recipe);

		//controlo que la receta agregada este en los favoritos
		expect($rootScope.user.favorites.indexOf(recipe)).not.toBe(-1);

		//que se haya llamado al servicio de guardar los favoritso
		expect(User.addToFavorites).toHaveBeenCalledWith(recipe,jasmine.any(Function));
	}));

	it("Should remove to favorites some recipe", inject(function (User,$rootScope) {
		var recipe = {
			NAME: 'My Recipe'
		};
		$rootScope.user = {
			name: "Jose",
			favorites: [recipe]
		}

		spyOn(User,'removeFromFavorites').andCallFake(function(recipe,callback) {
			callback({
				favorites: []
			});
		});

		expect($rootScope.user.favorites.indexOf(recipe)).not.toBe(-1);
		$scope.removeFavorites(recipe);

		//controlo que la receta agregada este en los favoritos
		expect($rootScope.user.favorites.indexOf(recipe)).toBe(-1);

		//que se haya llamado al servicio de guardar los favoritso
		expect(User.removeFromFavorites).toHaveBeenCalledWith(recipe,jasmine.any(Function));
	}));

	it("Should load user recipes when user is set on rootScope", inject(function($rootScope,User,Recipe,$routeParams) {

		var recipes = [{NAME:'Recipe 1'},{NAME:'Recipe 2'}];

		spyOn(Recipe,'findByUser').andReturn(recipes);
		
		spyOn(User,'get').andCallFake(function(user_id, callback) {
			$scope.viewUser = {
				name: 'view user name'
			};
			callback();
		});

		$routeParams.userId = "USER_ID";

		//change user and fire $watch
		$rootScope.user = {
			name: "Raul"
		};
		$rootScope.$apply();

		expect($rootScope.breadcrumbs.length).toBe(2);
		expect($rootScope.breadcrumbs[1].title).toBe('view user name');
		expect($scope.recipes.length).toBe(2);
		expect(User.get).toHaveBeenCalledWith({id:"USER_ID"}, jasmine.any(Function));
		expect(Recipe.findByUser).toHaveBeenCalledWith({id:"USER_ID"});

	}));
});
