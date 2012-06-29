(function(root) {
	"use strict";

	var includes = [
		"/socket.io/socket.io",
		"jquery.min",
		"jcanvas",
		"classify.min",
		"classify-array.min",
		"FrameTimer",
		"Bomb",
		"Player",
		"Game"
	];
	var init = function() {
		root.Game = Classify("Game");
		root.Game.Game().start().startFpsLog();
	};

	// make sure the core of the javascript files loaded
	if (this.$LAB) {
		var length = includes.length, i = 0,
		// shortcut reference to the html tag
		html = document.documentElement,
		// the async script loader
		lab = this.$LAB.setOptions({
			AlwaysPreserveOrder : true
		}),
		// callback for each script load
		wait = function() {
			if (i <= length) {
				html.className = html.className.replace(/\b(progress-)\d+\b/, "$1" + (Math.min(Math.round((++i / length) * 10), 10) * 10));
			}
		};
		// start up the progress bar classes
		html.className = html.className + " progress-0";
		// load each script, but execute in series
		includes.join("|").replace(/([^\|]+)(?:\||$)/g, function(match, script) {
			var name = /^\//.test(script) ? script : ("/js/" + script);
			lab.script(name + ".js").wait(wait);
		});
		// final function for page ready
		lab.wait(function() {
			$(function() {
				init.call(root);
			});
		});
	} else {
		throw "Javascript failed to load.";
	}
}).call(this, this);