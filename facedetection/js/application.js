$(document).ready(function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");

  var faceImage = new Image();
  faceImage.src = "face.jpg";
  faceImage.onload = function(){  
    ctx.drawImage(faceImage, 0, 0, canvas.width, canvas.height);
  };

  // Start
  document.getElementById('startButton').addEventListener('click', function(e) {

    var comp = ccv.detect_objects({ "canvas" :  ccv.pre(faceImage),
                    "cascade" : cascade,
                    "interval" : 5,
                    "min_neighbors" : 1 });
    
    resizeCanvas(faceImage, canvas);
    ctx.drawImage(faceImage, 0, 0);
    
    for (var i = 0; i < comp.length; i++) {
      $('.faceBox').css({ left: comp[i].x, top: comp[i].y, width: comp[i].width, height: comp[i].height}).show();
      console.log(comp[i].x);
    }
  });
});