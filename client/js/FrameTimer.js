Classify("Game/FrameTimer", {
	isPaused : true,
	time : 0,
	tick : 0,
	delta : 0,
	start : function() {
		this.isPaused = false;
		this.time = (new Date()).getTime();
		this.onFrame();
		return this;
	},
	stop : function() {
		this.isPaused = true;
		return this;
	},
	pause : function() {
		if (this.isPaused) {
			this.start();
		} else {
			this.stop();
		}
		return this;
	},
	__bind_onFrame : function() {
		if (this.isPaused) {
			return;
		}
		// queue up the next frame
		this.nextFrame();
		this.tick++;
		this.delta = (new Date()).getTime() - this.time;
		this.runLoop();
		this.time = (new Date()).getTime();
	},
	runLoop : function() {

	},
	nextFrame : (function() {
		// Check for each browser
		// @paul_irish function
		// Globalises this function to work on any browser as each browser has a different namespace for this
		var nextFrame = window.requestAnimationFrame || // Chromium
		window.webkitRequestAnimationFrame || // Webkit
		window.mozRequestAnimationFrame || // Mozilla Geko
		window.oRequestAnimationFrame || // Opera Presto
		window.msRequestAnimationFrame || // IE Trident?
		function(callback, element) { // Fallback function
			window.setTimeout(callback, 1000 / 60);
		};
		return function() {
			nextFrame(this.onFrame);
		};
	})()
});
