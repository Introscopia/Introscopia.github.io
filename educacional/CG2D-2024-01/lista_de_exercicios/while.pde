size( 500, 150 );

int i = 0;
while( i < 10 ){
  circle( 25+(i*50), 50, 35 );
  i += 1;
}

// este é o "for", ele combina as três etapas do loop
//   1) a inicialização do índice: "int j = 0"
//   2) a checagem da condição de saída: "j < 10"
//   3) e o avanço do índice: "j += 1"
// em uma linha só. 
for (int j = 0; j < 10; j += 1 ) {
  circle( 25+(j*50), 100, 35 );
}