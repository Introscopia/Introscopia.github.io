void setup(){
  size(500,500); 
}
void draw(){
   circle( mouseX, mouseY, 35 );
}
// O setup() é a função de inicialização do modo dinâmico.
// Dentro dele nós definimos o nosso canvas com o size(),
// e, mais tarde, é aonde atribuimos valores iniciais às 
// nossas variáveis.
// O setup() roda uma vez no inicio da execução (quando
// você aperta o PLAY.

// Depois do setup(), o draw() começa a ser executado
// repetidamente. A cada execução ele renderiza o seu
// desenho na tela. Se a frequencia dessas repetições
// for alta o suficiente (mais de 24 quadros por segundo)
// nós atingimos a ilusão de movimento. É o mesmo
// princípio de toda animação e todo vídeo!

// Uma sketch de Processing em modo dinâmico só tem
// UMA instânciado setup() e do draw()!

// O mouseX e o mouseY são VARIÁVEIS DE SISTEMA.
// atravez dela o processing nos dá acesso à posição
// do mouse em cada frame.