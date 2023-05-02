
var P;
var Pl;
var D;

var PE_img;
var PE_td;//transformed dimensions
var PE_R;// src rects
var PE_V;// vectors on the rigging skelleton
var PE_da;// default_angles
var PE_O;// offets
var PE_l;// lengths
var PE_Va;//anchor

var wa;//wobbler anchor

var tet = 0;

function load_fio( arr ){
	P = Array( arr.length );
	for( var i = 0; i < arr.length; ++i ){
		let spl = split(arr[i], ',');
		let x = float( spl[0] );
		let y = float( spl[1] );
		P[i] = createVector( x, y );
	}
}
function failed( response ){
	console.log( response );
}
function preload() {
	loadStrings("data/fio.txt", load_fio, failed );
	PE_img = loadImage('data/pe.png');
}

function setup() {

	let w = document.getElementById('fiobg').clientWidth
	let h = document.getElementById('fiobg').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	let Scl = h / 711.5; //scaling down from the original svg
	console.log( "Scl:", Scl );

	for( var i = 0; i < P.length; ++i ){
		P[i].mult(Scl);
	}
	Pl = Array( P.length );
	Pl[0] = 0;
	for( var i = 1; i < P.length; ++i ){
			Pl[i] = P[i].dist( P[i-1] );
	}
	D = -1;

	Scl = h / 1483.0; //scaling down from the image

	PE_R = Array(3);
	PE_R[0] = { x: 73,  y: 1186, w: 234, h: 243 };
	PE_R[1] = { x: 100, y: 1054, w: 107, h: 132 };
	PE_R[2] = { x: 94,  y: 696,  w: 314, h: 358 };
	PE_td = Array(3);
	for( var i = 0; i < 3; ++i ){
		PE_td[i] = { w: PE_R[i].w * Scl, h: PE_R[i].h * Scl };
	}
	PE_V = Array(4);
	PE_V[0] = createVector( 148.5, 1374.92 );
	PE_V[1] = createVector( 148.5, 1201.2 );
	PE_V[2] = createVector( 138.6, 1054.9 );
	PE_V[3] = createVector( 206.8, 920.7 );
	PE_O = Array(3);
	PE_da = Array(3);
	for( var i = 0; i < 3; ++i ){
		PE_O[i] = createVector( PE_V[i].x - PE_R[i].x, PE_V[i].y - PE_R[i].y ).mult(Scl);
		PE_da[i] = -atan2( PE_V[i+1].y - PE_V[i].y, PE_V[i+1].x - PE_V[i].x);
	}
	for (var i = 0; i < 4; i++) {
		PE_V[i].mult(Scl);
	}
	PE_l= Array(4);
	for( var i = 1; i < 4; ++i ){
		PE_l[i] = PE_V[i].dist( PE_V[i-1] );
	}
	for( var i = 0; i < 3; ++i ){
		PE_R[i].x -= 73;
		PE_R[i].y -= 696;
	}
	PE_Va = PE_V[0];
	wa = PE_V[3].copy();
	wa.y -= 8;
}

function draw() {

	clear();

	stroke(255);
	strokeWeight(5);
	for( var i = 1; i < P.length; ++i ){
		line( P[i].x, P[i].y, P[i-1].x, P[i-1].y );
	}


	PE_V[3].x = wa.x + (28 * cos( tet ) );
	PE_V[3].y = wa.y + (10 * sin( 2*tet ) );
	//fill(255);
	//ellipse( PE_V[3].x, PE_V[3].y, 8, 8 );
	tet += 0.01;
	for( var i = 3; i > 1; --i ){
		propagate( PE_V[i], PE_V[i-1], PE_l[i] );
	}
	//PE_V[0].x = PE_Va.x;
	//PE_V[0].y = PE_Va.y;
	for( var i = 0; i < 3; ++i ){
		propagate( PE_V[i], PE_V[i+1], PE_l[i+1] );
	}
	

	for( var i = 0; i < 3; ++i ){

		//strokeWeight(2);
		//line( PE_V[i].x, PE_V[i].y, PE_V[i+1].x, PE_V[i+1].y );

		push();
		//translate( PE_V[i].x - PE_O[i].x, PE_V[i].y - PE_O[i].y );
		//translate( PE_V[i].x, PE_V[i].y );
		translate( PE_V[i].x, PE_V[i].y );
		rotate( atan2( PE_V[i+1].y - PE_V[i].y, PE_V[i+1].x - PE_V[i].x) + PE_da[i] );

		image( PE_img, -PE_O[i].x, -PE_O[i].y, PE_td[i].w, PE_td[i].h, 
					   PE_R[i].x, PE_R[i].y, PE_R[i].w, PE_R[i].h );
		pop();
	}


}

function mousePressed() {
	let M = createVector( mouseX, mouseY );
	for( var i = 0; i < P.length; ++i ){
		let dsq = p5.Vector.sub( P[i], M ).magSq();
		if( dsq < 6 ){
			D = i;
			break;
		}
	}
}

function mouseDragged(){

	if( D >= 0 ){
		P[D].x = mouseX;
		P[D].y = mouseY;

		// propagate up
		for( var i = D+1; i < P.length; ++i ){
			propagate( P[i-1], P[i], Pl[i] );
		}
		// propagate down
		for( var i = D-1; i >= 0; --i ){
			propagate( P[i+1], P[i], Pl[i] );
		}
	}
}

function mouseReleased(){
	D = -1;
}

function propagate( adj, vec, l ) {
	let dx = adj.x - vec.x;
	let dy = adj.y - vec.y;
	let angle = atan2(dy, dx);
	vec.x = adj.x - cos(angle) * l;
	vec.y = adj.y - sin(angle) * l;
}