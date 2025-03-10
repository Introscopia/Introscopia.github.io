float L;
void setup() {
   size(400, 400);
   L = width/3.0;
   textSize(40);
}

void draw() {
  background(0);

  int MO = floor(mouseX/L) + 3 * floor(mouseY/L);
  
  if( MO == 0 ) fill(255);
  else fill( 0 );
  rect( 0, 0, L, L );
  if( MO == 1 ) fill(255);
  else fill( 0 );
  rect( L, 0, L, L );
  if( MO == 2 ) fill(255);
  else fill( 0 );
  rect( 2*L, 0, L, L );
  if( MO == 3 ) fill(255);
  else fill( 0 );
  rect( 0, L, L, L );
  if( MO == 4 ) fill(255);
  else fill( 0 );
  rect( L, L, L, L );
  if( MO == 5 ) fill(255);
  else fill( 0 );
  rect( 2*L, L, L, L );
  if( MO == 6 ) fill(255);
  else fill( 0 );
  rect( 0, 2*L, L, L );
  if( MO == 7 ) fill(255);
  else fill( 0 );
  rect( L, 2*L, L, L );
  if( MO == 8 ) fill(255);
  else fill( 0 );
  rect( 2*L, 2*L, L, L );
}

