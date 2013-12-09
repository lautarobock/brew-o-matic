(function(exports) {
    
    function compare(o1,o2,field,result,parent) {
        if ( o1[field] instanceof Date && o2[field] instanceof Date ) {
            
            if ( o1[field].getTime() != o2[field].getTime() ) {
                result.push("$."+(parent||'')+field);    
            }
            return;
        } else if ( o1[field] instanceof Object && o2[field] instanceof Object ) {
            
            var diff = exports.diff(o1[field],o2[field],field+".");
            for (var i = 0; i<diff.length; i++ ) {
                result.push(diff[i]);
            }
            
            return;
        } else if ( o1[field] != o2[field] ) {
            
            result.push("$."+(parent||'')+field);
            return;
        }
        
    }

    exports.diff = function(obj1,obj2,parent) {
        var r = [];
        var ready = [];
        for( var i in obj1 ) {
            ready.push(i);
            compare(obj1,obj2,i,r,parent);
        }
        for( var i in obj2 ) {
            if ( ready.indexOf(i) == -1 ) {
                ready.push(i);
                compare(obj1,obj2,i,r,parent);
            }
        }
        return r;
    };

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

    exports.formatDate = function(date,defaultFormatter) {
        date = new Date(date);
        //Fecha de hoy en segundos
        var today = new Date().getTime()/1000;
        //Fecha del comentario en segundos
        var dateSec = date.getTime()/1000;

        //Diferencia en segundos
        var diffSec = today-dateSec;

        if ( diffSec < 0 ) { //En el futuro
            if ( diffSec>-10) {
                return "Ahora";
            } else if ( diffSec>-60) {
                return "En menos de un minuto"
            } else if (diffSec > -(60*60)) { // Si es menos de una hora
                return "En " + Math.round(-diffSec/60) + " minutos";
            } else if ( date.getDate() == new Date().getDate()) { //si aun es el mismo dia, pero mas adelante
                return "En " + Math.floor(-diffSec/60/60) + ":" + exports.pad(Math.floor((-diffSec/60) % 60),2) + " Horas";
            } else if (date.getDate() == new Date().getDate()+1 ) { // Si sera mañana
                return "Mañana " + defaultFormatter(date,'HH:mm');
            }  else {
                return defaultFormatter(date,'dd/MM/yyyy HH:mm');
            }
        } else {// en el pasado
            if (diffSec<10) { // Si es menos de un minuto
                return "Ahora";
            } else if (diffSec<60) { // Si es menos de un minuto
                return "Hace menos de un minuto"
            } else if (diffSec < (60*60)) { // Si es menos de una hora
                return "Hace " + Math.round(diffSec/60) + " minutos";
            } else if (date.getDate() == new Date().getDate()) { //si aun es el mismo dia
                return "Hoy" + " hace " + Math.round(diffSec/60/60) + " horas";
            } else if (date.getDate() == new Date().getDate()-1 ) { // Si fue durane el dia de ayer
                return "Ayer " + defaultFormatter(date,'HH:mm');
            } else {
                return defaultFormatter(date,'dd/MM/yyyy HH:mm');
            }
        }

    };

    exports.pad = function(value,zeros) {
        value = value.toString();
        if (value.length > zeros) {
            return value;
        } else {
            var result = value;
            for ( var i=0; i<zeros-value.length; i++) {
                result = "0" + result;
            }
            return result;
        }
    }

})(typeof exports === 'undefined'? this['util'] = {} : exports );