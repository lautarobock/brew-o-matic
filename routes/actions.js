/**
 * Created with JetBrains WebStorm.
 * User: lautaro
 * Date: 20/10/13
 * Time: 13:58
 * To change this template use File | Settings | File Templates.
 */

var model = require('../domain/model.js');

exports.log = function(user_id,actionType,data) {
    model.Action.create(new model.Action({
            user_id:user_id,
            date: new Date(),
            actionType:actionType,
            data:data
        }), function(err,action) {
            if ( err ) {
                console.log("err",err)
                console.log("action",action)
            }
    });
};

/**
* Elimina el log de acciones mas viejas que 24 horas
*/
exports.removeOld = function() {
    var from  = new Date(new Date().getTime()-24*60*60*1000);
    console.log("Eliminando actions",from);
    model.Action.remove({date:{$lt:from}}).exec(function() {
        
    });
};
