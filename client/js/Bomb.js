Classify("Game/Bomb", {
	drop_time : 0,
	explode_time : 0,
	explode_in : 2000,
	settle_time : 500,
	is_exploded : false,
	explosion_width : 100,
	explosion_height : 100,
	width : 10,
	height : 10,

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
		var self = this;
		this.shouldExplode();
		this.draw();
		if (this.is_exploded) {
			this.game.players.forEach(function(player) {
				if(self.isCollision(player.x, player.y, player.width, player.height)) {
					player.remove();
				}
			});
		}
	},
	shouldExplode : function() {
		var self = this, time = new Date().getTime();
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
		this.game.bombs.forEach(function(bomb) {
			if (!bomb.is_exploded || bomb === self) {
				return;
			}
			if (bomb.isCollision(self.x - 5, self.y - 5, self.width, self.height)) {
				self.is_exploded = true;
				self.explode_time = time;
			}
		});

	},
	isCollision : function(x, y, width, height) {
		var half_width = this.explosion_width / 2;
		var half_height = this.explosion_height / 2;
		if (x < (this.x + half_width) && (x >= this.x) || x > (this.x - half_width) && (x < this.x)) {
			if (y < (this.y + half_height) && (y >= this.y) || y > (this.y - half_height) && (y < this.y)) {
				return true;
			}
		}
		return false;
	}
});
