PImage B;
ArrayList<PVector> nodes;
IntList values;
boolean[][] links;
float D = 38, R = 19;
int N = 1, P = -1;

void setup() {
   size( 1067, 600 );
   B = loadImage( "dollar_monster_bw.jpg" );
   B.resize( 0, 600);
   nodes = new ArrayList();
   values = new IntList();
   
   textAlign( CENTER, CENTER );
   textSize(20);
}

void draw() {
  image( B, 0, 0 );
  
  if( links != null ){
    stroke(#F0691B);
    strokeWeight(4);
    for(int i = 0; i < links.length; i++){
      for(int j = 0; j < i; j++){
        if( links[i][j] ){
          line( nodes.get(i).x, nodes.get(i).y, nodes.get(j).x, nodes.get(j).y );
        }
      } 
    }
  }
  stroke(0);
  strokeWeight(1);
  for(int i=0; i < nodes.size(); i++){
    if( values.size() >= i+1 ) fill(255);
    else fill(255, 100 );
    ellipse( nodes.get(i).x, nodes.get(i).y, D, D );
    fill(0);
    if( values.size() >= i+1 ) text( str( values.get(i) ), nodes.get(i).x, nodes.get(i).y ); 
  }
  
  if( mousePressed && links == null ){
    fill(255, 100 );
    ellipse( mouseX, mouseY, D, D );
  }
}

void mousePressed(){
  for(int i=0; i < nodes.size(); i++){
    if( dist( mouseX, mouseY, nodes.get(i).x, nodes.get(i).y ) < R ){
      P = i;
      break; 
    }
  }
}

void mouseReleased(){
  if( links == null ){
    nodes.add( new PVector( mouseX, mouseY ) );
  }
  else{
    if( P > -1 ){
      int NP = -1;
      for(int i=0; i < nodes.size(); i++){
        if( dist( mouseX, mouseY, nodes.get(i).x, nodes.get(i).y ) < R ){
          NP = i;
          break; 
        }
      }
      if( NP > -1 && P != NP ){
        links[P][NP] = true;
        links[NP][P] = true;
      }
    }
  }
}

void keyPressed(){
  if( int(key) >= 48 && int(key) <= 57 ){
    if( values.size() < nodes.size() ){
      values.append( N * (int(key)-48) ); 
      N = 1;
    }
  }
  if( key == '-' ) N = -1;
  if( key == ENTER ){
    if( links == null ) links = new boolean[ nodes.size() ][ nodes.size() ];
    else{
      for(int i=0; i < nodes.size(); i++){
        println( int(nodes.get(i).x), int(nodes.get(i).y), values.get(i) );
      }
      println(" ");
      for(int j = 0; j < links[0].length; j++){
        for(int i = 0; i < links.length; i++){
          print( ((links[i][j])? "1" : "0") );
          if( i < links[0].length-1 ) print(" ");
        }
        println();
      }
    }
  }
}
