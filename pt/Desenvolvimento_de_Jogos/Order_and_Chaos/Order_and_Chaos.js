var board;
let mode = 1;
var l;

function setup() {
  createCanvas(400, 400);
  l = width/6.0;
  board = Array(6);
  for( var i = 0; i < 6; ++i ){
    board[i] = Array(6);
    for( var j = 0; j < 6; ++j ){
      board[i][j] = 0;
    }
  }
}


function draw() {
  background('#252727');
  
  if( mode > 0 ) fill( '#409EFF' );
  else fill('#FF6040');
  ellipse( mouseX, mouseY, l, l );
  
  for( var i = 0; i < 6; ++i ){
    stroke(255);
    line( i*l, 0, i*l, height);
    line( 0, i*l, width, i*l );
    noStroke();
    for( var j = 0; j < 6; ++j ){
      if( board[i][j] != 0 ){
        if( board[i][j] > 0 ) fill( '#409EFF' );
        else fill('#FF6040');
        ellipse( (i+0.5)*l, (j+0.5)*l, l, l );
      }
    }
  }
}
function mouseReleased(){
  var I = floor( mouseX / l );
  var J = floor( mouseY / l );
  board[I][J] = mode;
}

function keyReleased(){
  mode *= -1;
}
