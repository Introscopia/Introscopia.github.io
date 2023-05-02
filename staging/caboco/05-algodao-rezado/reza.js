

function coordinates_in_rct( x, y, R ){
	return ( x > R.x && x < R.x + R.w ) && ( y > R.y && y < R.y + R.h );
}

var first_click = 1;
var veia_rezando;

var img;
var puff;

var rct;
var breathe = false;
var src;
var B;


class Bubble{

	constructor( x, y ){
		this.pos = createVector(x, y);
		this.vel = createVector( random(1,2.5), random(-0.75, 0.75 ) );
		this.rad = random(15,70);
		this.S = 0.32;
	}

	draw(){
		//g.ellipse( this.pos.x, this.pos.y, this.rad );
		push();
		translate(this.pos.x, this.pos.y);
		scale(this.S);
		image( puff, 0, 0 );
		pop();
		this.S += 0.002;
		this.pos.add( this.vel );
		this.vel.y -= 0.02;
	}
}


function preload() {
	img = loadImage('data/desenho--05.png');
	puff = loadImage('data/puff.png');
}

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth
	let h = document.getElementById('sketch-holder').clientHeight
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	frameRate(24);

	Scl = h / 682.0;
	
	rct = { x: 267 * Scl, y: 185 * Scl, w: 241 * Scl, h: 344 * Scl };
	src = createVector( 398, 322 ).mult(Scl);
	B = [];

	sg = createGraphics(w, h);
	//sg.blendMode(REPLACE);//REPLACE
	sg.noStroke();
	sg.fill( 200 );

	msk = createGraphics(w, h);
	msk.fill(255, 200);
	msk.noStroke();
	msk.rect(0,0,w,h);
}

function draw() {

	clear();

	push();
	imageMode(CORNER);
	scale(Scl);
	image( img, 0, 0 );
	pop();

	if( breathe ){
		let n = random(2,4);
		for (var i = 0; i < n; i++) {
			B.push( new Bubble( src.x, src.y ) );
		}
	}
	
	imageMode(CENTER);
	for (var i = B.length-1; i >= 0; i--){
		B[i].draw();
		if( B[i].pos.x > width+35 ){
			B.splice(i, 1);
		}
	}


	//var sgi = createImage(sg.width,sg.height);
	//sgi.copy(sg, 0, 0, sg.width, sg.height, 0, 0, sg.width, sg.height);
	//sgi.mask(msk);
	//image(sgi, 0, 0);
}


function mouseMoved() {
	if( coordinates_in_rct( mouseX, mouseY, rct ) ){
		breathe = true;
	}
	else breathe = false;
}

function mousePressed() {
	

}

function mouseDragged(){

}

function mouseReleased(){
	if( first_click ){
		veia_rezando = loadSound('data/01-veia-rezando-18.wav');
		veia_rezando.playMode('sustain');
		veia_rezando.play();
		first_click = 0;
	}
}