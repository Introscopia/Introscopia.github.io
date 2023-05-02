

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


function maintain( A, B, O ){
	let off = p5.Vector.rotate( O, atan2( A.y - B.y, A.x - B.x) );
	return p5.Vector.add( A, off );
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

var bo;//branch offsets
var l;
var normals;

var wind;


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
	dst[0] = { x: 280, y: 981, w: 228,  h: 193 }; //foot.png
	dst[1] = { x: 291, y: 108, w: 202,  h: 904 }; //left branch.png 
	dst[2] = { x: 321, y: 639, w: 322,  h: 344 }; //right branch.png
	dst[3] = { x: 188, y: 522, w: 126,  h: 204 }; //left leaf.png
	dst[4] = { x: 232, y: 247, w: 170,  h: 80  }; //top leaf.png
	dst[5] = { x: 350, y: 701, w: 227,  h: 167 }; //file folder.png 
	dst[6] = { x: 349, y: 367, w: 217,  h: 319 }; //flower.png      
	dst[7] = { x: 636, y: 540, w: 242,  h: 253 }; //right leaf.png  

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
	RV[1]= V[0].copy();//left branch
	RV[2]= V[0].copy();//right branch
	RV[3]= V[1].copy();//left leaf
	RV[4]= createVector( 401.017, 318.881 ); // top leaf root //top leaf
	RV[5]= V[2].copy();//file folder
	RV[6]= createVector( 426.785, 689.298 ); // flower root //flower
	RV[7]= createVector( 708.624, 557.236 ); // right leaf root//right leaf

	O = Array(8);
	da = Array(8);
	td = Array(8);
	for (var i = 0; i < 8; i++) {
		if( RV[i] == null ){
			O[i] = createVector( V[i].x - dst[i].x, V[i].y - dst[i].y ).mult(Scl);
		}
		else{
			//console.log( RV[i].x + ' - ' + dst[i].x + ' = ' + RV[i].x - dst[i].x );
			O[i] = createVector( RV[i].x - dst[i].x, RV[i].y - dst[i].y ).mult(Scl);
			da[i] = -atan2( V[i].y - RV[i].y, V[i].x - RV[i].x);
			RV[i].mult(Scl);
		}
		td[i] = { w: dst[i].w * Scl, h: dst[i].h * Scl };
		V[i].mult(Scl);

	}
	//RV[4].mult(Scl);
	//RV[6].mult(Scl);
	//RV[7].mult(Scl);

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

	bo = Array(3);
	bo[0] = p5.Vector.sub( RV[4], V[1] );
	bo[0].rotate( -atan2( V[1].y - V[0].y, V[1].x - V[0].x) );
	bo[1] = p5.Vector.sub( RV[6], V[2] );
	bo[1].rotate( -atan2( V[2].y - V[0].y, V[2].x - V[0].x) );
	bo[2] = p5.Vector.sub( RV[7], V[2] );
	bo[2].rotate( -atan2( V[2].y - V[0].y, V[2].x - V[0].x) );

	l = Array(7);
	l[0] = p5.Vector.dist(  V[0], V[1] );
	l[1] = p5.Vector.dist(  V[0], V[2] );
	l[2] = p5.Vector.dist( RV[3], V[3] );
	l[3] = p5.Vector.dist( RV[4], V[4] );
	l[4] = p5.Vector.dist( RV[5], V[5] );
	l[5] = p5.Vector.dist( RV[6], V[6] );
	l[6] = p5.Vector.dist( RV[7], V[7] );

	normals = Array(8);
	for( var i = 1; i < 8; ++i ){
		normals[i] = p5.Vector.sub( V[i], RV[i] ).mult(0.01);
	}

	wind = createVector(0,0);
}

function draw() {

	clear();

	wind = p5.Vector.lerp( wind, createVector( movedX, movedY ).mult(0.1), 0.1 );
	wind.x *= 0.99;
	wind.y *= 0.3;

	for( var i = 1; i < 8; ++i ){
		V[i].add( wind );
		V[i].add( normals[i] );
	}

	RV[1]= V[0].copy();
	RV[2]= V[0].copy();
	RV[3]= V[1].copy();
	RV[5]= V[2].copy();

	//top leaf root -> left branch
	RV[4] = maintain( V[1], V[0], bo[0] );
	//flower root -> right branch
	RV[6] = maintain( V[2], V[0], bo[1] );
	//right leaf root -> right branch
	RV[7] = maintain( V[2], V[0], bo[2] );


	propagate(  V[0], V[1], l[0] );
	propagate(  V[0], V[2], l[1] );
	propagate( RV[3], V[3], l[2] );
	propagate( RV[4], V[4], l[3] );
	propagate( RV[5], V[5], l[4] );
	propagate( RV[6], V[6], l[5] );
	propagate( RV[7], V[7], l[6] );



	for( var i = 0; i < 8; ++i ){
		//STK[i].move_anchored( wind );
		push();
		if( RV[i] == null ){
			translate( V[i].x, V[i].y );
		}
		else{
			translate( RV[i].x, RV[i].y );
			rotate( atan2( V[i].y - RV[i].y, V[i].x - RV[i].x ) + da[i] );
		}

		image( img[i], -O[i].x, -O[i].y, td[i].w, td[i].h );
		pop();
	}
}


function mouseMoved() {
	
}

function mousePressed() {

}

function mouseDragged(){

}

function mouseReleased(){
	
}