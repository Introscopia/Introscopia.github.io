//declarações
float x, y; // as coordenadas da bolinha
float vx, vy; // a velocidade da bolinha

void setup(){
  size(500,500);
  //inicializações
  x = 0;
  y = 0;
  vx = 3;
  vy = 1;
}
void draw(){
  //apagar o frame anterior
  background(127);
  //desenhar a bolinha
  circle(x,y,50);
  //passinho pra frente
  x = x + vx;
  y = y + vy;
  
  if( x > width ){//colisão da parede direita
    vx = -vx;
  }
}