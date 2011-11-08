Thread = function(_index, _from, _to) {
  this.index = parseInt(_index);
  this.from = parseInt(_from);
  this.to = parseInt(_to);

  this.result = 0;

  var that = this;
  //setTimeout( function() { that.calculate() }, 1000 * this.index);
  this.calculate();
};
Thread.prototype.calculate = function() {  
  var count = 0;

  var n = '';
  var isPrime = true;
  for(var i = this.from; i < this.to; i++) {
      for (var j = 2; j <= i; j++) {
          if ( i != j && i % j == 0 ){
            isPrime = false;
            break;
          }
      }
      if (isPrime) {
        n += i + ',';
        this.postMessage('Found: ' + i, 'found');
        count++;
      }
      isPrime = true;
  }
   
  this.result = count;
  this.postMessage('Found: ' + count, 'result');
};

Thread.prototype.pong = function() {
  var that = this;
  //this.postMessage('Pong!', 'pong');
};

Thread.prototype.postMessage = function(_text, _action) {
  if(!_action) _action = null;
  postMessage({ 'index' : this.index, 'action' : _action, 'text' : _text, 'result' : this.result});
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