Classify("Game/Game", "FrameTimer", {
	fpsTimer : null,
	boardHeight : 400,
	boardWidth : 600,
	__static_ : {
		instance : null
	},
	invoke : function() {
		// this is a singleton
		if (this.instance === null) {
			this.instance = new this();
		}
		return this.instance;
	},
	init : function() {
		this.fpsContainer = document.getElementById("fps");
		this.container = document.getElementById("board");
		this.players = [];
		this.keys = {};
		this.bombs = [];
		this.player = new Game.Player(this);
		this.bindWindowEvents();
	},
	runLoop : function() {
		//console.log(this.players);
		this.players.forEach(function(player) {
			player.render();
		});

		this.bombs.forEach(function(bomb) {
			bomb.render();
		});
	},
	setWidth : function(width) {
		this.canvas.width = width;
		this.boardWidth = width;
		return this;
	},
	setHeight : function(height) {
		this.canvas.height = height;
		this.boardHeight = height;
		return this;
	},
	bindWindowEvents : function() {
		var self = this, blurred = false;
		$(window).on("blur", function() {
			if (self.isPaused) {
				return;
			}
			blurred = true;
			//self.stop();
		}).on("focus", function() {
			if (!blurred) {
				return;
			}
			blurred = false;
			//self.start();
		});

		this.socket = io.connect();

		this.socket.on("init", function(uid) {
			self.player = new Game.Player(self, uid.uuid);
			self.players.push(self.player);
			self.players["u-" + uid.uuid] = self.player;
		});

		this.socket.on("new_player", function(uid) {
			var player = new Game.Player(self, uid.uuid);
			self.players.push(player);
			self.players["u-" + uid.uuid] = player;
		});

		this.socket.on("player_disconnect", function(uid) {
			self.players.forEach(function(player, i) {
				if (player.uid == uid.uuid) {
					player.remove();
					self.players.splice(i, 1);
				}
			});
		});

		this.socket.on("keydown", function(data) {
			self.players["u-" + data.uuid].keys = data.keys;
		});

		this.socket.on("keyup", function(data) {
			self.players["u-" + data.uuid].keys = data.keys;
		});

		$(document).on("keydown", this.keyDown).on("keyup", this.keyUp);
	},
	__bind_keyDown : function(context, e) {
		switch (e.which) {
			case 38: // up
			case 87: // w
				this.keys.up = true;
				this.player.keys.up = true;
				break;
			case 40: // down
			case 83: // s
				this.keys.down = true;
				this.player.keys.down = true;
				break;
			case 37: // left
			case 65: // a
				this.keys.left = true;
				this.player.keys.left = true;
				break;
			case 39: // right
			case 68: // d
				this.keys.right = true;
				this.player.keys.right = true;
				break;
			case 32: // space
				this.keys.space = true;
				this.player.keys.space = true;
				break;
		}
		if (this.socket) {
			this.socket.emit("keydown", this.player.keys);
		}
	},
	__bind_keyUp : function(context, e) {
		switch (e.which) {
			case 38: // up
			case 87: // w
				this.keys.up = false;
				this.player.keys.up = false;
				break;
			case 40: // down
			case 83: // s
				this.keys.down = false;
				this.player.keys.down = false;
				break;
			case 37: // left
			case 65: // a
				this.keys.left = false;
				this.player.keys.left = false;
				break;
			case 39: // right
			case 68: // d
				this.keys.right = false;
				this.player.keys.right = false;
				break;
			case 27: // esc
				this.pause();
				break;
			default:
				break;
		}
		if (this.socket) {
			this.socket.emit("keyup", this.keys);
		}
	},
	startFpsLog : function() {
		var self = this, t = 0;
		if (this.fpsTimer) {
			return this;
		}
		this.fpsTimer = setInterval(function() {
			// console.log(self.tick - t);
			self.fpsContainer.innerHTML = (self.tick - t) + " fps";
			t = self.tick;
		}, 1000);
		return this;
	},
	stopFpsLog : function() {
		clearInterval(this.fpsTimer);
		this.fpsTimer = null;
		return this;
	}
});
