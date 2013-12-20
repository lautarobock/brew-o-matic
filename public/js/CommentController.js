(function() {
    
    var comments = angular.module("comments",[]);

    comments.controller("CommentController",function($scope,Recipe,$filter,$timeout,$interval,pushListener) {
        
        $scope.rows = 1;

        $scope.removeComment = function(comment) {
            $('#confirmation-'+comment._id).modal('hide');
            $timeout(function() {
                var remove = {
                    comment: comment,
                    recipe_id: $scope.recipe._id
                };
                Recipe.removeComment(remove);    
            }, 1*1000);
            
        };

        function loadComments() {
            Recipe.getComments({id:$scope.recipe._id},function(comments) {
                $scope.recipe.comments = comments;
            });
        }

        function onAddComment(data) {
            console.log("INFO","New comment", data);
            //Antes de agregar el comentario nuevo me fijo si no es que ya lo tengo
            //Esto puede pasar porque justo pude haber hecho un loadComments()
            var f = util.Arrays.filter($scope.recipe.comments, function(iter) {
                return data._id == iter._id ? 0 : -1;
            });
            if ( f.length == 0 ) {
                $scope.recipe.comments.push(data);
                $scope.$apply();
            }
        }

        function onRemoveComment(removed) {
            console.log("INFO","Remove comment", data);
            util.Arrays.remove($scope.recipe.comments,removed, function(removed, iter) {
                return removed._id == iter._id ? 0 : -1;
            });
            $scope.$apply();
        }

        $scope.$watch("recipe._id", function () {
            if ( $scope.recipe && $scope.recipe._id ) {
                loadComments();
                pushListener.on("RECIPE_COMMENT_ADD_" + $scope.recipe._id, onAddComment);
                pushListener.on("RECIPE_COMMENT_REMOVE_" + $scope.recipe._id, onRemoveComment);
            };
        });


        $scope.$on('$destroy',function() {
            pushListener.off("RECIPE_COMMENT_ADD_" + $scope.recipe._id, onAddComment);
            pushListener.off("RECIPE_COMMENT_REMOVE_" + $scope.recipe._id, onRemoveComment);
        });

        
        $scope.addComment = function(comment) {
            var newComment = {
                recipe_id: $scope.recipe._id,
                text: comment
            };
            Recipe.addComment(newComment,function(comments){
                    // updateComments(comments);
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