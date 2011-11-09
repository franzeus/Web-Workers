var Station = function(_index, _connections, _x, _y, _w, _h) {
  this.index = _index;
  this.x = _x;
  this.y = _y;
  this.width = _w;
  this.height = _h;

  this.stationShape = new Rectangle({ context: Server.context, x: this.x, y: this.y, width: this.width, height: this.height, color: '#008800' });
  this.connections = _connections;
};
//
Station.prototype.draw = function() {
  this.stationShape.draw();

  Server.context.fillStyle = '#F6F6F6';
  Server.context.font = "10pt Arial";
  
  Server.context.fillText(this.index, this.getCenterPoint()[0] - 5, this.getCenterPoint()[1] + 4);
};
//
Station.prototype.clickEvent = function() {

};
//
Station.prototype.showConnections = function() {

};
//
Station.prototype.getCenterPoint = function() {
  var xCenter = this.x + (this.width / 2);
  var yCenter = this.y + (this.height / 2);
  return [xCenter, yCenter];  
};