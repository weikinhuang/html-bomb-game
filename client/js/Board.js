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
	getSessionId : function() {
		var sessid = Game.Cookie().getItem("sessionid");
		if (!sessid) {
			sessid = "x-" + (Math.random() * 1001) + (new Date().getTime());
			Game.Cookie().setItem("sessionid", sessid);
		}
		return sessid;
	},
	bindEvents : function() {
		this.game.socket.emit("init", {
			sessionId : this.getSessionId()
		});

		this.game.socket.on("ready", this.onPlayerReady);
		this.game.socket.on("playerConnect", this.onPlayerConnect);
		this.game.socket.on("playerDisconnect", this.onPlayerDisconnect);
		this.game.socket.on("stateChange", this.updateState);
	},
	__bind_onPlayerReady : function(socket, data) {
		console.log("ready", data);
		// keep a reference to the current player
		this.player = new Game.Player(data.uuid, this);
		this.players.push(this.player);
		this.players["u-" + data.uuid] = this.player;
	},
	__bind_onPlayerConnect : function(socket, data) {
		console.log("playerConnect", data);
		var player = new Game.Player(data.uuid, this);
		this.players.push(player);
		this.players["u-" + data.uuid] = player;
	},
	__bind_onPlayerDisconnect : function(socket, data) {
		console.log("playerDisconnect", data);
		this.players.forEach(function(player, i) {
			if (player.uid == data.uuid) {
				player.remove();
			}
		});
	},
	getState : function() {
		return {
			player : this.player.getState()
		};
	},
	__bind_updateState : function(socket, data) {
		if (!this.players["u-" + data.uuid] || !data.state) {
			return;
		}
		this.players["u-" + data.uuid].restoreState(data.state.player);
	},
	__bind_keyDown : function(context, e) {
		switch (e.which) {
			case 38: // up
			case 87: // w
				if (this.keys.up) {
					return;
				}
				this.keys.up = true;
				this.player.keys.up = true;
				break;
			case 40: // down
			case 83: // s
				if (this.keys.down) {
					return;
				}
				this.keys.down = true;
				this.player.keys.down = true;
				break;
			case 37: // left
			case 65: // a
				if (this.keys.left) {
					return;
				}
				this.keys.left = true;
				this.player.keys.left = true;
				break;
			case 39: // right
			case 68: // d
				if (this.keys.right) {
					return;
				}
				this.keys.right = true;
				this.player.keys.right = true;
				break;
			case 32: // space
				if (this.player.bombActive) {
					return;
				}
				this.player.dropBomb();
				break;
		}
		// send the current state when the user does something
		this.game.socket.emit("stateChange", this.getState());
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
		// send the current state when the user does something
		this.game.socket.emit("stateChange", this.getState());
	}
});
