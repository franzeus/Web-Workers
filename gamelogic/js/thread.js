var Thread = function(_index) {
  this.index = _index;

  this.time = 0;
  this.worker = new Worker("js/pathfinder.js");
  this.worker.onmessage = this.resultReceiver;      
  this.worker.onerror = this.errorReceiver;

  this.stats = {
    inactive  : { color : '#F0EEC2', label : 'inactive' },
    working   : { color : '#C1C2F5', label : 'working ...' },
    finished  : { color : '#BED1B0', label : 'finished' },
    error     : { color : '#EB9B81', label : 'error'}
  }

  this.result = null;
};

Thread.prototype.postMessage = function(_data) {
  this.worker.postMessage(_data);
};

Thread.prototype.stop = function() {
  this.worker.terminate();
};

Thread.prototype.resultReceiver = function(event) {
  var message = event.data;
  console.log(message);
  Server.resultReceiver(message);  
};

Thread.prototype.setResult = function(_result) {
  this.result = _result;
};

Thread.prototype.errorReceiver = function(event) {
  console.log(event.data);
};