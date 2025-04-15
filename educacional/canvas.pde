float tw;

void setup(){
  size(400,250);
  strokeWeight(2);
  textSize(20);
  textAlign( LEFT, TOP );
  tw = textWidth( "x: 222 (2.22 * height)"); 
  cursor(CROSS);
}

void draw(){
  background(255);
  
  float tx = mouseX+5;
  if( mouseX > width/2 ) tx -= tw+15;
  float ty = mouseY+5;
  if( mouseY > height/2 ) ty -= 45;
  
  stroke( 0,0,255 );
  line( mouseX, 0, mouseX, height);
  fill( 0,0,255 );
  text( "x: "+mouseX+" ("+nf(mouseX/float(width), 1, 2)+" * width)", tx, ty );
  
  stroke(255,0,0);
  line( 0, mouseY, width, mouseY );
  fill(255,0,0);
  text( "y: "+mouseY+", ("+nf(mouseY/float(height), 1, 2)+" * height)", tx, ty+20 );
}

// Aqui estamos usando o println para jogar no console as coordenadas do mouse quando você clica no canvas.
// você pode usar este truque nos seus projetos para se localizar no canvas!
void mouseClicked(){
  println( mouseX, mouseY );
}
