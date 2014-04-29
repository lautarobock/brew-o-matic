
var scheduler = require("../util/scheduler.js");

//Nodeunit
exports.testRunEveryHour = function(test) {
    var ftemp = setInterval;

    var commandPass = null;
    var timePass = null;
    var isInvoked = false;
    
    setInterval = function(command, time) {
        commandPass = command;
        timePass = time;
        isInvoked = true;
    };


    var myCommand = function() {};

    scheduler.runEveryHour(myCommand);

    test.equal(commandPass, myCommand);
    test.equal(timePass, 1000*60*60);
    test.equal(isInvoked, true);

    setInterval = ftemp;

    test.done();
    
};

//Nodeunit
exports.testRunEveryHourInmediatly = function(test) {
    var ftemp = setInterval;

    var commandPass = null;
    var timePass = null;
    var isInvoked = false;
    
    setInterval = function(command, time) {
        commandPass = command;
        timePass = time;
        isInvoked = true;
    };

    var isCommandInvoked = false;
    var myCommand = function() {
        isCommandInvoked = true;
    };

    scheduler.runEveryHour(myCommand,true);

    test.equal(commandPass, myCommand);
    test.equal(timePass, 1000*60*60);
    test.equal(isInvoked, true);
    test.equal(isCommandInvoked, true);

    setInterval = ftemp;

    test.done();
    
};

//Nodeunit
exports.testRunEveryMinute = function(test) {
    var ftemp = setInterval;

    var commandPass = null;
    var timePass = null;
    var isInvoked = false;
    
    setInterval = function(command, time) {
        commandPass = command;
        timePass = time;
        isInvoked = true;
    };


    var myCommand = function() {};

    scheduler.runEveryMinute(myCommand);

    test.equal(commandPass, myCommand);
    test.equal(timePass, 1000*60);
    test.equal(isInvoked, true);

    setInterval = ftemp;

    test.done();
    
};



//Nodeunit
exports.testRunEveryMinute = function(test) {
    var ftemp = setInterval;

    var commandPass = null;
    var timePass = null;
    var isInvoked = false;
    
    setInterval = function(command, time) {
        commandPass = command;
        timePass = time;
        isInvoked = true;
    };

    var myCommand = function() {};

    scheduler.runEveryDay(myCommand);

    test.equal(commandPass, myCommand);
    test.equal(timePass, 1000*60*60*24);
    test.equal(isInvoked, true);

    setInterval = ftemp;

    test.done();
    
};

