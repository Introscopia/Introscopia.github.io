size( 480, 480 );
int L = width / 8;

background(0);
fill(255);
noStroke();
int x = 0;
while( x < 8 ){
  int y = 0;
  while( y < 8 ){
     if( x % 2 == y % 2 ){ // se a paridade dos dois for igual
       rect( x * L, y * L, L, L );
     }
     y += 1;
  }
  x += 1;
}