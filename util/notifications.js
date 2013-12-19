var model = require('../domain/model.js');
var mongoose = require('mongoose');
var push = require("../routes/push");

exports.Status = {
    New: 'new',
    Unread: 'unread',
    Read: 'read'
};

exports.notifyOnPublish = function(recipe_name,recipe_id,user_name,user_id) {
    model.User.find().exec(function(err,users) {
        for ( var i=0; i<users.length; i++) {
            if ( users[i]._id != user_id) {
                var data = "El usuario <b>{{user_name}}</b> ha publicado la receta <b>{{recipe_name}}</b>";
                data = data.replace('{{user_name}}',user_name);
                data = data.replace('{{recipe_name}}',recipe_name);

                var link = "/share.html#/" + encodeURIComponent(recipe_id);
                notify(users[i]._id, data, link);
            }
        }
    });
};

/**
 * Notifica al owner q han agregado a favoritos su receta.
 *
 * @param owner_id id de usuario que es el dueño original de la receta
 * @param recipe
 * @param user_id id de usuario q clono la receta
 * @param user_name nombre de usuario q clono la receta
 */
exports.notifyAddFavorite = function(owner_id, recipe, user_id, user_name) {
    var data = "<b>{{user_name}}</b> ha agregado a favoritos tu receta <b>{{recipe.NAME}}</b>";
    data = data.replace('{{user_name}}',user_name);
    data = data.replace('{{recipe.NAME}}',recipe.NAME);

    var link = "#/recipe/edit/" + encodeURIComponent(recipe._id);
    notify(owner_id, data, link);
};

/**
 * Notifica al owner q han clonado su receta.
 *
 * @param owner_id id de usuario que es el dueño original de la receta
 * @param recipe
 * @param user_id id de usuario q clono la receta
 * @param user_name nombre de usuario q clono la receta
 * @param recipe_name nombre de la receta original
 */
exports.notifyRecipeCloned = function(owner_id, recipe,user_id,user_name,recipe_name) {
    if (owner_id != user_id) {
        var data = "<b>{{user_name}}</b> ha clonado tu receta <b>{{recipe.NAME}}</b>";
        data = data.replace('{{user_name}}',user_name);
        data = data.replace('{{recipe.NAME}}',recipe_name);

        var link = "/share.html#/" + encodeURIComponent(recipe._id);
        notify(owner_id, data, link);
    }
};

/**
 * Notifica modificacion de receta a los q la tienen como favorita.
 * @param recipe receta en la que se hizo update
 */
exports.notifyUpdateFavorite = function(recipe) {
    for (var i=0; i<recipe.starredBy.length; i++) {
        var data = "Han actualizado tu receta favorita <b>{{recipe.NAME}}</b>";
        data = data.replace('{{recipe.NAME}}',recipe.NAME);
        
        var link = "/share.html#/" + encodeURIComponent(recipe._id);
        notify(recipe.starredBy[i]._id, data, link);
    }
};

/**
 * Cuando se hace una modificacion en una receta favorita. Esto le llegaria a varios.
 * Tambien notifica a los que hicieron algun comentario
 * @param recipe la receta en la cual se hizo el comentario
 * @param user_id usuario el cual comenta
 * @param user_name nombre del usuario que comento la receta.
 */
exports.notifyCommentOnFavorite = function(recipe, user_id , user_name) {
    var notified = [];
    for (var i=0; i<recipe.starredBy.length; i++) {
        if ( recipe.starredBy[i]._id != user_id) {
            var data = "<b>{{user_name}}</b> ha comentado tu receta favorita <b>{{recipe.NAME}}</b>";
            data = data.replace('{{user_name}}',user_name);
            data = data.replace('{{recipe.NAME}}',recipe.NAME);
            
            var link = "/share.html#/" + encodeURIComponent(recipe._id);
            notified.push(recipe.starredBy[i]._id.toString());
            notify(recipe.starredBy[i]._id, data, link);
        }
    }
    for (var i=0; i<recipe.comments.length; i++) {
        //salteo q los que ya notifique por favoritos, al q comenta y al owner
        if ( recipe.comments[i].user_id != user_id
                && notified.indexOf(recipe.comments[i].user_id.toString()) == -1
                && recipe.comments[i].user_id != recipe.owner ) {
            var data = "<b>{{user_name}}</b> ha comentado en una receta q has comentado <b>{{recipe.NAME}}</b>";
            data = data.replace('{{user_name}}',user_name);
            data = data.replace('{{recipe.NAME}}',recipe.NAME);

            var link = "/share.html#/" + encodeURIComponent(recipe._id);
            notified.push(recipe.comments[i].user_id.toString());
            notify(recipe.comments[i].user_id, data, link);
        }
    }
};

/**
 * Cuando se ha realizado un comentario de un tercero en una receta propia
 *
 * @param user_id owner de la receta
 * @param user_id usuario el cual comenta
 * @param user_name nombre del usuario que comento la receta.
 * @param recipe_id id de la receta comentada.
 * @param recipe_name nombre de la receta
 */
exports.notifyCommentOnRecipe = function(owner_id, user_id,user_name , recipe_id, recipe_name) {
    if (owner_id != user_id) {
        var data = "<b>{{user_name}}</b> ha comentado en tu receta <b>{{recipe.NAME}}</b>";
        data = data.replace('{{user_name}}',user_name);
        data = data.replace('{{recipe.NAME}}',recipe_name);
        
        var link = "#/recipe/edit/" + encodeURIComponent(recipe_id);
        notify(owner_id, data, link);
    }
};

var notify = function(user_id,data,link) {
    model.Notification.create(new model.Notification({
            user_id:user_id,
            date: new Date(),
            status: exports.Status.New,
            data: data,
            link: link
        }), function(err,notification) {
            if ( err) {
                console.log("err",err);
                console.log("notification",notification);
            } else {
                push.emit("NOTIFICATION_ADD_" + user_id,notification);
            }
    });
};
exports.notify = notify;

/**
 * Elimina las notificaciones viejas.
 * Por ahora limpia las mas viejas q una semana q ya hayan sido leidas.
 *
 * Luego si veo q la DB crece mucho, deberia limpiar todas por ejemplo del ulitmo mes.
 */
exports.removeOld = function() {
    var from  = new Date(new Date().getTime()-7*24*60*60*1000);
    console.log("Eliminando desde",from);
    model.Notification.remove({date:{$lt:from},status:'read'}).exec();
};

/**
 * Service web.
 */
exports.findAll = function(req,res) {
    model.Notification.find({user_id:req.session.user_id}).sort("-date").exec(function(err,notifications) {
        model.Notification.update({user_id:req.session.user_id,status:'new'},{$set:{status:'unread'}},{multi:true}).exec();
        res.send(notifications);
    });

};

exports.findNews = function(req, res) {
    model.Notification.find({user_id:req.session.user_id,status:'new'}).sort("-date").exec(function(err,notifications) {
        res.send(notifications);
    });
};

exports.update = function(req,res) {
    console.log("req.params.id",req.params.id);
    console.log("body",req.body);
    delete req.body._id;
    model.Notification.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(req.params.id)},req.body).exec(function(err,notification) {
        res.send(notification);
    });
};
