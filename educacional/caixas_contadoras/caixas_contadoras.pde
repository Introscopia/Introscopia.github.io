int N = 12; // número de bolinhas.
float[] bx;
float[] by;
int selecionado = -1;
float R = 20;
float D = R*2;

float c1x, c1y, c2x, c2y;
float L = 100;

void setup() {
  size( 600, 480 );
  
  c1x = 10;
  c1y = 10;
  c2x = width-110;
  c2y = height-110;
  
  // inicializando os arrays de posiÃ§Ãµes.
  bx = new float[N];
  by = new float[N];
  float alpha = TWO_PI / float(N);
  for (int i = 0; i < N; i += 1 ){
    bx[i] =  (width/2) + 150 * cos( i * alpha ); //random(width);
    by[i] = (height/2) + 150 * sin( i * alpha ); //random(height);
  }
  textSize(30);
  textAlign( LEFT, TOP );
}

void draw() {
  background(200);
  
  fill(255);
  int conta = 0;
  rect( c1x, c1y, L, L );
  for(int i = 0; i < N; i += 1 ){
    if( bx[i] > c1x && bx[i] < c1x+L &&
        by[i] > c1y && by[i] < c1y+L ){
      conta += 1;
    }
  }
  fill(0);
  text( conta+"", c1x+L, c1y );
  
  conta = 0;
  fill(255);
  rect( c2x, c2y, L, L );
  for(int i = 0; i < N; i += 1 ){
    if( bx[i] > c2x && bx[i] < c2x+L &&
        by[i] > c2y && by[i] < c2y+L ){
      conta += 1;
    }
  }
  fill(0);
  text( conta+"", c2x-20, c2y );
  
  //um loop para desenhar cada bolinha.
  for (int i = 0; i < N; i += 1 ){
    if( i == selecionado ) fill(#88CAF5);// a bolinha selcionada Ã© azul.
    else fill(255);
    circle( bx[i], by[i], D );
  }
}

// O mouse se moveu... vamos ver ser ele estÃ¡ sobre uma bolinha.
void mouseMoved(){
  selecionado = -1;// primeiro assumimos que nÃ£o: deixa o selecionado negativo.
  for (int i = 0; i < N; i += 1 ){
     if( dist( mouseX, mouseY, bx[i], by[i] ) < R ){
       // a distancia entre o mouse e esta bolinha Ã© menor que o raio!
       // ou seja, o mouse estÃ¡ sobre esta bolinha.
       selecionado = i; // marcar esta como a selecionada. 
       break;// e pular fora do loop!
     }
  }
}

//usuÃ¡rio estÃ¡ tentando arrastar algo com o mouse...
void mouseDragged(){
  // se o selecionado for negativo, o mouse nÃ£o estÃ¡ sobre uma bolinha.
  if( selecionado >= 0 ){
    bx[ selecionado ] += mouseX - pmouseX; // calculamos o deslocamento do mouse
    by[ selecionado ] += mouseY - pmouseY; // usando os "p" mouses ("previous")
  }                                       // a posiÃ§Ã£o no frame anterior.
}
