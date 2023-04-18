
var P;
var Pl;
var D;

function load_fio( arr ){
  P = Array( arr.length );
  for( var i = 0; i < arr.length; ++i ){
    let spl = split(arr[i], ',');
    let x = float( spl[0] );
    let y = float( spl[1] );
    P[i] = createVector( x, y );
  }
}
function failed( response ){
  console.log( response );
}
function preload() {
  loadStrings("data/fio.txt", load_fio, failed );
}

function setup() {

  let w = document.getElementById('fiobg').clientWidth
  let h = document.getElementById('fiobg').clientHeight
  var canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');

  let Scl = h / 711.5;
  for( var i = 0; i < P.length; ++i ){
    P[i].mult(Scl);
  }
  Pl = Array( P.length );
  Pl[0] = 0;
  for( var i = 1; i < P.length; ++i ){
      Pl[i] = P[i].dist( P[i-1] );
  }
  D = -1;
}

function draw() {

  clear();

  stroke(255);
  strokeWeight(5);
  for( var i = 1; i < P.length; ++i ){
    line( P[i].x, P[i].y, P[i-1].x, P[i-1].y );
  }


}

function mousePressed() {
  let M = createVector( mouseX, mouseY );
  for( var i = 0; i < P.length; ++i ){
      let dsq = p5.Vector.sub( P[i], M ).magSq();
      if( dsq < 6 ){
        D = i;
        break;
      }
  }
}

function mouseDragged(){

  P[D].x = mouseX;
  P[D].y = mouseY;

  // propagate up
  for( var i = D+1; i < P.length; ++i ){
    let dx = P[i-1].x - P[i].x;
    let dy = P[i-1].y - P[i].y;
    let angle = atan2(dy, dx);
    P[i].x = P[i-1].x - cos(angle) * Pl[i];
    P[i].y = P[i-1].y - sin(angle) * Pl[i];
  }
  // propagate down
  for( var i = D-1; i >= 0; --i ){
    let dx = P[i+1].x - P[i].x;
    let dy = P[i+1].y - P[i].y;
    let angle = atan2(dy, dx);
    P[i].x = P[i+1].x - cos(angle) * Pl[i];
    P[i].y = P[i+1].y - sin(angle) * Pl[i];
  }
}

function mouseReleased(){
  D = -1;
}