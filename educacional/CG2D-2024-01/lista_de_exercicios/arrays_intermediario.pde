int N = 10; // número de bolinhas.
float e;
float[] posicoes;// esse array de posições será o Y das bolinhas.
int selecionado = 0;
boolean b_cima, b_baixo;

void setup() {
  size( 600, 200 );
  e = width / float(N);// espaçamento entre as bolinhas.
  
  posicoes = new float[N];// inicializando o array de posições.
  for (int i = 0; i < N; i += 1 ){
    posicoes[i] = height / 2;
  }
}

void draw() {
  background(200);
  
  //um loop para desenhar cada bolinha.
  for (int i = 0; i < N; i += 1 ){
    if( i == selecionado ) fill(#88CAF5);// a bolinha selcionada é azul.
    else fill(255);
    circle( 25+(i*e), posicoes[i], 35 );
  }
  
  if( b_cima ){// se o botão cima está pressionado, 
    posicoes[ selecionado ] -= 2; // mova a bolinha selecionada pra cima!
  }
  if( b_baixo ){
    posicoes[ selecionado ] += 2; 
  }
}

void keyPressed(){// tecla foi apertada.
  if( key == CODED ){
    // detectar pressionamento das setinhas cima e baixo, 
    // e usar nossas variáveis para guardar essa informação.
    if( keyCode == UP ) b_cima = true;
    if( keyCode == DOWN ) b_baixo = true;
    // mover a seleção com as setinhas esquerda e direita:
    if( keyCode == RIGHT ){
      selecionado += 1;
      if( selecionado >= N ) selecionado = 0;
    }
    if( keyCode == LEFT ){
      selecionado -= 1;
      if( selecionado < 0 ) selecionado = N-1;
    }
  }
}
void keyReleased(){// tecla foi solta.
  if( key == CODED ){
    if( keyCode == UP ) b_cima = false;
    if( keyCode == DOWN ) b_baixo = false;
  }
}