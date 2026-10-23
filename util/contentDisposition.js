// Node rejects header values with code points above 255 (ERR_INVALID_CHAR).
// A curly apostrophe (U+2019) in a recipe name is one of those, and the throw
// happens inside a Mongoose callback, so it takes down the process.
// filename* (RFC 5987) keeps the original name; filename= is a Latin-1 fallback.

var APOSTROPHE = /[\u2018\u2019\u201A\u201B]/g;
var DOUBLE_QUOTE = /[\u201C\u201D\u201E\u201F]/g;
var DASH = /[\u2013\u2014\u2212]/g;
// Printable ASCII plus Latin-1 (Node accepts the latter). Drop the rest.
var NOT_HEADER_SAFE = /[^\x20-\x7E\xA1-\xFF]/g;

function encodeRFC5987(value) {
    return encodeURIComponent(value)
        .replace(/['()*]/g, function(ch) {
            return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
        })
        .replace(/%(7C|60|5E)/g, function(match, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        });
}

function fallbackName(filename) {
    var ascii = String(filename)
        .replace(APOSTROPHE, "'")
        .replace(DOUBLE_QUOTE, "'")
        .replace(DASH, '-')
        .replace(NOT_HEADER_SAFE, '_')
        .replace(/["\\]/g, '_');
    if (!/[^\s.]/.test(ascii)) {
        return 'recipe';
    }
    return ascii;
}

function attachment(filename) {
    var name = filename == null || filename === '' ? 'recipe' : String(filename);
    return 'attachment; filename="' + fallbackName(name) + '"; filename*=UTF-8\'\'' + encodeRFC5987(name);
}

exports.attachment = attachment;
