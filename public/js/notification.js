(function() {
    var notification = angular.module("notification",[]);
    
    notification.factory("notificationData", function() {
        return {
            listener: null,
            reset: function() {
                if ( this.listener ) {
                    this.listener();
                }
            },
            updateListener : null,
            update: function() {
                if ( this.updateListener ) {
                    this.updateListener();
                }  
            }
        };
    });
    
    notification.controller("NotificationsCtrl",function($scope,Notification,$rootScope,notificationData,pushListener) {
        
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

        function onNewNotification(data) {
            console.log("INFO","New Notification (Data)", data);
            // $scope.notifications = Notification.query($scope.updateCount);
            $scope.notifications.splice(0,0,data);
            $scope.updateCount($scope.notifications);
        }

        $scope.$watch('user._id',function(user_id) {
            if ( user_id ) {
                $scope.notifications = Notification.query($scope.updateCount);
                pushListener.on("NOTIFICATION_ADD_" + user_id, onNewNotification);
            }                
        });

        $scope.$on('$destroy',function() {
            pushListener.off("NOTIFICATION_ADD_" + $scope.user._id, onNewNotification);
        });

        $rootScope.breadcrumbs = [{
            link: '#',
            title: 'Home'
        },{
            link: '#',
            title: 'Notificaciones'
        }];
        
        $scope.markAllAsRead = function() {
            angular.forEach($scope.notifications, function(n) {
                $scope.markAsRead(n,false);
            });
            notificationData.reset();
        };

        $scope.markAsRead = function(notification,update) {
            function callback() {
                if ( update ) {

                    notificationData.update();
                }    
            }
            if ( notification.status != 'read' ) {
                notification.status = 'read';
                if ( notification.$save ) {
                    notification.$save(callback);    
                } else {
                    Notification.save(notification,callback);
                }
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
        
    });
})();