var http = require('http');


exports.findBeers = function(req, mainRes) {
    // options for GET
    var optionsget = {
        host : 'www.birrasquehetomado.com.ar', // here only the domain name
        // (no http/https !)
        port : 80,
        path : '/api/Beer', // the rest of the url with parameters if needed
        method : 'GET' // do GET
    };

    // do the GET request
    var data = "";

    var reqGet = http.request(optionsget, function(res) {
        res.setEncoding('utf8');
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
    //  console.log("headers: ", res.headers);


        res.on('data', function(d) {
            console.info('DATA:\n');
            data += d;
            console.info('\n\n/DATA');
        });

        res.on('end', function(d) {
            console.info('GET resultEND:\n');
            mainRes.send(data);
            console.info('\n\nCall completed');
        });

    });

    reqGet.on('error', function(e) {
        console.error(e);
    });

    reqGet.end();




};