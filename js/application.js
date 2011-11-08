var startButton = document.getElementById('startButton');
// Start calculation Button
startButton.addEventListener('click', function(e) {
  var numberOfThreads = document.getElementById('threadNum').value;
  var numToCalc = document.getElementById('calcNum').value;
  if(numberOfThreads > 12) {
    alert("Limit of 10 threads!");
    return false;
  }

  if(Server.supported()) {
    Server.init(Math.min(numberOfThreads, 12), numToCalc);
    Server.createWorkers();
  }
});
