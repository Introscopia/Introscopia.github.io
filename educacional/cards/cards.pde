import controlP5.*;


ControlP5 cp5;


int[] deck;
int deck_index = 0;
IntList mao_do_player;
char[] naipes = { 'C', 'P', 'E', 'O' };
String[] naipes_nome = { "Copas", "Paus", "Espadas", "Ouros" };

void setup(){
  
  size( 400, 400 );

  cp5 = new ControlP5(this);
  cp5.addBang("hitme")
       .setPosition( 10, 325 )
       .setSize(120, 32)
       ;



	deck = new int [52];
	for( int i = 0; i < 52; i++ ){
		deck[i] = i+1;
	}
	shuffle(deck);
	for( int i = 0; i < 52; i++ ){
		//print( deck[i] + ", " );
		int V = deck[i] % 13;
    if( V == 0 ) V = 13;
		int N = int(floor((deck[i]-1) / 13.0));
		//println( card_face(V) + " de " + naipes_nome[N] );
	}

  mao_do_player = new IntList();
  
  //noLoop();
  
}	


void draw(){
  background(0);
}



void shuffle( int[] deck ){
	for (int i = 0; i < deck.length-2; ++i){
		int ni = int(random( i+1, deck.length ));
		int temp = deck[i];
		deck[i] = deck[ni];
		deck[ni] = temp;
	}
}

String card_face( int V ){
  if( V == 1 ) return "A";
  else if( V == 11 ) return "J";
  else if( V == 12 ) return "Q";
  else if( V == 13 ) return "K";
  else{
    return V+"";
  }
}

public void hitme(){

	mao_do_player.append( deck[ deck_index ] );
  deck_index += 1;


  println( "Pediu Carta!");

  for( int i = 0; i < mao_do_player.size(); i++ ){
    int V = mao_do_player.get(i) % 13;
    if( V == 0 ) V = 13;
    int N = int(floor((mao_do_player.get(i)-1) / 13.0));
    println( card_face(V) + " de " + naipes_nome[N] );
  }
}
