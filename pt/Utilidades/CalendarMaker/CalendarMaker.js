var CG;
var date1, date2;
var types =  ["A4", "Letter", "Photo", "Legal"];
var typesW = [ 210,  216,      203,     216,  ];
var typesH = [ 297,  279,      305,     356,  ];
var DPmm;

var weekday_initials = [ [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
                         [ 'D', 'S', 'T', 'Q', 'Q', 'S', 'S' ],
                         [ 'D', 'L', 'M', 'M', 'J', 'V', 'S' ],
                         [ 'S', 'M', 'D', 'M', 'D', 'F', 'S' ] ];
var month_abbreviations = [ [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
                            [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
                            [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
                            [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ] ];

//var feriados_nomes = [ "Carnaval", "Tiradentes", "Dia do Trabalhador", "Independência", "Nossa Senhora Aparecida", "Finados", "Proclamação da República", "Natal" ];
var feriados;

var mm_per_inch = 25.4;
var inch_per_mm = 0.03937008;
var cm_per_inch = 2.54;
var inch_per_cm = 0.3937008;

var sidebarX, sidebarW;
var px, py, zoom;

var UI;
var tcx, tcy;
var type = { n : 0 };
var units = { n : 0 };
var W = { n : 0 };
var H = { n : 0 };
var DPI = { n : 72 };
var columns = { n : 2 };
var the_year = { n : 2018 };
var margin = { n : 0.5 };
var remove_margins = { b : false };
var EXP = { b : false };
var portrait = { b : true };
var lang = { n : 1 };
var textsize = { n : 10 };
var gray = { b : false };
var monday_first = { b : true };


function setup() {
  createCanvas(900, 624);
  
  textSize(18);
  textAlign(CENTER, CENTER);
  noStroke();
  
  sidebarW = 250;
  sidebarX = width - sidebarW;
  var m = 5;
  var m2 = 2*m;
  var x = sidebarX + m;
  var h = (height - m2) / 21.0;
  var w = sidebarW - m2;
  var w2 = 0.5 * w;
  var w4 = 0.25 * w;
  
  tcx = sidebarX + m + ((sidebarW-m2) * 0.5);
  tcy = m + (h * 0.5);
  UI = Array(26);
  UI[0] = new intSet(x, m+(1*h), w4, h, 'A4', 0);
  UI[1] = new intSet(x + w4, m+(1*h), w4, h, 'Letter', 1);
  UI[2] = new intSet(x + 2*w4, m+(1*h), w4, h, 'Photo', 2);
  UI[3] = new intSet(x + 3*w4, m+(1*h), w4, h, 'Legal', 3);
  
  UI[4] = new PlusMinus( x, m+(3*h), w2, h, 2, 0, "DPI:" );
  UI[5] = new intSet( x + w2, m+(3*h), w4, h, "72", 72 );
  UI[6] = new intSet( x + 3*w4, m+(3*h), w4, h, "300", 300 );
  
  UI[7] = new PlusMinus( x, m+(5*h), w2, h, 0.1, 3, "Margem:" );
  UI[8] = new intSet(x + 2*w4, m+(5*h), w4, h, 'cm', 0);
  UI[9] = new intSet(x + 3*w4, m+(5*h), w4, h, 'in', 1);
  
  UI[10] = new Toggle( x, m+(6*h), w, h, "Remover Margens" );
  
  UI[11] = new PlusMinus( x, m+(8*h), w2, h, 1, 0, "Colunas:" );
  UI[12] = new Toggle( x + w2, m+(8*h), w2, h, "Retrato" );

  UI[13] = new PlusMinus( x, m+(10*h), w2, h, 1, 0, "Largura(px):" );
  UI[14] = new PlusMinus( x + w2, m+(10*h), w2, h, 1, 0, "Altura(px):" );
  
  UI[15] = new PlusMinus( x, m+(12*h), w, h, 1, 0, "Ano:" );
  UI[16] = new datePlusMinus( x, m+(13*h), w, h, 1 );
  UI[17] = new datePlusMinus( x, m+(14*h), w, h, 1 );
  
  UI[18] = new PlusMinus( x, m+(16*h), w2, h, 1, 0, 'Fonte(pt):' );
  UI[19] = new Toggle(x + w2, m+(16*h), w2, h, 'Meses');
  					
  UI[20] = new Toggle(x, m+(17*h), w, h, 'Semana Começa Segunda');
  
  UI[21] = new intSet(x       , m+(18*h), w4, h, 'EN', 0);
  UI[22] = new intSet(x + 1*w4, m+(18*h), w4, h, 'PT', 1);
  UI[23] = new intSet(x + 2*w4, m+(18*h), w4, h, 'ES', 2);
  UI[24] = new intSet(x + 3*w4, m+(18*h), w4, h, 'DE', 3);
  
  UI[25] = new Toggle(x, m+(20*h), w, h, 'Exportar');
  
  set_dimensions();
  the_year.n = year();
  date1 = new Dateclass( 1, 1, the_year.n );
  date2 = date1.add( 365 );
  
  feriados = Array(8);
  feriados[0] = new Date();
  feriados[1] = new Date( 21, 4, the_year.n );
  feriados[2] = new Date( 1, 5, the_year.n );
  feriados[3] = new Date( 7, 9, the_year.n );
  feriados[4] = new Date( 12, 10, the_year.n );
  feriados[5] = new Date( 2, 11, the_year.n );
  feriados[6] = new Date( 15, 11, the_year.n );
  feriados[7] = new Date( 25, 12, the_year.n );
  
  CG = render_calendar();
  //print( CG.width, CG.height );
}

function draw() {
  fill(210);
  rect( 0, 0, width-1, height-1 );
  fill( 90 );
  rect( sidebarX, 0, sidebarW-1, height-1 );
  fill(255);
  text( "Gerador de Calendário", tcx, tcy );
  
  for( var i = 0; i <= 4; ++i ) UI[i].display( type );
  for( var i = 4; i <= 6; ++i ) UI[i].display( DPI );
  UI[7].display(margin);
  UI[8].display(units); UI[9].display(units);
  UI[10].display( remove_margins );
  UI[11].display( columns );
  UI[12].display( portrait );
  UI[13].display( W );
  UI[14].display( H );
  UI[15].display( the_year );
  UI[16].display( date1 );
  UI[17].display( date2 );
  UI[18].display( textsize );
  UI[19].display( gray );
  UI[20].display(monday_first);
  UI[21].display( lang );
  UI[22].display( lang );
  UI[23].display( lang );
  UI[24].display( lang );
  UI[25].display( EXP );
  
  translate( px, py );
  scale( zoom );
  image( CG, 0, 0 );
  
  if( EXP.b ){
    save(CG, date1.y + " Calendar.pdf");
    EXP.b = false;
  }
}

function mouseReleased(){
  var c = 0;
  for( var i = 0; i < 4; ++i ) c+= UI[i].released( type );
  for( var i = 4; i <= 6; ++i ) c+= UI[i].released( DPI );
  c+= UI[7].released(margin);
  if( margin.n < 0 ) margin.n = 0;
  var pu = units.n;
  UI[8].released(units); 
  UI[9].released(units);
  if( pu != units.n ){
    ++c;
    if( units.n == 0 ) margin.n *= cm_per_inch;// from in to cm
    else margin.n *= inch_per_cm;// from cm to in
  }
  c+= UI[10].released( remove_margins );
  c+= UI[11].released( columns );
  if( columns.n < 1 ) columns.n = 1;
  
  if( UI[12].released( portrait ) > 0 ){
    if( type.n >= 0 ) ++c;
    else {
      var t = W.n;
      W.n = H.n;
      H.n = t;
    }
  }
  
  
  if( c > 0 && type.n >= 0 ){
    set_dimensions();
    CG = render_calendar();
  }

  c = 0;
  c += UI[13].released( W );
  c += UI[14].released( H );
  if( c > 0 ){
    type.n = -1;
    CG = render_calendar();
  }
  
  c = 0;
  if( UI[15].released( the_year ) > 0 ){
    date1 = new Dateclass( 1, 1, the_year.n );
    date2 = date1.add( 365 );
    ++c;
  }
  c += UI[16].released( date1 );
  c += UI[17].released( date2 );
  c += UI[18].released( textsize );
  c += UI[19].released( gray );
  c += UI[20].released(monday_first);
  c += UI[21].released( lang );
  c += UI[22].released( lang );
  c += UI[23].released( lang );
  c += UI[24].released( lang );
  if( c > 0 ) CG = render_calendar();
  
  c+= UI[25].released( EXP );
}

function set_dimensions(){
  DPmm = DPI.n * inch_per_mm;
  if( portrait.b ){
    W.n = DPmm * typesW[ type.n ];
    H.n = DPmm * typesH[ type.n ];
  }
  else{
    H.n = DPmm * typesW[ type.n ];
    W.n = DPmm * typesH[ type.n ];
  }
  if( remove_margins.b ){
    var m = (units.n == 0)? margin.n * 10 * DPmm : margin.n * DPI.n;
    m *= 2;
    H.n -= m;
    W.n -= m;
  }
}

function render_calendar( ){
  var m = 0;
  if( !remove_margins.b ){
    m = (units.n == 0)? margin.n * 10 * DPmm : margin.n * DPI.n;
    m = ceil(m);
  }
  var w = floor( (W.n-(2*m)) / columns.n ) -1;
  var o = createGraphics( W.n, H.n );
  o.noStroke();
  o.rect( 0, 0, W.n -1, H.n -1 );
  var l = date1.days_until( date2 );
  print( l );
  var rows = ceil( ceil( l / 7.0 ) / columns.n );
  var D = date1.get();
  o.translate( m, m );
  //var k = { b : false };
  for(var i = 0; i < columns.n; i++){
    o.image( calendarStrip( w, H.n -(2*m), D, rows ), floor(i*(w + 2)), 0 );
    D = D.add( rows * 7 );
  }
  
  zoom = 1.0;
  if( H.n > height ){
    zoom = height/(H.n+1);
    px = ( sidebarX - (zoom * (W.n+1))) * 0.5;
    py = 0;
  }
  if( W.n*zoom > sidebarX ){
    zoom *= sidebarX / (zoom * (W.n+1));
    px = 0;
    py = ( height - (zoom * (H.n+1)) ) * 0.5;
  }
  
  return o;
}

function calendarStrip( w, h, start, rows, k ){
  var day = start.get();
  var wd = day.day_of_the_week();
  if( monday_first.b ) wd = ( wd == 0 )? 6 : wd-1;
  day = day.sub( wd );
  //prvarln( wd, day.d, day.m, day.y );
  var cell_w = floor((w-1)/7.0);
  var cell_h;
  var marg = 1;
  var top;
  var pm = day.m;
  
  var o = createGraphics( w, h );
  
  o.textAlign(LEFT, TOP);
  //o.textFont( co );
  o.fill(0);
  //o.textSize(18);
  top = 6 + o.textAscent() + o.textDescent();
  cell_h = floor((h - 1 - top)/ float(rows));
  
  for(var i = 0; i < 7; i++){
    if( monday_first.b ) wd = ( i == 6 )? 0 : i+1;
    else wd = i;
    var ds = weekday_initials[lang.n][wd];
    o.text( ds, ( (cell_w - textWidth(ds)) / 2.0) + i * cell_w, 2);
  }
  o.line(0, top -3, w, top - 3);
  
  //o.textFont( cc );
  
  //o.textSize(14);
  //top = 6 + o.textAscent() + o.textDescent();
  o.textSize(textsize.n);
  var k = false;
  for(var j = 0; j < rows; j++){
    var y = round( (j * cell_h) + top );
    for(var i = 0; i < 7; i++){
      
      var STR = str(day.d);
      
      if( day.d == 1 ){
        STR += "/" + month_abbreviations[lang.n][day.m -1]; //"1st of " + month(day.m);
        if(day.m == 1) STR += "\n" + day.y;      //"\nof " + day.y;
        k = !k;
      }
      
      var x = round( i * cell_w );
      
      if( k && gray.b ) o.fill(230);
      else o.fill(255);
      o.rect( x , y, cell_w, cell_h );
      
      x = round( x + (2 * marg) );
      o.fill(0);
      o.text(STR, x, j * cell_h + 2 * marg + top );
      
      //for(var k = 0; k < feriados.length; ++k){
      //  if( day.equals( feriados[k] ) ){
      //    o.text( "F", (i+1) * cell_w + marg - textWidth("F"), (j+1) * cell_h + 11 );
      //    break;
      //  }
      //  else if( day.d == 20 && day.m == 3 ){
      //    o.text( "EV", (i+1) * cell_w + marg - textWidth("EV") + 2, (j+1) * cell_h + 11 );
      //    break;
      //  }
      //  else if( day.d == 21 && day.m == 6 ){
      //    o.text( "Sæ", (i+1) * cell_w + marg - textWidth("Sæ") + 4, (j+1) * cell_h + 11 );//Æ
      //    break;
      //  }
      //  else if( day.d == 23 && day.m == 9 ){
      //    o.text( "EA", (i+1) * cell_w + marg - textWidth("EA") + 2, (j+1) * cell_h + 11 );
      //    break;
      //  }
      //  else if( day.d == 21 && day.m == 12 ){
      //    o.text( "SH", (i+1) * cell_w + marg - textWidth("SH") + 3, (j+1) * cell_h + 11 );
      //    break;
      //  }
      //}
      day.tick();
      pm = day.m;
    }
  }
  //o.stroke( 0 );
  //o.noFill();
  //o.rect( 1, 1, w-2, h-3 );
  return o;
}

//=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o
//=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o=o

function h_to_dec( h, m ){
  return (h / 24.0) + (m / 1440.0);
}

//%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]

function  checkLeap( y){
  if (y % 400 == 0) return true;
  else if (y % 100 == 0) return false;
  else if (y % 4 == 0) return true;
  else return false;
}

//%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]

function day_of_the_week( d, m, y){
  var mt;
  if(checkLeap(y)){
    var mtl = [6, 2, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    mt = mtl;
  }
  else{
    var mtn = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    mt = mtn;
  }
  var w = int((d + mt[m-1] + (y-2000) + floor((y-2000)/4.0) + 6) % 7.0);
  return w;
}
//%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]

function days_in_month( m, y ){
  if ((m==4)||(m==6)||(m==9)||(m==11)){
    return 30;
  }
  else if ((m==1)||(m==3)||(m==5)||(m==7)||(m==8)||(m==10)||(m==12)){
    return 31;
  }
  else if (m==2){
    if(checkLeap(y)){
      return 29;
    }
    else{
      return 28;
    }
  }
  else return -1;
}
//%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]
//%|%%%|%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%%%[<>]%%%|%

function Dateclass( d, m, y ){
  this.d = d;
  this.m = m;
  this.y = y;
  this.leap = checkLeap(y);
  
  this.print_ln = function(){
    println( this.d + "/" + month_abbreviations[0][this.m - 1] + "/" + this.y + ", " + weekday(this.day_of_the_week(), 3));
  }
  this.string = function(){
    return nf(this.d, 2) + "/" + month_abbreviations[0][this.m - 1] + "/" + this.y;
  }
  
  this.day_of_the_week = function(){ //sunday is 0.
    return day_of_the_week(this.d, this.m, this.y);
  }
  
  this.equal_to = function(o){
    if( this.d == o.d && this.m == o.m && this.y == o.y )return true;
    else return false;
  }
  this.greater_than = function(o){
    if( this.y > o.y ) return true;
    if( this.y == o.y && this.m > o.m ) return true;
    if( this.y == o.y && this.m == o.m && this.d > o.d ) return true;
    else return false;
  }
  this.less_than = function( o ){
    if( this.y < o.y ) return true;
    if( this.y == o.y && this.m < o.m ) return true;
    if( this.y == o.y && this.m == o.m && this.d < o.d ) return true;
    else return false;
  }
  
  this.tick = function(){
    var mc = days_in_month( this.m, this.y ); //month ceiling
    if( this.m < 12 ){
      if(this.d < mc) this.d++;
      else if(this.d == mc){this.d=1; this.m++;}
    }
    else{
      if (this.d < mc) this.d++;
      else if (this.d == mc){
          this.d=1;
          this.m=1;
          this.y++;
      }
    }
  }
  
  this.add = function( days ){
    if( days < 0 ) return this.sub( abs(days) );
    else if ( days == 0 ) return this;
    
    var it = new Dateclass( days_in_month(this.m, this.y), this.m, this.y );
    var total = days_in_month(this.m, this.y) - this.d;
    while( days > total ){
      if( it.m < 12 ){
        it.m ++;
        it.d = days_in_month(it.m, it.y);
        total += it.d;
      }
      else{
        it.y ++;
        it.m = 1;
        it.d = 31;
        total += 31;
      }
    }
    if( days < total ){
      if( it.d - (total - days) >= 1 ) it.d -= (total - days); 
      else{
        print("Date.add() crapped out: it: "+it.d+"/"+it.m+"/"+it.y+" days: "+days+" total: "+total);
        return new Dateclass(1, 1, 1);
      }
    }
    return it.get();
  }
  
  this.sub = function( days ){
    if( days < 0 ) return this.add( abs(days) );
    else if ( days == 0 ) return this;
    var it = new Dateclass( 1, this.m, this.y );
    var total = this.d-1;
    while( days > total ){
      if( it.m > 1 ){
        it.d = 1;
        it.m --;
        total += days_in_month(it.m, it.y);
      }
      else{
        it.y --;
        it.m = 12;
        it.d = 1;
        total += 31;
      }
    }
    if( days < total ){
      it.d += total - days;
    }
    return it.get();
  }
  
  this.days_left_in_year = function(){
    var t = checkLeap(this.y)? 366 : 365;
    return t - this.day_of_the_year();
  }
  
  this.day_of_the_year = function(){
    var x = 0;
    for( var i = 1; i < this.m; ++i ){
      x += days_in_month( i, this.y );
    }
    x += this.d;
    return x;
  }
  
  this.days_until = function( o ){
    if( this.greater_than( o ) ) return -1;
    
    var D = 0;
    var it = this.get();
    while( o.y > it.y ){
     D += it.days_left_in_year()+1;
     it = new Dateclass( 1, 1, it.y+1 );
    }
    while( o.m > it.m ){
     D += days_in_month(it.m, it.y) - it.d + 1;
     it = new Dateclass( 1, it.m + 1, it.y );
    }
    D += o.d - it.d;   
    
    return D;
  }
   
  this.get = function(){ return new Dateclass( this.d, this.m, this.y ); } 
};

//-=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=-

function intSet(x, y, w, h, label, set ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.set = set;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  
  this.display = function( incumbency ){
    stroke(255);
    if( incumbency.n == this.set ) fill(255);
    else fill(0);
    rect( this.x, this.y, this.w, this.h );
    
    noStroke();
    if( incumbency.n == this.set ) fill(0);
    else fill(255);
    text( this.label, this.cx, this.cy );
  }
  this.released = function( incumbency ){
    if( mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h ){
      incumbency.n = this.set;
      return 1;
    }
    return 0;
  }
};

function Toggle(x, y, w, h, label ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  
  this.display = function( incumbency ){
    stroke(255);
    if( incumbency.b ) fill(255);
    else fill(0);
    rect( this.x, this.y, this.w, this.h );
    if( incumbency.b ) fill(0);
    else fill(255);
    noStroke();
    text( this.label, this.cx, this.cy );
  }
  this.released = function( incumbency ){
    if( mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h ){
      incumbency.b = !incumbency.b;
      return 1;
    }
    return 0;
  }
};

function PlusMinus(x, y, w, h, step, nfv, label ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.step = step;
  this.label = label;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  this.rx = x + w - h;
  this.nfv = nfv;
  
  this.display = function( incumbency ){
    stroke(255);
    fill(0);
    rect( this.x, this.y, this.w, this.h );
    rect( this.x, this.y, this.h, this.h );
    rect( this.rx, this.y, this.h, this.h );
    fill(255);
    noStroke();
    textSize(14);
    text( nf(incumbency.n, 1, this.nfv), this.cx, this.cy );
    textSize(24);
    text( "-", this.x + 15, this.cy );
    text( "+", this.x + this.w - 15, this.cy+1 );
    textSize(18);
    text( this.label, this.cx, this.cy -this.h );
  }
  this.pressed = function( incumbency ){//set held, increment every 800 millis in display
    
  }
  
  this.released = function( incumbency ){
    if( mouseY > this.y && mouseY < this.y + this.h ){
      if( mouseX > this.x  && mouseX < this.x + this.h ){
        incumbency.n -= step;
        return 1;
      }
      else if( mouseX > this.x + this.w - this.h && mouseX < this.x + this.w ){
        incumbency.n += step;
        return 1;      
      } 
    }
    return 0;
  }
};

function datePlusMinus(x, y, w, h, step ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.step = step;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  this.rx = x + w - h;
  
  this.display = function( incumbency ){
    stroke(255);
    fill(0);
    rect( this.x, this.y, this.w, this.h );
    rect( this.x, this.y, this.h, this.h );
    rect( this.rx, this.y, this.h, this.h );
    fill(255);
    noStroke();
    textSize(14);
    text( incumbency.string(), this.cx, this.cy );
    textSize(24);
    text( "-", this.x + 15, this.cy );
    text( "+", this.x + this.w - 15, this.cy+1 );
    textSize(18);
  }
  this.released = function( incumbency ){
    if( mouseY > this.y && mouseY < this.y + this.h ){
      if( mouseX > this.x  && mouseX < this.x + this.h ){
        var t = incumbency.sub( this.step );
        incumbency.d = t.d;
        incumbency.m = t.m;
        incumbency.y = t.y;
        return 1;
      }
      else if( mouseX > this.x + this.w - this.h && mouseX < this.x + this.w ){
        var t = incumbency.add( this.step );
        incumbency.d = t.d;
        incumbency.m = t.m;
        incumbency.y = t.y;
        return 1;      
      } 
    }
    return 0;
  }
};
