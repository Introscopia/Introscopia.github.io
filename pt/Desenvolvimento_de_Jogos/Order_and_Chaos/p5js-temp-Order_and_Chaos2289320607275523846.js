var board;
var mode = 1;
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
  if( mode > 0 ) fill( "#409EFF" );
  else fill("#FF6040");
  ellipse( mouseX, mouseY, l, l );
  for( var i = 0; i < 6; ++i ){
    for( var j = 0; j < 6; ++j ){
      if( board[i][j] != 0 ){
        if( board[i][j] > 0 ) fill( #409EFF );
        else fill(#FF6040);
        ellipse( (i+0.5)*l, (j+0.5)*l, l, l );
      }
    }
  }
}

function keyReleased(){
  mode *= -1;
}
