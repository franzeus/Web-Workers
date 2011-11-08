var Thread = function(_index, _x, _y) {
  this.index = _index;
  this.x = _x;
  this.y = _y;
  this.width = 100;
  this.height = 100;

  this.time = 0;
  this.worker = new Worker("js/primenumber.js");

  this.stats = {
    inactive  : { color : '#F0EEC2', label : 'inactive' },
    working   : { color : '#C1C2F5', label : 'working ...' },
    finished  : { color : '#BED1B0', label : 'finished' },
    error     : { color : '#EB9B81', label : 'error'}
  }

  this.shape = new Rectangle(Server.context, this.x, this.y, this.width, this.height, this.stats.inactive.color);
  this.fontColor = '#333333';

  this.text = 'Thread ' + this.index;
  this.result = null;
  this.status = this.stats.working.label;
};

Thread.prototype.draw = function() {
  this.shape.draw();

  // Thread x
  Server.context.fillStyle = this.fontColor;
  Server.context.font = "10pt Arial";
  Server.context.fillText(this.text, this.x + 6, this.y + 13);

  // Status
  Server.context.font = "8pt Arial";
  Server.context.fillText(this.status, this.x + 3, this.y + 30);

  // Result
  Server.context.fillText(this.result, this.x + 3, this.y + 50);

  // Time
  if(this.time) {
    Server.context.fillText('Time: ' + this.time / 1000 + ' sec', this.x + 3, this.y + 70);    
  }
};

Thread.prototype.setStatus = function(_status) {
  if(!_status) return false;
  switch(_status) {
    case('inactive'): this.shape.color = this.stats.inactive.color; 
                      this.status = this.stats.inactive.label; break;

    case('working'):  this.shape.color = this.stats.working.color;
                      this.status = this.stats.working.label; break;

    case('finished'): this.shape.color = this.stats.finished.color;
                      this.status = this.stats.finished.label; break;

    case('error'):    this.shape.color = this.stats.error.color;
                      this.status = this.stats.error.label; break;  
  }
};

Thread.prototype.setResult = function(_result) {       
  this.shape.color = _color;
};