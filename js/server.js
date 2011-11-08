var Server = {
  workers : null,
  numberOfWorkers : 0,
  resDiv : document.getElementById('result'),
  sumAggregation : 0,
  sumTime : 0,
  numberToCalculate : 0,
  canvas : document.getElementById('canvas'),
  context : null,
  serverShape : null,

  startTime : null,
  stopTime : null,

  init : function(_num, _numToCalc) {
    Server.numberToCalculate = _numToCalc || 9000;
    Server.context = Server.canvas.getContext('2d');
    Server.sumAggregation = 0;
    Server.sumTime = 0;
    Server.workers = [];
    Server.numberOfWorkers = _num || 1;
    Server.serverShape = new Rectangle(Server.context, (Server.canvas.width / 2) - 100, Server.canvas.height - 40, 200, 40, '#666666');
    startTime = 0;
    stopTime = 0;
  },

  createWorkers : function() {
    GAP = 20;
    var x = 20;
    var y = 20;
    for(var i=0; i < Server.numberOfWorkers; i++) {
      if(i > 0) {
        x = Server.workers[i-1].x + Server.workers[i-1].width + GAP;
        if(x + Server.workers[i-1].width + GAP > Server.canvas.width) {
          x = 20;
          y += 120;
        }        
      }
      Server.workers.push(new Thread(i, x, y));
    }    

    /*
    var x = (Server.canvas.width / 2) - ( (Server.numberOfWorkers * 70) / 2 + 60 );
    }*/
    Server.assignWork();
  },

  assignWork : function() {

    // Split the calculation
    var range = new Array();
    var split = Math.round(Server.numberToCalculate / Server.numberOfWorkers);
    for(var k = 1; k <= Server.numberToCalculate; k++) {
      if(k>0 && k % split == 0) {
        range.push(new Array(k - split, k));
      }
    }

    this.draw();

    // Post calculation vars to thread
    for(var i=0; i < Server.workers.length; i++) {
      var from = range[i][0];
      var to = range[i][1];

      Server.workers[i].worker.onmessage = Server.resultReceiver;
      Server.workers[i].worker.postMessage({'action' : 'create', 'index' : i, 'from' : from, 'to' : to});
      Server.workers[i].worker.onerror = Server.errorReceiver;
      Server.workers[i].setStatus('working');
    }

  },

  resultReceiver : function(event) {
    var message = event.data;

    //Server.resDiv.innerHTML +=  message.index + ': ' + message.text + '<br />';
          
    Server.workers[message.index].result = message.text;
            
    if(message.action == 'result') {
      Server.workers[message.index].setStatus('finished');
      Server.workers[message.index].worker.terminate();
      Server.sumAggregation += message.result;
      Server.workers[message.index].time = message.time;
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
    
    Server.workers.forEach(function(worker){
      worker.draw();
    });

    Server.serverShape.draw();
    Server.context.fillStyle = '#FFFFFF';
    Server.context.font = "10pt Arial";
    Server.context.fillText('Receiver', Server.serverShape.x + 10, Server.serverShape.y + 25);
    Server.context.fillText('Total:', Server.serverShape.x + 120, Server.serverShape.y + 25);
    Server.context.fillText(Server.sumAggregation, Server.serverShape.x + 160, Server.serverShape.y + 25);

    setTimeout(function() { Server.draw()} , 50);
  },

  errorReceiver : function(event) {
    throw event.data;
    console.log('ERROR: ' + event.data);
    Server.workers[message.index].setStatus('error');
  },

  ping : function(_index) {
    this.resDiv.innerHTML +=  'Ping: ' + _index + '<br />';      
    this.workers[_index].worker.postMessage({'action' : 'ping'});
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