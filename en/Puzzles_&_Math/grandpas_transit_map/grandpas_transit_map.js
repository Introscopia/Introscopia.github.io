var path = [0, 1, 4, 14, 20, 21, 26, 31, 25, 20, 14, 4, 1, 2, 3, 9, 13, 19, 18, 17, 16, 15, 10, 5, 6, 11, 16, 22, 27, 26, 25, 21, 22, 23, 18, 24, 30, 29, 18, 12, 8, 3, 6, 10, 14, 21, 27, 33, 34, 35];
var X = [177, 116, 203, 289, 28, 116, 200, 289, 378, 465, 116, 285, 376, 462, 24, 113, 197, 286, 374, 465, 25, 109, 198, 283, 460, 25, 110, 196, 280, 370, 457, 108, 194, 280, 368, 320];
var Y = [ 26, 66, 65, 70, 153, 151, 154, 155, 157, 156, 239, 243, 244, 245, 325, 329, 328, 329, 332, 330, 414, 413, 413, 416, 417, 499, 499, 502, 504, 504, 503, 588, 591, 589, 592, 626]; 

var img;
var c, p, x, y, v, cos, sin;
function setup() {
  var canvas = createCanvas( 493, 646 );
  canvas.parent('sketch-holder');
  
  img = loadImage('data/grid.jpg');
  x = X[0];
  y = Y[0];
  c = 1;
  p = 1;
  v = 3;
  var d = dist( x, y, X[p], Y[p] );
  cos = v * ((X[p]-x) / d);
  sin = v * ((Y[p]-y) / d);
  fill(255, 255, 0);
  noStroke();
}

function draw() {
  image( img, 0, 0 );
  ellipse( x, y, 30, 30 );
  //for( var i = 0; i < X.length; ++i ){
  //  ellipse( X[i], Y[i], 5, 5 );
  //}
  if( dist( x, y, X[p], Y[p] ) <= v ){
    x = X[p];
    y = Y[p];
    ++c;
    p = path[c];
    if( c >= path.length ){
      x = X[0];
      y = Y[0];
      c = 1;
      p = 1;
    }
    var d = dist( x, y, X[p], Y[p] );
    cos = v * ((X[p]-x) / d);
    sin = v * ((Y[p]-y) / d);
  }
  else{
    x += cos;
    y += sin;
  }
}
