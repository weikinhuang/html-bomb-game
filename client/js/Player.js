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
		this.shouldDropBomb();
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
		console.log("Player " + this.uid + " is dead!");
	},
	dropBomb : function() {
		this.bombActive = true;
		return this;
	},
	shouldDropBomb : function() {
		if (!this.bombActive) {
			return;
		}
		this.bombActive = false;
		var bomb = new Game.Bomb(this, this.board);
		this.bombs.push(bomb);
		this.board.bombs.push(bomb);
	},
	removeBomb : function(bomb) {
		this.bombs.remove(bomb);
		this.board.bombs.remove(bomb);
	}
});
