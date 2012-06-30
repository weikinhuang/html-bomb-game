Classify("Game/Player", {
	x : 200,
	y : 200,
	pixelPerMs : 0.08,
	width : 20,
	height : 20,
	isAlive : true,
	uid : 0,
	init : function(uid, board) {
		this.uid = uid;
		this.board = board;
		this.canvas = document.createElement("canvas");
		this.canvas.height = board.height;
		this.canvas.width = board.width;
		this.$canvas = $(this.canvas).addClass("player");
		board.container.appendChild(this.canvas);
		this.bombs = Classify.global.Array();
		this.keys = {};
	},
	render : function() {
		if (!this.isAlive) {
			return;
		}
		this.move();
		this.draw();
	},
	draw : function() {
		this.$canvas.clearCanvas().drawRect({
			fillStyle : "#000",
			x : this.x,
			y : this.y,
			width : this.width,
			height : this.height,
			fromCenter : false
		});
	},
	move : function() {
		if (this.keys.up) {
			this.y = Math.max(this.y - (this.board.game.delta * this.pixelPerMs), 0);
		} else if (this.keys.down) {
			this.y = Math.min(this.y + (this.board.game.delta * this.pixelPerMs), this.board.height - this.height);
		}
		if (this.keys.left) {
			this.x = Math.max(this.x - (this.board.game.delta * this.pixelPerMs), 0);
		} else if (this.keys.right) {
			this.x = Math.min(this.x + (this.board.game.delta * this.pixelPerMs), this.board.width - this.width);
		}
	},
	remove : function() {
		this.$canvas.clearCanvas().remove();
		this.isAlive = false;
		this.board.players.remove(this);
		delete this.board.players["u-" + this.uid];
		console.log("Player " + this.uid + " is dead!");
	},
	dropBomb : function() {
		var bomb = new Game.Bomb(this, this.board);
		this.bombs.push(bomb);
		this.board.bombs.push(bomb);
		return this;
	},
	removeBomb : function(bomb) {
		this.bombs.remove(bomb);
		this.board.bombs.remove(bomb);
	},
	getState : function() {
		var self = this, keys = {};
		Object.keys(this.keys).forEach(function(k) {
			if (self.keys[k]) {
				keys[k] = true;
			}
		});
		return {
			keys : keys,
			isAlive : this.isAlive,
			bombs : this.bombs.map(function(bomb) {
				return bomb.getState();
			}).toArray(),
			x : this.x,
			y : this.y
		};
	},
	restoreState : function(state) {
		if (!state || !this.isAlive) {
			return;
		}
		var self = this;
		this.x = state.x;
		this.y = state.y;
		this.keys = state.keys;

		if (!state.isAlive) {
			this.remove();
		}

		state.bombs.forEach(function(bombState) {
			if (self.bombs.some(function(bomb) {
				return bombState.dropTime == bomb.dropTime;
			})) {
				return;
			}
			var bomb = new Game.Bomb(self, self.board);
			bomb.restoreState(bombState);
			self.bombs.push(bomb);
			self.board.bombs.push(bomb);
		});
	}
});
