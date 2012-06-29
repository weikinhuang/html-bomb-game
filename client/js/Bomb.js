Classify("Game/Bomb", {
	drop_time : 0,
	explode_in : 5000,
	is_exploded : false,
	
	init : function(game, x, y) {
		this.drop_time = new Date().getTime();
		this.canvas = document.createElement("canvas");
		this.canvas.height = game.boardHeight;
		this.canvas.width = game.boardWidth;
		game.container.appendChild(this.canvas);
		this.x = x;
		this.y = y;
	
	},

	draw : function(){
		var self = this;
		if(this.is_exploded){
			$(this.canvas).drawRect({
				fillStyle: "red",
				x: self.x, 
				y: self.y,
				width: 100,
				height: 100
			});	
		}else{
			$(this.canvas).drawArc({
				fillStyle: "darkblue",
				x: self.x, 
				y: self.y,
				radius: 10
			});
		}			
		
	},

	render : function() {
		this.clear();
		this.draw();
		this.shouldExplode();
	},
	clear : function() {
		this.canvas.width = this.canvas.width;
	},
	shouldExplode : function(){
console.log(this.is_exploded, "exploded");		
		if(this.is_exploded){
			return;
		}
		if(new Date().getTime() >= this.drop_time + this.explode_in){
			this.is_exploded = true;
			$(this.canvas).clearCanvas();
	
		}
	}
});  