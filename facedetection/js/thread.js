var Thread = function(_index) {
  this.index = _index;

  this.time = 0;
  this.worker = new Worker("js/worker_facedetecton.js");
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
  console.log(message.x, message.y, message.w, message.h);
  $('.faceBox').clone().css({ left: message.x, top: message.y, width: message.w, height: message.h}).appendTo('body').fadeIn();
};

Thread.prototype.setResult = function(_result) {
  this.result = _result;
};

Thread.prototype.errorReceiver = function(event) {
  console.log(event.data);
};

Thread.prototype.terminate = function(event) {
  this.worker.terminate();
};