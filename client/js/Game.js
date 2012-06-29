Classify("Game/Game", "FrameTimer", {
	fpsTimer : null,
	x : 10,
	y : 10,
	dx : 4,
	dy : 4,
	r : 10,
	boardHeight : 200,
	boardWidth : 300,
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
		this.canvas = document.createElement("canvas");
		this.canvas.height = this.boardHeight;
		this.canvas.width = this.boardWidth;
		this.container = document.getElementById("board").appendChild(this.canvas);
		this.fpsContainer = document.getElementById("fps");
		this.ball = this.canvas.getContext('2d');
		this.keyboard = {};
		this.bindWindowEvents();
	},
	runLoop : function() {
		this.move();
		this.clear();
		this.ball.fillStyle = 'rgb(0, 0, 0)';
		this.ball.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		this.ball.closePath();
		this.ball.fill();
		this.ball.save();
	},
	move : function() {
		if ((this.x - this.r) < 0 || (this.x + this.r) > this.canvas.width) {
			this.dx = -1 * this.dx;
		}
		if ((this.y - this.r) < 0 || (this.y + this.r) > this.canvas.height) {
			this.dy = -1 * this.dy;
		}
		this.x += this.dx;
		this.y += this.dy;
	},
	clear : function() {
		this.canvas.width = this.boardWidth;
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

		this.onKeyup = new Classify("Game").Keyboard.Keyup(window);
		this.onKeydown = new Classify("Game").Keyboard.Keydown(window);
		this.onKeypress = new Classify("Game").Keyboard.Keypress(window);

		this.onKeypress.bind("p", function() {
			self.pause();
		});
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
