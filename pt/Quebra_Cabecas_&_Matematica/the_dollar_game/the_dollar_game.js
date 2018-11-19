var nodes = [];
var links = [];
//var E, D;

function preload(){
  var file = loadStrings('assets/bradys_challenge.txt', load );
}
function load( file ){
  var step = true;
  var c = 0;
  for(var i=0; i < file.length; i++){
    if( step ){
      if( file[i].length == 1 ){
        step = false;
        links = new Array( nodes.length );
      }
      else{
        print("saigiro"+i);
        var s = split( file[i], ' ' );
        if( s.length == 3 ){
          nodes.push( new Node( int(s[0]), int(s[1]), int(s[2]) ) );
        }
        else print( "BAD LINE: "+file[i] );
      }
    }
    else{
      links[c] = new Array( nodes.length );
      var s = split( file[i], ' ' );
      if( s.length == nodes.length ){
        for(var j = 0; j < s.length; ++j ){
          links [c][j] = s[j] === '1';
        }
      }
      ++c;
    }
  }
  //print( links );
}

function setup() {
  createCanvas( 1067, 600 );
  textAlign( CENTER, CENTER );
  textSize(20);
  //nodes = new Array(8);
}

function draw() {
  fill(245);
  stroke(0);
  rect( 1, 1, width-2, height-2); 
  strokeWeight(4);
  for( var i = 0; i < links.length; ++i ){
    for( var j = 0; j < i; ++j ){
      if( links[i][j] ){
        line( nodes[i].i, nodes[i].j, nodes[j].i, nodes[j].j );
      }
    }
  }
  strokeWeight(1);
  for( var i = 0; i < nodes.length; ++i ){
    nodes[i].display( 38 );
  }
}

function mouseReleased(){
  for(var i=0; i < nodes.length; i++){
    if( dist( mouseX, mouseY, nodes[i].i, nodes[i].j ) < 19 ){
      if( mouseButton == LEFT ) nodes[i].give( nodes, links[i] );
      else if( mouseButton == RIGHT || mouseButton == CENTER ) nodes[i].take( nodes, links[i] );
      break;
    }
  }
}

function Node( i, j, v ){
  this.i = i;
  this.j = j;
  this.v = v;
  this.display = function( d ){
    stroke(0);
    if( this.v > 0 ) fill('#DBF3FF');
    else if( this.v == 0 ) fill(255);
    else fill('#FFDBDC');
    ellipse( i, j, d, d );
    fill(0); noStroke();
    text( str(this.v), i, j );
  }
  this.give = function( nodes, links ){
    for(var i=0; i < links.length; i++){
      if( links[i] ){
        nodes[i].v ++;
        this.v --;
      }
    }
  }
  this.take = function( nodes, links ){
    for(var i=0; i < links.length; i++){
      if( links[i] ){
        nodes[i].v --;
        this.v ++;
      }
    }
  }
};
