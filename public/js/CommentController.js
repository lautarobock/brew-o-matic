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
        
    });
})();