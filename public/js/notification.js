(function() {
    var notification = angular.module("notification",[]);
    
    notification.factory("notificationData", function() {
        return {
            listener: null,
            reset: function() {
                if ( this.listener ) {
                    this.listener();
                }
            }
        };
    });
    
    notification.controller("NotificationsCtrl",function($scope,Notification,$rootScope,notificationData) {
        
        notificationData.reset();
        
        $scope.updateCount = function(notifications) {
            $scope.countUnread = 0;
            $scope.countNew = 0;
            angular.forEach(notifications, function(not) {
                if ( not.status == 'new') {
                    $scope.countNew++;
                } else if ( not.status == 'unread') {
                    $scope.countUnread++;
                }
            });
        };

        $scope.$watch('user',function() {
            $scope.notifications = Notification.query($scope.updateCount);
        });


        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Notificaciones'
        }];
        
        $scope.markAsRead = function(notification) {
            if ( notification.status != 'read' ) {
                notification.status = 'read';
                notification.$save();
                $scope.updateCount($scope.notifications);
            }
        };
        
        $scope.statusClass = function(notification) {
            if ( notification.status == 'unread') { 
                return 'gt-notification-unread';
            } else if ( notification.status == 'new') {
                return 'gt-notification-new';
            }
            return '';
        };
        
        //$rootScope.notificationCount = 0;
        //$rootScope.notificationClass = '';
        
    });
})();