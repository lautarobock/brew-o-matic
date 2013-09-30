(function() {

    var index = angular.module('index');

 
    index.controller("LoginController",function($scope,$rootScope,User) {
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
                        id:obj.id
                    },function(user){
                        if ( angular.isDefined(user.google_id) ) {
                            $rootScope.user = user;
                            console.log(user);
                        } else {
                            var newUser = new User({google_id:obj.id,name:obj.name});
                            newUser.$save(function(user) {
                                $rootScope.user = user;
                            });
                            console.log("Server Login Error");
                        }
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
        
        $scope.disconnectUser = function() {
            var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
                    gapi.auth.getToken().access_token;
            // Realiza una solicitud GET asíncrona.
            $.ajax({
                type: 'GET',
                url: revokeUrl,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(nullResponse) {
                    //document.getElementById('signinButton').setAttribute('style', 'display: block');
                    $rootScope.user = undefined;
                    $scope.$apply();
                },
                error: function(e) {
                    // Gestiona el error
                    // console.log(e);
                    // Puedes indicar a los usuarios que se desconecten de forma manual si se produce un error
                    // https://plus.google.com/apps
                }
            });
        }
    });

})();