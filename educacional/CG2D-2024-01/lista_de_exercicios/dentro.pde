//declarações
float r = 15;
float d = 30;
float caixa_e, caixa_t, caixa_d, caixa_b, caixa_l, caixa_a; 

void setup(){
  size(600,600);
  //inicializações
  caixa_l = 0.25 * width;
  caixa_a = 0.333 * height;
  caixa_e = width/2 - caixa_l/2;
  caixa_t = height/2 - caixa_a/2; 
  caixa_d = caixa_e + caixa_l;
  caixa_b = caixa_t + caixa_a;
  background(70);
}

void draw(){
  //desenhar a bolinha
  noStroke();
  if( mouseX > caixa_e && mouseX < caixa_d && 
      mouseY > caixa_t && mouseY < caixa_b ){
    fill(0, 0, 255);
  }
  else fill( 255 );
  circle(mouseX,mouseY,d);
  
  //desenhar a caixinha
  noFill();
  stroke(0);
  rect( caixa_e, caixa_t, caixa_l, caixa_a );
}