int N = 12; // número de bolinhas.
float[] x;
float[] y;
int selecionado = -1;
float R = 20;
float D = R*2;

void setup() {
  size( 600, 480 );
  
  // inicializando os arrays de posições.
  x = new float[N];
  y = new float[N];
  float alpha = TWO_PI / float(N);
  for (int i = 0; i < N; i += 1 ){
    x[i] =  (width/2) + 150 * cos( i * alpha ); //random(width);
    y[i] = (height/2) + 150 * sin( i * alpha ); //random(height);
  }
}

void draw() {
  background(200);
  
  //um loop para desenhar cada bolinha.
  for (int i = 0; i < N; i += 1 ){
    if( i == selecionado ) fill(#88CAF5);// a bolinha selcionada é azul.
    else fill(255);
    circle( x[i], y[i], D );
  }
}

// O mouse se moveu... vamos ver ser ele está sobre uma bolinha.
void mouseMoved(){
  selecionado = -1;// primeiro assumimos que não: deixa o selecionado negativo.
  for (int i = 0; i < N; i += 1 ){
     if( dist( mouseX, mouseY, x[i], y[i] ) < R ){
       // a distancia entre o mouse e esta bolinha é menor que o raio!
       // ou seja, o mouse está sobre esta bolinha.
       selecionado = i; // marcar esta como a selecionada. 
       break;// e pular fora do loop!
     }
  }
}

//usuário está tentando arrastar algo com o mouse...
void mouseDragged(){
  // se o selecionado for negativo, o mouse não está sobre uma bolinha.
  if( selecionado >= 0 ){
    x[ selecionado ] += mouseX - pmouseX; // calculamos o deslocamento do mouse
    y[ selecionado ] += mouseY - pmouseY; // usando os "p" mouses ("previous")
  }                                       // a posição no frame anterior.
}