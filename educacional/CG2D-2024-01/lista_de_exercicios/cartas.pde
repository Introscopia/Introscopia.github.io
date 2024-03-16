//declarações
float x, y;
float vx, vy;

void setup(){
  size(600,250);
  //inicializações
  x = 25;
  y = height-100;
  vx = 2;
  vy = -10;
  rectMode( CENTER );
}
void draw(){
  //desenhar a carta
  rect(x, y, 50, 80);
  //passinho pra frente
  x = x+vx;
  y = y+vy;
  vy = vy+0.5;//gravidade
  
  if( x > width-25 ){//colisão direita
    vx = vx * -0.9;// colisão inelastica. a carta perde 10% da velocidade a cada colisão.
    x = width-25;//restituição da posição. evita o bug do objeto ficar preso na parede.
  }
  if( x < 25 ){//colisão esquerda
    vx = vx * -0.9;
    x = 25;
  }
  if( y > height-40 ){//colisão baixo
    vy = vy * -0.9;
  }
  if( y < 0 ){//colisão cima
    vy = vy * -0.9;
  }
}