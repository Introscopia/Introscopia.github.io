void setup(){
  size(500,200);
}
void draw(){
   if( mouseX > 250 ){ // SE (mouse estiver pra lá do meio)...
     background(0,0,255);// fundo azul
   }
   else{// CASO CONTRÁRIO
     background(255);// fundo branco
   }
   line( 250, 0, 250, 200 );
}