var startButton = document.getElementById('startButton');
startButton.addEventListener('click', function(e) { 

  var numberOfThreads = document.getElementById('threadNum').value;
  var numToCalc = document.getElementById('calcNum').value;
  if(numberOfThreads > 10) {
    alert("No more than 10 Threads!");
    return false;
  }

  if(Server.supported()) {
    Server.init(Math.min(numberOfThreads, 10), numToCalc);
    Server.createWorkers();
  }
});
