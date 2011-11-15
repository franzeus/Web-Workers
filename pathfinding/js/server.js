// ----------------------------------
// SERVRE CLASS
// ----------------------------------
var Server = {

  blocks : null,
  resDiv : document.getElementById('result'),
  canvas : document.getElementById('canvas'),
  context : null,
  graph: null,
  lines: null,
  thread1 : null,
  source : null,
  destination: null,

  init : function() {
    Server.context = Server.canvas.getContext('2d');
    Server.blocks = [];
    Server.lines = [];
    Server.graph = {
      a: { name: 'a', edges: { b: 1 },            x: 50,  y: 40  },
      b: { name: 'b', edges: { c: 1, e: 1},       x: 250, y: 40  },
      c: { name: 'c', edges: { g: 5},             x: 450, y: 40  },
      d: { name: 'd', edges: { g: 1},             x: 650, y: 40  },
      e: { name: 'e', edges: { a: 1},             x: 50, y: 200 },
      f: { name: 'f', edges: { g: 1, b: 2},       x: 250, y: 200 },
      g: { name: 'g', edges: { f: 1, h: 1},       x: 450, y: 200 },
      h: { name: 'h', edges: { d: 1},             x: 650, y: 200 }
    }

    document.getElementById('canvas').addEventListener('click', function(e) {
      var mouseX = Server.getMousePosition(e)[0];
      var mouseY = Server.getMousePosition(e)[1];

      Server.blocks.forEach(function(block) {
        if( mouseX >= block.shape.x && 
        mouseX <= (block.shape.x + block.shape.width) && 
        mouseY >= block.shape.y &&
        mouseY <= block.shape.y + block.shape.height) {

          // Set Source
          if(Server.source == null) {
            Server.blocks.forEach(function(block) {
              block.shape.color = '#008800';
            }); 
            Server.source = block.index;
          // Set Destination
          } else {
            Server.destination = block.index;
            Server.findPath();            
          }
          block.clickEvent();
        }
      });      
    });
  },

  createGraphs : function() {
    for(var prop in Server.graph ) {
        if(Server.graph.hasOwnProperty(prop))
          Server.blocks.push(new Station(Server.graph[prop].name, Server.graph[prop].edges, Server.graph[prop].x, Server.graph[prop].y, 40, 40));
    }
    this.draw();
  },

  // Start worker
  findPath : function(src, dest) {
    Server.destination = dest || Server.destination;
    Server.source = src || Server.source;
        
    Server.thread1 = new Thread();
    Server.thread1.postMessage({ 'index' : 0, 'from' : Server.source, 'to' : Server.destination, 'graph' : Server.graph });
    Server.reset();
  },

  reset : function() {
    Server.lines = [];
    Server.context.clearRect(0, 0, Server.canvas.width, Server.canvas.height);
    this.draw();
    Server.source = null;   
  },

  createLine : function(startX, startY, endX, endY) {    
    var line = new Line({
      context: Server.context,
      startX: startX + 20,
      startY: startY + 20,
      endX: endX + 20,
      endY: endY + 20,
      lineWidth: 2,
      color: '#FFFFFF'
    });
    Server.lines.push(line);
  },

  resultReceiver : function(message) {    
    Server.resDiv.innerHTML = message.time / 1000 + ' Seconds';

    var playerPath = [];
    for(var i=0; i < message.result.length; i++) {
      if(i < message.result.length - 1) {
        Server.createLine(Server.graph[message.result[i]].x, Server.graph[message.result[i]].y, Server.graph[message.result[i+1]].x, Server.graph[message.result[i+1]].y);
        playerPath.push(new Array(Server.graph[message.result[i+1]].x + 20, Server.graph[message.result[i+1]].y + 20));
      }
    }

    Player.init(Server.graph[message.result[0]].x, Server.graph[message.result[0]].y);
    Player.setPath(playerPath);
  },

  // Draw on canvas
  draw : function() {
    Server.context.clearRect(0,0,Server.canvas.width, Server.canvas.height);    

    if(Server.lines.length) {
      Server.lines.forEach(function(line) {
        line.draw();
      });
    }

    Server.blocks.forEach(function(block) {
      block.draw();
    });

    if(Player.isVisible)
      Player.draw();
    

    setTimeout(function() { Server.draw(); } , 50);
  },

  // Returns current mouseposition
  getMousePosition : function(e) {
    var x, y;

    if (e.pageX || e.pageY) {
      x = e.pageX; y = e.pageY;
    } else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    }

    x -= Server.canvas.offsetLeft;  
    y -= Server.canvas.offsetTop;

    return [x,y];
  },

  // Returns true if web workers are supported by browser
  supported : function() {
     if(!!window.Worker) {
      return true;
     } else {
      Server.resDiv.innerHTML = "Y U NO support Webworkers!?!";
      return false;
     }
  }
}