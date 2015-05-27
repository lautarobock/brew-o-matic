(function(exports) {

    function DiffHelper() {
        var ready;
        var result;
        this.excludes = [];

        function parentArray(parent) {
            return {
                parent: parent,
                wrap: function(field) {
                    return parent+"["+field+"]";
                }
            };
        }

        function parentObject(parent) {
            return {
                parent: parent,
                wrap: function(field) {
                    return parent+"."+field;
                }
            };
        }

        this.compareAll = function(obj1,obj2,parent) {
            for( var i in obj1 ) {
                if ( ready.indexOf(i) == -1 ) {
                    ready.push(i);
                    var p;
                    if ( obj1 instanceof Array ) {
                        p = parentArray("$")
                    } else {
                        p = parentObject("$");
                    }
                    this.compare(obj1,obj2,i,parent||p);
                }

            }
        };

        this.compare = function(o1,o2,field,parent) {
            var diff = [];
            if ( o1[field] instanceof Date && o2[field] instanceof Date ) {
                if ( o1[field].getTime() != o2[field].getTime() ) {
                    diff = [parent.wrap(field)];
                }
            } else if ( o1[field] instanceof Array && o2[field] instanceof Array ) {
                var helper = new DiffHelper();
                helper.excludes = this.excludes;
                diff = helper.diff(o1[field],o2[field],parentArray(parent.wrap(field)));
            } else if ( o1[field] instanceof Object && o2[field] instanceof Object ) {
                var helper = new DiffHelper();
                helper.excludes = this.excludes;
                diff = helper.diff(o1[field],o2[field],parentObject(parent.wrap(field)));
            } else if ( o1[field] != o2[field] ) {
                diff = [parent.wrap(field)];
            }
            for ( var i = 0; i<diff.length; i++ ) {
                var fail = false;
                for ( var ri=0; ri<this.excludes.length; ri++) {
                    var reg = new RegExp(this.excludes[ri]);
                    var fail = fail || reg.test(diff[i]);
                }
                if ( !fail ) {
                    result.push(diff[i]);
                }
            }
        };

        this.diff = function(obj1,obj2,parent) {
            ready = [];
            result = [];
            this.compareAll(obj1,obj2,parent);
            this.compareAll(obj2,obj1,parent);
            return result;
        };
    }

    exports.diff = function(obj1,obj2,excludes) {
        var helper = new DiffHelper();
        helper.excludes = excludes || [];
        return helper.diff(obj1,obj2);
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

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        var tomorroy = new Date();
        tomorroy.setDate(tomorroy.getDate()+1);

        if ( diffSec < 0 ) { //En el futuro
            if ( diffSec>-10) {
                return "Ahora";
            } else if ( diffSec>-60) {
                return "En menos de un minuto";
            } else if (diffSec > -(60*60)) { // Si es menos de una hora
                return "En " + Math.round(-diffSec/60) + " minutos";
            } else if ( date.getDate() == new Date().getDate() &&
                date.getMonth() == new Date().getMonth() &&
                date.getYear() == new Date().getYear()) { //si aun es el mismo dia, pero mas adelante
                return "En " + Math.floor(-diffSec/60/60) + ":" + exports.pad(Math.floor((-diffSec/60) % 60),2) + " Horas";
            } else if (date.getDate() == tomorroy.getDate() &&
                date.getMonth() == tomorroy.getMonth() &&
                date.getYear() == tomorroy.getYear()) { // Si sera mañana
                return "Mañana " + defaultFormatter(date,'HH:mm');
            }  else {
                return defaultFormatter(date,'dd/MM/yyyy HH:mm');
            }
        } else {// en el pasado
            if (diffSec<10) { // Si es menos de un minuto
                return "Ahora";
            } else if (diffSec<60) { // Si es menos de un minuto
                return "Hace menos de un minuto";
            } else if (diffSec < (60*60)) { // Si es menos de una hora
                return "Hace " + Math.round(diffSec/60) + " minutos";
            } else if (date.getDate() == new Date().getDate() &&
                date.getMonth() == new Date().getMonth() &&
                date.getYear() == new Date().getYear()) { //si aun es el mismo dia
                // return "Hoy" + " hace " + Math.round(diffSec/60/60) + " horas";
                return "Hoy" + " hace " + Math.floor(diffSec/60/60) + ":" + exports.pad(Math.floor((diffSec/60) % 60),2) + " Horas";
            } else if (date.getDate() == yesterday.getDate() &&
                date.getMonth() == yesterday.getMonth() &&
                date.getYear() == yesterday.getYear()) { // Si fue durane el dia de ayer
                return "Ayer " + defaultFormatter(date,'HH:mm');
            } else {
                var days = diffSec/60/60/24;
                if ( days > 365 ) {
                    var years = Math.floor(days / 365);
                    var daysLeft = Math.floor(days % 365);
                    return 'Hace $years$months$days'
                        .replace('$years', yearText(years))
                        .replace('$months', monthsText(Math.floor(daysLeft / 30)))
                        .replace('$days', daysText(Math.floor(daysLeft % 30)));
                } else if ( days > 30 ) {
                    return 'Hace $months meses y $days dias'
                        .replace('$months', Math.floor(days / 30))
                        .replace('$days', Math.floor(days % 30));
                } else {
                    return 'Hace $days dias'
                    .replace('$days', Math.floor(days));
                }
            }
        }

    };

    function yearText(years) {
        if ( years > 1 ) {
            return years + ' años';
        } else if ( years === 1 ) {
            return '1 año';
        } else {
            return '';
        }
    }

    function daysText(days) {
        if ( days > 1 ) {
            return ', ' + days + ' dias';
        } else if ( days === 1 ) {
            return ', 1 dia';
        } else {
            return '';
        }
    }

    function monthsText(months) {
        if ( months > 1 ) {
            return ', ' + months + ' meses';
        } else if ( months === 1 ) {
            return ', 1 mes';
        } else {
            return '';
        }
    }

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
