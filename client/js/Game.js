Classify("Game/Game", "FrameTimer", {
	fpsTimer : null,
	boardHeight : 400,
	boardWidth : 600,
	__static_ : {
		instance : null
	},
	invoke : function() {
		// this is a singleton
		if (this.instance === null) {
			this.instance = new this();
		}
		return this.instance;
	},
	init : function() {
		this.fpsContainer = document.getElementById("fps");
		this.container = document.getElementById("board");
		this.keys = {};
		this.player = new Game.Player(this);
		this.bindWindowEvents();
	},
	runLoop : function() {
		this.player.render();
	},
	setWidth : function(width) {
		this.canvas.width = width;
		this.boardWidth = width;
		return this;
	},
	setHeight : function(height) {
		this.canvas.height = height;
		this.boardHeight = height;
		return this;
	},
	bindWindowEvents : function() {
		var self = this, blurred = false;
		$(window).on("blur", function() {
			if (self.isPaused) {
				return;
			}
			blurred = true;
			self.stop();
		}).on("focus", function() {
			if (!blurred) {
				return;
			}
			blurred = false;
			self.start();
		});

		$(document).on("keydown", this.keyDown).on("keyup", this.keyUp);
	},
	__bind_keyDown : function(context, e) {
		switch (e.which) {
			case 38: // up
			case 87: // w
				this.keys.up = true;
				break;
			case 40: // down
			case 83: // s
				this.keys.down = true;
				break;
			case 37: // left
			case 65: // a
				this.keys.left = true;
				break;
			case 39: // right
			case 68: // d
				this.keys.right = true;
				break;
		}
	},
	__bind_keyUp : function(context, e) {
		switch (e.which) {
			case 38: // up
			case 87: // w
				this.keys.up = false;
				break;
			case 40: // down
			case 83: // s
				this.keys.down = false;
				break;
			case 37: // left
			case 65: // a
				this.keys.left = false;
				break;
			case 39: // right
			case 68: // d
				this.keys.right = false;
				break;
			case 27: // esc
				this.pause();
				break;
			default:
				break;
		}

	},
	startFpsLog : function() {
		var self = this, t = 0;
		if (this.fpsTimer) {
			return this;
		}
		this.fpsTimer = setInterval(function() {
			// console.log(self.tick - t);
			self.fpsContainer.innerHTML = (self.tick - t) + " fps";
			t = self.tick;
		}, 1000);
		return this;
	},
	stopFpsLog : function() {
		clearInterval(this.fpsTimer);
		this.fpsTimer = null;
		return this;
	}
});
