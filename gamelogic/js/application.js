Server.init();
Server.createGraphs();

// Start calculation Button
document.getElementById('startButton').addEventListener('click', function(e) {
  var src = document.getElementById('source').value;
  var des = document.getElementById('destination').value;
    
  if(Server.supported()) {    
    Server.findPath(src, des);
  }
});