Classify("Game/Player", {
	x : 200,
	y : 200,
	pixelPerMs : 0.08,
	width : 20,
	height : 20,
	isAlive : true,
	init : function(game, uid) {
		this.canvas = document.createElement("canvas");
		$(this.canvas).addClass("player");
		this.canvasHeight = game.boardHeight;
		this.canvasWidth = game.boardWidth;
		this.canvas.height = game.boardHeight;
		this.canvas.width = game.boardWidth;
		this.$canvas = $(this.canvas);
		this.context = this.canvas.getContext('2d');
		this.appendTo(game.container);
		this.game = game;
		this.bombs = [];
		this.uid = uid;
	},
	appendTo : function(container) {
		container.appendChild(this.canvas);
	},
	render : function() {
		if (!this.isAlive) {
			return;
		}
		this.move();
		this.draw();
		this.dropBomb();
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
		if (this.game.keys.up) {
			this.y = Math.max(this.y - (this.game.delta * this.pixelPerMs), 0);
		} else if (this.game.keys.down) {
			this.y = Math.min(this.y + (this.game.delta * this.pixelPerMs), this.canvasHeight - this.height);
		}
		if (this.game.keys.left) {
			this.x = Math.max(this.x - (this.game.delta * this.pixelPerMs), 0);
		} else if (this.game.keys.right) {
			this.x = Math.min(this.x + (this.game.delta * this.pixelPerMs), this.canvasWidth - this.width);
		}
	},
	remove : function() {
		this.$canvas.clearCanvas();
		this.$canvas.remove();
		this.isAlive = false;
		console.log("Player is dead!");
	},
	dropBomb : function() {
		if (!this.game.keys.space) {
			return;
		}
		this.game.keys.space = false;
		var bomb = new Game.Bomb(this.game, this);
		this.bombs.push(bomb);
		this.game.bombs.push(bomb);
	},
	removeBomb : function(bomb) {
		var index = this.bombs.indexOf(bomb);
		if (index > -1) {
			this.bombs.splice(index, 1);
		}
		var gameIndex = this.game.bombs.indexOf(bomb);
		if (gameIndex > -1) {
			this.game.bombs.splice(gameIndex, 1);
		}
	}
});
