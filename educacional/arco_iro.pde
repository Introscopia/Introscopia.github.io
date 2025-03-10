void setup(){
  size(600,600);
  colorMode(HSB);
}

void draw(){
  int N = 12;
  float a = TWO_PI/N;
  float r = 35;
  int i = 0;
  noStroke();
  while( i < N ){
    fill( (float(i)/N) * 255, 255, 255 );
    circle( mouseX + r * cos(i * a), mouseY + r * sin(i * a), 20 ); 
    i += 1;
  }
}