(function (exports) {
    // var hydro = 1.050;
    // var temp = 20;
    // var calibration = 15;
    // var tempunit = "C";

    // function switchUnitsToUs() {
    //     $(".tempunit").html("(F)");
    //     tempunit = "F";
    //     document.calc.txthydro.value = "1.020";
    //     document.calc.txttemp.value = "80";
    //     document.calc.txtcalibration.value = "68";
    //     setCookie("bfmetric", "", -1);
    //     updateAll()
    // }

    // function switchUnitsToMetric() {
    //     $(".tempunit").html("(C)");
    //     tempunit = "C";
    //     document.calc.txthydro.value = "1.020";
    //     document.calc.txttemp.value = "27";
    //     document.calc.txtcalibration.value = "20";
    //     setCookie("bfmetric", "metric", (365 * 3));
    //     updateAll()
    // }

    function setVars(txthydro,txttemp,txtcalibration) {
        // hydro = document.calc.txthydro.value;
        // temp = document.calc.txttemp.value;
        // calibration = document.calc.txtcalibration.value;
        hydro = txthydro;
        temp = txttemp;
        calibration = txtcalibration;
        hydro = parseFloat(hydro);
        temp = parseFloat(temp);
        calibration = parseFloat(calibration);
        // setCookie("bf_hydrometer_calibration", calibration + "", (365 * 3))
    }
    exports.setVars = setVars;

    function updateAll() {
        // if (!checkInput()) {
        //     return false
        // }
        recalculate()
    }

    function recalculate(hydro, temp, calibration) {
        // var hydro = 1.050;
        // var temp = 20;
        // var calibration = 15;
        var tempunit = "C";
        if (tempunit == "F") {
            temp = fahrenheitToCelsius(temp);
            calibration = fahrenheitToCelsius(calibration)
        }
        var difference = calculateHydrometerCorrection(temp, calibration);
        var result = rounddecimal(difference + hydro, 3);
        // $('#divAdjusted').html(result)
        return result;
    }
    exports.recalculate = recalculate;

    // function checkInput() {
    //     setVars();
    //     if (!isNumber(hydro)) {
    //         // console.log('Hydrometer reading must be a number (format 1.xxx).');
    //         return false
    //     }
    //     if (!isNumber(temp)) {
    //         // alert('Temperature must be a number.');
    //         return false
    //     }
    //     if (!isNumber(calibration)) {
    //         // alert('Calibration must be a number.');
    //         return false
    //     }
    //     if (tempunit == 'F') {
    //         if (temp < 32 || temp > 159) {
    //             // alert('Temperature must be between 32-159 (F).');
    //             return false
    //         }
    //         if (calibration < 50 || calibration > 75) {
    //             // alert('Calibration must be between 50-75 (F).');
    //             return false
    //         }
    //     } else {
    //         if (temp < 0 || temp > 71) {
    //             // alert('Temperature must be between 0-71 (C).');
    //             return false
    //         }
    //         if (calibration < 10 || calibration > 24) {
    //             // alert('Calibration must be between 10-24 (C).');
    //             return false
    //         }
    //     }
    //     return true
    // }

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

(function(exports) {
    // var og1 = 12;
    // var wortcorrection1 = 1.0;
    // var divPart1CorrectedBrix;
    // var divPart1ActualSG;
    
    // var divPart2OGCorrectedBrix;
    // var divPart2OGActualSG;
    // var divPart2FGCorrectedBrix;
    // var divPart2FGActualSG;
    // var divPart2ABV;

    function setVars(og, fg, correction) {
        // og1 = document.calc.txtPart1og.value;
        // wortcorrection1 = document.calc.txtPart1wortcorrectionfactor.value;
        // divPart1CorrectedBrix = document.getElementById('part1CorrectedBrix');
        // divPart1ActualSG = document.getElementById('part1ActualSG');
        og2 = og;
        part2ogunit = "brixwri";
        fg2 = fg;
        wortcorrection2 = correction;
        // divPart2OGCorrectedBrix = document.getElementById('part2OGCorrectedBrix');
        // divPart2OGActualSG = document.getElementById('part2OGActualSG');
        // divPart2FGCorrectedBrix = document.getElementById('part2FGCorrectedBrix');
        // divPart2FGActualSG = document.getElementById('part2FGActualSG');
        // divPart2ABV = document.getElementById('part2ABV')
    }
    exports.setVars = setVars;

    // function updateAll() {
    //     if (!checkInput()) {
    //         return false
    //     }
    //     recalculate()
    // }

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

    // function checkInput() {
    //     setVars();
    //     if (!isNumber(og1) || og1 > 75 || og1 < 0) {
    //         alert('Part 1 Brix WRI OG must be a number between 0 and 75.');
    //         return false
    //     }
    //     if (!isNumber(wortcorrection1) || wortcorrection1 > 1.5 || wortcorrection1 < 0.5) {
    //         alert('Part 1 Wort Correction Factor must be a number between 0.5 and 1.5.');
    //         return false
    //     }
    //     if (part2ogunit == "sg") {
    //         if (!isNumber(og2) || og2 > 1.5 || og2 < 0) {
    //             alert('Part 2 OG must be a number between 0 and 1.500.');
    //             return false
    //         }
    //     } else {
    //         if (!isNumber(og2) || og2 > 75 || og2 < 0) {
    //             alert('Part 2 OG must be a number between 0 and 75.');
    //             return false
    //         }
    //     } if (!isNumber(fg2) || fg2 > 75 || fg2 < 0) {
    //         alert('Part 2 Brix WRI FG must be a number between 0 and 75.');
    //         return false
    //     }
    //     if (!isNumber(wortcorrection2) || wortcorrection2 > 1.5 || wortcorrection2 < 0.5) {
    //         alert('Part 2 Wort Correction Factor must be a number between 0.5 and 1.5.');
    //         return false
    //     }
    //     return true
    // }

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