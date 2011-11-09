var Station = function(_index, _connections, _x, _y, _w, _h) {
  this.index = _index;
  this.x = _x;
  this.y = _y;
  this.width = _w;
  this.height = _h;

  this.stationShape = new Rectangle(Server.context, this.x, this.y, this.width, this.height, '#008800');
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