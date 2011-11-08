var Thread = function(_index, _x, _y) {
  this.index = _index;
  this.x = _x;
  this.y = _y;
  this.width = 100;
  this.height = 100;

  this.time = 0;

  this.color = { 
    inactive : '#F0EEC2',
    working : '#C1C2F5',
    finished : '#BED1B0',
    error : '#EB9B81'
  };

  this.shape = new Rectangle(Server.context, this.x, this.y, this.width, this.height, this.color.inactive);
  this.fontColor = '#333333';

  this.text = 'Thread ' + this.index;
  this.result = null;
  this.status = 'working ...';
  this.worker = new Worker("js/primenumber.js");
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
  Server.context.font = "8pt Arial";
  Server.context.fillText(this.result, this.x + 3, this.y + 50);

  // Result
  if(this.time) {
    Server.context.fillText('Time: ' + this.time / 1000 + ' sec', this.x + 3, this.y + 70);    
  }
};

Thread.prototype.setStatus = function(_status) {
  if(!_status) return false;
  switch(_status) {
    case('working'):  this.shape.color = this.color.working;
                      this.status = 'working ...'; break;

    case('inactive'): this.shape.color = this.color.inactive; 
                      this.status = 'inactive'; break;

    case('finished'): this.shape.color = this.color.finished;
                      this.status = 'finished'; break;

    case('error'):    this.shape.color = this.color.error; 
                      this.status = 'error'; break;  
  }
};

Thread.prototype.setResult = function(_result) {       
  this.shape.color = _color;
};