void setup(){
  size(500,500);
}
void draw(){
  boolean vermelho = mouseX > width/2;
  boolean azul = mouseY > height/2;
  if( vermelho && azul ){
    background( 255,0,255);
  }
  else if( vermelho ){
    background(255,0,0); 
  }
  else if( azul ){
    background(0,0,255); 
  }
  else{
    background(255); 
  }
   
  line( 0, height/2, width, height/2 );
  line( width/2, 0, width/2, height );
}
