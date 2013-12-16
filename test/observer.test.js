/**
 * Created by lautaro on 14/12/13.
 */

var observer = require("../routes/observer.js");

exports.testAddObserver = function(test) {

    observer.when("comments-RECIPE_ID").call(function() {
        test.ok(true);
    });

    observer.change("comments-RECIPE_ID");

    test.expect(1);
    test.done()
};

exports.testRemoveObserver = function(test) {

    var observable = observer.when("comments-RECIPE_ID").call(function() {
        test.ok(true);
    });

    observer.change("comments-RECIPE_ID");
    observer.change("comments-RECIPE_ID");

    observable.cancel();

    observer.change("comments-RECIPE_ID");

    test.expect(2);
    test.done();
};

exports.testMultiObserver = function(test) {
    var obs1 = observer.when("comments-RECIPE_ID").call(function() {
        test.ok(true);
    });

    var obs2 = observer.when("comments-RECIPE_ID").call(function() {
        test.ok(true);
    });

    observer.change("comments-RECIPE_ID");

    obs1.cancel();

    observer.change("comments-RECIPE_ID");

    test.expect(3);
    test.done();
};