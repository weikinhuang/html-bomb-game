(function(root) {
	"use strict";

	var includes = [ "js/jquery.min.js", "js/classify.min.js", "js/classify-array.min.js" ];
	var init = function() {
		console.log("ready");
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
			lab.script(script).wait(wait);
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