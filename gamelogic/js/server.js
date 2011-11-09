// ----------------------------------
// SERVRE CLASS
// ----------------------------------
var Server = {

  blocks : null,
  resDiv : document.getElementById('result'),
  canvas : document.getElementById('canvas'),
  context : null,
  graph: null,

  init : function() {
    Server.context = Server.canvas.getContext('2d');
    Server.blocks = [];

    Server.graph = {
      a: { name: 'a', edges: { b: 10 }, x: 100, y: 40 },
      b: { name: 'b', edges: { c: 5, d: 1}, x: 300 , y: 40},
      c: { name: 'c', edges: { d: 5, f: 1}, x: 300, y: 200},
      d: { name: 'd', edges: { b: 1}, x: 100, y: 200 },
      e: { name: 'e', edges: { c: 1, g: 1}, x: 500, y: 40 },
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

    var thread = new Thread();
    thread.postMessage({ 'index' : 0, 'from' : src, 'to' : dest, 'graph' : Server.graph });

    var path = dijkstra.find_path(Server.graph, src, dest);
    
    for(var i=0; i<path.length; i++) {
      if(i < path.length - 1)
        Server.drawLine(Server.graph[path[i]].x, Server.graph[path[i]].y, Server.graph[path[i+1]].x, Server.graph[path[i+1]].y);
    }    
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

  resultReceiver : function(event) {
    var message = event.data;

    //Server.resDiv.innerHTML +=  message.index + ': ' + message.text + '<br />';
          
    if(message.action == 'result') {
      
      Server.sumTime += message.time;

      if(message.index == Server.workers.length - 1) {       
        Server.resDiv.innerHTML = Server.sumTime / 1000 + ' Seconds';
      }
    }
    else if(message.action == 'found') {
      Server.workers[message.index].result = message.text;
    }
  },

  draw : function() {
    Server.context.clearRect(0,0,Server.canvas.width, Server.canvas.height);
    
    Server.blocks.forEach(function(block) {
      block.draw();
    });

    //setTimeout(function() { Server.draw(); } , 50);
  },

  update : function() {
    
  },

  errorReceiver : function(event) {
    throw event.data;
    console.log('ERROR: ' + event.data);
    Server.workers[message.index].setStatus('error');
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