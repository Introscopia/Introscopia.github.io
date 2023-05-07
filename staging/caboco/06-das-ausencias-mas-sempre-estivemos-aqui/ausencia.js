
function propagate( adj, vec, l ){
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


function drag_fio( I ){///modified to use global L
	if( I < 0 || I >= P.length ) return;
	// propagate up
	for( var i = I+1; i < P.length; ++i ){
		propagate( P[i-1], P[i], L );
	}
	// propagate down
	for( var i = I-1; i >= 0; --i ){
		propagate( P[i+1], P[i], L );
	}
}

var first_click = 1;

var sound_fio = null;
var contact_fio = 0;

var sound_cabecas;
var contact_cabecas;

function coordinates_in_rct( x, y, R ){
	return ( x > R.x && x < R.x + R.w ) && ( y > R.y && y < R.y + R.h );
}

var img;
var bg;
var Scl;

var P;
var L;
var hooks;
var O;

var srcs;//cabecinhas
var dsts;
var anchors;

var force;


function preload() {
	img = loadImage('data/desenho--06.png');
	bg = loadImage('data/bg.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 1121.0;

	srcs = Array(7);
	srcs[0] = { x: 182, y: 0,   w: 151, h: 171 };
	srcs[1] = { x: 436, y: 143, w: 173, h: 145 };
	srcs[2] = { x: 0,   y: 226, w: 185, h: 154 };
	srcs[3] = { x: 375, y: 478, w: 169, h: 126 };
	srcs[4] = { x: 70,  y: 572, w: 153, h: 159 };
	srcs[5] = { x: 358, y: 661, w: 168, h: 172 };
	srcs[6] = { x: 135, y: 816, w: 153, h: 230 };

	dsts = Array(7);
	contact_cabecas = Array(7);
	for( var i = 0; i < 7; ++i ){
		dsts[i] = { x: srcs[i].x * Scl, y: srcs[i].y * Scl, w: srcs[i].w * Scl, h: srcs[i].h * Scl };
		contact_cabecas[i] = 0;
	}

	let V = Array(7);
	V[0] = createVector( 296.694, 101.653 ).mult(Scl);
	V[1] = createVector( 471.074, 195.868 ).mult(Scl);
	V[2] = createVector( 139.669, 294.215 ).mult(Scl);
	V[3] = createVector( 425.62,  503.306 ).mult(Scl);
	V[4] = createVector( 182.684, 627.592 ).mult(Scl);
	V[5] = createVector( 396.158, 728.685 ).mult(Scl);
	V[6] = createVector( 269.408, 869.803 ).mult(Scl);

	var total_len = 0;
	for( var i = 0; i < 6; ++i ){
		total_len += p5.Vector.dist( V[i], V[i+1] );
	}
	L = 8.0;
	var pn = floor(total_len / L)+4;
	P = Array(pn);
	hooks = Array(7);
	anchors = Array(7);
	O = Array(7);
	let c = 0;
	for( var i = 0; i < 6; ++i ){
		P[c] = V[i];
		hooks[i] = c;
		anchors[i] = P[c].copy();//createVector( dsts[i].x, dsts[i].y );
		O[i] = createVector( dsts[i].x - P[c].x, dsts[i].y - P[c].y );
		c += 1;
		let len = p5.Vector.dist( V[i], V[i+1] );
		let n = floor(len / L);
		let alpha = atan2( V[i+1].y - V[i].y, V[i+1].x - V[i].x );
		let delta = createVector( L*cos(alpha), L*sin(alpha) );
		for( var j = 0; j < n; ++j ){
			P[c] = p5.Vector.add( P[c-1], delta );
			c += 1;
		}
	}
	//console.log( pn, c );
	hooks[6] = c-1;
	anchors[6] = P[c-1].copy();
	O[6] = createVector( dsts[6].x - P[c-1].x, dsts[6].y - P[c-1].y );

	force = createVector( 3, 0 );
}

function draw() {

	if( mouseX == pmouseX && mouseY == pmouseY ){
		for( var i = 0; i < 7; ++i ){
			if( coordinates_in_rct( mouseX, mouseY, dsts[i] ) ){
				contact_cabecas[i] += 1;
			}
		}
	}

	if( !first_click ){
		if( contact_fio > 0 ){
			if( !(sound_fio.isPlaying()) ) sound_fio.play();
			if( contact_fio > 60 ) contact_fio = 60;
			contact_fio -= 1;
			if( contact_fio <= 0 ) sound_fio.stop();
		}
		for( var i = 0; i < 7; ++i ){
			if( contact_cabecas[i] > 0 ){
				if( !(sound_cabecas[i].isPlaying()) ) sound_cabecas[i].play();
				if( contact_cabecas[i] > 60 ) contact_cabecas[i] = 60;
				contact_cabecas[i] -= 1;
				if( contact_cabecas[i] <= 0 ) sound_cabecas[i].stop();

				let F = force.copy();
				F.add( p5.Vector.sub( anchors[i], P[ hooks[i] ] ).mult(0.1) );
				P[ hooks[i] ].add( F );
				dsts[i].x = P[ hooks[i] ].x + O[i].x;
				dsts[i].y = P[ hooks[i] ].y + O[i].y;
				force.rotate( 0.02 );
				drag_fio( hooks[i] );
			}
			else if( p5.Vector.sub( anchors[i], P[ hooks[i] ] ).magSq() > 1 ){
				let F =  p5.Vector.sub( anchors[i], P[ hooks[i] ] ).mult(0.1);
				P[ hooks[i] ].add( F );
				dsts[i].x = P[ hooks[i] ].x + O[i].x;
				dsts[i].y = P[ hooks[i] ].y + O[i].y;
				drag_fio( hooks[i] );
			}
		}
	}

	clear();

	push();
	imageMode(CORNER);
	scale(Scl);
	image( bg, 0, 0 );
	pop();

	for( var i = 0; i < 7; ++i ){
		image( img, dsts[i].x, dsts[i].y, dsts[i].w, dsts[i].h,
					srcs[i].x, srcs[i].y, srcs[i].w, srcs[i].h );
	}


	
	stroke('#8a0d12');
	strokeWeight(7);
	for( var i = 1; i < P.length; ++i ){
		line( P[i].x, P[i].y, P[i-1].x, P[i-1].y );
	}
	stroke(255);
	strokeWeight(4);
	for( var i = 1; i < P.length; ++i ){
		line( P[i].x, P[i].y, P[i-1].x, P[i-1].y );
	}
	//fill(255);
	//for( var i = 1; i < P.length; ++i ){
	//	ellipse( P[i].x, P[i].y, 4 );
	//}
}


function mouseMoved() {
	for( var i = 0; i < 7; ++i ){
		if( coordinates_in_rct( mouseX, mouseY, dsts[i] ) ){
			contact_cabecas[i] += 2;
		}
	}
}

function mousePressed() {

}

function mouseDragged(){

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mouseReleased(){
	D = -1;

	if( first_click ){
		sound_fio = loadSound('data/01-fio-de-algodao-2.wav');
		sound_fio.playMode('sustain');
		sound_cabecas = Array(7);
		for (var i = 0; i < 7; i++) {
			sound_cabecas[i] = loadSound('data/'+(i+1)+'.wav');
			sound_cabecas[i].playMode('sustain');
		}
		first_click = 0;
	}
}