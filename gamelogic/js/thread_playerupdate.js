Thread = function(_index, _x, _y, _path) {

  this.index = _index;
  this.currentX = _x;
  this.currentY = _y;
  this.path = _path;
  this.nextPointIndex = 0;
  this.xDir = (this.path[0][0] - this.currentX) / 100;
  this.yDir = (this.path[0][1] - this.currentY) / 100;

  this.result = 0;

  var that = this;
  setInterval( function() { that.calculate() }, 50);
};
Thread.prototype.calculate = function() {

  if(this.nextPointIndex > this.path.length - 1) {
    this.xDir = 0;
    this.yDir = 0;
    return false;
  }

  this.currentX = Math.round(this.currentX);
  this.currentY = Math.round(this.currentY);
  
  if(this.nextPointIndex < this.path.length) {
    if(this.currentX == this.path[this.nextPointIndex][0] && this.currentY == this.path[this.nextPointIndex][1]) {
        this.nextPointIndex += 1;

        if(this.nextPointIndex < this.path.length) {
          this.xDir = (this.path[this.nextPointIndex][0] - this.currentX) / 100; 
          this.yDir = (this.path[this.nextPointIndex][1] - this.currentY) / 100;        
        }
    }
  }

  this.currentX += this.xDir;
  this.currentY += this.yDir;

  this.postMessage();
};

Thread.prototype.postMessage = function() {
  postMessage({
    x : this.currentX,
    y : this.currentY
  });
};


// Start Thread
onmessage = function(event) {
  var index = event.data.index || 'T';
  var x = event.data.x;
  var y = event.data.y;
  var path = event.data.path;

  if(typeof(thread) === 'undefined')
    thread = new Thread(index, x, y, path);
};