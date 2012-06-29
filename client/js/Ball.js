Classify("Game/Ball", {
	x : 10,
	y : 10,
	dx : 4,
	dy : 4,
	r : 10,
	init : function(boardHeight, boardWidth) {
		this.canvas = document.createElement("canvas");
		this.canvas.height = boardHeight;
		this.canvas.width = boardWidth;
		this.context = this.canvas.getContext('2d');
	},
	appendTo : function(container) {
		container.appendChild(this.getCanvas());
	},
	render : function() {
		this.move();
		this.clear();
		this.draw();
	},
	draw : function() {
		this.context.fillStyle = 'rgb(0, 0, 0)';
		this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
		this.context.closePath();
		this.context.fill();
		this.context.save();
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
		this.canvas.width = this.canvas.width;
	},
	getCanvas : function() {
		return this.canvas;
	}
});
