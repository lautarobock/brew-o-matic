var model = require('../domain/model.js');

/**
 * POST from TILT
 * @Params body  {"SG":"1.020","Temp":"66.8","Color":"BLACK","Timepoint":"42746.416989097226","Beer":"Brown #51","Comment":""}
 */
exports.updateTilt = function(req, res) {
    model.Recipe.findOne({_id:req.params.id}).exec(function(err,recipe) {
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