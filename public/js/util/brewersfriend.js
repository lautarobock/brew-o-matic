/**
 * bfHydrometer
 */
(function (exports) {

    function recalculate(hydro, temp, calibration) {
        var tempunit = "C";
        if (tempunit == "F") {
            temp = fahrenheitToCelsius(temp);
            calibration = fahrenheitToCelsius(calibration)
        }
        var difference = calculateHydrometerCorrection(temp, calibration);
        var result = rounddecimal(difference + hydro, 3);
        return result;
    }
    exports.recalculate = recalculate;

    function isNumber(s) {
        if (s === null) {
            return false
        }
        if (s === 0) {
            return true
        }
        if (s == '') {
            return false
        }
        if (isNaN(s)) {
            return false
        }
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (!((c >= "0") && (c <= "9")) && c != '.') {
                return false
            }
        }
        return true
    }

    function calculateHydrometerCorrection(temp, calibration) {
        temp = parseFloat(temp);
        calibration = parseFloat(calibration);
        if (temp < 0 || temp > 71) {
            return 0
        }
        if (calibration < 10 || calibration > 24) {
            return 0
        }
        var C = [];
        var delta = [];
        for (var i = 0; i <= 71; i++) {
            C[i] = i
        }
        var calibrationOffset = 15 - Math.round(calibration);
        var difference = 0;
        delta[0] = -0.0009;
        delta[1] = -0.0009;
        delta[2] = -0.0009;
        delta[3] = -0.0009;
        delta[4] = -0.0009;
        delta[5] = -0.0009;
        delta[6] = -0.0008;
        delta[7] = -0.0008;
        delta[8] = -0.0007;
        delta[9] = -0.0007;
        delta[10] = -0.0006;
        delta[11] = -0.0005;
        delta[12] = -0.0004;
        delta[13] = -0.0003;
        delta[14] = -0.0001;
        delta[15] = 0;
        delta[16] = 0.0002;
        delta[17] = 0.0003;
        delta[18] = 0.0005;
        delta[19] = 0.0007;
        delta[20] = 0.0009;
        delta[21] = 0.0011;
        delta[22] = 0.0013;
        delta[23] = 0.0016;
        delta[24] = 0.0018;
        delta[25] = 0.0021;
        delta[26] = 0.0023;
        delta[27] = 0.0026;
        delta[28] = 0.0029;
        delta[29] = 0.0032;
        delta[30] = 0.0035;
        delta[31] = 0.0038;
        delta[32] = 0.0041;
        delta[33] = 0.0044;
        delta[34] = 0.0047;
        delta[35] = 0.0051;
        delta[36] = 0.0054;
        delta[37] = 0.0058;
        delta[38] = 0.0061;
        delta[39] = 0.0065;
        delta[40] = 0.0069;
        delta[41] = 0.0073;
        delta[42] = 0.0077;
        delta[43] = 0.0081;
        delta[44] = 0.0085;
        delta[45] = 0.0089;
        delta[46] = 0.0093;
        delta[47] = 0.0097;
        delta[48] = 0.0102;
        delta[49] = 0.0106;
        delta[50] = 0.0110;
        delta[51] = 0.0114;
        delta[52] = 0.0118;
        delta[53] = 0.0122;
        delta[54] = 0.0126;
        delta[55] = 0.0130;
        delta[56] = 0.0135;
        delta[57] = 0.0140;
        delta[58] = 0.0145;
        delta[59] = 0.0150;
        delta[60] = 0.0155;
        delta[61] = 0.0160;
        delta[62] = 0.0165;
        delta[63] = 0.0171;
        delta[64] = 0.0177;
        delta[65] = 0.0183;
        delta[66] = 0.0189;
        delta[67] = 0.0195;
        delta[68] = 0.0201;
        delta[69] = 0.0207;
        delta[70] = 0.0213;
        delta[71] = 0.0219;
        delta[72] = 0.0225;
        delta[73] = 0.0231;
        delta[74] = 0.0237;
        delta[75] = 0.0243;
        delta[76] = 0.0249;
        delta[77] = 0.0255;
        delta[78] = 0.0261;
        delta[79] = 0.0267;
        delta[80] = 0.0273;
        for (i = 0; i < C.length; i++) {
            if (C[i] == temp) {
                var calibrationOffsetBounded = calibrationOffset;
                if ((i + calibrationOffsetBounded) < 0) {
                    calibrationOffsetBounded = 0
                }
                difference = delta[i + calibrationOffsetBounded];
                break
            }
            if (temp >= C[i] && temp < C[i + 1]) {
                var calibrationOffsetBounded = calibrationOffset;
                if ((i + calibrationOffsetBounded) < 0) {
                    calibrationOffsetBounded = 0
                }
                difference = (delta[i + calibrationOffsetBounded] + delta[i + calibrationOffsetBounded + 1]) / 2;
                break
            }
        }
        return difference
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }

    function fahrenheitToCelsius(fahrenheit) {
        fahrenheit = parseFloat(fahrenheit);
        if (fahrenheit === '') {
            return false
        }
        if (isNaN(fahrenheit)) {
            return false
        }
        return (5 / 9) * (fahrenheit - 32)
    }
})(typeof exports === 'undefined'? this['bfHydrometer'] = {} : exports );

/**
 * bfRefractometer
 */
(function(exports) {


    function recalculate(og2, fg2, wortcorrection2) {
        var part2ogunit = "brixwri";

        var part2OGInBrix;
        var part2OGInSG;
        if (part2ogunit == "brixwri") {
            part2OGInBrix = og2 / wortcorrection2;
            part2OGInSG = convertPlatoToGravity(part2OGInBrix)
        }
        if (part2ogunit == "plato") {
            part2OGInBrix = og2;
            part2OGInSG = convertPlatoToGravity(og2)
        }
        if (part2ogunit == "sg") {
            part2OGInBrix = convertGravityToPlato(og2, 10);
            part2OGInSG = og2
        }
        var part2CorrectedFGInBrix = fg2 / wortcorrection2;
        var part2FGInSG = getFGFromBrix(part2OGInBrix, part2CorrectedFGInBrix);
        var part2FGInBrix = convertGravityToPlato(part2FGInSG, 10);

        // console.log("divPart2OGCorrectedBrix",rounddecimal(part2OGInBrix, 2) + " ºP, " + rounddecimal(part2OGInSG, 3));
        var valueStr = rounddecimal(part2FGInBrix, 2) + " ºP, " + rounddecimal(part2FGInSG, 3);
        // console.log("divPart2FGCorrectedBrix",valueStr);
        var abw = 76.08 * (part2OGInSG - part2FGInSG) / (1.775 - part2OGInSG);
        var abv = abw * (part2FGInSG / 0.794);
        // console.log("divPart2ABV",rounddecimal(abv, 2) + "%");
        return part2FGInBrix;
    }
    exports.recalculate = recalculate;


    function updateOGScale() {
        setVars();
        if (part2ogunit == "sg") {
            document.calc.txtPart2og.value = "1.048"
        } else {
            document.calc.txtPart2og.value = "12"
        }
    }

    function isNumber(s) {
        if (s === null) {
            return false
        }
        if (s === 0) {
            return true
        }
        if (s == '') {
            return false
        }
        if (isNaN(s)) {
            return false
        }
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (!((c >= "0") && (c <= "9")) && c != '.') {
                return false
            }
        }
        return true
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }

    function convertPlatoToGravity(plato) {
        return (plato / (258.6 - ((plato / 258.2) * 227.1))) + 1
    }

    function convertGravityToPlato(sg, n) {
        if (!n) {
            n = 1
        }
        var plato = (-1 * 616.868) + (1111.14 * sg) - (630.272 * Math.pow(sg, 2)) + (135.997 * Math.pow(sg, 3));
        return rounddecimal(plato, n)
    }

    function getFGFromBrix(brixOg, brixFg) {
        return 1.0000 - 0.0044993 * brixOg + 0.011774 * brixFg + 0.00027581 * Math.pow(brixOg, 2) - 0.0012717 * Math.pow(brixFg, 2) - 0.0000072800 * Math.pow(brixOg, 3) + 0.000063293 * Math.pow(brixFg, 3)
    }

    function resetform() {
        document.calc.reset();
        setVars();
        recalculate()
    }
})(typeof exports === 'undefined'? this['bfRefractometer'] = {} : exports );

/**
 * bfDilution
 */
(function(exports) {

    var currentVolume2 = 7.5;
    var currentGravity2 = 1.035;
    var targetVolume = 5.5;

    // function setVars() {
    //     currentVolume = document.calc.txtcurrentvolume.value;
    //     currentGravity = document.calc.txtcurrentgravity.value;
    //     desiredGravity = document.calc.txtdesiredgravity.value;
    //     currentVolume2 = document.calc.txtcurrentvolume2.value;
    //     currentGravity2 = document.calc.txtcurrentgravity2.value;
    //     targetVolume = document.calc.txttargetvolume.value
    // }

    function recalculate(currentVolume, currentGravity, desiredGravity) {
        // var currentVolume = 3.5;
        // var currentGravity = 1.075;
        // var desiredGravity = 1.05;

        var newVolume = ((currentGravity - 1) / (desiredGravity - 1)) * currentVolume;
        newVolume = rounddecimal(newVolume, 2);
        if (isNaN(newVolume)) {
            newVolume = 0
        }
        // $('#divNewVolume').html(newVolume);
        // console.log("newVolume",newVolume);
        return newVolume;
        // var difference = rounddecimal(newVolume - currentVolume, 2);
        // console.log("difference",difference);
        // if (difference >= 0) {
        //     $('#divVolumeDifference').html("<span style='color: green;'>" + difference + "</span>")
        // } else {
        //     $('#divVolumeDifference').html("<span style='color: red;'>" + difference + "</span>")
        // }
    }
    exports.recalculate = recalculate;

    function recalculate2() {
        var newGravity = (currentGravity2 - 1) * (currentVolume2 / targetVolume);
        newGravity = newGravity + 1;
        newGravity = rounddecimal(newGravity, 3);
        if (isNaN(newGravity)) {
            newGravity = 0
        }
        $('#divNewGravity').html(newGravity);
        var difference = rounddecimal(newGravity - currentGravity2, 3);
        if (difference >= 0) {
            $('#divGravityDifference').html("<span style='color: green;'>" + difference + "</span>")
        } else {
            $('#divGravityDifference').html("<span style='color: red;'>" + difference + "</span>")
        }
    }

    function checkInput2() {
        setVars();
        if (!isNumber(currentVolume2)) {
            alert('Wort Volume must be a number.');
            return false
        }
        if (currentVolume2 <= 0) {
            alert('Current Volume must be greater than zero.');
            return false
        }
        if (!isNumber(currentGravity2)) {
            alert('Current Gravity must be a number (format 1.xxx).');
            return false
        }
        if (currentGravity2 <= 1) {
            alert('Current Gravity must be greater than 1.00.');
            return false
        }
        if (!isNumber(targetVolume)) {
            alert('Target Volume must be a number.');
            return false
        }
        if (targetVolume <= 0) {
            alert('Target Volume must be greater than zero.');
            return false
        }
        return true
    }

    function isNumber(s) {
        if (s === null) {
            return false
        }
        if (s === 0) {
            return true
        }
        if (s == '') {
            return false
        }
        if (isNaN(s)) {
            return false
        }
        var i;
        for (i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (!((c >= "0") && (c <= "9")) && c != '.') {
                return false
            }
        }
        return true
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }
})(typeof exports === 'undefined'? this['bfDilution'] = {} : exports );

/**
 * bfYeast
 */
(function(exports) {

    /**
     * @param wortVolume Liters
     * @param wortGravity in gravity units
     * @param pitchRate grams of yeast by liters
     * @param yeastType 'dry'||'liquid'||'slurry'
     * @param yeast_dry_grams grams of yeast
     * @param yeast_dry_cells_per_gram density of yeast
     *
     * @return {
     *  yeastNeeded yeast you need
     *  yeastCount actual amout of yeast
     *  yeastDifference difference (>0 is ok, <0 you need more)
     *  actualPitchRate actual pitch rate
     * }
     */
    function recalculate(
        wortVolume,
        wortGravity,
        pitchRate,
        yeastType,
        yeast_dry_grams,
        yeast_dry_cells_per_gram
    ) {
        var millilitersOfWort = wortVolume * 1000;
        var wortPlato = convertGravityToPlato(wortGravity, 10)

        var yeastNeeded = pitchRate * millilitersOfWort * wortPlato;
        yeastNeeded = yeastNeeded / 1000;
        //RES: Target Pitch Rate Cells
        yeastNeeded = rounddecimal(yeastNeeded, 0); //billion cells

        yeastCount = 0;
        if (yeastType == 'dry') {
            yeastCount = yeast_dry_cells_per_gram * yeast_dry_grams
        }
        //Dont use yet
        if (yeastType == 'liquid') {
            var daysOld = Math.floor((new Date() - Date.parse(yeast_liquid_mfg_date)) / 86400000);
            if (daysOld < 0) {
                daysOld = 0
            }
            var dayString = "days";
            if (daysOld == 1) {
                dayString = "day"
            }
            var viability = 100 - (daysOld * 0.7);
            if (viability < 0) {
                viability = 0
            }
            viability = rounddecimal(viability, 0);
            $('#yeast_viability').html("Yeast is " + daysOld + " " + dayString + " old, the viability is estimated at " + viability + "%.");
            yeastCount = 100 * (viability / 100) * yeast_liquid_packs
        }
        //Dont use yet
        if (yeastType == 'slurry') {
            yeastCount = yeast_slurry_density * yeast_slurry_amount * 1000
        }

        //RES: Cells Available
        yeastCount = rounddecimal(yeastCount, 0);

        //RES: Difference
        var yeastDifference = yeastCount - yeastNeeded;

        var actualPitchRate = ((yeastCount * 1000) / wortPlato) / millilitersOfWort;
        //RES: Pitch Rate As-Is
        actualPitchRate = rounddecimal(actualPitchRate, 2);

        //Here goes starter calculations (See original JS)

        return {
            yeastNeeded: yeastNeeded,
            yeastCount: yeastCount,
            yeastDifference: yeastDifference,
            actualPitchRate: actualPitchRate
        }
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }

    function convertGravityToPlato(sg, n) {
        if (!n) {
            n = 1
        }
        var plato = (-1 * 616.868) + (1111.14 * sg) - (630.272 * Math.pow(sg, 2)) + (135.997 * Math.pow(sg, 3));
        return rounddecimal(plato, n)
    }

    exports.recalculate = recalculate;

})(typeof exports === 'undefined'? this['bfYeast'] = {} : exports );

/**
 * bfWater
 */
(function(exports) {

    var e = 2.718281828459045235;


    /**
    * @param in {
    *   dilution  Numeric % of dilution
    *   mashvolume Numeric
    *   mashunits gallons / quarts / liters
    *   source  Numeric[0..7] (source[6] is out)
    *   target Numeric[0..7] (target[6] is out)
    *   CaCO3 Numeric
    *   NaHCO3 Numeric
    *   CaSO4 Numeric
    *   CaCl2 Numeric
    *   MgSO4 Numeric
    *   NaCl Numeric
    * }
    * @param out {
    *   diluted: same as startwater but for read
    * }
    */
    function recalculate(input, output) {
        input.mashunits = input.mashunits || 'liters';
        var mashvolume = input.mashvolume;
        if ( input.mashunits === 'quarts' ) {
            mashvolume = mashvolume * 0.25;
        }
        if ( input.mashunits === 'liters' ) {
            mashvolume = mashvolume * 0.264172052;
        }
        output.startwater = new Array(6);
        for (i = 0; i <= 5; i++) {
            output.diluted[i] = rounddecimal(input.source[i] * ((100 - input.dilution) / 100), 0);
            // diluteddiv[i].innerHTML = rounddecimal(diluted[i], 0);
            output.startwater[i] = input.source[i] * ((100 - input.dilution) / 100)
        }
        for (i = 0; i <= 5; i++) {
            output.diff[i] = rounddecimal(output.startwater[i] - input.target[i], 0)
        }
        input.source[6] = rounddecimal((input.source[5] * (50 / 61)), 0);
        output.diluted[6] = rounddecimal(((input.source[5] * ((100 - input.dilution) / 100)) * (50 / 61)), 0);
        // diluteddiv[6].innerHTML = rounddecimal(diluted[6], 0);
        input.target[6] = rounddecimal((input.target[5] * (50 / 61)), 0);
        output.diff[6] = rounddecimal(((input.source[5] - input.target[5]) * (50 / 61)), 0);
        if (input.CaCO3 > 0) {
            output.CaCO3_tsp = input.CaCO3 / 3.8;
        } else {
            output.CaCO3_tsp = 0;
        }
        if (input.NaHCO3 > 0) {
            output.NaHCO3_tsp = input.NaHCO3 / 4.4;
        } else {
            output.NaHCO3_tsp = 0;
        }
        if (input.CaSO4 > 0) {
            output.CaSO4_tsp = input.CaSO4 / 4;
        } else {
            output.CaSO4_tsp = 0;
        }
        if (input.CaCl2 > 0) {
            output.CaCl2_tsp = input.CaCl2 / 3.4;
        } else {
            output.CaCl2_tsp = 0;
        }
        if (input.MgSO4 > 0) {
            output.MgSO4_tsp = input.MgSO4 / 4.5;
        } else {
            output.MgSO4_tsp = 0;
        }
        if (input.NaCl > 0) {
            output.NaCl_tsp = input.NaCl / 6;
        } else {
            output.NaCl_tsp = 0;
        }
        var adjCa = 0;
        var adjMg = 0;
        var adjSO4 = 0;
        var adjNa = 0;
        var adjCl = 0;
        var adjHCO3 = 0;
        var CaCO3 = input.CaCO3 / 2;
        if (CaCO3 > 0) {
            adjCa = adjCa + ((105 * CaCO3) / mashvolume);
            adjHCO3 = adjHCO3 + ((321 * CaCO3) / mashvolume)
        }
        if (input.NaHCO3 > 0) {
            adjNa = adjNa + ((75 * input.NaHCO3) / mashvolume);
            adjHCO3 = adjHCO3 + ((191 * input.NaHCO3) / mashvolume)
        }
        if (input.CaSO4 > 0) {
            adjCa = adjCa + ((61.5 * input.CaSO4) / mashvolume);
            adjSO4 = adjSO4 + ((147.4 * input.CaSO4) / mashvolume)
        }
        if (input.CaCl2 > 0) {
            adjCa = adjCa + ((72 * input.CaCl2) / mashvolume);
            adjCl = adjCl + ((127 * input.CaCl2) / mashvolume)
        }
        if (input.MgSO4 > 0) {
            adjMg = adjMg + ((26 * input.MgSO4) / mashvolume);
            adjSO4 = adjSO4 + ((103 * input.MgSO4) / mashvolume)
        }
        if (input.NaCl > 0) {
            adjNa = adjNa + ((104 * input.NaCl) / mashvolume);
            adjCl = adjCl + ((160 * input.NaCl) / mashvolume)
        }
        output.salts[0] = rounddecimal(adjCa, 0);
        output.salts[1] = rounddecimal(adjMg, 0);
        output.salts[2] = rounddecimal(adjSO4, 0);
        output.salts[3] = rounddecimal(adjNa, 0);
        output.salts[4] = rounddecimal(adjCl, 0);
        output.salts[5] = rounddecimal(adjHCO3, 0);
        output.salts[6] = rounddecimal((adjHCO3 * (50 / 61)), 0);
        output.accuracy = {
            value: 0,
            allin: true
        };
        for (i = 0; i <= 5; i++) {
            var resultinglevel = rounddecimal(parseFloat(rounddecimal(output.diff[i], 10)) + parseFloat(rounddecimal(output.salts[i], 10)), 0);
            output.result[i] = {
                value: resultinglevel,
                range: true
            };
            output.adjusted[i] = rounddecimal(parseFloat(rounddecimal(output.diluted[i], 10)) + parseFloat(rounddecimal(output.salts[i], 10)), 0);
            output.result[i].range = !(resultinglevel < -20 || resultinglevel > 20);
            output.accuracy.value += Math.abs(resultinglevel);
            output.accuracy.allin = output.accuracy.allin && output.result[i].range;
        }
        output.adjusted[6] = rounddecimal((rounddecimal(output.adjusted[5], 10) * (50 / 61)), 0);
        output.result[6] = {
            value: rounddecimal((rounddecimal(output.result[5].value, 10) * (50 / 61)), 0),
            range: true
        };
        output.accuracy.distance = bfUtil.distance(output.adjusted,input.target);
        output.accuracy.value += Math.abs(output.result[6].value);
        var CaValue = rounddecimal(output.adjusted[0], 10);
        if (CaValue < 50) {
            output.Ca_balance = Balance.LOW;
        }
        if (CaValue >= 50 && CaValue <= 150) {
            output.Ca_balance = Balance.NORMAL;
        }
        if (CaValue > 150) {
            output.Ca_balance = Balance.HIGH;
        }
        if (CaValue > 250) {
            output.Ca_balance = Balance.HARMFUL;
        }
        var MgValue = rounddecimal(output.adjusted[1], 10);
        if (MgValue >= 0 && MgValue <= 30) {
            output.Mg_balance = Balance.NORMAL;
        }
        if (MgValue > 30) {
            output.Mg_balance = Balance.HIGH;
        }
        if (MgValue > 50) {
            output.Mg_balance = Balance.HARMFUL;
        }
        var SO4Value = rounddecimal(output.adjusted[2], 10);
        if (SO4Value < 50) {
            output.SO4_balance = Balance.LOW;
        }
        if (SO4Value >= 50 && SO4Value <= 150) {
            output.SO4_balance = Balance.NORMAL;
        }
        if (SO4Value > 150 && SO4Value <= 350) {
            output.SO4_balance = Balance.NORMAL;
        }
        if (SO4Value > 350) {
            output.SO4_balance = Balance.HIGH;
        }
        if (SO4Value > 750) {
            output.SO4_balance = Balance.HARMFUL;
        }
        var NaValue = rounddecimal(output.adjusted[3], 10);
        if (NaValue >= 0 && NaValue <= 150) {
            output.Na_balance = Balance.NORMAL;
        }
        if (NaValue > 150) {
            output.Na_balance = Balance.HIGH;
        }
        if (NaValue > 200) {
            output.Na_balance = Balance.HARMFUL;
        }
        var ClValue = rounddecimal(output.adjusted[4], 10);
        if (ClValue >= 0 && ClValue <= 250) {
            output.Cl_balance = Balance.NORMAL;
        }
        if (ClValue > 250) {
            output.Cl_balance = Balance.HIGH;
        }
        if (ClValue > 300) {
            output.Cl_balance = Balance.HARMFUL;
        }
        if (ClValue <= 0) {
            ClValue = 1
        }
        var SO4Clratio = SO4Value / ClValue;
        if (SO4Clratio > 0 && SO4Clratio <= 0.5) {
            output.SO4Cl_balance = Ratio.HIGHLY_MALTY;
        }
        if (SO4Clratio > 0.5 && SO4Clratio <= 0.7) {
            output.SO4Cl_balance = Ratio.MALTY;
        }
        if (SO4Clratio > 0.7 && SO4Clratio <= 1.3) {
            output.SO4Cl_balance = Ratio.BALANCE;
        }
        if (SO4Clratio > 1.3 && SO4Clratio <= 2) {
            output.SO4Cl_balance = Ratio.BITTER;
        }
        if (SO4Clratio > 2) {
            output.SO4Cl_balance = Ratio.HIGHLY_BITTER;
        }
        if (ClValue <= 5 && SO4Value <= 5) {
            output.SO4Cl_balance = Ratio.LOW_VALUES;
        }
        var AlkalinityValue = rounddecimal(output.adjusted[6], 10);
        if (AlkalinityValue >= 0 && AlkalinityValue <= 50) {
            output.Alkalinity_balance = Alkalinity.PALE;
        }
        if (AlkalinityValue > 50 && AlkalinityValue <= 150) {
            output.Alkalinity_balance = Alkalinity.AMBER;
        }
        if (AlkalinityValue > 150 && AlkalinityValue <= 300) {
            output.Alkalinity_balance = Alkalinity.DARK;
        }
        if (AlkalinityValue > 300) {
            output.Alkalinity_balance = Alkalinity.HIGH;
        }
    }

    function dummyOutput() {
        return {
            diluted: new Array(6),
            diff: new Array(6),
            salts: new Array(6),
            result: new Array(6),
            adjusted: new Array(6)
        };
    }

    function suggest(input, output) {
        var best = {
            CaCO3: 0,
            lastCaCO3: 0,
            NaHCO3: 0,
            lastNaHCO3: 0,
            CaSO4: 0,
            lastCaSO4: 0,
            CaCl2: 0,
            lastCaCl2: 0,
            MgSO4: 0,
            lastMgSO4: 0,
            NaCl: 0,
            lastNaCl: 0,
            distance: 10000,
            calculations: 0
        };

        function setBest(input, output) {
            best.CaCO3= input.CaCO3;
            best.NaHCO3= input.NaHCO3;
            best.CaSO4= input.CaSO4;
            best.CaCl2= input.CaCl2;
            best.MgSO4= input.MgSO4;
            best.NaCl= input.NaCl;
            best.distance = output.accuracy.distance;
        }

        best.lastCaCO3 = 10000;
        for ( input.CaCO3=0; input.CaCO3<1000; input.CaCO3++ ) {
            best.lastNaHCO3 = 10000
            for ( input.NaHCO3=0; input.NaHCO3<1000; input.NaHCO3++ ) {
                best.lastCaSO4 = 10000;
                for ( input.CaSO4=0; input.CaSO4<1000; input.CaSO4++ ) {
                    best.lastCaCl2 = 10000;
                    for ( input.CaCl2=0; input.CaCl2<1000; input.CaCl2++ ) {
                        best.lastMgSO4 = 10000;
                        for ( input.MgSO4=0; input.MgSO4<1000; input.MgSO4++ ) {
                            best.lastNaCl = 10000;
                            for ( input.NaCl=0; input.NaCl<1000; input.NaCl++ ) {
                                console.log('input', input.CaCO3, input.NaHCO3, input.CaSO4, input.CaCl2, input.MgSO4, input.NaCl);
                                var output = dummyOutput();
                                recalculate(input,output);
                                best.calculations++;
                                console.log('distance', output.accuracy.distance);
                                if ( output.accuracy.distance > best.lastNaCl ) {
                                    break;
                                }
                                best.lastNaCl = output.accuracy.distance;

                                if ( output.accuracy.distance<best.distance ) {
                                    setBest(input, output);
                                }
                            }
                            if ( best.lastNaCl > best.lastMgSO4 ) {
                                break;
                            }
                            best.lastMgSO4 = best.lastNaCl;
                        }
                        if ( best.lastMgSO4 > best.lastCaCl2 ) {
                            break;
                        }
                        best.lastCaCl2 = best.lastMgSO4;
                    }
                    if ( best.lastCaCl2 > best.lastCaSO4 ) {
                        break;
                    }
                    best.lastCaSO4 = best.lastCaCl2;
                }
                if ( best.lastCaSO4 > best.lastNaHCO3 ) {
                    break;
                }
                best.lastNaHCO3 = best.lastCaSO4;
            }
            if ( best.lastNaHCO3 > best.lastCaCO3 ) {
                break;
            }
            best.lastCaCO3 = best.lastNaHCO3;
        }
        return best;
    }

    function rounddecimal(n, places) {
        if (n === null) {
            return false
        }
        if (n === '') {
            return false
        }
        if (isNaN(n)) {
            return false
        }
        if (places < 0) {
            return false
        }
        if (places > 10) {
            return false
        }
        var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
        var decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == 0) {
            rounded = "0" + rounded;
            decimalPointPosition = 1
        }
        if (places != 0) {
            decimalPointPosition = (rounded + "").lastIndexOf(".");
            if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
                rounded += "."
            }
        }
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
        if (currentPlaces < places) {
            for (x = currentPlaces; x < places; x++) {
                rounded += "0"
            }
        }
        return rounded
    }


    var Balance = {
        LOW: 'LOW',
        HIGH: 'HIGH',
        NORMAL: 'NORMAL',
        HARMFUL: 'HARMFUL'
    };

    var Ratio = {
        HIGHLY_MALTY: 'HIGHLY_MALTY',
        MALTY: 'MALTY',
        BALANCE: 'BALANCE',
        BITTER: 'BITTER',
        HIGHLY_BITTER: 'HIGHLY_BITTER',
        LOW_VALUES: 'LOW_VALUES'
    };

    var Alkalinity = {
        PALE: 'PALE',
        AMBER: 'AMBER',
        DARK: 'DARK',
        HIGH: 'HIGH'
    };

    exports.recalculate = recalculate;
    exports.rounddecimal = rounddecimal;
    exports.Balance = Balance;
    exports.Ratio = Ratio;
    exports.Alkalinity = Alkalinity;
    exports.suggest = suggest;


})(typeof exports === 'undefined'? this['bfWater'] = {} : exports );

/**
* bfUtil
*/
(function(exports){

    exports.distance = function(p1, p2) {
        // console.log('p1',p1);
        // console.log('p2',p2);
        var result = 0;
        for ( var i=0; i<p1.length; i++ ) {
            result += Math.pow(p1[i]-p2[i],2);
        }
        return exports.rounddecimal(Math.sqrt(result),2);
    };

    exports.rounddecimal = function(n, places) {
        return Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
    };

})(typeof exports === 'undefined'? this['bfUtil'] = {} : exports );
