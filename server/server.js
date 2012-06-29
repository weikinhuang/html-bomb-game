// include the necessary module
var fs = require("fs");
var http = require("http");
var url = require("url");
var path = require("path");
var Classify = require("./classify.min.js");

var Server = Classify.create({
	__static_ : {
		contentType : {
			js : "text/javascript",
			json : "text/javascript",
			css : "text/css",
			html : "text/html"
		}
	},
	init : function() {
		var self = this;
		this.server = http.createServer(function(request, response) {
			var uri = url.parse(request.url).pathname, filename = path.join("client", uri);
			console.log("Requesting: " + filename);
			path.exists(filename, function(exists) {
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
		}).listen(60000, function() {
			console.log("listening on port 60000");
		});
/*
		io.listen(this.server, {
			log : false,
			transports : [ "websocket", "flashsocket", "htmlfile", "jsonp-polling" ],
			"flash policy port" : parseInt(this.build.getOption("browserstack.port") || 80, 10)
		}).sockets.on("connection", function(socket) {

		});
*/
		return this;
	}
});

Server();