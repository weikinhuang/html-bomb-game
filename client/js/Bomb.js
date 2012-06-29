Classify("Game/Bomb", {

		init : function() {
		this.canvas = document.createElement("canvas");
		$(this.canvas).drawArc({
			fillStyle: "darkblue",
			x: 20, y: 20,
			radius: 10
		});
	
	},
});