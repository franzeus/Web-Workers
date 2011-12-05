importScripts('ccv.js');
importScripts('face.js');

Thread = function(_index, _path, _data) {
  this.index = _index;
  this.path = _path;
  this.data = _data;
  
  this.startTime = null;
  this.stopTime = null;

  var that = this;
  this.calculate();
};
Thread.prototype.calculate = function() {
  this.startTime = new Date().getTime();
  
  // Load Image
  //var faceImage = new Image();
  //faceImage.src = this.path;
  
  // Start
  var comp = ccv.detect_objects({ "canvas" :  ccv.pre(this.data),
                    "cascade" : cascade,
                    "interval" : 5,
                    "min_neighbors" : 1 });
  var x = 0; var y = 0;
  var w = 0; var h = 0;
  for (var i = 0; i < comp.length; i++) {      
    x = Math.round(comp[i].x);
    y = Math.round(comp[i].y);
    w = comp[i].width;
    h = comp[i].height;
  }

  this.result = {x: x, y: y, w: w, h: h};
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
var i = new Image();

// Start Thread
onmessage = function(event) {  
  var index = 1;
  var path = event.data.path;
  var data = event.data.imagedata;

  if(typeof(thread) === 'undefined')
    thread = new Thread(index, path, data);
};