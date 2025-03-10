//declarações
float x, y;
float vx, vy;

void setup(){
  size(600,250);
  //inicializações
  x = 0;
  y = 56;
  vx = 2.8;
  vy = 3.2;
}
void draw(){
  //background(0);//apagar o frame anterior
  //desenhar a bolinha
  circle(x,y,50);
  //passinho pra frente
  x = x+vx;
  y = y+vy;
  //vy = vy+0.5;//gravidade
  
  if( x > width ){//colisão direita
    vx = vx * -1;
  }
  if( x < 0 ){//colisão esquerda
    vx = vx * -1;
  }
  if( y > height ){//colisão baixo
    vy = vy * -1;
  }
  if( y < 0 ){//colisão cima
    vy = vy * -1;
  }
}
