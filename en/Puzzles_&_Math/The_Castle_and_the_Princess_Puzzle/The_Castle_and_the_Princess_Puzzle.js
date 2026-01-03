var N = 6;
var princess, prince;
var w, ww;
var scroll = 0;

function setup(){
  createCanvas(500, 600);
  
  prince = [ 0 ];
  princess = [];
  princess[0] = [];
  for(var j = 0; j < N; j++) princess[0][j] = (j != prince[0]);
  ww = floor((width-1)/N);
  w = ww * 0.5;
  noLoop();
}

function draw(){
  background(255);
  translate(0, scroll);
  for(var i = 0; i <= prince.length; i++){
    for(var j = 0; j < N; j++){
      strokeWeight(1);
      if( i < prince.length && prince[i] == j ) fill(255, 100, 100);
      else fill(255);
      rect(j * ww, i * ww, ww, ww);
    }
  }
  for(var i = 0; i < prince.length; i++){
    for(var j = 0; j < N; j++){
      if( princess[i][j] ){
        strokeWeight(5);
        if( j > 0 )  line( (j+0.5) * ww, (i+0.5) * ww, (j-0.5) * ww, (i+1.5) * ww );
        if( j < N-1) line( (j+0.5) * ww, (i+0.5) * ww, (j+1.5) * ww, (i+1.5) * ww );
      }
    }
  }
}

function mouseClicked(){
  var Y = floor( (mouseY-scroll)/ww );
  var X = floor( mouseX/ww );
  print( Y, X );
  if( Y >= 0 && Y < prince.length){
    if( Y === prince.length-1 && prince[Y] === X ) prince.pop();
    else prince[Y] = X;
  }
  else if( Y == prince.length ) prince.push( X );
  
  princess = [];
  princess[0] = [];
  for(var j = 0; j < N; j++) princess[0][j] = (j != prince[0]);
  
  for(var i = 1; i <= prince.length; i++){
    princess[i] = [];
    for(var j = 0; j < N; j++){
      if( prince[i] == j ) princess[i][j] = false;
      else{
        if( j == 0 ){
          if( princess[i-1][1] ) princess[i][j] = true;
          else princess[i][j] = false;
        }
        else if( j == N-1){
          if( princess[i-1][N-2] ) princess[i][j] = true;
          else princess[i][j] = false;
        }
        else{
          if( princess[i-1][j-1] || princess[i-1][j+1] ) princess[i][j] = true;
          else princess[i][j] = false;
        }
      }
    }
  }    
  redraw();
}

function keyPressed(){
  if( key == ' '){
    nodes = [];
    prince = [0];
    for(var i = 0; i < N; i++){
      nodes.push( new Node(i) );
      nodes[i].spawn(prince.length, 0);
    }
  }
  redraw();
}

function mouseWheel(E) {
  scroll -= 25 * (E.delta / abs(E.delta));
  if( scroll > 0 ) scroll = 0;
  print( E.delta, scroll );
  redraw();
}
