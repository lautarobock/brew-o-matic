(function() {

    var index = angular.module('login',['calculator']);

    index.run(function($rootScope) {
        
        $rootScope.loginSuccess = false;
        
    });
 
    index.controller("LoginController",function($scope,$rootScope,User,Notification,notificationData,pushListener,CalculatorPopup) {
        
        $scope.openCalcPopup = function() {
            CalculatorPopup.open();
        };

        $scope.$on('g+login',function(event,authResult) {
            if ( authResult == null ) {
                $rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.$apply();
            } else if ( authResult['access_token']) {
              // Autorizado correctamente
              // Oculta el botón de inicio de sesión ahora que el usuario está autorizado, por ejemplo:
              //Guardo el token
              gapi.auth.setToken(authResult);
              
              //Pido los datos del usuario
              gapi.client.load('oauth2', 'v2', function() {
                var request = gapi.client.oauth2.userinfo.get();
                
                request.execute(function (obj){
                    User.getByGoogleId({
                        id:obj.id,
                        name: obj.name
                    },function(user){
                        $rootScope.loginSuccess = true;
                        $rootScope.user = user;
                        console.log(user);
                    });
                    
                });
              });
              
              //document.getElementById('signinButton').setAttribute('style', 'display: none');
            } else if ( authResult['error'] == "immediate_failed") {
                $rootScope.loginSuccess = true;
                $scope.loginError = '';
                $rootScope.$apply();
            } else if ( authResult['error'] ) {
                $rootScope.loginSuccess = true;
                $scope.loginError = authResult['error'];
                $scope.$apply();
                $rootScope.$apply();
                console.log('There was an error: ' + authResult['error']);
            } else {
                $rootScope.loginSuccess = true;
                $scope.loginError = JSON.stringify(authResult);
                $scope.$apply();
                $rootScope.$apply();
                console.log('Error inesperado');
            }
        });

        $scope.googleSignIn = function() {
            googleSignIn();
        };
        
        notificationData.listener = function() {
            $scope.notificationClass = '';
            $scope.notificationCount = 0;
        };

        notificationData.updateListener = function() {
            $scope.findNotificationsCount();
        };
                
        $scope.notificationClass = '';
        $scope.notificationCount = 0;

        $scope.$watch('user',function(user) {
            if (user) {
                $scope.findNotificationsCount();
                //setInterval($scope.findNotificationsCount,60*1000);
                pushListener.on("NOTIFICATION_ADD_" + user._id, function(data) {
                    console.log("INFO","New Notification (Count)", data);
                    $scope.findNotificationsCount();
                });
            }
        });

        $scope.findNotificationsCount = function() {
            console.log("Actualizacion notificaciones");
            Notification.findNews(function(nots) {
                $scope.notificationCount = nots.length;
                $scope.notificationClass = nots.length != 0 ? 'gt-notificaction-count-alert' : '';
            });
        };            
        


    });

})();