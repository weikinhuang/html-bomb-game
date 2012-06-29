// include the necessary module
var fs = require("fs");
var http = require("http");
var url = require("url");
var path = require("path");
var io = require("socket.io");
var Classify = require("./classify.min.js");
// require the special array library
require("./classify-array.min.js")(Classify);

var Server = Classify.create({
	__static_ : {
		contentType : {
			js : "text/javascript",
			json : "text/javascript",
			css : "text/css",
			html : "text/html"
		}
	},
	port : 60000,
	init : function() {
		var self = this;
		this.server = http.createServer(function(request, response) {
			var uri = url.parse(request.url).pathname, filename = path.join("client", uri);
			// console.log("Requesting: " + filename);
			fs.exists(filename, function(exists) {
				if (!exists) {
					response.writeHead(404, {
						"Content-Type" : "text/plain"
					});
					response.write("404 Not Found\n");
					response.end();
					return;
				}

				if (fs.statSync(filename).isDirectory()) {
					filename = filename.replace(/\/$/, "") + "/index.html";
				}

				fs.readFile(filename, "binary", function(err, file) {
					if (err) {
						response.writeHead(500, {
							"Content-Type" : "text/plain"
						});
						response.write(err + "\n");
						response.end();
						return;
					}

					response.writeHead(200, {
						"Content-Type" : self.constructor.contentType[filename.split(".").pop()] || "text/html"
					});
					response.write(file, "binary");
					response.end();
				});
			});
		}).listen(this.port, function() {
			console.log("listening on port " + self.port);
		});

		var uuid = 0, sockets = Classify.global.Array(), sessions = {};
		io.listen(this.server, {
			log : false,
			transports : [ "websocket", "flashsocket", "htmlfile", "jsonp-polling" ],
			"flash policy port" : this.port
		}).sockets.on("connection", function(socket) {
			var currentId = ++uuid;
			console.log("Player connected: " + currentId);
			socket.uuid = currentId;
			socket.isActive = true;

			socket.on("init", function(data) {
				if (sessions[data.sessionId]) {
					sockets.remove(sessions[data.sessionId]);
					sessions[data.sessionId].isActive = false;
					sockets.forEach(function(s) {
						// disconnect this user's previous sessions
						s.emit("playerDisconnect", {
							uuid : sessions[data.sessionId].uuid
						});
					});
					delete sessions[data.sessionId];
				}

				// store reference to user's current session
				sessions[data.sessionId] = socket;
				sockets.push(socket);
				socket.emit("ready", {
					uuid : currentId
				});

				socket.on("disconnect", function() {
					console.log("disconnect: " + currentId);
					sockets.remove(socket);
					sockets.forEach(function(s, i) {
						s.emit("playerDisconnect", {
							uuid : currentId
						});
					});
				});

				socket.on("keyup", function(data) {
					console.log("keyup: " + currentId);
					if (!socket.isActive) {
						return;
					}
					var emit_data = {
						uuid : currentId,
						keys : data
					};
					sockets.forEach(function(s) {
						if (s === socket) {
							return;
						}
						s.emit("keyup", emit_data);
					});
				});

				socket.on("keydown", function(data) {
					console.log("keydown: " + currentId);
					if (!socket.isActive) {
						return;
					}
					var emit_data = {
						uuid : currentId,
						keys : data
					};
					sockets.forEach(function(s) {
						if (s === socket) {
							return;
						}
						s.emit("keyup", emit_data);
					});

				});

				sockets.forEach(function(s) {
					if (s === socket || !s.isActive) {
						return;
					}
					// tell all other players that this player has connected
					s.emit("playerConnect", {
						uuid : currentId
					});

					// tell current player about the currently connected players
					socket.emit("playerConnect", {
						uuid : s.uuid
					});

				});
			});
		});

		return this;
	}
});

Server();
