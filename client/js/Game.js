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
		this.board = new Game.Board(this);
		this.bindWindowEvents();
		this.board.bindEvents();
		this.start();
	},
	runLoop : function() {
		this.board.render();
	},
	bindWindowEvents : function() {
		var self = this, blurred = false;
		$(window).on("blur", function() {
			if (self.isPaused) {
				return;
			}
			blurred = true;
			//self.stop();
		}).on("focus", function() {
			if (!blurred) {
				return;
			}
			blurred = false;
			//self.start();
		});
		this.socket = io.connect();
		$(document).on("keydown", this.board.keyDown).on("keyup", this.board.keyUp);
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
