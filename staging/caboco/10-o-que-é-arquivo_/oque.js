
function propagate( adj, vec, l ){
	let dx = adj.x - vec.x;
	let dy = adj.y - vec.y;
	let angle = atan2(dy, dx);
	vec.x = adj.x - cos(angle) * l;
	vec.y = adj.y - sin(angle) * l;
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

var sound = null;

var lady, spider;
var lady_dst;
var Scl;
var bgx;

var O;

var head;
var vel;
var fio;
var lp;
var FL, FLsq;


function preload() {
	lady = loadImage('data/lady.png');
	spider = loadImage('data/spider.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 1391.0;
	bgx = 700;
	FL = 6;
	FLsq = sq(FL);

	let root = createVector( 307, 972 ).mult(Scl);
	root.x += bgx;
	fio = new Fio_Ancorado( root, root );
	head = createVector( 307, 309 ).mult(Scl);
	head.x += bgx;
	fio.drag_head( head );
	lp = fio.P.length-1;

	vel = createVector(0,0);

	lady_dst = { x: head.x - (Scl * lady.width * 0.5), y: head.y - (Scl * lady.height), w: Scl * lady.width, h: Scl * lady.height };
}

function draw() {

	clear();

	stroke(255);
	strokeWeight(6*Scl);
	fio.draw();

	fill('#8a0d12');
	noStroke();
	rect( 0, 0, width, lady_dst.y+lady_dst.h );//backing

	image( lady, lady_dst.x, lady_dst.y, lady_dst.w, lady_dst.h );

	push();
	translate( fio.P[lp].x , fio.P[lp].y  );
	let alpha = atan2( fio.P[lp-1].y - fio.P[lp].y, fio.P[lp-1].x - fio.P[lp].x);
	rotate( alpha + HALF_PI );
	scale(Scl);
	image( spider, -100, -129 );
	pop();

	vel.y += 0.5;
	fio.P[lp].x += vel.x;
	fio.P[lp].y += vel.y;
	vel.mult(0.96);

	for( var i = lp-1; i > 0; --i ){
		propagate( fio.P[i+1], fio.P[i], FL );
	}
	for( var i = 1; i < fio.P.length; ++i ){
		propagate( fio.P[i-1], fio.P[i], FL );
	}	
}

function mouseMoved() {
	
	vel.x += movedX * 0.05;

	fio.P[0].y += movedY * 0.4;
	if( fio.P[0].y > head.y ) fio.P[0].y = head.y;
	fio.drag_fio( 0 );

}


function mouseReleased(){

	if( first_click ){
		sound = loadSound('data/-som-da-aranha-20.wav');
		sound.playMode('sustain');
		sound.play();
		first_click = 0;
	}
}