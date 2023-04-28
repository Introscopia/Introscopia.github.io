

function random_vec( maxmag ){
	let a = radians( random(1,360) );
	let m = random( 0, maxmag );
	return createVector( m*cos(a), m*sin(a) );
}

function propagate( adj, vec, l ) {
	let dx = adj.x - vec.x;
	let dy = adj.y - vec.y;
	let angle = atan2(dy, dx);
	vec.x = adj.x - cos(angle) * l;
	vec.y = adj.y - sin(angle) * l;
}

// 0, 163, 1055, 657


var Scl;

var N;

var img;
var dst;
var V;
var RV;
var O;
var da;
var td;

var wind;
let NS = 0.008;
var nox, noy;
var dnox, dnoy;


function preload() {
	img = Array(8);
	img[0] = loadImage('data/foot.png');
	img[1] = loadImage('data/left branch.png');
	img[2] = loadImage('data/right branch.png');
	img[3] = loadImage('data/left leaf.png');
	img[4] = loadImage('data/top leaf.png');
	img[5] = loadImage('data/file folder.png');
	img[6] = loadImage('data/flower.png');
	img[7] = loadImage('data/right leaf.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 1199.0;	

	for( var i = 0; i < N; ++i ){
		STK[i].init( Scl );
	}

	dst = Array(8);
	//dst[0] = { X: 0,   y: 0,   w: 1055, h: 1199};
	dst[0] = { X: 280, y: 981, w: 228,  h: 193 }; //foot.png
	dst[1] = { X: 291, y: 108, w: 202,  h: 904 }; //left branch.png 
	dst[2] = { X: 321, y: 639, w: 322,  h: 344 }; //right branch.png
	dst[3] = { X: 188, y: 522, w: 126,  h: 204 }; //left leaf.png
	dst[4] = { X: 232, y: 247, w: 170,  h: 80  }; //top leaf.png
	dst[5] = { X: 350, y: 701, w: 227,  h: 167 }; //file folder.png 
	dst[6] = { X: 349, y: 367, w: 217,  h: 319 }; //flower.png      
	dst[7] = { X: 636, y: 540, w: 242,  h: 253 }; //right leaf.png  

	V = Array(8);
	V[0]= createVector( 322.102, 1008.18 ); //foot.png:         foot
	V[1]= createVector( 307.607, 705.403 ); //left branch.png:  left leaf root
	V[2]= createVector( 347.870, 850.349 ); //right branch.png: file root
	V[3]= createVector( 217.419, 560.457 ); //left leaf.png:    left leaf tip  
	V[4]= createVector( 265.734, 273.787 ); //top leaf.png:     top leaf tip
	V[5]= createVector( 452.553, 832.634 ); //file folder.png:  file tip
	V[6]= createVector( 457.385, 484.764 ); //flower.png:       flower tip
	V[7]= createVector( 752.108, 665.141 ); //right leaf.png:   right leaf tip

	RV = Array(8);
	RV[0]= null;//foot
	RV[1]= V[0];//left branch
	RV[2]= V[0];//right branch
	RV[3]= V[1];//left leaf
	RV[4]= createVector( 401.017, 318.881 ); // top leaf root //top leaf
	RV[5]= V[2];//file folder
	RV[6]= createVector( 426.785, 689.298 ); // flower root //flower
	RV[7]= createVector( 708.624, 557.236 ); // right leaf root//right leaf

	O = Array(8);
	da = Array(8);
	td = Array(8);
	for (var i = 0; i < 8; i++) {
		O[i]  = createVector( V[i].x - dst[i].x, V[i].y - dst[i].y ).mult(Scl);
		if( RV[i] != null ) da[i] = -atan2( RV[i].y - V[i].y, RV[i].x - V[i].x);
		td[i] = { w: dst[i].w * Scl, h: dst[i].h * Scl };
		V[i].mult(Scl);
	}
	RV[4].mult(Scl);
	RV[6].mult(Scl);
	RV[7].mult(Scl);

	//V = Array(11);
	//V[0]= createVector( 322.102, 1008.18 ); // foot
	//V[1]= createVector( 307.607, 705.403 ); // left leaf root
	//V[2]= createVector( 217.419, 560.457 ); // left leaf tip
	//V[3]= createVector( 401.017, 318.881 ); // top leaf root
	//V[4]= createVector( 265.734, 273.787 ); // top leaf tip
	//V[5]= createVector( 347.87,  850.349 ); // file root
	//V[6]= createVector( 452.553, 832.634 ); // file tip
	//V[7]= createVector( 426.785, 689.298 ); // flower root
	//V[8]= createVector( 457.385, 484.764 ); // flower tip
	//V[9]= createVector( 708.624, 557.236 ); // right leaf root
	//V[10]=createVector( 752.108, 665.141 ); // right leaf tip

	wind = createVector(0,0);
	nox = 0;
	noy = 0;
	dnox = random( -12, 12 ) * 0.0003;
	dnoy = random( -12, 12 ) * 0.0003;
}

function draw() {

	clear();

	//wind = p5.Vector.lerp( wind, createVector( movedX, movedY ).mult(0.1), 0.012 ).mult(0.99);
	//wind.y *= 0.2;

	for( var i = 0; i < 8; ++i ){
		//STK[i].move_anchored( wind );
		fill(255);
		ellipse( V[i].x, V[i].y, 6, 6 );
		push();
		translate( V[i].x, V[i].y );
		if( RV[i] != null ){
			rotate( atan2( RV[i].y - V[i].y, RV[i].x - V[i].x ) - da[i] );
		}

		image( img[i], -O[i].x, -O[i].y, td[i].w, td[i].h );
		pop();
	}

	//nox += dnox;
	//noy += dnoy;
}


function mouseMoved() {
	
}

function mousePressed() {
	let M = createVector( mouseX, mouseY );

}

function mouseDragged(){

}

function mouseReleased(){
	
}