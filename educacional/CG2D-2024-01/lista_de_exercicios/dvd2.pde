//declarações
float x, y;
float vx, vy;
float r = 20;
float d = 40;

float caixa_e, caixa_t, caixa_d, caixa_b, caixa_l, caixa_a; 

void setup(){
  size(600,600);
  //inicializações
  x = r;
  y = 100;
  vx = 1.8;
  vy = 2;
  caixa_l = 0.25 * width;
  caixa_a = 0.333 * height;
  caixa_e = width/2 - caixa_l/2;
  caixa_t = height/2 - caixa_a/2; 
  caixa_d = caixa_e + caixa_l;
  caixa_b = caixa_t + caixa_a;
  colorMode(HSB);
  background(70);
}
int hue = 0;
void draw(){
  //apagar o frame anterior
  //background(0);
  //desenhar a bolinha
  fill(hue, 255,255);
  noStroke();
  hue = (hue + 1) % 255;
  circle(x,y,d);
  fill(255);
  rect( caixa_e, caixa_t, caixa_l, caixa_a );
  //passinho pra frente
  x = x+vx;
  y = y+vy;
  //vy = vy+0.5;//gravidade
  
  // ambas as colisões horizontais realizam a mesma linha de código
  // então podemos combiná-las em um if só usando o OU lógico:
  if( x > width-r || x < r ){//colisões horizontais
    vx = -vx;
  }
  //e o mesmo com as verticais:
  if( y > height-r || y < r ){//colisões verticais
    vy = -vy;
  }
  //parede esquerda da caixa
  if( x > caixa_e-r && x < caixa_e+r && y > caixa_t && y < caixa_b ){
    vx = -vx;
    x = caixa_e-r;
  }
  //parede direita da caixa
  if( x < caixa_d+r && x > caixa_d-r && y > caixa_t && y < caixa_b ){
    vx = -vx;
    x = caixa_d+r;
  }
  //parede do topo da caixa
  if( y > caixa_t-r && y < caixa_t+r && x > caixa_e && x < caixa_d ){
    vy = -vy;
    y = caixa_t-r;
  }
  //parede de baixo da caixa
  if( y < caixa_b+r && y > caixa_b-r && x > caixa_e && x < caixa_d ){
    vy = -vy;
    y = caixa_b+r;
  }  
}
