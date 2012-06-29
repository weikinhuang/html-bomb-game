Classify("Game/Bomb", {
	drop_time : 0,
	explode_time : 0,
	explode_in : 2000,
	settle_time : 500,
	is_exploded : false,
	explosion_width: 100,
	explosion_height: 100,
	width: 10,
	height: 10,

	init : function(game, player) {
		this.drop_time = new Date().getTime();
		this.canvas = document.createElement("canvas");
		this.canvasHeight = game.boardHeight;
		this.canvasWidth = game.boardWidth;
		$(this.canvas).addClass("bomb");
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
				width : self.explosion_width,
				height : self.explosion_height
			});

			this.width = self.explosion_width;
			this.height = self.explosion_height;
		} else {
			this.$canvas.drawArc({
				fillStyle : "darkblue",
				x : self.x,
				y : self.y,
				radius : self.width
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
			this.isCollision(this.player.x, this.player.y, this.player.width, this.player.height);
		}
	},
	isCollision : function(x, y, width, height){
		var half_width = this.explosion_width/2;
		var half_height = this.explosion_height/2;
		if(x < (this.x + half_width) && (x >= this.x)  || x > (this.x - half_width) && (x < this.x)){
				if(y < (this.y + half_height) && (y >= this.y) || y > (this.y - half_height) && (y < this.y) ){
					console.log("game over stopping");
					// this.game.stop();
				}
			}
	}
});
