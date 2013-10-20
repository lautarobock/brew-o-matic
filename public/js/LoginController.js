(function() {

    var index = angular.module('login',[]);

 
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
                        id:obj.id,
                        name: obj.name
                    },function(user){
                        $rootScope.user = user;
                        console.log(user);
//                        if ( angular.isDefined(user.google_id) ) {
//                            $rootScope.user = user;
//                            console.log(user);
//                        } else {
//                            var newUser = new User({google_id:obj.id,name:obj.name});
//                            newUser.$save(function(user) {
//                                $rootScope.user = user;
//                            });
//                            console.log("Server Login Error");
//                        }
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
        

    });

})();