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