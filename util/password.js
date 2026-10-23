var crypto = require('crypto');

var SCRYPT_N = 16384;
var SCRYPT_R = 8;
var SCRYPT_P = 1;
var KEYLEN = 64;

function isHash(value) {
    return typeof value === 'string' && value.indexOf('scrypt$') === 0;
}

function hash(password, cb) {
    var salt = crypto.randomBytes(16);
    crypto.scrypt(password, salt, KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P }, function(err, derived) {
        if (err) return cb(err);
        cb(null, [
            'scrypt',
            String(SCRYPT_N),
            String(SCRYPT_R),
            String(SCRYPT_P),
            salt.toString('base64'),
            derived.toString('base64')
        ].join('$'));
    });
}

function timingSafeStringEqual(a, b) {
    var bufA = Buffer.from(String(a));
    var bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) {
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
}

function verify(password, stored, cb) {
    if (!stored || !password) {
        return cb(null, false, false);
    }
    if (!isHash(stored)) {
        return cb(null, timingSafeStringEqual(password, stored), true);
    }
    var parts = stored.split('$');
    if (parts.length !== 6) {
        return cb(null, false, false);
    }
    var salt = Buffer.from(parts[4], 'base64');
    var expected = Buffer.from(parts[5], 'base64');
    crypto.scrypt(password, salt, expected.length, {
        N: parseInt(parts[1], 10),
        r: parseInt(parts[2], 10),
        p: parseInt(parts[3], 10)
    }, function(err, derived) {
        if (err) return cb(err);
        if (derived.length !== expected.length) {
            return cb(null, false, false);
        }
        cb(null, crypto.timingSafeEqual(derived, expected), false);
    });
}

exports.hash = hash;
exports.verify = verify;
exports.isHash = isHash;
