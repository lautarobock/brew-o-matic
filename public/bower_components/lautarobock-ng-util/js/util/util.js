(function() {

    var util = angular.module("gt.util", []);

    util.factory("MainTitle", function() {
        var main = '';
        var add = null;
        var replace = null;
        return {
            get: function() {
                if ( add ) {
                    return add + ' - ' + main;
                } else if ( replace ) {
                    return replace;
                } else {
                    return main;    
                }
            },
            set: function(title) {
                main = title;
            },
            add: function(title) {
                add = title;
            },
            clearAdd: function() {
                add = null;
            },
            replace: function(title) {
                replace = title;
            },
            clearReplace: function() {
                replace = null;
            }
        };
    });

    util.factory("Responsive", function($window) {
        return {
            isXs: function() {
                return $window.document.width < 768;
            },
            isSm: function() {
                return $window.document.width >= 768 && $window.document.width < 992;
            },
            isMd: function() {
                return $window.document.width >= 992 && $window.document.width < 1200;
            },
            isLg: function() {
                return $window.document.width >= 1200;
            }
        };
    });

})();