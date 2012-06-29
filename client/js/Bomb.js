Classify("Game/Bomb", {
	dropTime : 0,
	explodeTime : 0,
	explodeDelay : 2000,
	settleSpeed : 500,
	hasExploded : false,
	redraw : false,

	width : 0,
	height : 0,
	unExplodedWidth : 10,
	unExplodedHeight : 10,
	explosionWidth : 100,
	explosionHeight : 100,

	x : 0,
	y : 0,
	centerX : 0,
	centerY : 0,

	init : function(player, board) {
		this.player = player;
		this.board = board;
		this.canvas = document.createElement("canvas");
		this.canvas.height = board.height;
		this.canvas.width = board.width;
		this.$canvas = $(this.canvas).addClass("bomb");
		board.container.appendChild(this.canvas);
		this.dropTime = new Date().getTime();
		this.setInitialPosition();
		this.redraw = true;
		this.width = this.unExplodedWidth;
		this.height = this.unExplodedHeight;
		this.x = this.centerX - Math.round(this.unExplodedWidth / 2);
		this.y = this.centerY - Math.round(this.unExplodedHeight / 2);
	},
	setInitialPosition : function() {
		this.centerX = (this.player.x + Math.round(this.player.width / 2));
		this.centerY = (this.player.y + Math.round(this.player.height / 2));
	},
	render : function() {
		var self = this;
		this.shouldExplode();
		this.draw();
		if (this.hasExploded) {
			this.board.players.forEach(function(player) {
				if (self.isCollision(player.x, player.y, player.width, player.height)) {
					player.remove();
				}
			});
		}
	},
	draw : function() {
		if (!this.redraw) {
			return;
		}
		this.redraw = false;
		this.$canvas.clearCanvas();
		if (this.hasExploded) {
			this.$canvas.drawRect({
				fillStyle : "red",
				x : this.x,
				y : this.y,
				width : this.explosionWidth,
				height : this.explosionHeight,
				fromCenter : false
			});
		} else {
			this.$canvas.drawArc({
				fillStyle : "darkblue",
				x : this.centerX,
				y : this.centerY,
				radius : this.unExplodedWidth
			});
		}
	},
	shouldExplode : function() {
		var self = this, time = new Date().getTime();
		if (this.hasExploded) {
			if (time >= (this.explodeTime + this.settleSpeed)) {
				// this.$canvas.clearCanvas().remove();
				this.player.removeBomb(this);
			}
			return;
		}
		if (time >= this.dropTime + this.explodeDelay) {
			this.explode(time);
			return;
		}
		this.board.bombs.some(function(bomb) {
			if (!bomb.hasExploded || bomb === self) {
				return;
			}
			if (bomb.isCollision(self.x, self.y, self.width, self.height)) {
				self.explode(time);
				return true;
			}
		});
	},
	explode : function(time) {
		this.hasExploded = true;
		this.explodeTime = time;
		this.redraw = true;
		this.width = this.explosionWidth;
		this.height = this.explosionHeight;
		this.x = this.x + Math.round(this.unExplodedWidth / 2) - Math.round(this.explosionWidth / 2);
		this.y = this.y + Math.round(this.unExplodedHeight / 2) - Math.round(this.explosionHeight / 2);
	},
	isCollision : function(x, y, w, h) {
		var collideX = (x >= this.x && x <= (this.x + this.width)) || ((x + w) > this.x && (x + w) <= (this.x + this.width));
		var collideY = (y >= this.y && y <= (this.y + this.height)) || ((y + w) > this.y && (y + w) <= (this.y + this.height));

		return collideX && collideY;
	}
});
