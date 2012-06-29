Classify("Game/Board", {
	height : 400,
	width : 600,
	init : function(game) {
		this.game = game;
		this.container = game.container;
		this.keys = {};
		this.players = Classify.global.Array();
		this.bombs = Classify.global.Array();
		this.player = null;
	},
	render : function() {
		this.players.forEach(function(player) {
			player.render();
		});

		this.bombs.forEach(function(bomb) {
			bomb.render();
		});
	},
	setWidth : function(width) {
		this.width = width;
		return this;
	},
	setHeight : function(height) {
		this.height = height;
		return this;
	},
	bindEvents : function() {
		var self = this;

		this.game.socket.on("init", function(uid) {
			self.player = new Game.Player(uid.uuid,self);
			self.players.push(self.player);
			self.players["u-" + uid.uuid] = self.player;
		});
/*
		this.game.socket.on("new_player", function(uid) {
			var player = new Game.Player(self, uid.uuid);
			self.players.push(player);
			self.players["u-" + uid.uuid] = player;
		});

		this.game.socket.on("player_disconnect", function(uid) {
			self.players.forEach(function(player, i) {
				if (player.uid == uid.uuid) {
					player.remove();
					self.players.splice(i, 1);
				}
			});
		});
		this.game.socket.on("keydown", function(data) {
			self.players["u-" + data.uuid].keys = data.keys;
		});

		this.game.socket.on("keyup", function(data) {
			self.players["u-" + data.uuid].keys = data.keys;
		});
 */
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
				this.player.dropBomb();
				break;
		}
		//this.socket.emit("keydown", this.player.keys);
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
				this.game.pause();
				break;
			default:
				break;
		}
		//this.socket.emit("keyup", this.keys);
	}
});
