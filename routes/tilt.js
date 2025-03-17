var model = require('../domain/model.js');

/**
 * POST from TILT
 * @Params body  {"SG":"1.020","Temp":"66.8","Color":"BLACK","Timepoint":"42746.416989097226","Beer":"Brown #51","Comment":""}
 */
exports.updateTilt = function(req, res) {
    console.log('UPDATE TILT', req.params.id);
    console.log(req.body);
    model.Recipe.findOne({_id:req.params.id}).exec(function(err,recipe) {
        if (err) {
            res.send(500,{error: 'Error al obtener la receta'});
            return;
        }
        if (!recipe) {
            res.send(404,{error: 'Receta no encontrada'});
            return;
        }
        try {
            if (recipe.tiltValues.length > 2) {
                //si los ultimos 3 valoes son iguales elimino el anteultimo
                var lastPos = recipe.tiltValues.length-1;
                var last = recipe.tiltValues[lastPos];
                var prev = recipe.tiltValues[lastPos-1];
                if ( last.temp === prev.temp && prev.temp === fahrenheitToCelsius(req.body.Temp) && 
                    last.sg === prev.sg && prev.sg === parseFloat(req.body.SG)) {
                    recipe.tiltValues.pop();
                }
            }
            recipe.tiltValues.push({
                date: new Date(),
                sg: parseFloat(req.body.SG),
                temp: fahrenheitToCelsius(req.body.Temp)
            })
            recipe.save(function(err) {
                if ( err ) {
                    res.send(500,{error: 'Error al actializr TITL en la receta'});
                } else {
                    console.log('Params', req.params.id);
                    console.log('Query', JSON.stringify(req.query));
                    console.log('Body', JSON.stringify(req.body));
                    res.send({"result":"success", "row": recipe.tiltValues[recipe.tiltValues.length-1]});
                }
            });
        } catch (error) {
            console.error('Error al actializr TITL en la receta', error);
            res.send(500,{error: 'Error al actializr TITL en la receta'});

        }
    });
};

function fahrenheitToCelsius(fahrenheit) {
    fahrenheit = parseFloat(fahrenheit);
    if (fahrenheit === '') {
        return null;
    }
    if (isNaN(fahrenheit)) {
        return null;
    }
    return (5 / 9) * (fahrenheit - 32)
}