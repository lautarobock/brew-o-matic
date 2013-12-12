(function() {
    
    var comments = angular.module("comments",[]);

    comments.controller("CommentController",function($scope,Recipe,$filter,$timeout,$interval) {
        
        $scope.rows = 1;

        $scope.loadNewComments = false;
        
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

        var d = $interval(function() {
            Recipe.getComments({id:$scope.recipe._id},function(comments) {
                console.log("comments",comments);
                var diff = util.diff($scope.recipe.comments,comments,
                    ["\\[[0-9]\\]*\\.\\$\\$hashKey","\\[[0-9]\\]*\\.\\$.*","\\$\\[\\$promise\\]", "\\$\\[\\$resolved\\]"]);
                if ( diff.length != 0 ) {
                    console.log("diff",diff);
                    $scope.loadNewComments = true;
                    $timeout(function() {
                        $scope.loadNewComments = false;
                    },3000);
                    $scope.recipe.comments = comments;
                }
            });
        },30*1000);

        $scope.$on('$destroy',function() {
            $interval.cancel(d);
        });

        
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