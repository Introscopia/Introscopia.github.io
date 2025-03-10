boolean Z = true, X, C = true, V;

int Y;

void setup(){
  size( 680, 300 );
  
  Y = height/2;

  stroke(40);
  strokeWeight(4);
  textSize(22);
  textAlign(CENTER, CENTER);
}

void draw(){

  background(200);

  if( Z ){
    fill(#1FC1AA);
    rect( 40, Y-50, 100, 100 );
  }
  fill(0);
  text( "Z", 90, 280 );
  
  if( X ){
    fill( 0,255,0 );
    circle(250,Y,110);
  }
  fill(0);
  text( "X", 250, 280 );
  
  if( C ){
    fill(255,0,0);
    triangle(410, Y-55, 470, Y+50, 350, Y+50);
  }
  fill(0);
  text( "C", 410, 280 );
  
  if( V ){
    fill(255,255,0);
    float a = TWO_PI/10.0;
    beginShape();
    for(int i = 0; i < 10; i++ ){
      float d = 70;
      if( i % 2 == 1 ) d = 26;
      float x = 580 + d * cos( (i * a) - HALF_PI );
      float y =  Y  + d * sin( (i * a) - HALF_PI );
      vertex( x, y );
    }
    endShape(CLOSE);
  }
  fill(0);
  text( "V", 580, 280 );
}
void keyPressed(){
  if (key == CODED) {
    if (keyCode == UP) {
      Y -= 15;
    }
    else if (keyCode == DOWN) {
      Y += 15;
    }
  }
  else{
         if( key == 'Z' || key == 'z' ) Z = !Z;
    else if( key == 'X' || key == 'x' ) X = !X;
    else if( key == 'C' || key == 'c' ) C = !C;
    else if( key == 'V' || key == 'v' ) V = !V;
  }
}