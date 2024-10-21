
void setup() {
   size(400, 400);
   
   reset(0);// chamando o reset com zero pra inicializar aleatóriamente
}

void draw() {
   
  // resto do jogo
  
  if( bx > width ){
    reset(-1);// chamando o reset...
  }
  else if( bx < 0 ){
    reset(1);// passando o 'lado' do gol
  }
}

// declarando a função reset
void reset( int lado ){
  bx = meio
  by = meio
  if( lado < 0 ){
    bvx = -323232
  }
  else if( lado > 0 ){
    bvx = 12232
  }
  else if( lado == 0 ){
     bvx = random() 
  }
}
