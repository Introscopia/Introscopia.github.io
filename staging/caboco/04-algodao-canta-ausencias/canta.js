
var first_click = 1;
var voices;
var contact;

var img;
var src;
var A;
var V;
var O;
var td;
var Scl;



function preload() {
	img = loadImage('data/desenho.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 1380.0;

	src = Array(4);
	src[0] = { x: 251, y: 28, w: 210, h: 213 };
	src[1] = { x: 221, y: 324, w: 321, h: 236 };
	src[2] = { x: 195, y: 681, w: 303, h: 243 };
	src[3] = { x: 172, y: 1009, w: 396, h: 354 };
	A = Array(4);
	V = Array(4);
	O = Array(4);
	td = Array(4);
	contact = Array(4);		
	for (var i = 0; i < 4; i++) {
		O[i] = createVector( 0.5 * src[i].w, 0.5 * src[i].h ).mult(Scl);
		V[i] = createVector( (Scl * src[i].x) + O[i].x,
							 (Scl * src[i].y) + O[i].y );
		A[i] = V[i].copy();
		td[i] = { w: Scl * src[i].w, h: Scl * src[i].h };
		contact[i] = 0;
	}
}

function draw() {

	if( mouseX == pmouseX && mouseY == pmouseY ){
		let M = createVector( mouseX, mouseY );
		for (var i = 0; i < 4; i++) {
			let d = p5.Vector.dist( V[i], M );
			if( d < td[i].w * 0.5 ){
				contact[i] += 1;
				break;
			}
		}
	}


	for( var i = 0; i < 4; ++i ){
		if( contact[i] > 0 ){
			if( !(voices[i].isPlaying()) ) voices[i].play();
			if( contact[i] > 45 ) contact[i] = 45;
			contact[i] -= 1;
			if( contact[i] <= 0 ) voices[i].stop();
		}
	}

	clear();

	for (var i = 0; i < 4; i++) {

		let spring = p5.Vector.sub( A[i], V[i] ).mult(0.05);
		V[i].add( spring );

		image( img, V[i].x - O[i].x, V[i].y - O[i].y, td[i].w, td[i].h, 
								src[i].x, src[i].y, src[i].w, src[i].h );
	}

}


function mouseMoved() {
	let M = createVector( mouseX, mouseY );
	for (var i = 0; i < 4; i++) {
		let d = p5.Vector.dist( V[i], M );
		if( d < td[i].w * 0.5 ){
			V[i].x += 0.12 * movedX;
			V[i].y += 0.12 * movedY;
			contact[i] += 2;
		}
	}
}

function mousePressed() {
	

}

function mouseDragged(){

}

function mouseReleased(){
	if( first_click ){
		voices = Array(4);
		for (var i = 0; i < 4; i++) {
			voices[i] = loadSound('data/'+(i+1)+'.wav');
			voices[i].playMode('sustain');
		}
		first_click = 0;
	}
}