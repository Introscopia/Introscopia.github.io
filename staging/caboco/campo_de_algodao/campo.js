

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

var img;
var Scl;

var N;

var wind;

class Stalk{
	src; //source rect
	V; //stalk vertices
	O; //offset
	td; //transformed dimensions
	constructor( str ) {
		let spl = split( str, ',');
		this.src = { x: int(spl[0]), y: int(spl[1]), w: int(spl[2]), h: int(spl[3]) };
	}
	init( Scl ){
		this.V = Array(3);
		this.h = map( this.src.y, 100, 700, 0.4, 2.0 ) * this.src.h * Scl * random(90,110) * 0.01;
		this.V[2] = createVector( this.src.x + 0.5 * this.src.w, this.src.y + this.src.h ).mult(Scl);
		this.V[1] = createVector( this.V[2].x, this.V[2].y + 0.333 * this.h );
		this.V[0] = createVector( this.V[2].x, this.V[2].y + this.h );
		this.O = createVector( 0.5 * this.src.w,  this.src.h ).mult(Scl);
		this.td = { w: this.src.w * Scl, h: this.src.h * Scl };
		this.src.y -= 163;
	}
	move_anchored( force ){
		let f = force.copy().mult( (1.25 * noise( NS * this.V[0].x + nox, NS * this.V[0].y + noy )) -0.25 );
		this.V[2].add( f );
		//this.V[2].x += random(-10,10) * 0.008;
		this.V[2].y -= this.h * 0.02;//the up force
		propagate( this.V[2], this.V[1], 0.333 * this.h );
		propagate( this.V[0], this.V[1], 0.666 * this.h );
		propagate( this.V[1], this.V[2], 0.333 * this.h );

	}
	draw(){
		push();
		translate( this.V[2].x, this.V[2].y );
		rotate( atan2( this.V[1].y - this.V[2].y, this.V[1].x - this.V[2].x) - HALF_PI );

		image( img, -this.O.x, -this.O.y, this.td.w, this.td.h, 
					this.src.x, this.src.y, this.src.w, this.src.h );
		pop();

		//stroke(255);
		//line( this.V[2].x, this.V[2].y, this.V[1].x, this.V[1].y );
		//line( this.V[1].x, this.V[1].y, this.V[0].x, this.V[0].y );
	}
}
var STK;

let NS = 0.008;
var nox, noy;
var dnox, dnoy;

function load_src( arr ){
	N = arr.length;
	STK = Array( N );
	for (var i = 0; i < N; i++) {	
		STK[i] = new Stalk( arr[i] );
	}
}
function failed( response ){
	console.log( response );
}

function preload() {
	loadStrings("data/algodata.txt", load_src, failed );
	img = loadImage('data/algodoes.png');
}

function setup() {

	let w = document.getElementById('bg').clientWidth
	let h = document.getElementById('bg').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 1312.0;	

	for( var i = 0; i < N; ++i ){
		STK[i].init( Scl );
	}

	wind = createVector(0,0);
	nox = 0;
	noy = 0;
	dnox = random( -12, 12 ) * 0.0003;
	dnoy = random( -12, 12 ) * 0.0003;
}

function draw() {

	clear();

	//scale( Scl );
	//image( img, 0, 163 );

	//noStroke();
	//for( var i = 0; i < width; i += 12 ){
	//	for( var j = 0; j < height; j += 12 ){
	//		fill( 255*noise( NS*i + nox, NS*j + noy ) );
	//		rect( i, j, 12, 12 );
	//	}
	//}

	wind = p5.Vector.lerp( wind, createVector( movedX, movedY ).mult(0.1), 0.012 ).mult(0.99);
	wind.y *= 0.2;

	for( var i = 0; i < N; ++i ){
		STK[i].move_anchored( wind );
		STK[i].draw();
	}

	nox += dnox;
	noy += dnoy;
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