(function() {
    
    var comments = angular.module("comments",[]);

    comments.controller("CommentController",function($scope,Recipe,$filter,$timeout,$interval,pushListener) {
        
        $scope.rows = 1;

        $scope.loadNewComments = false;
        
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

        $scope.comment_new_id = null;

        function updateComments(comments) {
            var diff = util.diff($scope.recipe.comments,comments,[
                "\\[[0-9]*\\]*\\.\\$\\$hashKey",
                "\\[[0-9]*\\]*\\.\\$.*",
                "\\$\\[\\$promise\\]", 
                "\\$\\[\\$resolved\\]"]);

            if ( diff.length != 0 ) {
                console.log("diff",diff);

                //En este momento solo puede haber un comentario extra o uno menos.
                if ( comments.length > $scope.recipe.comments.length ) {
                    $scope.comment_new_id = comments[comments.length-1]._id;
                    $scope.recipe.comments = comments;
                    $timeout(function() {
                        $scope.comment_new_id = null;
                    },3000);
                } else {
                    $scope.comment_new_id = jsonPath($scope.recipe.comments,diff[0]);
                    $timeout(function() {
                        $scope.comment_new_id = null;
                        $scope.recipe.comments = comments;
                    },3000);
                }
                
            }
        }

        function loadComments() {
            Recipe.getComments({id:$scope.recipe._id},function(comments) {
                updateComments(comments);
            });
        }

        $scope.$watch("recipe._id", function () {
            if ( $scope.recipe && $scope.recipe._id ) {
                loadComments();
                pushListener.on("RECIPE_COMMENT_ADD_" + $scope.recipe._id, function (data) {
                    loadComments();
                });
                pushListener.on("RECIPE_COMMENT_REMOVE_" + $scope.recipe._id, function (data) {
                    loadComments();
                });
            };
        });


        $scope.$on('$destroy',function() {
            pushListener.off("RECIPE_COMMENT_ADD_" + $scope.recipe._id);
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