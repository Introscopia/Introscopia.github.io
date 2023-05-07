
function propagate( adj, vec, l ){
	let dx = adj.x - vec.x;
	let dy = adj.y - vec.y;
	let angle = atan2(dy, dx);
	vec.x = adj.x - cos(angle) * l;
	vec.y = adj.y - sin(angle) * l;
}



function coordinates_in_rct( x, y, R ){
	return ( x > R.x && x < R.x + R.w ) && ( y > R.y && y < R.y + R.h );
}


class Fio_Ancorado{

	constructor( root, origin ){
		this.root = root;
		this.anchor = origin.copy();
		this.O = p5.Vector.sub( origin, root );
		this.P = Array(1);
		this.P[0] = origin.copy();
	}

	drag_tail( ){
		let lp = this.P.length-1;
		this.P[lp] = p5.Vector.add( this.root, this.O );
		for( var i = lp-1; i >= 0; --i ){
			propagate( this.P[i+1], this.P[i], FL );
		}
	}

	drag_head( V ){
		this.P[0] = V.copy();
		let lp = this.P.length-1;
		for( var i = 1; i <= lp; ++i ){
			propagate( this.P[i-1], this.P[i], FL );
		}
		while( p5.Vector.sub( this.P[ lp ], this.anchor ).magSq() > FLsq ){
			let a = atan2( this.anchor.y - this.P[ lp ].y, this.anchor.x - this.P[ lp ].x );
			this.P.push( createVector( this.P[ lp ].x + FL * cos(a), this.P[ lp ].y + FL * sin(a) ) );
			lp = this.P.length-1;
		}
	}

	drag_fio( I ){
		if( I < 0 || I >= this.P.length ) return;
		// propagate up
		for( var i = I+1; i < this.P.length; ++i ){
			propagate( this.P[i-1], this.P[i], FL );
		}
		// propagate down
		for( var i = I-1; i >= 0; --i ){
			propagate( this.P[i+1], this.P[i], FL );
		}
	}

	draw(){
		for( var i = 1; i < this.P.length; ++i ){
			line( this.P[i].x, this.P[i].y, this.P[i-1].x, this.P[i-1].y );
		}
	}

}


var first_click = 1;

var sound_fio = null;
var contact_fio = 0;

var bg;
var nubs;
var Scl;

var RV;
var V;
var radsq;
var O;
var da;
var td;
var l;
var normals;
var dst;

var fios;
var D = -1;
var Di;
var FL; //fio (chainlin) length
var FLsq;


function preload() {
	bg = loadImage('data/desenho--07.png');
	nubs = Array(2);
	nubs[0] = loadImage('data/nub-L.png');
	nubs[1] = loadImage('data/nub-R.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 919.0;

	V = Array(2);
	RV = Array(2);
	RV[0] = createVector( 130.729, 606.311 );
	V[0]  = createVector( 165.289, 323.065 );
	RV[1] = createVector( 141.998, 605.56  );
	V[1]  = createVector( 298.272, 441.022 );

	radsq = Array(2);
	radsq[0] = sq( 140.0 *Scl );
	radsq[1] = sq( 122.0 *Scl );
	
	dst = Array(2);
	//0, 0, 1444, 919 // desenho--07-2-01
	dst[0] = { x: 79, y: 223, w: 191, h: 386 }; // nub-L
	dst[1] = { x: 136, y: 356, w: 247, h: 254 }; // nub-R

	O = Array(2);
	da = Array(2);
	td = Array(2);
	l = Array(2);
	normals = Array(2);

	for (var i = 0; i < 2; i++) {
		O[i] = createVector( RV[i].x - dst[i].x, RV[i].y - dst[i].y ).mult(Scl);
		da[i] = -atan2( V[i].y - RV[i].y, V[i].x - RV[i].x);
		RV[i].mult(Scl);
		td[i] = { w: dst[i].w * Scl, h: dst[i].h * Scl };
		V[i].mult(Scl);
		l[i] = p5.Vector.dist( RV[i], V[i] );
		normals[i] = p5.Vector.sub( V[i], RV[i] ).mult(0.01);
	}

	fios = [];
	FL = 6;
	FLsq = sq(FL);
}

function draw() {

	if( !first_click ){
		if( contact_fio > 0 ){
			if( !(sound_fio.isPlaying()) ) sound_fio.play();
			if( contact_fio > 60 ) contact_fio = 60;
			contact_fio -= 1;
			if( contact_fio <= 0 ) sound_fio.stop();
		}
	}

	clear();

	push();
	imageMode(CORNER);
	scale(Scl);
	image( bg, 0, 0 );
	pop();

	

	for( var i = 0; i < 2; ++i ){

		V[i].add( normals[i] );

		propagate( RV[i], V[i], l[i] );
		
		push();
		if( RV[i] == null ){
			translate( V[i].x, V[i].y );
		}
		else{
			translate( RV[i].x, RV[i].y );
			rotate( atan2( V[i].y - RV[i].y, V[i].x - RV[i].x ) + da[i] );
		}

		image( nubs[i], -O[i].x, -O[i].y, td[i].w, td[i].h );
		pop();
	}


	
	//stroke('#8a0d12');
	//strokeWeight(7);
	//for( var i = 1; i < P.length; ++i ){
	//	line( P[i].x, P[i].y, P[i-1].x, P[i-1].y );
	//}

	stroke(255);
	strokeWeight(4);
	for (var i = fios.length - 1; i >= 0; i--) {
		fios[i].draw();
	}

	//fill(255);
	//for( var i = 1; i < P.length; ++i ){
	//	ellipse( P[i].x, P[i].y, 4 );
	//}
}


function mouseMoved() {
	let M = createVector( mouseX, mouseY );
	let algo = false;
	for( var i = 0; i < 2; ++i ){
		if( p5.Vector.sub( V[i], M ).magSq() < radsq[i] ){
			let f = createVector( movedX, movedY ).mult(0.1);
			V[i].add( f );
			algo = true;
		}
	}
	if( algo ){
		for (var i = fios.length - 1; i >= 0; i--) {
			fios[i].drag_tail();
		}
	}
}

function mousePressed() {
	let M = createVector( mouseX, mouseY );
	for( var i = 0; i < 2; ++i ){
		if( p5.Vector.sub( V[i], M ).magSq() < radsq[i] ){
			fios.push( new Fio_Ancorado( V[i], M ) );
			D = fios.length -1;
			Di = 0;
		}
	}
	if( D < 0 ){
		for( var j = 0; j < fios.length; ++j ){
			for( var i = 0; i < fios[j].P.length; ++i ){
				let dsq = p5.Vector.sub( fios[j].P[i], M ).magSq();
				if( dsq < 10 ){
					D = j;
					Di = i;
					break;
				}
			}
		}
	}

}

function mouseDragged(){
	if( D >= 0 ){
		if( Di == 0 ){
			fios[D].drag_head( createVector( mouseX, mouseY ) );
		}
		else{
			fios[D].P[Di].set( mouseX, mouseY );
			fios[D].drag_fio( Di );
			fios[D].drag_tail();
		}
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mouseReleased(){
	D = -1;

	if( first_click ){
		sound_fio = loadSound('data/01-fio-de-algodao-2.wav');
		sound_fio.playMode('sustain');
		first_click = 0;
	}
}