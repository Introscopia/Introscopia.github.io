
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

var sound_flowers = null;
var contact_flowers;

var bg;
var bgx;
var Scl;

var V;
var radsq;

var fios;
var D = -1;
var Di;
var FL; //fio (chainlin) length
var FLsq;


function preload() {
	bg = loadImage('data/desenho--08.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 888.0;

	bgx = 0.5 * (width - (Scl * bg.width));

	V = Array(5);
	V[0] = createVector( 243, 244 ).mult(Scl);
	V[1] = createVector( 485, 335 ).mult(Scl);
	V[2] = createVector( 308, 407 ).mult(Scl);
	V[3] = createVector( 276, 557 ).mult(Scl);
	V[4] = createVector( 442, 550 ).mult(Scl);

	for (var i = 0; i < V.length; i++) {
		V[i].x += bgx;
	}

	radsq = sq( 60 * Scl );


	fios = [];
	FL = 6;
	FLsq = sq(FL);

	contact_flowers = Array(5);
	for (var i = 0; i < 5; i++) {
		contact_flowers[i] = 0;
	}
	
}

function draw() {

	let M = createVector( mouseX, mouseY );
	for( var i = 0; i < 5; ++i ){
		if( p5.Vector.sub( V[i], M ).magSq() < radsq ){
			contact_flowers[i] += 2;
		}
	}

	if( !first_click ){
		for (var i = 0; i < 5; i++) {
			if( contact_flowers[i] > 0 ){
				if( !(sound_flowers[i].isPlaying()) ) sound_flowers[i].play();
				if( contact_flowers[i] > 60 ) contact_flowers[i] = 60;
				contact_flowers[i] -= 1;
				if( contact_flowers[i] <= 0 ) sound_flowers[i].stop();
			}
		}
	}

	clear();

	push();
	imageMode(CORNER);
	translate(bgx, 0);
	scale(Scl);
	image( bg, 0, 0 );
	pop();


	
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

	//text( 'D: '+D+', Di: '+Di, 100, 100 );

}


function mousePressed() {
	let M = createVector( mouseX, mouseY );
	for( var i = 0; i < 5; ++i ){
		if( p5.Vector.sub( V[i], M ).magSq() < radsq ){
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
		if( Di < 4 ){
			fios[D].drag_head( createVector( mouseX, mouseY ) );
		}
		else{
			fios[D].P[Di].set( mouseX, mouseY );
			fios[D].drag_fio( Di );
			fios[D].drag_tail();
		}
	}
}

function mouseReleased(){
	D = -1;

	if( first_click ){
		sound_flowers = Array(5);
		for (var i = 0; i < 5; i++) {
			sound_flowers[i] = loadSound('data/'+(i+1)+'.wav');
			sound_flowers[i].playMode('sustain');
		}
		first_click = 0;
	}
}