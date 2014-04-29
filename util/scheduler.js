
var TIME_DAY = 1000*60*60*24;
var TIME_HOUR = 1000*60*60;
var TIME_MINUTE = 1000*60;
var TIME_SECOND = 1000;

exports.runEveryHour = function(command, inmediatly) {
	runEveryTime(command,TIME_HOUR,inmediatly);
};

exports.runEveryMinute = function(command, inmediatly) {
	runEveryTime(command,TIME_MINUTE,inmediatly);
};

exports.runEverySecond = function(command, inmediatly) {
	runEveryTime(command,TIME_SECOND,inmediatly);
};

exports.runEveryDay = function(command, inmediatly) {
	runEveryTime(command,TIME_DAY,inmediatly);
};

function runEveryTime(command, time, inmediatly) {
	if ( inmediatly ) command();
	setInterval(command, time);	
}