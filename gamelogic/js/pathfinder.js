importScripts('dijkstra.js');

Thread = function(_index, _from, _to, _graph) {
  this.index = _index;
  this.from = parseInt(_from);
  this.to = parseInt(_to);
  this.graph = _graph;

  postMessage({ 'graph' : _graph});
  
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
  //this.postMessage(path, 'result');
};

Thread.prototype.postMessage = function(_text, _action) {
  if(!_action) _action = null;
  var time = this.stopTime - this.startTime;
  postMessage({ 'action' : _action, 'text' : _text, 'result' : this.result, 'time' : time });
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