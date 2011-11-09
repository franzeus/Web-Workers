// ----------------------------------
// SERVRE CLASS
// ----------------------------------
var Server = {

  blocks : null,
  resDiv : document.getElementById('result'),
  canvas : document.getElementById('canvas'),
  context : null,
  graph: null,
  thread1 : null,

  init : function() {
    Server.context = Server.canvas.getContext('2d');
    Server.blocks = [];

    Server.graph = {
      a: { name: 'a', edges: { b: 10 }, x: 100, y: 40 },
      b: { name: 'b', edges: { c: 5, d: 1, e: 1}, x: 300 , y: 40},
      c: { name: 'c', edges: { d: 5, f: 1}, x: 300, y: 200},
      d: { name: 'd', edges: { b: 1}, x: 100, y: 200 },
      e: { name: 'e', edges: { c: 1, h :1}, x: 500, y: 40 },
      f: { name: 'f', edges: { e: 1, b: 2}, x: 500, y: 200 },
      g: { name: 'g', edges: { h: 1}, x: 700, y: 40 },
      h: { name: 'h', edges: { e: 1, f: 1}, x: 700, y: 200 }
    }

    document.getElementById('canvas').addEventListener('onkeypress', function(e){
      console.log(e.keyCode);
    });
  },

  createGraphs : function() {
    for(var prop in Server.graph ) {
        if(Server.graph.hasOwnProperty(prop))
          Server.blocks.push(new Station(Server.graph[prop].name, Server.graph[prop].edges, Server.graph[prop].x, Server.graph[prop].y, 40, 40)); // A
    }
    this.draw();
  },

  findPath : function(src, dest) {
    Server.context.clearRect(0, 0, Server.canvas.width, Server.canvas.height);
    this.draw();

    Server.thread1 = new Thread();
    Server.thread1.postMessage({ 'index' : 0, 'from' : src, 'to' : dest, 'graph' : Server.graph });
  },

  drawLine : function(startX, startY, endX, endY) {
    Server.context.strokeStyle = '#f00';
    Server.context.lineWidth   = 2;
    Server.context.beginPath();
    Server.context.moveTo(startX + 20, startY + 20); 
    Server.context.lineTo(endX + 20, endY + 20);
    Server.context.stroke();
    Server.context.closePath();
  },

  resultReceiver : function(message) {    
    Server.resDiv.innerHTML = message.time / 1000 + ' Seconds';

    for(var i=0; i < message.result.length; i++) {
      if(i < message.result.length - 1)
        Server.drawLine(Server.graph[message.result[i]].x, Server.graph[message.result[i]].y, Server.graph[message.result[i+1]].x, Server.graph[message.result[i+1]].y);
    }
  },

  draw : function() {
    Server.context.clearRect(0,0,Server.canvas.width, Server.canvas.height);
    
    Server.blocks.forEach(function(block) {
      block.draw();
    });

    //setTimeout(function() { Server.draw(); } , 50);
  },

  supported : function() {    
     if(!!window.Worker) {
      return true;
     } else {
      Server.resDiv.innerHTML = "Y U NO support Webworkers!?!";
      return false;      
     }
  }
}