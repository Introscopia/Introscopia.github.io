float x, y;
void setup(){
  size(500,200);
  x = 0;
  y = 100;
}
void draw(){
   circle( x, y, 35 );
   x = x + 2;
}