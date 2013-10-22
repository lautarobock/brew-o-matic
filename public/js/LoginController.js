(function() {

    var index = angular.module('login',[]);

 
    index.controller("LoginController",function($scope,$rootScope,User,Notification) {
        $scope.$on('g+login',function(event,authResult) {
            if (authResult['access_token']) {
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
                        $rootScope.user = user;
                        console.log(user);
                    });
                    
                });
              });
              
              //document.getElementById('signinButton').setAttribute('style', 'display: none');
            } else if (authResult['error'] == "immediate_failed") {

            } else if ( authResult['error'] ) {
                $scope.loginError = authResult['error'];
                $scope.$apply();
                console.log('There was an error: ' + authResult['error']);
            } else {
                $scope.loginError = JSON.stringify(authResult);
                $scope.$apply();
                console.log('Error inesperado');
            }
        });

        
        $rootScope.notificationClass = '';
        $rootScope.notificationCount = 0;
        
        $scope.$watch('user',function(user) {
            if (user) {
                $scope.findNotificationsCount();
                setInterval($scope.findNotificationsCount,60*1000);
            }
        });

        $scope.findNotificationsCount = function() {
            console.log("Actualizacion notificaciones");
            Notification.findNews(function(nots) {
                $rootScope.notificationCount = nots.length;
                $rootScope.notificationClass = nots.length != 0 ? 'gt-notificaction-count-alert' : '';
            });
        };            
        


    });

})();