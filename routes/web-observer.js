/**
 * Created by lautaro on 14/12/13.
 */

var observer = require("./observer");

var changes = {};
var observables = {};

exports.when = function(req,res) {
    //Si ya tiene uno con el mismo ID lo elimino
    if ( observables[req.session.user_id + "_" + req.params.id] ) {
        console.log("INFO","Elimino observer repetido")
        observables[req.session.user_id + "_" + req.params.id].cancel();
        delete observables[req.session.user_id + "_" + req.params.id];
    }

    var observable = observer.when(req.params.id).call(function() {
        console.log("INFO", "Observer callback");
        changes[req.session.user_id] = changes[req.session.user_id] || {};
        changes[req.session.user_id][req.params.id] = true;
    });

    observables[req.session.user_id + "_" + req.params.id] = observable;
    res.send("OK");
};

exports.cancel = function(req, res) {
    console.log("INFO", "Cancel observer");
    if ( observables[req.session.user_id + "_" + req.params.id] ) {
        observables[req.session.user_id + "_" + req.params.id].cancel();
        delete observables[req.session.user_id + "_" + req.params.id];
    }
    res.send("OK");
};

exports.poll = function(req, res) {
    var resp = [];
    console.log("INFO", "Poll", resp);
    for ( var i in changes[req.session.user_id] ) {
        resp.push({
            value: i
        });
    }
    delete changes[req.session.user_id];
    if ( resp.length > 0 ) {
        console.log("INFO", "Envio respuestas", resp);
    }
    res.send(resp);
};

