/*
Jogo Desenvolvido na Oficina de desenvolimento de Jogos 
No Processing Community Day São Paulo 2019
*/

Nave player;
float acel;
float yaw;
float G = 25;

ArrayList<Smoke> smoke;

float univ = 5000;
Star[] stars = new Star[5000];
PVector center;
Planet[] planetas;

void setup(){
  //size( 700, 600, FX2D );
  fullScreen(FX2D);
  player = new Nave( 350, 300, loadImage( "Constitution.png" ), 0.06 );
  imageMode( CENTER );
  for( int i=0; i<stars.length; i++){
    stars[i] = new Star(random(-univ, univ), random(-univ, univ), random( 0.5, 4), color(random(200, 255), random(200, 255), random(200, 255)));
  }
  center = new PVector(width*0.5, height*0.5);
  
  planetas = new Planet[20];
  planetas[0] = new Planet( 0, 0, 300, color( 0, 160, 200 ) );
  //planetas[1] = new Planet( 400, 0, 300, color( 0, 160, 200 ) );
  for( int i = 1; i < planetas.length; ++i ){
    planetas[i] = new Planet( random(-univ, univ), random(-univ, univ), random( 100, 400 ), color(random(255), random(255), random(255)) );
  }
  
  smoke = new ArrayList();
}
void draw(){
  background(#040334);
  noStroke();
  fill(255);
  
  translate(-player.pos.x + center.x, -player.pos.y + center.y);
  
  for( int i=0; i < stars.length; i++){
    stars[i].display();
  }
  for( int i = 0; i < planetas.length; ++i ){
    planetas[i].display();
    float dist = planetas[i].pos.dist(player.pos);
    if(dist < 3 * planetas[i].diameter ){
      if(dist < 0.25 * planetas[i].diameter) dist = 0.25 * planetas[i].diameter;
      PVector grav= new PVector(G*planetas[i].diameter/sq(dist),0);
      grav.rotate(atan2(-player.pos.y+planetas[i].pos.y,-player.pos.x+planetas[i].pos.x));
      player.vel.add(grav);
    }
  }
  for( int i = smoke.size()-1; i > 0; --i ){
    smoke.get(i).display();
    if( smoke.get(i).alpha <= 0 ) smoke.remove(i);
  }

  player.move();
  player.display();
  //println(frameRate);
}

class Nave{
  PVector pos, vel;
  float rot, sca, rotvel, thrust;
  PImage img;
  Nave( float x, float y, PImage i, float s ){
    pos = new PVector( x, y );
    vel = new PVector( 0, 0 );
    rot = -HALF_PI;
    img = i;
    sca = s;
    rotvel = 0.075;
    thrust = 0.1;
  }
  void move(){
    rot += yaw * rotvel;
    PVector nvel = new PVector(thrust * acel, 0);
    nvel.rotate(rot);
    vel.add(nvel);
    nvel.mult(-30);
    if( abs( acel ) > 0 ){
      for( int i = 0; i < 3; ++i ) smoke.add( new Smoke( pos.x + nvel.x, pos.y + nvel.y ) );
    }
    pos.add( vel );
  }
  void display(){
    pushMatrix();
    translate( pos.x, pos.y );
    scale( sca );
    rotate( rot );
    image( img, 0, 0 );
    popMatrix();
  }
}

class Star {
  PVector pos;
  float tam;
  color col;
  float K;
  Star(float x, float y, float r, color c){
    pos = new PVector(x, y);
    tam = r;
    col = c;
    K = random( 0.002, 0.15 );
  }
  void display(){
    fill(col);
    ellipse(pos.x, pos.y, tam + sin(frameCount * K), tam + sin(frameCount * K));
  }
}

class Circle{
  PVector pos;
  float diameter;
  color c;
  Circle( float x, float y, float d, color c ){
    pos = new PVector( x, y );
    diameter = d;
    this.c = c;
  }
  void display(){
    fill( c );
    ellipse( pos.x, pos.y, diameter, diameter );
  }
}

class Planet extends Circle{
  Planet( float x, float y, float d, color c ){
    super( x, y, d, c );
  }
}

class Smoke extends Circle{
  int alpha;
  Smoke( float x, float y ){
    super( x + random(-6, 6), y+ random(-6, 6), random(4, 12), round(random( 95, 159 )) );
    alpha = round(random( 50, 150 ));
  }
  void display(){
    fill( c, alpha );
    ellipse( pos.x, pos.y, diameter, diameter );
    alpha--;
  }
}


//Controles

void keyPressed() {
  switch(keyCode) {
    case LEFT:
    yaw = -1;
    break;
    case RIGHT:
    yaw = 1;
    break;
    case UP:
    acel = 1;
    break;
    case DOWN:
    acel = -1;
    break;
  }
}

void keyReleased() {
  switch(keyCode) {
    case LEFT:
    case RIGHT:
    yaw = 0;
    break;
    case UP:
    case DOWN:
    acel = 0;
    break;
  }
}

