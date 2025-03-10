size( 680, 300 );// definir o tamanho da janela.

stroke(40);// cor de contorno (valor grayscale entre 0 e 255)
strokeWeight(4);// grossura do contorno

fill(#1FC1AA);// Pintar de azul: use Ferramentas -> Seletor de cores!
rect( 40, 100, 100, 100 );//Quadrado

fill( 0,255,0 );// ...ou use valores R,G,B entre 0 e 255!
circle(250,150,110);// Circulo

fill(255,0,0);
triangle(410, 95, 470, 200, 350, 200);// Triangulo! (eu trapaceei para achar esses valores...)

// Uma estrela de cinco pontas.
// Não se assuste com esse código! 
// É só pra mostrar que formas mais complexas também são possíveis! 
fill(255,255,0);
float a = TWO_PI/10.0;
beginShape();
for(int i = 0; i < 10; i++ ){
  float d = 70;
  if( i % 2 == 1 ) d = 26;
  float x = 580 + d * cos( (i * a) - HALF_PI );
  float y = 150 + d * sin( (i * a) - HALF_PI );
  vertex( x, y );
}
endShape(CLOSE);
