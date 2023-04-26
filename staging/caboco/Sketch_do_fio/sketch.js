
function propagate( adj, vec, l ) {
	let dx = adj.x - vec.x;
	let dy = adj.y - vec.y;
	let angle = atan2(dy, dx);
	vec.x = adj.x - cos(angle) * l;
	vec.y = adj.y - sin(angle) * l;
}

function intersect( L0, L1 ){

    let s1x = L0.B.x - L0.A.x;   
    let s1y = L0.B.y - L0.A.y;
    let s2x = L1.B.x - L1.A.x;   
    let s2y = L1.B.y - L1.A.y;
    let s = (-s1y * (L0.A.x - L1.A.x) + s1x * (L0.A.y - L1.A.y)) / (-s2x * s1y + s1x * s2y);
    let t = ( s2x * (L0.A.y - L1.A.y) - s2y * (L0.A.x - L1.A.x)) / (-s2x * s1y + s1x * s2y);

    if ( (s >= 0 && s <= 1) && (t >= 0 && t <= 1) ){
        return true;
    }
    return false;
}

class Rig{
	img;
	N;
	td;//transformed dimensions
	R;// src rects
	V;// vectors on the rigging skelleton
	da;// default_angles
	O;// offets
	l;// lengths
	Va;//anchor
	constructor(str) {
		this.img = loadImage('data/' + str + '.png');
		this.dat = loadStrings('data/' + str + '.txt');
	}

	init( h ){
		let Scl = h / float(this.dat[0]); //scaling down from the image
		this.N = int(this.dat[1]);

		let minX = 999999;
		let minY = 999999;

		this.R = Array( this.N );
		for (var i = 0; i < this.N; i++) {
			let spl = split(this.dat[2+i], ',');
			this.R[i] = { x: int(spl[0]),  y: int(spl[1]), w: int(spl[2]), h: int(spl[3]) };
			if( this.R[i].x < minX ) minX = this.R[i].x;
			if( this.R[i].y < minY ) minY = this.R[i].y;
		}
		
		this.td = Array( this.N );
		for( var i = 0; i < this.N; ++i ){
			this.td[i] = { w: this.R[i].w * Scl, h: this.R[i].h * Scl };
		}

		this.V = Array( this.N+1 );
		for (var i = 0; i <= this.N; i++) {
			let spl = split(this.dat[2+this.N+i], ',');
			this.V[i] = createVector( float(spl[0]), float(spl[1]) );
		}

		this.dat = null;

		this.O = Array( this.N );
		this.da = Array( this.N );
		for( var i = 0; i < this.N; ++i ){
			this.O[i] = createVector( this.V[i].x - this.R[i].x, this.V[i].y - this.R[i].y ).mult(Scl);
			this.da[i] = -atan2( this.V[i+1].y - this.V[i].y, this.V[i+1].x - this.V[i].x);
		}
		for (var i = 0; i < this.N+1; i++) {
			this.V[i].mult(Scl);
		}
		this.l= Array( this.N+1 );
		for( var i = 1; i < this.N+1; ++i ){
			this.l[i] = this.V[i].dist( this.V[i-1] );
		}
		for( var i = 0; i < this.N; ++i ){
			this.R[i].x -= minX;
			this.R[i].y -= minY;
		}
		this.Va = this.V[0];
	}

	move_anchored( head ){
		PE.V[this.N] = head.copy();
		for( var i = this.N; i > 1; --i ){
			propagate( PE.V[i], PE.V[i-1], PE.l[i] );
		}
		//PE.V[0].x = PE.Va.x;
		//PE.V[0].y = PE.Va.y;
		for( var i = 0; i < this.N; ++i ){
			propagate( PE.V[i], PE.V[i+1], PE.l[i+1] );
		}
	}

	draw(){
		for( var i = 0; i < this.N; ++i ){

			//strokeWeight(2);
			//stroke(0,0,255);
			//line( this.V[i].x, this.V[i].y, this.V[i+1].x, this.V[i+1].y );

			push();
			translate( this.V[i].x, this.V[i].y );
			rotate( atan2( this.V[i+1].y - this.V[i].y, this.V[i+1].x - this.V[i].x) + this.da[i] );

			image( this.img, -this.O[i].x, -this.O[i].y, this.td[i].w, this.td[i].h, 
						   this.R[i].x, this.R[i].y, this.R[i].w, this.R[i].h );
			pop();
		}
	}
}


function drag_fio( I ){
	if( I < 0 || I >= P.length ) return;
	// propagate up
	for( var i = I+1; i < P.length; ++i ){
		propagate( P[i-1], P[i], Pl[i] );
	}
	// propagate down
	for( var i = I-1; i >= 0; --i ){
		propagate( P[i+1], P[i], Pl[i+1] );
	}
}

function random_vec( maxmag ){
	let a = radians( random(1,360) );
	let m = random( 0, maxmag );
	return createVector( m*cos(a), m*sin(a) );
}


var P;
var Pl;
var D;

var PE;
var Wa = {};

var tet = 0;

var MH; // mouseHistory
var mhi;// mouse history index

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
	PE = new Rig( 'pe' );
}

function setup() {

	let w = document.getElementById('fiobg').clientWidth
	let h = document.getElementById('fiobg').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	MH = Array(3);
	for (var i = 0; i < 3; i++) {
		MH[i] = createVector(0,0);
	}
	mhi = 0;

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

	PE.init(h);
	//console.log( PE.dat.length + ' stringss' );
	Wa.V = Array(3);
	Wa.M = Array(3);
	for( var i = 0; i < 3; ++i ){
		Wa.M[i] = map( i, 0, 2, 0.04, 0.1 );
		Wa.V[i] = random_vec( Wa.M[i] );
	}
	Wa.A = PE.V[3].copy();
}

function draw() {

	clear();

	stroke(255);
	strokeWeight(5);
	for( var i = 1; i < P.length; ++i ){
		line( P[i].x, P[i].y, P[i-1].x, P[i-1].y );
	}


	//let head = createVector( wa.x + (28 * cos( tet ) ), wa.y + (5 * sin( 2*tet ) ) );
	//tet += 0.0012;
	//head = p5.Vector.lerp( PE.V[3], head, 0.25 );

	fill(255);
	ellipse( Wa.A.x, Wa.A.y, 8, 8 );

	let G = p5.Vector.sub( Wa.A, PE.V[3] ).mult(0.00004);
	let R = createVector(0,0);
	for( var i = 1; i < 3; ++i ){
		R.add( Wa.V[i] );
		Wa.V[i].add( G );
		Wa.V[i].add( random_vec( 0.003 ) );
		if( Wa.V[i].magSq() > sq(Wa.M[i]) ){
			Wa.V[i].mult( Wa.M[i] / Wa.V[i].mag() );
		}
	}
	let head = p5.Vector.add( PE.V[3], R );

	PE.move_anchored( head );
	PE.draw();
}


function mouseMoved() {
	MH[mhi].set( mouseX, mouseY );
	let mhl = (mhi >= 2)? 0 : mhi+1;
	let LsM = { A: MH[mhi], B: MH[mhl] };
	let LsF = { A: P[0], B: null };

	for( var i = 1; i < P.length; ++i ){
		LsF.B = P[i];
		if( intersect( LsM, LsF ) ){
			let i0 = constrain( i-5, 0, P.length-1 );
			for (var j = i0; j < i; j++) {
				P[j].x += map( j, i-5, i, 0.1, 0.85 ) * movedX;
				P[j].y += map( j, i-5, i, 0.1, 0.85 ) * movedY;
			}
			let i1 = constrain( i+5, 0, P.length-1 );
			for (var j = i; j < i1; j++) {
				P[j].x += map( j, i, i+5, 0.85, 0.1 ) * movedX;
				P[j].y += map( j, i, i+5, 0.85, 0.1 ) * movedY;
			}
			drag_fio( i );
			//break;
		}
		LsF.A = LsF.B;
	}

	LsF.A = PE.V[1];
	let clipped = 0;
	for( var i = 2; i < 4; ++i ){
		LsF.B = PE.V[i];
		if( intersect( LsM, LsF ) ){
			Wa.V[2].x += 0.1 * movedX;
			Wa.V[2].y += 0.1 * movedY;
			clipped = 1;
		}
		LsF.A = LsF.B;
	}
	if( !clipped ){
		let d = p5.Vector.dist( PE.V[3], MH[mhi] );
		if( d < 40 ){
			Wa.V[2].x += 0.02 * movedX;
			Wa.V[2].y += 0.02 * movedY;
		}
	}

	mhi += 1;
	if( mhi >= 3 ) mhi = 0;
}

function mousePressed() {
	let M = createVector( mouseX, mouseY );
	for( var i = 0; i < P.length; ++i ){
		let dsq = p5.Vector.sub( P[i], M ).magSq();
		if( dsq < 8 ){
			D = i;
			break;
		}
	}
}

function mouseDragged(){

	P[D].x = mouseX;
	P[D].y = mouseY;
	drag_fio( D );
}

function mouseReleased(){
	D = -1;
}