var E = 20;
var grid = [];
function setup(){
  createCanvas(600, 600);
  var N = floor(width/E);
  for(var i = 0; i < N; i++){
    grid[i] = [];
    for(var j = 0; j < N; j++){
      grid[i][j] = false;
    }
  }
  grid[0][0] = true;
  grid[1][0] = true;
  grid[0][1] = true;
  noStroke();
}

function draw(){
  for(var i = 0; i < grid.length; i++){
    var ie = ( i % 2 == 0 );
    for(var j = 0; j < grid[0].length; j++){
      if( ie == (j % 2 == 0) ) fill(255);
      else fill(0);
      rect( i*E, height-(j*E), E, E );
    }
  }
  for(var i = 0; i < grid.length; i++){
    for(var j = 0; j < grid[0].length; j++){
      if( grid[i][j] ){
        fill(255, 0, 0); 
        ellipse( (i+0.5)*E, height-((j+0.5)*E), E, E );
      }
    }
  }
}
function mouseClicked(){
  var i = floor(mouseX/E);
  var j = floor((height-mouseY)/E);
  if( grid[i][j] ){
    if( !grid[i+1][j] && !grid[i][j+1] ){
      grid[i+1][j] = true;
      grid[i][j+1] = true;
      grid[i][j] = false;
    }
  }
}
