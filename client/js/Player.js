Classify("Game/Player", {
	x : 200,
	y : 200,
	pixelPerMs : 0.08,
	width : 20,
	height : 20,
	init : function(game) {
		this.canvas = document.createElement("canvas");
		this.canvasHeight = game.boardHeight;
		this.canvasWidth = game.boardWidth;
		this.canvas.height = game.boardHeight;
		this.canvas.width = game.boardWidth;
		this.$canvas = $(this.canvas);
		this.context = this.canvas.getContext('2d');
		this.appendTo(game.container);
		this.game = game;
	},
	appendTo : function(container) {
		container.appendChild(this.canvas);
	},
	render : function() {
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
	getCanvas : function() {
		return this.canvas;
	}
});
