
// declarando um array de ints.
int[] um_array;

//inicializando ele com 10 elementos.
um_array = new int[10];

// acessando o primeiro elemento (índices de arrays começam do zero!)
um_array[0] = 5;

// portanto, o último elemento de um array 
// de N elementos fica no índice N-1.
um_array[9] = 50;

//vamos usar um loop para preencher todo o array com a tabuada do 5:
int indi = 0;
while( indi < 10 ){
  um_array[ indi ] = 5 * (indi + 1);
  indi += 1;
}
// podemos conferir os conteudos do array usando o print()!
// (os resultados saem no terminal, esse espaço preto abaixo do código!)
indi = 0;
while( indi < 10 ){
  print( um_array[ indi ] +", " );
  indi += 1;
}

// vamos usar os valores desse array para desenhar alguns círculos...
size( 200, 200 );
indi = 9;
while( indi > 0 ){
  circle( 100, 100, 2 * um_array[ indi ] );
  indi -= 1;
}
// experimente mudar os conteudos do array lá em cima 
// e ver como isso altera o desenho!
