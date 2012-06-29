Classify("Game/Bomb", {
	drop_time : 0,
	explode_time : 0,
	explode_in : 5000,
	settle_time : 500,
	is_exploded : false,

	init : function(game, player) {
		this.drop_time = new Date().getTime();
		this.canvas = document.createElement("canvas");
		this.canvasHeight = game.boardHeight;
		this.canvasWidth = game.boardWidth;
		this.canvas.height = game.boardHeight;
		this.canvas.width = game.boardWidth;
		this.$canvas = $(this.canvas);
		this.context = this.canvas.getContext('2d');
		game.container.appendChild(this.canvas);
		this.game = game;
		this.player = player;
		this.x = player.x;
		this.y = player.y;
	},
	draw : function() {
		var self = this;
		this.$canvas.clearCanvas();
		if (this.is_exploded) {
			this.$canvas.drawRect({
				fillStyle : "red",
				x : self.x,
				y : self.y,
				width : 100,
				height : 100
			});
		} else {
			this.$canvas.drawArc({
				fillStyle : "darkblue",
				x : self.x,
				y : self.y,
				radius : 10
			});
		}
	},
	render : function() {
		this.shouldExplode();
		this.draw();
	},
	shouldExplode : function() {
		var time = new Date().getTime();
		if (this.is_exploded) {
			if (time >= (this.explode_time + this.settle_time)) {
				this.$canvas.clearCanvas();
				this.player.removeBomb(this);
				this.$canvas.remove();
			}
			return;
		}
		if (time >= this.drop_time + this.explode_in) {
			this.is_exploded = true;
			this.explode_time = time;
		}
	}
});
