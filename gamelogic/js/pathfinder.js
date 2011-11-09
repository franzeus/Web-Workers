importScripts('dijkstra.js');

Thread = function(_index, _from, _to, _graph) {
  this.index = _index;
  this.from = _from;
  this.to = _to;
  this.graph = _graph;
  
  this.startTime = null;
  this.stopTime = null;

  this.result = 0;

  var that = this;
  this.calculate();
};
Thread.prototype.calculate = function() {
  this.startTime = new Date().getTime();
  
  var path = dijkstra.find_path(this.graph, this.from, this.to);

  this.result = path;
  this.stopTime = new Date().getTime();
  this.postMessage();
};

Thread.prototype.postMessage = function() {
  var time = this.stopTime - this.startTime;
  postMessage({
    'result' : this.result, 
    'time' : time
  });
};


// Start Thread
onmessage = function(event) {
  var index = event.data.index || 'T';
  var from = event.data.from;
  var to = event.data.to;
  var graph = event.data.graph;

  if(typeof(thread) === 'undefined')
    thread = new Thread(index, from, to, graph);
};