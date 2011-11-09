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

  setPath : function(_path) {
    if(!_path[0]) return false;
    Player.path = _path;
    Player.isVisible = true;

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

  init : function() {
    Server.context = Server.canvas.getContext('2d');
    Server.blocks = [];
    Server.lines = [];
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
    Server.lines = [];
    Server.context.clearRect(0, 0, Server.canvas.width, Server.canvas.height);
    this.draw();

    Server.thread1 = new Thread();
    Server.thread1.postMessage({ 'index' : 0, 'from' : src, 'to' : dest, 'graph' : Server.graph });
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

  supported : function() {
     if(!!window.Worker) {
      return true;
     } else {
      Server.resDiv.innerHTML = "Y U NO support Webworkers!?!";
      return false;
     }
  }
}