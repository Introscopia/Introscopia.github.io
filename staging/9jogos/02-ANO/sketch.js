
var E;
var Gr, Gc;
var Gx, Gy;

function setup() {

	let w = document.getElementById('sketch-holder').clientWidth;
	let h = document.getElementById('sketch-holder').clientHeight;
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	E = 40;
	Gr = int(width/E);
	Gx = 0.5*(width - (Gr * E));
	Gc = int(height/E);
	Gy = 0.5*(height - (Gc * E));

}

function draw() {

	background(255, 255, 255);

	stroke(127);
	for (var i = 0; i <= Gr; i++) {
		let x = Gx + i * E;
		line( x, Gy, x, Gy+(Gc*E) );
	}
	for (var j = 0; j <= Gc; j++) {
		let y = Gy + j * E;
		line( Gx, y, Gx+(Gr*E), y );
	}
}

function mousePressed() {

}

function mouseDragged(){

}


function mouseReleased(){

}