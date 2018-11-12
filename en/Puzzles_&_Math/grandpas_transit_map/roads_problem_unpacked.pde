final Road[][] grid = new Road[36][36];
final byte[][]unexplored = new byte[36][36];
char[] villages = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'};
//                  0    1    2    3    4    5    6    7    8    9   10    11   12   13   14   15  16   17   18   19    20   21   22   23   24  25   26    27   28   29   30   31   32   33   34   35
boolean alldone = false;
IntList solution;
Node startsburg;
ArrayList<nodeList> m;

void setup(){
  size( displayWidth, 6000 );
  
  solution = new IntList();
  
  for(int i = 0; i < 36; i++){
    for(int j = 0; j < 36; j++){
      grid[i][j] = new Road();
    }
  }
  //Road[][] = new Road('', '');
  grid[0][1]   = new Road('r', 'c');
  grid[1][2]   = new Road('b', 't');
  grid[1][4]   = new Road('b', 'c');
  grid[1][5]   = new Road('r', 't');
  grid[2][3]   = new Road('g', 't');
  grid[2][6]   = new Road('r', 'c');
  grid[3][6]   = new Road('b', 'b');
  grid[3][8]   = new Road('g', 'b');
  grid[3][9]   = new Road('r', 't');
  grid[4][5]   = new Road('g', 'h');
  grid[4][10]  = new Road('g', 'b');
  grid[4][14]  = new Road('r', 'c');
  grid[5][6]   = new Road('g', 'h');
  grid[5][10]  = new Road('r', 'h');
  grid[6][7]   = new Road('r', 'c');
  grid[6][10]  = new Road('b', 'b');
  grid[6][11]  = new Road('g', 't');
  grid[7][8]   = new Road('r', 'h');
  grid[7][11]  = new Road('r', 'b');
  grid[8][9]   = new Road('b', 'h');
  grid[8][12]  = new Road('g', 't');
  grid[8][13]  = new Road('g', 'h');
  grid[9][13]  = new Road('r', 'b');
  grid[10][14] = new Road('b', 't');
  grid[10][15] = new Road('r', 'c');
  grid[11][12] = new Road('b', 'b');
  grid[11][16] = new Road('g', 't');
  grid[11][17] = new Road('r', 'h');
  grid[12][13] = new Road('b', 'h');
  grid[12][18] = new Road('r', 't');
  grid[13][19] = new Road('r', 'b');
  grid[14][20] = new Road('r', 'b');
  grid[14][21] = new Road('b', 'h');
  grid[15][16] = new Road('g', 'c');
  grid[15][21] = new Road('g', 'h');
  grid[16][17] = new Road('b', 'c');
  grid[16][22] = new Road('r', 't');
  grid[17][18] = new Road('b', 'h');
  grid[17][23] = new Road('r', 't');
  grid[18][19] = new Road('b', 'b');
  grid[18][23] = new Road('g', 'b');
  grid[18][24] = new Road('g', 'c');
  grid[18][29] = new Road('r', 'h');
  grid[19][24] = new Road('g', 't');
  grid[20][21] = new Road('g', 'b');
  grid[20][25] = new Road('b', 'b');
  grid[21][22] = new Road('r', 'c');
  grid[21][25] = new Road('r', 'c');
  grid[21][26] = new Road('g', 'b');
  grid[21][27] = new Road('b', 't');
  grid[22][23] = new Road('g', 'c');
  grid[22][27] = new Road('r', 't');
  grid[23][28] = new Road('r', 'h');
  grid[24][30] = new Road('g', 't');
  grid[25][31] = new Road('b', 'h');
  grid[25][26] = new Road('r', 't');
  grid[26][27] = new Road('r', 'c');
  grid[26][31] = new Road('g', 'h');
  grid[27][28] = new Road('g', 't');
  grid[27][32] = new Road('r', 't');
  grid[27][33] = new Road('b', 'b');
  grid[28][29] = new Road('g', 'b');
  grid[28][33] = new Road('r', 'c');
  grid[29][30] = new Road('g', 'h');
  grid[29][34] = new Road('r', 'h');
  grid[30][34] = new Road('r', 'b');
  grid[31][32] = new Road('b', 'c');
  grid[32][33] = new Road('g', 'c');
  grid[33][34] = new Road('r', 'b');
  grid[34][35] = new Road('b', 'b');
  
  for(int i = 0; i < 36; i++){
    for(int j = 0; j < 36; j++){
      if(i > j){
        grid[i][j] = grid[j][i];
      }
    }
  }
  
  //print_grid_array();
  
  for(int i = 0; i < 36; i++){
    for(int j = 0; j < 36; j++){
      unexplored[i][j] = 25;
    }
  }
  startsburg = new Node( 0, 0 );
  
  m = new ArrayList();
  m.add( new nodeList() );
  m.get(0).list.add( startsburg.get() );
  
  textAlign(CENTER, CENTER);
}

int tree_size, dead_ends;

void draw(){
  if(!alldone){
    tree_size = 0;
    dead_ends = 0;
    
    m.add( new nodeList() );
    
    startsburg.children.get(0).find_children();
    
    if( tree_size == 0 ) alldone = true;
    
    //println(frameCount, tree_size, dead_ends);
  }
  else {
    /*
    for(int i = 0; i < m.size(); i++){
      for(int j = 0; j < m.get(i).list.size(); j++){
        print(m.get(i).list.get(j).name() + " ");
      }
      print('\n');
    }
    */
    
    for(int i = 0; i < m.size(); i++){
      for(int j = 0; j < m.get(i).list.size(); j++){
        m.get(i).list.get(j).update_prole();
        //println(m.get(i).list.get(j).prole);
      }
    }
    fill(0);
    background(255);
    /*
    float max_wid = 7;
    int offset;
    for(int i = 0; i < m.size(); i++){
      offset = 0;
      for(int j = 0; j < m.get(i).list.size(); j++){
        text(str(m.get(i).list.get(j).name()), 10 + i*((width-20)/m.size()), 10 + ((m.get(i).list.get(j).prole/2f) + offset)*((height-20)/max_wid));
        offset += m.get(i).list.get(j).prole;
      }
    }
    */
    
    startsburg.display(20, height * 0.5, height);
    save("solution tree redudancy 25 doublelong.jpg");
    noLoop();
  }
}



class Road{
  public char company, type;
  Road(){
    company = '.';
    type = '.';
  }
  Road(char c, char t){
    company = c;
    type = t;
  }
}

class Node{
  Node parent;
  ArrayList<Node> children;
  int village, age, prole;
  boolean done;
  Node( int v, int a ){
    age = a + 1;
    village = v;
    children = new ArrayList();
    this.spend_nickel();
  }
  Node( Node p, int v, int a ){
    parent = p;
    age = a + 1;
    village = v;
    done = false;
    children = new ArrayList();
    /*
    if(village != 35){
      this.find_children();
    }
    else print(age);
    */
  }
  void display( float x, float y, float s ){
    float C = ((children.size()-1) * s) / 2f; // s = map(age, 1, 50, height * 0.5, 50)
    for(int i = 0; i < children.size(); i++){
      float xx = x + ((width-40)/52f);
      float yy = y + map(i+0.5, 0, children.size(), -C, C );
      stroke( colore(grid[village][children.get(i).village].company));
      line(x, y, xx, yy);
      children.get(i).display(xx, yy, constrain(s/float(children.size()), 30, height) );
    }
    text(this.name(), x, y);
  }
  Node get(){
    return new Node(parent, village, age-1);
  }
  void update_prole(){
    prole = this.check_prole();
  }
  int check_prole(){
    int p = 0;
    for(int i = 0; i < children.size(); i++){
      p += children.get(i).check_prole();
    }
    //println(village, ":", children.size(), p);
    return (children.size() >= p)? children.size() : p;
    //if(children.size() > p) return children.size();
    //else return p;
  }
  void print_parent(){
    if( parent.age > 1 ){
      //print(str(villages[parent.village]) + " ");
      parent.print_parent();
      solution.append(parent.village);
    }
    //else print('\n');
  }
  char name(){
    return villages[village];
  }
  void spend_nickel(){
    done = true;
    for(int i = 0; i < 36; i++){
      if(grid[village][i].type != '.' && grid[village][i].company != '.' ){
        if( unexplored[village][i] > 0 ){
          //println("spending on", i);
          children.add( new Node( this, i, age ) );
          unexplored[village][i]--;
        }
      }
    }
  }
  void find_children(){
    if( done ){
      for(int i = 0; i < children.size(); i++){
        if( children.get(i).village == 35 ){
          alldone = true; 
          //println("WE HAVE A WINNER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", children.get(i).age);
          //this.print_parent();
          
          //solution.reverse();
          for(int u = 0; u < solution.size(); u++){
            //print(solution.get(u)+", ");
          }
          //print('\n');
        }
        else{
          children.get(i).find_children();
        }
      }
    }
    else{
      done = true;
      
      char transfer_type, transfer_company;
      transfer_type = grid[parent.village][village].type;
      transfer_company = grid[parent.village][village].company;
      int p_tree_size = tree_size;
      for(int i = 0; i < 36; i++){
        //println("village ==", villages[village], "i ==", villages[i], "grid[village][i].type ==", grid[village][i].type, "grid[village][i].company ==", grid[village][i].company,"transfer_type ==", transfer_type, "transfer_company ==", transfer_company);
        if(grid[village][i].type == transfer_type || grid[village][i].company == transfer_company){
          //print("done ");
          if( (unexplored[village][i] > 0) && (i != parent.village) ){
            //print("deal");
            tree_size++;
            children.add( new Node( this, i, age ) );
            m.get(m.size()-1).list.add( children.get(children.size()-1) );
            unexplored[village][i] --;
          }
          //print('\n');
        }
      }
      if (tree_size == p_tree_size) dead_ends ++;
    }
  }
}

class nodeList{
  public ArrayList<Node> list;
  nodeList( ArrayList<Node> l ){
    list = l;
  }
  nodeList(){
    list = new ArrayList();
  }
}

void print_grid_array(){
  print("||");
  for(int i = 0; i < 36; i++){
    print(str(villages[i])+"  ");
  }
  print('\n');
  for(int j = 0; j < 36; j++){
    print(str(villages[j])+" ");
    for(int i = 0; i < 36; i++){
      if( i == j ) print("|| ");
      else print(str(grid[i][j].company) + str(grid[i][j].type) + " ");
    }
    print('\n');
  }
}
color colore( char c ){
  switch( c ) {
    case 'r':
      return color(255, 0, 0);
    case 'g':
      return color(0, 255, 0);
    case 'b':
      return color(0, 0, 255);
    default:
      return color(0);
  }
}
