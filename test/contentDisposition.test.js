var http = require('http');
var contentDisposition = require('../util/contentDisposition.js');

function assertHeaderAccepted(test, value) {
    var res = new http.ServerResponse({ method: 'GET' });
    res.setHeader('Content-disposition', value);
    test.equal(res.getHeader('Content-disposition'), value);
}

exports.testCurlyApostrophe = function(test) {
    var value = contentDisposition.attachment('Gremlyn\u2019s Mild.xml');
    assertHeaderAccepted(test, value);
    test.ok(value.indexOf('filename="Gremlyn\'s Mild.xml"') !== -1);
    test.ok(value.indexOf("filename*=UTF-8''Gremlyn%E2%80%99s%20Mild.xml") !== -1);
    test.done();
};

exports.testPlainAsciiName = function(test) {
    var value = contentDisposition.attachment('IPA.xml');
    assertHeaderAccepted(test, value);
    test.ok(value.indexOf('filename="IPA.xml"') !== -1);
    test.ok(value.indexOf("filename*=UTF-8''IPA.xml") !== -1);
    test.done();
};

exports.testHeaderInjection = function(test) {
    var value = contentDisposition.attachment('a\r\nSet-Cookie: x=1.xml');
    assertHeaderAccepted(test, value);
    test.equal(value.indexOf('\r'), -1);
    test.equal(value.indexOf('\n'), -1);
    test.done();
};

exports.testLatin1StillAllowed = function(test) {
    var value = contentDisposition.attachment('caf\u00e9.xml');
    assertHeaderAccepted(test, value);
    test.ok(value.indexOf('filename="caf\u00e9.xml"') !== -1);
    test.done();
};
