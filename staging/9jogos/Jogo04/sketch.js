
function coords_in_rct( x, y, R ){
	return ( x > R.x && x < R.x + R.w ) && ( y > R.y && y < R.y + R.h );
}

function shuffle_arr(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = int(random(i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function sup( total, parts ){
	console.log( "supping "+ total +" : "+ parts );
	let a = Array(parts);
	a[0] = int(random(1, 9))+1;
	let tote = a[0];
	for (var i = 1; i < parts-1; i++){
		let fresh = 0;
		do{
			let max = constrain( total-tote -(parts-i-1), 4, 9 );
			console.log("max: "+max );
			a[i] = int(random(1, max ));
			if( a[i] + tote >= total ) a[i] -= 1;
			if( a[i] < 1 ) return null;
			fresh = 1;
			for (var j = 0; j < i; j++){
				if( a[i] == a[j] ){
					fresh = 0;
					break;
				}
			}
		} while( !fresh );
		tote += a[i];
	}
	for (var j = 0; j < parts-1; j++){
		if( total-tote == a[j] ){
			return null;
		}
	}
	a[ parts-1 ] = total-tote;
	if( a[ parts-1 ] < 1 ) return null;
	return a;
}
function shuffled_unique_partitions( total, parts ){
	let a = [];
	do{
		a = sup( total, parts );
	} while( a == null );
	return a;
}

function star( N, x, y, r, t ){
	beginShape();
	let delta = TWO_PI / N;
	for (var i = 0; i < N; i++) {
		let a = i * delta -HALF_PI;
		vertex( x + r*cos(a), y + r*sin(a) );
		a += 0.5 * delta;
		vertex( x + (r*t)*cos(a), y + (r*t)*sin(a) );
	}
	endShape(CLOSE);
}

//let palette = [ '#cb3027', '#f9a31b', '#ffe116', '#73cc3b', '#20d6c7', '#285cc4', '#94408b' ];

function palette_fill( C ){
	switch( C ){
		case 0: fill( '#cb3027' ); break;
		case 1: fill( '#f9a31b' ); break;
		case 2: fill( '#ffe116' ); break;
		case 3: fill( '#73cc3b' ); break;
		case 4: fill( '#20d6c7' ); break;
		case 5: fill( '#285cc4' ); break;
		case 6: fill( '#94408b' ); break;
	}
}

function a_shape( S, x, y, r, C ){

	palette_fill( C );

	switch( S ){
		case 2:
			ellipse( x, y, r+r );
			break;
		case 3:
			r *= 1.22;
			y += (1/6.0)*r;
			triangle( x, y-r, x + (0.86602540378443 * r), y + 0.5 * r, x - (0.86602540378443 * r), y + 0.5 * r );
			break;
		case 4:
			r *= 0.9
			square( x-r, y-r, r+r );
			break;
		case 5:
			r *= 1.15;
			star( 5, x, y, r, 0.46 );
			break;
	}
}

function a_shapO( O ){
	a_shape( O.S, O.x, O.y, O.r, O.C );
}


var q_type;
var shapelist;
var question_str;
var draw_keyboard;
var kbr;
var castS, castC;
var ord;
var PONTOS;
var RESPOSTA;
var ULTIMA_CHANCE;


function setup() {

	let w = document.getElementById('sketch-holder').clientWidth;
	let h = document.getElementById('sketch-holder').clientHeight;
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	textSize(40);
	textAlign(  LEFT, TOP );

	PONTOS = 0;

	kbr = { x: width*0.85, y: height*0.7, w: width*0.13, h: height*0.28 };
	kbr.wo2 = kbr.w / 2.0;
	kbr.ho2 = kbr.h / 2.0;
	kbr.wo4 = kbr.w / 4.0;
	kbr.ho4 = kbr.h / 4.0;
	kbr.wo3 = kbr.w / 3.0;
	kbr.ho3 = kbr.h / 3.0;
	kbr.wo6 = kbr.w / 6.0;
	kbr.ho6 = kbr.h / 6.0;
	

	next_question();

}







function draw() {

	background(255, 255, 255);

	stroke(0);
	strokeWeight(5);
	for (var i = 0; i < shapelist.length; i++) {
		a_shapO( shapelist[i] );
	}
	
	fill(0);
	noStroke();
	textAlign(  LEFT, TOP );
	text( question_str, 10, 10 );

	if( PONTOS > 0 ){
		textAlign( RIGHT, TOP );
		stroke(255);
		text( ""+PONTOS, width -55, 19 );
		stroke(0);
		strokeWeight(2);
		a_shape( 5, width -35, 37, 15, 2 );
	}

	draw_keyboard();
	
}








function mouseReleased(){

	//console.log( mouseX, mouseY );
	//console.log( "l.push( { x: "+ (mouseX / width) + " * width, y:" + (mouseY / height) + " * height } );" );
	//shapelist.push( { S: int(random(2, 6)), x: mouseX, y: mouseY, r: 40, C: int(random(7)) } );

	if( coords_in_rct( mouseX, mouseY, kbr ) ){
		if( draw_keyboard == draw_num_keyboard ){
			let I = int((mouseX - kbr.x) / kbr.wo3);
			let J = int((mouseY - kbr.y) / kbr.ho3);
			if( I + (3*J) == RESPOSTA ){
				PONTOS += 1;
				next_question();
			}
		}
		else if( draw_keyboard == draw_shape_keyboard ){
			let I = int((mouseX - kbr.x) / kbr.wo2);
			let J = int((mouseY - kbr.y) / kbr.ho2);
			if( I + (2*J) == RESPOSTA ){
				PONTOS += 1;
				next_question();
			}
		}
	}
}


function field_coords() {
	let Q = int(random(6));

	let l = [];
	switch( Q ){
		case 0:{
			l.push( { x: 0.190 * width, y: 0.521 * height } );
			l.push( { x: 0.255 * width, y: 0.391 * height } );
			l.push( { x: 0.339 * width, y: 0.292 * height } );
			l.push( { x: 0.442 * width, y: 0.223 * height } );
			l.push( { x: 0.549 * width, y: 0.220 * height } );
			l.push( { x: 0.650 * width, y: 0.233 * height } );
			l.push( { x: 0.741 * width, y: 0.310 * height } );
			l.push( { x: 0.690 * width, y: 0.492 * height } );
			l.push( { x: 0.616 * width, y: 0.596 * height } );
			l.push( { x: 0.524 * width, y: 0.684 * height } );
			l.push( { x: 0.417 * width, y: 0.726 * height } );
			l.push( { x: 0.319 * width, y: 0.702 * height } );
			l.push( { x: 0.249 * width, y: 0.633 * height } );
			l.push( { x: 0.338 * width, y: 0.507 * height } );
			l.push( { x: 0.408 * width, y: 0.384 * height } );
			l.push( { x: 0.445 * width, y: 0.559 * height } );
			l.push( { x: 0.502 * width, y: 0.356 * height } );
			l.push( { x: 0.541 * width, y: 0.509 * height } );
			l.push( { x: 0.610 * width, y: 0.379 * height } );
		} break;

		case 1:{
			l.push( { x: 0.127 * width, y: 0.690 * height } );
			l.push( { x: 0.169 * width, y: 0.497 * height } );
			l.push( { x: 0.261 * width, y: 0.522 * height } );
			l.push( { x: 0.327 * width, y: 0.606 * height } );
			l.push( { x: 0.409 * width, y: 0.631 * height } );
			l.push( { x: 0.485 * width, y: 0.536 * height } );
			l.push( { x: 0.517 * width, y: 0.374 * height } );
			l.push( { x: 0.549 * width, y: 0.194 * height } );
			l.push( { x: 0.620 * width, y: 0.203 * height } );
			l.push( { x: 0.700 * width, y: 0.268 * height } );
			l.push( { x: 0.762 * width, y: 0.391 * height } );
			l.push( { x: 0.847 * width, y: 0.416 * height } );
			l.push( { x: 0.916 * width, y: 0.321 * height } );
			l.push( { x: 0.922 * width, y: 0.105 * height } );
			l.push( { x: 0.073 * width, y: 0.867 * height } );
		} break;

		case 2:{
			l.push( { x: 0.324 * width, y:0.347 * height } );
			l.push( { x: 0.418 * width, y:0.405 * height } );
			l.push( { x: 0.466 * width, y:0.260 * height } );
			l.push( { x: 0.533 * width, y:0.179 * height } );
			l.push( { x: 0.652 * width, y:0.233 * height } );
			l.push( { x: 0.727 * width, y:0.282 * height } );
			l.push( { x: 0.732 * width, y:0.499 * height } );
			l.push( { x: 0.687 * width, y:0.677 * height } );
			l.push( { x: 0.650 * width, y:0.452 * height } );
			l.push( { x: 0.556 * width, y:0.354 * height } );
			l.push( { x: 0.491 * width, y:0.524 * height } );
			l.push( { x: 0.583 * width, y:0.606 * height } );
			l.push( { x: 0.582 * width, y:0.813 * height } );
			l.push( { x: 0.492 * width, y:0.717 * height } );
			l.push( { x: 0.414 * width, y:0.613 * height } );
			l.push( { x: 0.323 * width, y:0.522 * height } );
			l.push( { x: 0.347 * width, y:0.722 * height } );
			l.push( { x: 0.423 * width, y:0.820 * height } );
			l.push( { x: 0.272 * width, y:0.680 * height } );
			l.push( { x: 0.243 * width, y:0.450 * height } );
		} break;

		case 3:{
			l.push( { x: 0.237 * width, y:0.309 * height } );
			l.push( { x: 0.238 * width, y:0.544 * height } );
			l.push( { x: 0.236 * width, y:0.769 * height } );
			l.push( { x: 0.343 * width, y:0.289 * height } );
			l.push( { x: 0.338 * width, y:0.534 * height } );
			l.push( { x: 0.336 * width, y:0.773 * height } );
			l.push( { x: 0.436 * width, y:0.277 * height } );
			l.push( { x: 0.436 * width, y:0.532 * height } );
			l.push( { x: 0.433 * width, y:0.774 * height } );
			l.push( { x: 0.536 * width, y:0.280 * height } );
			l.push( { x: 0.534 * width, y:0.544 * height } );
			l.push( { x: 0.531 * width, y:0.776 * height } );
			l.push( { x: 0.619 * width, y:0.268 * height } );
			l.push( { x: 0.619 * width, y:0.539 * height } );
			l.push( { x: 0.623 * width, y:0.778 * height } );
			l.push( { x: 0.713 * width, y:0.255 * height } );
			l.push( { x: 0.712 * width, y:0.549 * height } );
			l.push( { x: 0.710 * width, y:0.776 * height } );
		} break;

		case 4:{
			l.push( { x: 0.498 * width, y:0.168 * height } );
			l.push( { x: 0.582 * width, y:0.208 * height } );
			l.push( { x: 0.646 * width, y:0.299 * height } );
			l.push( { x: 0.665 * width, y:0.448 * height } );
			l.push( { x: 0.674 * width, y:0.625 * height } );
			l.push( { x: 0.649 * width, y:0.776 * height } );
			l.push( { x: 0.582 * width, y:0.870 * height } );
			l.push( { x: 0.508 * width, y:0.890 * height } );
			l.push( { x: 0.436 * width, y:0.863 * height } );
			l.push( { x: 0.378 * width, y:0.759 * height } );
			l.push( { x: 0.349 * width, y:0.578 * height } );
			l.push( { x: 0.354 * width, y:0.396 * height } );
			l.push( { x: 0.420 * width, y:0.240 * height } );
			l.push( { x: 0.510 * width, y:0.519 * height } );
		} break;

		case 5: {
			l.push( { x: 0.781 * width, y:0.478 * height } );
			l.push( { x: 0.213 * width, y:0.502 * height } );
			l.push( { x: 0.494 * width, y:0.178 * height } );
			l.push( { x: 0.498 * width, y:0.863 * height } );
			l.push( { x: 0.418 * width, y:0.779 * height } );
			l.push( { x: 0.353 * width, y:0.707 * height } );
			l.push( { x: 0.286 * width, y:0.625 * height } );
			l.push( { x: 0.292 * width, y:0.405 * height } );
			l.push( { x: 0.369 * width, y:0.315 * height } );
			l.push( { x: 0.431 * width, y:0.242 * height } );
			l.push( { x: 0.569 * width, y:0.248 * height } );
			l.push( { x: 0.642 * width, y:0.319 * height } );
			l.push( { x: 0.713 * width, y:0.398 * height } );
			l.push( { x: 0.577 * width, y:0.796 * height } );
			l.push( { x: 0.656 * width, y:0.694 * height } );
			l.push( { x: 0.720 * width, y:0.584 * height } );
			l.push( { x: 0.495 * width, y:0.499 * height } );
		} break;
	}
	return l;
}


function next_question(){
//           
	q_type = int(random(4));

	shapelist = [];
	//ULTIMA_CHANCE = false;

	castS = Array(4);
	for (var i = 0; i < 4; i++) castS[i] = i;
	castS = shuffle_arr( castS );
	castC = Array(7);
	for (var i = 0; i < 7; i++) castC[i] = i;
	castC = shuffle_arr( castC );

	switch( q_type ){

		case 0:{
			question_str = "Quantos       você vê?";
			RESPOSTA = int(random(2,9))+1;
			shapelist[0] = { S: int(random(2, 6)), x: 200, y: 30, r: 20, C: int(random(7)) };

			let P = field_coords();
			c = 0;
			for (var i = P.length - 1; i >= 0; i--) {
				var S, C;
				if( (c < RESPOSTA && int(random(P.length)) < RESPOSTA) || (RESPOSTA-c) > i ){
					S = shapelist[0].S;
					C = shapelist[0].C;
					c += 1;
				}
				else{
					do{
						S = int(random(2, 6));
						C = int(random(7));
					} while ( S == shapelist[0].S && C == shapelist[0].C );
				}
				shapelist.push( { S: S, x: P[i].x, y: P[i].y, r: 40, C: C } );
			}
			RESPOSTA -= 1;

			draw_keyboard = draw_num_keyboard;
			ord = false;
			} break;

		case 1:{
			let P = field_coords();
			RESPOSTA = int(random(4));
			let castN = shuffled_unique_partitions( P.length, 4 );
			console.log( P.length, castN );

			question_str = "Qual é a forma que aparece "+ castN[ RESPOSTA ] +" vezes?";
			
			
			for (var i = P.length - 1; i >= 0; i--) {
				var Q;
				do{
					Q = int(random(4));
				} while( castN[ Q ] <= 0 );
				castN[ Q ] -= 1;				
				shapelist.push( { S: castS[ Q ]+2, x: P[i].x, y: P[i].y, r: 40, C: castC[ Q ] } );
			}

			draw_keyboard = draw_shape_keyboard;
			ord = false;
			}break;

		case 2:{
			let pos = int(random(9))+1;
			question_str = "Qual é a forma na " + pos + "ª posição?";

			RESPOSTA = int(random(4));

			let n = int(random(9,12));
			let Y = height / 2;
			let dx = (0.8*width)/n;
			for (var i = 0; i < n; i++) {
				let Q = int(random(4));
				if( i == pos-1 ) Q = RESPOSTA;
				shapelist.push( { S: castS[ Q ]+2, x: (0.1*width)+(i*dx), y: Y, r: 40, C: castC[ Q ] } );
			}

			draw_keyboard = draw_shape_keyboard;
			ord = true;
			} break;

		case 3:{
			question_str = "Qual é a posição do        ?";
			RESPOSTA = int(random(9));
			let THE = int(random(4));
			shapelist[0] = { S: castS[ THE ]+2, x: 412, y: 30, r: 20, C: castC[ THE ] };


			let n = int(random(9,12));
			let Y = height / 2;
			let dx = (0.8*width)/n;
			for (var i = 0; i < n; i++) {
				var Q;
				if( i == RESPOSTA ) Q = THE;
				else{
					do{
						Q = int(random(4));
					} while( Q == THE );
				}
				shapelist.push( { S: castS[ Q ]+2, x: (0.1*width)+(i*dx), y: Y, r: 40, C: castC[ Q ] } );
			}

			draw_keyboard = draw_num_keyboard;
			ord = true;
			} break;
	}
}

function draw_num_keyboard(){
	textStyle(BOLD);
	textAlign( CENTER, CENTER );
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			let R = { x: kbr.x + i * kbr.wo3, y: kbr.y + j * kbr.ho3, w: kbr.wo3 -5, h: kbr.ho3 -5 };
			let X = kbr.x + i * kbr.wo3;
			let Y = kbr.y + j * kbr.ho3;
			fill(255);
			if( coords_in_rct( mouseX, mouseY, R ) ) stroke( '#73cc3b' );
			//else if( (i + (3*j) + 1) == RESPOSTA ) stroke( 0, 0, 255 );
			else stroke(0);
			strokeWeight(4);
			rect( R.x, R.y, R.w, R.h, 5, 5, 5, 5 );
			fill(0);
			noStroke();
			let str = (i + (3*j) + 1) + "";
			if( ord ) str += "ª";
			text( str, R.x + kbr.wo6 -3, R.y+ kbr.ho6 -2 );
		}
	}
	textStyle(NORMAL);
}

function draw_shape_keyboard(){
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 2; j++) {
			let R = { x: kbr.x + i * kbr.wo2, y: kbr.y + j * kbr.ho2, w: kbr.wo2 -5, h: kbr.ho2 -5 };
			fill(255);
			if( coords_in_rct( mouseX, mouseY, R ) ) stroke( '#73cc3b' );
			//else if( i+(2*j) == RESPOSTA ) stroke( 0, 0, 255 );
			else stroke(0);
			strokeWeight(4);
			rect( R.x, R.y, R.w, R.h, 5, 5, 5, 5 );
			stroke(0);
			let S = castS[i+(2*j)]+2;
			let C = castC[i+(2*j)];
			a_shape( S, R.x + kbr.wo4 -2.5, R.y + kbr.ho4 -2.5, kbr.wo4 * 0.5, C );
		}
	}
}