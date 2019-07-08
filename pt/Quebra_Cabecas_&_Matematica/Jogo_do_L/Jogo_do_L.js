var tetra_lib = [
                  [// L
                    [1, 1, 1, 0],
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                  ],
                  [// I
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                  ],
                  [// S
                    [0, 1, 1, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                  ],
                  [// T
                    [1, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                  ],
                  [// O
                    [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                  ]
                ];
var E;

var grid;
var sprites;
var Ls;

var turn = 0;
var coin = false;
var di, dj, tmx, tmy;
var p_i = -1, p_j = -1, p_rot = 0, p_mir = false;

document.oncontextmenu = function() {
  return false;
}

function setup() {
  var canvas = createCanvas(500, 540);
  canvas.parent('sketch-holder');

  textSize( 22 );
  textAlign( LEFT, TOP );
  
  E = 125;
  
  grid = Array(4).fill().map( () => new Array(4).fill(-1) );
  //grid = insert( tetra_lib[0], grid, 1, 0, 0 );
  sprites = Array(3);
  sprites[0] = loadImage( "../../../images/blue.png" );
  sprites[1] = loadImage( "../../../images/red.png"  );
  sprites[2] = loadImage( "../../../images/coin.png" );
  //         tetromino( i, j, id, rot, mir)
  //print(tetra_lib[0]);
  //         tetromino( i, j, id, rot, mir)
  Ls = Array(2);
  Ls[0] = new tetromino( 1, 0, 0, 0, false );
  Ls[1]  = new tetromino( 1, 1, 0, 2, false );
  grid = Ls[0].apply( grid, 0 );
  grid = Ls[1].apply( grid, 1 );
  grid[0][1] = 2;
  grid[3][2] = 2;
}


function draw() {
  background(0);
  fill('#252727');
  stroke(255);
  rect( 0, 0, 499, 499 );
  for( var i = 1; i < 4; ++i ){
    var k = i*E;
    line( 0, k, 500, k );
    line( k, 0, k, 500 );
  }
  for( var i = 0; i < 4; ++i ){
    for( var j = 0; j < 4; ++j ){
      if( grid[i][j] >= 0 && grid[i][j] < sprites.length ){
        image( sprites[ grid[i][j] ], i*E, j*E );
      }
    }
  }

  if( di <= 0 ){
    if( coin ){
      image( sprites[ 2 ], mouseX +tmx, mouseY +tmy );
    }
    else{
      var m = Ls[turn].transformed();
      push();
      translate( mouseX +tmx, mouseY +tmy );
      for( var i = 0; i < 4; ++i ){
        for( var j = 0; j < 4; ++j ){
          if( m[i][j] == 1 ) image( sprites[ turn ], i*E, j*E );
        }
      }
      pop();
    }
  }
  
  noStroke();
  if( turn == 0 ){
    fill(0, 0, 255);
    text( "Vez do Azul", 12, 510 );
  }
  else if( turn == 1 ){
    fill(255, 0, 0);
    text( "Vez do Vermelho", 12, 510 );
  }
  if( coin ){
    fill(255);
    text( "Mova uma Moeda", 312, 510 );
  }
}

function mousePressed(){
  if (mouseButton === RIGHT) {
    if(  di <= 0 && !coin ) Ls[turn].mir = !Ls[turn].mir;
  }
  else if (mouseButton === LEFT){
    var mx = floor( mouseX / E );
    var my = floor( mouseY / E );
    var Q = coin? 2 : turn;
    if( grid[mx][my] == Q ){
      if( coin ){ // moving the coin
        di = 0;
        dj = 0;
        tmx = (E * mx) - mouseX;
        tmy = (E * my) - mouseY;
        grid[mx][my] = -1;
      }
      else{ // moving an L
        di = Ls[turn].i - mx;
        dj = Ls[turn].j - my;
        tmx = (E * Ls[turn].i) - mouseX;
        tmy = (E * Ls[turn].j) - mouseY;
        p_i = Ls[turn].i;
        p_j = Ls[turn].j;
        p_rot = Ls[turn].rot;
        p_mir = Ls[turn].mir;
        grid = matrix_replace( grid, turn, -1 );
      }
    }
  }
}

function mouseWheel(event) {
  if( di <= 0 && !coin ){
    Ls[turn].rot += event.delta;
    if( Ls[turn].rot > 3){
      Ls[turn].rot -= 4*floor(Ls[turn].rot/4.0);
    }
    if( Ls[turn].rot < 0 ){
      Ls[turn].rot = 4 + ( Ls[turn].rot + (4*floor(-Ls[turn].rot/4.0)) );
    }
  }
}

function mouseReleased(){
  if( di <= 0 ){
    if (mouseButton === LEFT){
      var mx = floor( mouseX / E );
      var my = floor( mouseY / E );
      if( coin ){
        if( grid[mx][my] == -1 ){
          grid[mx][my] = 2;
          turn += 1;
          if( turn > 1 ) turn = 0;
          coin = false;
          di = 1;
        }
      }
      else{
        Ls[turn].i = mx + di;
        Ls[turn].j = my + dj;
        //grid = Ls[turn].apply( grid, turn );
        var clear = true;
        var m = Ls[turn].transformed();
        for( var i = 0; i < 4; ++i ){
          for( var j = 0; j < 4; ++j ){
            var I = i + Ls[turn].i;
            var J = j + Ls[turn].j;
            if( I >= 0 && I < 4 && J >= 0 && J < 4 ){
              if( m[i][j] == 1 && grid[I][J] != -1 ){
                clear = false;
                break;
              }
            }
            else if ( m[i][j] == 1 ){
              clear = false;
              break;
            }
          }
          if(!clear) break;
        }
        if( clear ){// did they just put it back in the same place? (that's illegal)
          if( p_i == Ls[turn].i && p_j == Ls[turn].j && p_rot == Ls[turn].rot && p_mir == Ls[turn].mir ) clear = false;
        }
        if( clear ){
          grid = Ls[turn].apply( grid, turn );
          coin = true;
          di = 1;
        }
      }
    }
  }
}

function tetromino( i, j, id, rot, mir ){
  this.i = i;
  this.j = j;
  this.id = id;
  this.rot = rot;
  this.mir = mir;
  
  this.transformed = function(){
    var s = Array(4).fill().map( () => new Array(4).fill(0) );
    s = apply_rot( tetra_lib[this.id], this.rot, 0 );
    if( this.mir ){
      s = apply_mir( s, 0 );
    }
    return s;
  }
  this.apply = function( G, sprite ){
    var s = this.transformed();
    s = matrix_replace( s, 0, -1 );
    s = matrix_replace( s, 1, sprite );
    G = insert( s, G, this.i, this.j, -1 );
    return G;
  }
}
//=============================================================================================================================

function apply_rot( matrix, value, neutral ){
  var out = Array(4).fill().map( () => new Array(4).fill(0) );
  if( value > 3 ){
    value -= 4*floor(value/4.0);
  }
  switch( value ){
    case 0:
      return clone_matrix( matrix );
      break;
    case 1:
      for( var i = 0; i < 4; ++i ){
        for( var j = 0; j < 4; ++j ){
          out[i][j] = matrix[3-j][i];
        }
      }
      break;
    case 2:
      for( var i = 0; i < 4; ++i ){
        for( var j = 0; j < 4; ++j ){
          out[i][j] = matrix[3-i][3-j];
        }
      }
      break;
    case 3:
      for( var i = 0; i < 4; ++i ){
        for( var j = 0; j < 4; ++j ){
          out[i][j] = matrix[j][3-i];
        }
      }
      break;
  }
  //print("apply_rot out (unjustified):", out);
  return justify( out, neutral );
}

function apply_mir( matrix, neutral ){
  var out = Array(4).fill().map( () => new Array(4).fill(0) );
  for( var i = 0; i < 4; ++i ){
    for( var j = 0; j < 4; ++j ){
      out[i][j] = matrix[3-i][j];
    }
  }
  return justify( out, neutral );
}

function justify( matrix, neutral ){
  var tj = 0;
  for( var j = 0; j < 4; ++j ){
    var empty = true;
    for( var i = 0; i < 4; ++i ){
      if( matrix[i][j] != neutral ){
        empty = false;
        break;
      }
    }
    if( empty ) tj -= 1;
    else break;
  }

  var ti = 0;
  for( var i = 0; i < 4; ++i ){
    var empty = true;
    for( var j = 0; j < 4; ++j ){
      if( matrix[i][j] != neutral ){
        empty = false;
        break;
      }
    }
    if( empty ) ti -= 1;
    else break;
  }
  
  var out = Array(4).fill().map( () => new Array(4).fill(0) );
  return insert( matrix, out, ti, tj, neutral );
}

function insert( source, dest, ti, tj, neutral ){
  for( var i = 0; i < 4; ++i ){
    for( var j = 0; j < 4; ++j ){
      var I = i+ti;
      var J = j+tj;
      if( I >= 0 && I < 4 && J >= 0 && J < 4 && source[i][j] != neutral ){
        dest[I][J] = source[i][j];
      }
    }
  }
  return dest;
}

function matrix_replace( matrix, X, R ){
  var out = Array(4).fill().map( () => new Array(4).fill(0) );
  for( var i = 0; i < 4; ++i ){
    for( var j = 0; j < 4; ++j ){
      if( matrix[i][j] == X ) out[i][j] = R;
      else out[i][j] = matrix[i][j];
    }
  }
  return out;
}

function clone_matrix( matrix ){
  var out = Array(4).fill().map( () => new Array(4).fill(0) );
  for( var i = 0; i < 4; ++i ){
    for( var j = 0; j < 4; ++j ){
      out[i][j] = matrix[i][j];
    }
  }
  return out;
}
