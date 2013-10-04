(function() {
    
    var comments = angular.module("comments",[]);

    comments.controller("CommentController",function($scope,Recipe,$filter,$timeout) {
        
        $scope.rows = 1;
        
        $scope.removeComment = function(comment) {
            var remove = {
                comment: comment,
                recipe_id: $scope.recipe._id
            };
            Recipe.removeComment(remove,function(comments){
                    $('#confirmation').modal('hide');
                    $timeout(function() {
                        $scope.recipe.comments = comments;
                    },500);
                    
                });
        };
        
        $scope.addComment = function(comment) {
            var newComment = {
                recipe_id: $scope.recipe._id,
                text: comment
            };
            Recipe.addComment(newComment,function(comments){
                    $scope.recipe.comments = comments;
                    $scope.comment = '';
                    $scope.rows = 1;
                });
        };

        $scope.focus = function(comment) {
            $scope.rows = 5;
        };
        
        $scope.blur = function(comment) {
            if (!comment || comment == '') {
                $scope.rows = 1;
            }
        };
        
        $scope.formatDate = function(date) {
            date = new Date(date);
            //Fecha de hoy en segundos
            var today = new Date().getTime()/1000;
            //Fecha del comentario en segundos
            var dateSec = date.getTime()/1000;
            
            //Diferencia en segundos
            var diffSec = today-dateSec;
            
            if (diffSec<60) { // Si es menos de un minuto
                return "Hace menos de un minuto"
            } if (diffSec < (60*60)) { // Si es menos de una hora
                return "Hace " + Math.round(diffSec/60) + " minutos";
            } if (date.getDate() == new Date().getDate()) { //si aun es el mismo dia
                return "Hoy" + " hace " + Math.round(diffSec/60/60) + " horas";
            } if (date.getDate() == new Date().getDate()-1 ) { // Si fue durane el dia de ayer
                return "Ayer " + $filter('date')(date,'HH:mm');
            } else {
                return $filter('date')(date,'dd/MM/yyyy HH:mm');
            }
        };
    });
})();