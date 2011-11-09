var Player = {
  x : 0,
  y : 0,
  shape : null,
  path : null,
  isVisible : null,
  nextPointIndex: 0,

  init : function(_x, _y) {
    Player.x = _x + 20;
    Player.y = _y + 20;
    Player.shape = new Circle({ context: Server.context, x: Player.x, y: Player.y, radius: 10, color: 'rgba(111, 214, 229, 0.9)' });
    Player.path = [];
    Player.isVisible = false;
    Player.nextPointIndex = 0;

    Player.worker = new Worker("js/thread_playerupdate.js");
    Player.worker.onmessage = Player.resultReceiver;
  },

  draw : function() {
    Player.shape.draw();
    Player.update();
  },

  update : function() {
    
    if(Player.nextPointIndex > Player.path.length - 1) {
      this.xDir = 0;
      this.yDir = 0;
      this.shape.color = 'rgba(111, 214, 229, 0.4)'
      return false;
    }

    var currentX = Math.round(Player.shape.x);
    var currentY = Math.round(Player.shape.y);

    if(Player.nextPointIndex < Player.path.length) {
      if(currentX == Player.path[Player.nextPointIndex][0] && currentY == Player.path[Player.nextPointIndex][1]) {
        Player.nextPointIndex += 1;

        if(Player.nextPointIndex < Player.path.length) {
          this.xDir = (Player.path[Player.nextPointIndex][0] - currentX) / 100; 
          this.yDir = (Player.path[Player.nextPointIndex][1] - currentY) / 100;        
        }
      }
    }
  

    Player.shape.x += this.xDir;
    Player.shape.y += this.yDir;
  },

  resultReceiver : function(event) {
    var message = event.data;

    Player.shape.x = message.x;
    Player.shape.y = message.y;
  },

  setPath : function(_path) {
    if(!_path[0]) return false;
    Player.path = _path;
    Player.isVisible = true;

    // Try update logic in thread -> uncomment Player.update() in draw()
    //Player.worker.postMessage({ 'index' : 0, 'path' : _path, x : Player.x, y : Player.y });

    this.xDir = (_path[0][0] - this.x) / 100;
    this.yDir = (_path[0][1] - this.y) / 100;
  },
};


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
          if(Server.source == null) {
            Server.source = block.index;
          } else {
            Server.destination = block.index;
            Server.findPath();            
            Server.reset();
          }
          block.clickEvent();
        }
      });
      
    });
  },

  createGraphs : function() {
    for(var prop in Server.graph ) {
        if(Server.graph.hasOwnProperty(prop))
          Server.blocks.push(new Station(Server.graph[prop].name, Server.graph[prop].edges, Server.graph[prop].x, Server.graph[prop].y, 40, 40)); // A
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

    Server.blocks.forEach(function(block) {
      block.shape.color = '#008800';
    });    
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