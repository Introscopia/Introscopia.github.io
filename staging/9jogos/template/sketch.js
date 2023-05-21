
function setup() {

	let w = document.getElementById('sketch-holder').clientWidth;
	let h = document.getElementById('sketch-holder').clientHeight;
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

}

function draw() {

	background(255, 255, 255);

	ellipse( mouseX, mouseY, 50 );
	
}

function mousePressed() {

}

function mouseDragged(){

}


function mouseReleased(){

}