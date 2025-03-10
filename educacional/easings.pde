
float W = 0;
int t = 0;
void setup() {
  size(400, 400);
  frameRate(60);
}

void draw() {
  background(200);
  rect( 50, 150, W, 100 );

  W = 300 * easeOutQuad( t / 100.0 );
  t++;
  if ( t > 100 ) t = 0;
}

float easeOutQuad(float x) {
  return 1 - (1 - x) * (1 - x);
}
