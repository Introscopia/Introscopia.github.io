boolean B;
void setup(){
  size(400,400);
}
void draw(){
  if( B ) background(255);
  else background(0);
}
void keyPressed(){
  // Aperte qualquer tecla..
  B = !B; // ! é o "NÃO" lógico. inverte o valor booleano.
}