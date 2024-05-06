int c = -1;
void setup() {
   size(400, 400);
   textSize(20);
}
void draw() {
  background(0);
  if( c > 0 && millis() > c + 5000 ){
    circle( 200, 200, 200 ); 
  }
  if( c < 0 ){// c negativo: timer desativado
    text( "clique para iniciar o timer", 4, height - 20 );
  }
  else{
    text( "ativando a bola em "+nf( ( (c+5000)-millis() )/1000.0, 1, 1)+" segundos!", 4, height - 20 );
  }
  
}
void mouseClicked(){
  c = millis();
}
