Thread = function(_index, _from, _to) {
  this.index = parseInt(_index);
  this.from = parseInt(_from);
  this.to = parseInt(_to);

  this.startTime = null;
  this.stopTime = null;

  this.result = 0;

  var that = this;
  //setTimeout( function() { that.calculate() }, 1000 * this.index);
  this.calculate();
};
Thread.prototype.calculate = function() {  
  var count = 0;
  this.startTime = new Date().getTime();
  var n = '';
  var isPrime = false;
  for(var i = this.from; i < this.to; i++) {
      for (var j = 2; j <= i; j++) {
          if ( i != j && i % j == 0 ){
            isPrime = false;
            break;
          }
      }
      if (isPrime && i != 1) {
        //n += i + ',';
        this.postMessage('Found: ' + count, 'found');
        count++;
      }
      isPrime = true;
  }
   
  this.result = count;
  this.stopTime = new Date().getTime();
  this.postMessage('Found: ' + count, 'result');
};

Thread.prototype.pong = function() {
  var that = this;
  //this.postMessage('Pong!', 'pong');
};

Thread.prototype.postMessage = function(_text, _action) {
  if(!_action) _action = null;
  var time = this.stopTime - this.startTime;
  postMessage({ 'index' : this.index, 'action' : _action, 'text' : _text, 'result' : this.result, 'time' : time });
};

// Start Thread
onmessage = function(event) {
  var index = event.data.index;
  var from = event.data.from;
  var to = event.data.to;

  //if(event.data.action == 'create')
  if(typeof(thread) === 'undefined')
    thread = new Thread(index, from, to);
  if (event.data.action == 'ping');
    thread.pong();
};