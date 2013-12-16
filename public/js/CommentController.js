(function() {
    
    var comments = angular.module("comments",[]);

    comments.controller("CommentController",function($scope,Recipe,$filter,$timeout,$interval,Observer) {
        
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

//        var d = $interval(function() {
//            Recipe.getComments({id:$scope.recipe._id},function(comments) {
//                console.log("comments",comments);
//                var diff = util.diff($scope.recipe.comments,comments,
//                    ["\\[[0-9]\\]*\\.\\$\\$hashKey","\\[[0-9]\\]*\\.\\$.*","\\$\\[\\$promise\\]", "\\$\\[\\$resolved\\]"]);
//                if ( diff.length != 0 ) {
//                    console.log("diff",diff);
//                    $scope.loadNewComments = true;
//                    $timeout(function() {
//                        $scope.loadNewComments = false;
//                    },3000);
//                    $scope.recipe.comments = comments;
//                }
//            });
//        },30*1000);

        var d = $interval(function () {
            var updates = Observer.query({}, function() {
                var changes = false;
                for ( var i=0; i<updates.length; i++ ) {
                    var u = updates[i].value;
                    if ( u.indexOf('RECIPE_COMMENT_ADD_') == 0 ) {
                        changes = true;
                    }
                }
                if ( changes ) {
                    Recipe.getComments({id:$scope.recipe._id},function(comments) {
                        console.log("comments",comments);
                        var diff = util.diff($scope.recipe.comments,comments,
                            ["\\[[0-9]*\\]*\\.\\$\\$hashKey","\\[[0-9]\\]*\\.\\$.*","\\$\\[\\$promise\\]", "\\$\\[\\$resolved\\]"]);
                        if ( diff.length != 0 ) {
                            console.log("diff",diff);
                            $scope.loadNewComments = true;
                            $timeout(function() {
                                $scope.loadNewComments = false;
                            },3000);
                            $scope.recipe.comments = comments;
                        }
                    });
                }
            });
        },10*1000);

        $scope.$watch("recipe._id", function () {
            if ( $scope.recipe && $scope.recipe._id ) {
                Observer.save({id:"RECIPE_COMMENT_ADD_" + $scope.recipe._id});
            };
        });


        $scope.$on('$destroy',function() {
            $interval.cancel(d);
            Observer.remove({id:"RECIPE_COMMENT_ADD_" + recipe._id});
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