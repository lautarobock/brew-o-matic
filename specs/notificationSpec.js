
describe("notification module", function() {

	describe("notificationData Service", function() {

		beforeEach(angular.mock.module('index'));
		// beforeEach(angular.mock.module('notification'));

		it("Should has a notificationData Service and call to listener",inject(function($controller,$rootScope,notificationData) {

			expect(notificationData).toBeDefined();

			var mock = {
				called: function() {

				}
			};

			spyOn(mock,'called');

			notificationData.listener = function() {
				mock.called();
			}
			
			var $scope = $rootScope.$new();
			$controller("NotificationsCtrl", {
				$scope: $scope
			});

			expect(mock.called).toHaveBeenCalled()

		}));

		it("Should has to load notification and counts",inject(function(
					$controller,
					$rootScope,
					notificationData,
					Notification,
					pushListener) {

			//Mock Notification.query()
			spyOn(Notification,'query').andCallFake(function(callback) {
				$scope.notification = [{_id:'not_1',status:'new'},{_id:'not_2',status:'unread'}];
				callback($scope.notification);
			});

			spyOn(pushListener,'on');

			var $scope = $rootScope.$new();
			$controller("NotificationsCtrl", {
				$scope: $scope
			});

			//change user to fire $watch
			$rootScope.user = {
				_id: 'Jose_id',
				name: "Jose"
			}
			$rootScope.$apply();

			//Verify
			expect(Notification.query).toHaveBeenCalled();
			expect(pushListener.on).toHaveBeenCalledWith("NOTIFICATION_ADD_Jose_id", jasmine.any(Function));
			expect($scope.countUnread).toBe(1);
			expect($scope.countNew).toBe(1);

		}));

		it("Should has to mark as read",inject(function(
					$controller,
					$rootScope,
					notificationData,
					Notification) {

			//Creo scope y controlelr
			var $scope = $rootScope.$new();
			$controller("NotificationsCtrl", {
				$scope: $scope
			});
			//Set notifications
			$scope.countUnread = 1;
            $scope.countNew = 1;
			$scope.notifications = [{_id:'not_1',status:'new',$save: function() {}},
				{_id:'not_2',status:'unread',$save: function() {}}];
			spyOn($scope.notifications[0],'$save');
			spyOn($scope.notifications[1],'$save');

			//do action
			$scope.markAsRead($scope.notifications[0]);

			//Verifications
			expect($scope.countUnread).toBe(1);
			expect($scope.countNew).toBe(0);
			expect($scope.notifications[0].$save).toHaveBeenCalled();

			//do action
			$scope.markAsRead($scope.notifications[1]);

			//Verifications
			expect($scope.countUnread).toBe(0);
			expect($scope.countNew).toBe(0);
			expect($scope.notifications[1].$save).toHaveBeenCalled();

		}));

		it("Should obtain status css class name", inject(function(
					$controller,
					$rootScope) {

			//Creo scope y controlelr
			var $scope = $rootScope.$new();
			$controller("NotificationsCtrl", {
				$scope: $scope
			});

			expect($scope.statusClass({status:'unread'})).toBe('gt-notification-unread');
			expect($scope.statusClass({status:'new'})).toBe('gt-notification-new');
			expect($scope.statusClass({status:'read'})).toBe('');

		}));

	});
});