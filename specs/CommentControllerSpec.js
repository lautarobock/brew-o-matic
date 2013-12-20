describe("CommentController", function() {

	beforeEach(angular.mock.module('index'));

	var $scope;

	beforeEach(inject(function($rootScope, $controller) {
		$scope = $rootScope.$new();
		$controller("CommentController", {
			$scope: $scope
		});

		//dummy jquery function
		window.$ = function(id) {
			return {};
		};

		//override socket.io connect
		window.io = {
			connect: function() {
				return {
					on: function () {

					},
					removeListener: function() {

					},
					removeAllListeners: function() {

					}
				};
			}
		};

	}));

	it("Should define start number of rows for text area", function() {
		expect($scope.rows).toBe(1);
	});

	it("Should remove comment", inject(function(Recipe,$timeout) {
		//Dummy
		var element = {
			modal: function(id) {}	
		};
		//Define Spy
		spyOn(window,"$").andCallFake(function(id) {
			return element;
		});
		spyOn(element,"modal");
		spyOn(Recipe,"removeComment");
		//This method will be called when recipe._id is in scope ($watch)
		//I'm not insterested to verify it.
		spyOn(Recipe,"getComments").andCallFake(function(data, callback) {

		});
		

		//Set $scope context
		$scope.recipe = {
			_id: "RECIPE_ID"
		}

		//Call to Remove comment
		$scope.removeComment({_id: 'COMMENT_ID'});
		$timeout.flush();

		//Verify
		expect(window.$).toHaveBeenCalledWith("#confirmation-COMMENT_ID");
		expect(element.modal).toHaveBeenCalledWith("hide");

		expect(Recipe.removeComment).toHaveBeenCalledWith({
            comment: {_id: 'COMMENT_ID'},
            recipe_id: "RECIPE_ID"
        });
	}));

	it("Should load comments when recipe._id is in $scope", inject(function(Recipe) {

		spyOn(Recipe,"getComments").andCallFake(function(data, callback) {
			callback([{_id: "comment_id#1"},{_id: "comment_id#2"}]);
		});

		//To fire $watch
		$scope.recipe = {
			_id: "RECIPE_ID"
		}
		$scope.$apply();

		//Verify
		expect(Recipe.getComments).toHaveBeenCalledWith({id:"RECIPE_ID"},jasmine.any(Function));
		expect($scope.recipe.comments).toEqual([{_id: "comment_id#1"},{_id: "comment_id#2"}]);
	}));

	it("Should add and remove comment when push is called", inject(function(Recipe, pushListener) {
		var callbackAdd;
		var callbackRemove;
		spyOn(pushListener.socket, 'on').andCallFake(function(id,callback){
			if ( id == "RECIPE_COMMENT_ADD_RECIPE_ID") {
				callbackAdd = callback;
			}
			if ( id == "RECIPE_COMMENT_REMOVE_RECIPE_ID") {
				callbackRemove = callback;
			}
		});
		//To not call real ajax query
		spyOn(Recipe,"getComments");

		//To fire $watch
		$scope.recipe = {
			_id: "RECIPE_ID",
			comments: []
		}
		$scope.$apply();

		//Call to simulate incomming message from websocket
		callbackAdd({_id: "comment_id#1"});


		//Verify
		expect(pushListener.socket.on).toHaveBeenCalledWith("RECIPE_COMMENT_ADD_RECIPE_ID", jasmine.any(Function));
		expect(pushListener.socket.on).toHaveBeenCalledWith("RECIPE_COMMENT_REMOVE_RECIPE_ID", jasmine.any(Function));
		expect($scope.recipe.comments[0]).toEqual({_id: "comment_id#1"});
		expect($scope.recipe.comments.length).toBe(1);

		//and check for not add when the comment already is in collection
		//call callback with the same ID
		callbackAdd({_id: "comment_id#1"});
		expect($scope.recipe.comments.length).toBe(1);

		//Remove with wrong id
		callbackRemove({_id: "WRONG"});
		expect($scope.recipe.comments.length).toBe(1);
		//Remove ok
		callbackRemove({_id: "comment_id#1"});
		expect($scope.recipe.comments.length).toBe(0);
		//remove again
		callbackRemove({_id: "comment_id#1"});
		expect($scope.recipe.comments.length).toBe(0);
	}));

	it("Should unregister socket callback when destroy $scope", inject(function(Recipe, pushListener) {
		//To not call real ajax query
		spyOn(Recipe,"getComments");

		spyOn(pushListener.socket, 'on');
		spyOn(pushListener.socket, 'removeListener');

		//To fire $watch
		$scope.recipe = {
			_id: "RECIPE_ID",
			comments: []
		}
		$scope.$apply();

		//Verify
		expect(pushListener.socket.on).toHaveBeenCalledWith("RECIPE_COMMENT_ADD_RECIPE_ID", jasmine.any(Function));
		expect(pushListener.socket.on).toHaveBeenCalledWith("RECIPE_COMMENT_REMOVE_RECIPE_ID", jasmine.any(Function));
		
		$scope.$emit("$destroy");

		expect(pushListener.socket.removeListener).toHaveBeenCalledWith("RECIPE_COMMENT_ADD_RECIPE_ID", jasmine.any(Function));
		expect(pushListener.socket.removeListener).toHaveBeenCalledWith("RECIPE_COMMENT_REMOVE_RECIPE_ID", jasmine.any(Function));

	}));

	it("Should add a comment", inject(function (Recipe) {

		spyOn(Recipe,'addComment').andCallFake(function(comment, callback) {
			callback();
		});

		//To fire $watch
		$scope.recipe = {
			_id: "RECIPE_ID"
		}
		$scope.rows = 6;
		$scope.comment = "Bla bla";
		$scope.addComment({_id: 'comment_id'});

		expect(Recipe.addComment).toHaveBeenCalledWith({
                recipe_id: "RECIPE_ID",
                text: {_id: 'comment_id'}
            }, jasmine.any(Function));
		expect($scope.rows).toBe(1);
		expect($scope.comment).toBe("");

	}));

	it("Should chage rows and onfocus and onblur", function () {

		$scope.focus();
		expect($scope.rows).toBe(5);

		$scope.blur("Bla bla");
		expect($scope.rows).toBe(5);

		$scope.blur("");
		expect($scope.rows).toBe(1);

		$scope.rows = 5;
		$scope.blur();
		expect($scope.rows).toBe(1);
	});


});