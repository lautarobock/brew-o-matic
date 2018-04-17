
var io = require('socket.io');

var util = require("../public/js/util/util.js");

var _socket = [];

exports.initOn = function(app) {
	// var i = io.listen(app);
    // i.set('transports', ['websocket','xhr-polling']);
	// i.sockets.on("connection", function(socket) {
	// 	_socket.push(socket);
	// 	console.log("INFO", "Connect WebSocket", _socket.length);
		
	// 	socket.on('disconnect', function () {
	// 	    util.Arrays.remove(_socket,socket);
	// 	    console.log("INFO", "Disconnect WebSocket", _socket.length);
	// 	});
	// });
};

exports.emit = function(id, data) {
	// for ( var i=0; i<_socket.length; i++ ) {
	// 	_socket[i].emit(id, data);	
	// }
};