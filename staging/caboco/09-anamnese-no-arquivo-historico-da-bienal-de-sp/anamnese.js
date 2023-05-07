
var first_click = 1;

var sound = null;

var bg;
var bgx;
var Scl;

var eyes;
var ed;

var tet;

function preload() {
	bg = loadImage('data/desenho--09.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	Scl = h / 919.0;

	bgx = 0.5 * (width - (Scl * bg.width));

	eyes = Array(2);
	eyes[0] = { pos: createVector( 489.703, 491.228 ).mult(Scl), rad: Scl * 4 };
	eyes[1] = { pos: createVector( 515.706, 487.276 ).mult(Scl), rad: Scl * 4.2 };
	eyes[0].pos.x += bgx;
 	eyes[1].pos.x += bgx;
	ed = eyes[0].rad * 1.6;

	//console.log( p5.Vector.dist( v[0], v[1] ), p5.Vector.dist( v[2], v[3] ) );
	
	tet = 0;
}

function draw() {

	clear();

	let tx = 3.5 * cos(tet);
	let ty = 3.5 * sin(2*tet); 
	tet += 0.03;

	translate(tx, ty);

	push();
	imageMode(CORNER);
	translate( bgx, 0 );
	scale(Scl);
	image( bg, 0, 0 );
	pop();

	fill('#8a0d12');
	noStroke();
	let M = createVector( mouseX, mouseY );
	for (var i = 0; i < 2; i++) {
		let dif = p5.Vector.sub( M, eyes[i].pos );
		let m = map( dif.mag(), 0, width*0.45, 0, eyes[i].rad );
		dif.setMag( m );
		ellipse( eyes[i].pos.x + dif.x, eyes[i].pos.y + dif.y, ed );
	}
	

}


function mouseReleased(){

	if( first_click ){
		sound = loadSound('data/14.wav');
		sound.playMode('sustain');
		sound.play();
		first_click = 0;
	}
}