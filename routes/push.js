
var app = require('http').createServer(handler);
var io = require('socket.io');


var _socket;

exports.initOn = function(app) {
	io.listen(app);

	io.socket.on("connection", function(socket) {
		console.log("INFO", "WebSocket start");
		_socket = socket;
	});
};

exports.emit = function(id, data) {
	_socket.emit(id, data);
};