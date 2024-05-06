//declarações
int N = 100;
float[] xizes;
float[] ypsulons;
float[] vxs;
float[] vys;

void setup(){
  size(680, 480);
  //inicializações
  xizes = new float[N];
  ypsulons = new float[N];
  vxs = new float[N];
  vys = new float[N];
  for (int i = 0; i < N; i += 1 ) {
    xizes[i] = random(width);
    ypsulons[i] = random(height);
    vxs[i] = random(-3, 3);
    vys[i] = random(-3, 3);
  }
  noStroke();
}
void draw(){
  //background(0);//apagar o frame anterior
  fill(0,80);
  rect(0,0,width,height);
  //desenhar as bolinhas
  fill(255);
  for (int i = 0; i < N; i += 1 ) {
    circle(xizes[i], ypsulons[i], 20);
    //passinho pra frente
    xizes[i] = xizes[i] + vxs[i];
    ypsulons[i] = ypsulons[i] + vys[i];
    //vy = vy+0.5;//gravidade
    
    if( xizes[i] > width ){//colisão direita
      vxs[i] = -vxs[i];
    }
    if( xizes[i] < 0 ){//colisão esquerda
      vxs[i] = -vxs[i];
    }
    if( ypsulons[i] > height ){//colisão baixo
      vys[i] = -vys[i];
    }
    if( ypsulons[i] < 0 ){//colisão cima
      vys[i] = -vys[i];
    }
  }
}