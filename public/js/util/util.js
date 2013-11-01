(function(exports) {
    
    /**
     * Heleper class to manage arrays
     */
    exports.Arrays = {
        remove: function(array,object,comparator) {
            if ( comparator ) {
                var index = -1;
                for ( var i=0; i<array.length; i++) {
                    if ( comparator(object, array[i]) == 0 ) {
                        index = i;
                        break;
                    }
                }
                if ( index !== -1 ) {
                    array.splice(index,1);
                }
                return index;
            } else {
                var index = array.indexOf(object);
                if ( index !== -1 ) {
                    array.splice(index,1);
                }
                return index;       
            }            
        },
        filter: function(array, comparator) {
            var result = [];
            for (var i=0; i<array.length; i++) {
                if ( comparator(array[i]) == 0 ) {
                    result.push(array[i]);
                }
            }
            return result;
        }
    };
})(typeof exports === 'undefined'? this['util'] = {} : exports );