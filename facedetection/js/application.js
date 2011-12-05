$(document).ready(function() {
  /*
  // Grayscale function by Liu Liu
    function grayscale(image) {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      
      canvas.width  = image.offsetWidth;
      canvas.height = image.offsetHeight;
      
      ctx.drawImage(image, 0, 0);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;
      var pix1, pix2, pix = canvas.width * canvas.height * 4;
      while (pix > 0) {
        data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data[pix] * 0.3 + data[pix1] * 0.59 + data[pix2] * 0.11);
      }
      ctx.putImageData(imageData, 0, 0);
      return canvas;
  }
  var coords = ccv.detect_objects(grayscale( $('img').get(0) ), cascade, 5, 1);
  */


  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");

  var faceImage = new Image();
  faceImage.src = "faces.png";
  faceImage.onload = function(){  
    ctx.drawImage(faceImage, 0, 0, canvas.width, canvas.height);
  };
  canvas.width = faceImage.width;
  canvas.height = faceImage.height;

  // Start
  document.getElementById('startButton').addEventListener('click', function(e) {

    var comp = ccv.detect_objects({ "canvas" :  ccv.pre(faceImage),
                    "cascade" : cascade,
                    "interval" : 5,
                    "min_neighbors" : 1 });
    
    for (var i = 0; i < comp.length; i++) {
      var offsetLeft = $('canvas').position().left;
      var offsetTop = $('canvas').position().top;
      var finalLeft = Math.round(offsetLeft + comp[i].x);
      var finalTop = Math.round(offsetTop + comp[i].y);
      $('.faceBox').clone().css({ left: finalLeft, top: finalTop, width: comp[i].width, height: comp[i].height}).appendTo('body').fadeIn();
      console.log(finalLeft, finalTop);
    }
  });
  

/*
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");

  var faceImage = new Image();
  faceImage.src = "face.jpg";
  faceImage.onload = function(){  
    ctx.drawImage(faceImage, 0, 0, canvas.width, canvas.height);
  };
  canvas.width = faceImage.width;
  canvas.height = faceImage.height;



  // Get 100 pixels of the green Canvas
  var data = ctx.getImageData( 0, 0, canvas.width, canvas.height ).data;

  document.getElementById('startButton').addEventListener('click', function(e) {
    var t = new Thread(1);
    t.postMessage({ path: 'face.jpg', imagedata: data });
  });
  */
});