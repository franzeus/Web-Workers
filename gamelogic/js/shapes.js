/*
	HTML5 Canvas - Shape Class V 1.1
	https://github.com/webarbeit
*/
// Base Class
Shape = function(_context, _x, _y, _color) {
	this.init(_context, _x, _y, _color);
}
Shape.prototype.init = function(_context, _x, _y, _color) {
	this.x = _x || 0;
	this.y = _y || 0;
	this.color = _color;
	this.canvasContext = _context;
};

// -------------------------------------------------
Circle = function(_settings) {
	this.constructor(_settings.context, _settings.x, _settings.y, _settings.color);
	this.radius = _settings.radius;
};
Circle.prototype = new Shape();
//
Circle.prototype.draw = function() {
	this.canvasContext.beginPath();
	this.canvasContext.fillStyle = this.color;
	this.canvasContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
	this.canvasContext.fill();
};

// -------------------------------------------------
Rectangle = function(_settings) {
	this.constructor(_settings.context, _settings.x, _settings.y, _settings.color);
	this.width = _settings.width;
	this.height = _settings.height;
};
Rectangle.prototype = new Shape();
//
Rectangle.prototype.draw = function() {
	this.canvasContext.fillStyle = this.color;
	this.canvasContext.fillRect(this.x, this.y, this.width, this.height);
};

// -------------------------------------------------
ImageShape = function(_settings) {
	this.constructor(_settings.context, _settings.x, _settings.y);
	this.width = _settings.width;
	this.height = _settings.height;
	this.src = _settings.src;
	this.img = new Image();
	this.img.src = this.src;
	this.angle = _settings.angle;// _angle;
};
ImageShape.prototype = new Shape();
//
ImageShape.prototype.draw = function() {
	this.canvasContext.save();
	this.canvasContext.rotate(this.angle * Math.PI  / 180);
	this.canvasContext.drawImage(this.img, this.x, this.y, this.width, this.height);
	this.canvasContext.restore();
};


// -------------------------------------------------
Line = function(_settings) {
	this.constructor(_settings.context, _settings.startX, _settings.startY, _settings.color);
	this.endX = _settings.endX;
	this.endY = _settings.endY;
	this.lineWidth = _settings.lineWidth;
};
Line.prototype = new Shape();
//
Line.prototype.draw = function() {
	this.canvasContext.strokeStyle = this.color;
  this.canvasContext.lineWidth = this.lineWidth;
  this.canvasContext.beginPath();
  this.canvasContext.moveTo(this.x, this.y); 
  this.canvasContext.lineTo(this.endX, this.endY);
  this.canvasContext.stroke();
  this.canvasContext.closePath();
};