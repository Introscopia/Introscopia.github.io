
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

function square_number( n ){
	let s = int(sqrt(n));
	if( s*s == n ) return true;
	else return false;
}

function reduce_frac( F ){

	for (var i = 6; i >= 2; i--) {
		if( F.nom % i == 0 && F.den % i == 0 ){
			return { nom: F.nom / i, den: F.den / i };
		}
	}
	return { nom: F.nom, den: F.den };
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


let E; 
var hE;
var Gr, Gc;
var hGr, hGc;
var Gx, Gy;

var sqrt3o4;
var sqrt3o2;

var q_type;
var fraclist;
var question_str;
var inequality;
var draw_keyboard;
var kbr;
var castG, castC;
var PONTOS;
var RESPOSTA;


function setup() {

	let w = document.getElementById('sketch-holder').clientWidth;
	let h = document.getElementById('sketch-holder').clientHeight;
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	E = 40; 
	hE = E / 2;
	sqrt3o4 = sqrt(3)/4.0;
	sqrt3o2 = sqrt(3)/2.0;
	Gr = int(width/E);
	Gx = 0.5*(width - (Gr * E));
	Gc = int(height/E);
	Gy = 0.5*(height - (Gc * E));
	hGr = Gr / 2;
	hGc = Gc / 2;

	PONTOS = 0;

	next_question();
}

function draw() {

	background(255, 255, 255);

	stroke(210);
	strokeWeight(1);
	for (var i = 0; i <= Gr; i++) {
		let x = Gx + i * E;
		line( x, Gy, x, Gy+(Gc*E) );
	}
	for (var j = 0; j <= Gc; j++) {
		let y = Gy + j * E;
		line( Gx, y, Gx+(Gr*E), y );
	}

	stroke(0);
	strokeWeight(5);
	for (var i = 0; i < fraclist.length; i++) {
		draw_fracO( fraclist[i] );
	}

	fill(0);
	noStroke();
	textSize(40);
	textAlign(  LEFT, TOP );
	text( question_str, Gx, Gy );

	if( PONTOS > 0 ){
		textAlign( RIGHT, TOP );
		stroke(255);
		text( ""+PONTOS, width -55, 19 );
		stroke(0);
		strokeWeight(2);
		palette_fill( 2 );
		star( 5, width -35, 37, 17.25, 0.46 );
	}

	draw_keyboard();

	//let z = constrain( round( map( mouseX, 0, width/2, 0, 25 ) ), 0, 25);
	//draw_fraction( 0, z, 25, Gx + 3 * E,    Gy + 10 * E, E, 0 );
	//draw_fraction( 1, z, 25, Gx + 6 * E,    Gy +  8 * E, E, 2 );
	//draw_fraction( 2, z, 25, Gx + 11.5 * E, Gy +  8 * E, E, 4 );
}

function mousePressed() {

}

function mouseDragged(){

}

function mouseReleased(){

	if( draw_keyboard == VouF_keyboard ){
		let R = { x: kbr.x, y: kbr.y, w: kbr.w, h: kbr.h / 2 };
		if( coords_in_rct( mouseX, mouseY, R ) ){
			if( RESPOSTA == true ){
				PONTOS += 1;
				next_question();
			}
		}
		else{
			R.y += kbr.h / 2;
			if( coords_in_rct( mouseX, mouseY, R ) ){
				if( RESPOSTA == false ){
					PONTOS += 1;
					next_question();
				}
			}
		}
	}
	else if( draw_keyboard == pick_4_keyboard ){
		let I = constrain( round( (mouseX - Gx) / (Gr * E * 0.2)  ), 1, 4 )-1;
		if( I == RESPOSTA ){
			PONTOS += 1;
			next_question();
		}
	}
}



function next_question(){

	q_type = int(random(3));

	fraclist = [];
	//ULTIMA_CHANCE = false;

	castG = Array(4);
	for (var i = 0; i < 4; i++) castG[i] = i;
	castG = shuffle_arr( castG );
	castC = Array(7);
	for (var i = 0; i < 7; i++) castC[i] = i;
	castC = shuffle_arr( castC );

	let den_candidates = [ 3, 4, 4, 5, 6, 6, 7, 8, 8, 8, 9, 9, 9, 10, 12, 12, 12, 14, 15, 16, 16, 16, 20, 20, 24, 25, 25 ];

	switch( q_type ){

		case 0:{ // [] > [] (verdadeiro / falso)
			question_str = "";

			let rando = random(3);
			if( rando < 1 ){
				inequality = '>';
			}
			else if( rando < 2 ){
				inequality = '<';
			}
			else{
				inequality = '=';
				RESPOSTA = (random(3) < 2);
			}

			let ratio = Array(2);
			for (var i = 0; i < 2; i++) {
				fraclist.push( { G: int(random(3)), nom: 0, den: random(den_candidates), x: Gx + ((i+1) * 0.333 * Gr) * E, y: Gy + hGc * E, w: 6*E, C: castC[i] } );
				if( i == 1 && inequality == '=' && RESPOSTA == true ){
					let F = reduce_frac( fraclist[0] );
					fraclist[1].nom = F.nom; 
					fraclist[1].den = F.den;
					if( fraclist[1].nom == fraclist[0].nom ){
						fraclist[1].nom *= 2;
						fraclist[1].den *= 2;
					}
				}
				else{
				 fraclist[i].nom = int(random(1, fraclist[i].den ));
					if( fraclist[i].G == 2 && !square_number( fraclist[i].den ) ){
						fraclist[i].den = sq(round( sqrt(fraclist[i].den) ));
						if( fraclist[i].den == 1 ) fraclist[i].den = 9;
						if( fraclist[i].nom >= fraclist[i].den ){
							fraclist[i].nom = int(random(1, fraclist[i].den ));
						}
					}
				}
				ratio[i] = fraclist[i].nom / fraclist[i].den;
			}
			//console.log( ratio[0], ratio[1] );
			switch( inequality ){
				case '>':
					RESPOSTA = (ratio[0] > ratio[1]);
					break;
				case '<':
					RESPOSTA = (ratio[0] < ratio[1]);
					break;
				case '=':
					RESPOSTA = (ratio[0] == ratio[1]);
					break;
			}
			
			kbr = { x: Gx + 0.42 * Gr * E, y: Gy + 0.84 * Gc * E, w: 0.16 * Gr * E, h: 0.16 * Gc * E };
			draw_keyboard = VouF_keyboard;

		} break;

		case 1:{ // Qual figura descreve uma proporção de a/b?

			let ratio = Array(4);
			for (var i = 0; i < 4; i++) {
				fraclist.push( { G: int(random(3)), nom: 0, den: random(den_candidates), x: Gx + ((i+1) * 0.2 * Gr) * E, y: Gy + hGc * E, w: 4*E, C: castC[i] } );
				fraclist[i].nom = int(random(2, fraclist[i].den ));
				if( fraclist[i].G == 2 && !square_number( fraclist[i].den ) ){
					fraclist[i].den = sq(round( sqrt(fraclist[i].den) ));
					if( fraclist[i].den == 1 ) fraclist[i].den = 9;
					if( fraclist[i].nom >= fraclist[i].den ){
						fraclist[i].nom = int(random(1, fraclist[i].den ));
					}
				}
				ratio[i] = fraclist[i].nom / fraclist[i].den;
			}
			RESPOSTA = int(random(4));
			for (var i = 0; i < 4; i++) {
				if( i == RESPOSTA ) continue;
				//if( fraclist[ RESPOSTA ].nom == fraclist[ i ].nom &&
				//	  fraclist[ RESPOSTA ].den == fraclist[ i ].den ){
				if( ratio[ RESPOSTA ] == ratio[ i ] ){
					fraclist[ i ].nom += 1;
					if( fraclist[i].nom >= fraclist[i].den ){
						fraclist[ i ].nom -= 2;
					}
				}
			}
			let F = reduce_frac( fraclist[ RESPOSTA ] );
			question_str = "Qual figura descreve uma proporção de "+F.nom +"/"+ F.den+" ?";

			//kbr = { x: Gx + 0.42 * Gr * E, y: Gy + 0.84 * Gc * E, w: 0.16 * Gr * E, h: 0.16 * Gc * E };
			draw_keyboard = pick_4_keyboard;

		} break;

		case 2:{
			question_str = "Todas essas figura descrevem a mesma fração,\nexceto uma. Qual é a diferente?";
			let F = { den: random(den_candidates) };
			F.nom = int(random(2, F.den ));
			let RF = reduce_frac( F );
			let ratio = RF.nom / RF.den;
			var maxG = 2;
			if( square_number(RF.den) ) maxG = 3;
			RESPOSTA = int(random(4));

			for (var i = 0; i < 4; i++) {
				if( i == RESPOSTA ){
					fraclist.push( { G: int(random(3)), nom: 0, den: 0, x: Gx + ((i+1) * 0.2 * Gr) * E, y: Gy + hGc * E, w: 4*E, C: castC[i] } );
					var RESratio = 0;
					do{
						fraclist[i].den = random(den_candidates);
						fraclist[i].nom = int(random(2, fraclist[i].den ));
						if( fraclist[i].G == 2 && !square_number( fraclist[i].den ) ){
							fraclist[i].den = sq(round( sqrt(fraclist[i].den) ));
							if( fraclist[i].den == 1 ) fraclist[i].den = 9;
							if( fraclist[i].nom >= fraclist[i].den ){
								fraclist[i].nom = int(random(1, fraclist[i].den ));
							}
						}
						RESratio = fraclist[i].nom / fraclist[i].den;
					} while( RESratio == ratio );
				}
				else{
					fraclist.push( { G: int(random(maxG)), nom: F.nom, den: F.den, x: Gx + ((i+1) * 0.2 * Gr) * E, y: Gy + hGc * E, w: 4*E, C: castC[i] } );
					let rando = random(3);
					if( rando<1 ){
						fraclist[i].nom = RF.nom;
						fraclist[i].den = RF.den;
					}
					else if( rando<2 ){
						fraclist[i].nom *= 2;
						fraclist[i].den *= 2;
					}
					if( fraclist[i].G == 2 && !square_number( fraclist[i].den ) ) fraclist[i].G = int(random(2));
				}
			}

			draw_keyboard = pick_4_keyboard;
			
		} break;
	}
}


function VouF_keyboard(){

	push();
	fill(0);
	noStroke();
	textSize(100);
	textStyle(BOLD);
	textAlign( CENTER, CENTER );
	text( inequality,  Gx + hGr * E, Gy + hGc * E );
	pop();

	push();
	fill(255);
	strokeWeight(5);
	let R = { x: kbr.x, y: kbr.y, w: kbr.w, h: kbr.h / 2 };
	if( coords_in_rct( mouseX, mouseY, R ) ) stroke( '#73cc3b' );
	else stroke(0);
	rect( R.x, R.y, R.w, R.h-6, 5, 5, 5, 5 );
	R.y += kbr.h / 2;
	if( coords_in_rct( mouseX, mouseY, R ) ) stroke( '#73cc3b' );
	else stroke(0);
	rect( R.x, R.y, R.w, R.h-6, 5, 5, 5, 5 );
	pop();

	push();
	fill(0);
	noStroke();
	textSize(30);
	textAlign( CENTER, CENTER );
	text("Verdadeiro", Gx + hGr * E, kbr.y + 0.25*kbr.h );
	text("Falso", Gx + hGr * E, kbr.y + 0.75*kbr.h );
	pop();


}

function pick_4_keyboard(){

	let I = constrain( round( (mouseX - Gx) / (Gr * E * 0.2)  ), 1, 4 );
	let X = Gx + (I * 0.2 * Gr) * E;
	let Y = Gy + 0.75 * Gc * E + 5 * sin(frameCount * 0.125);
	stroke(0);
	strokeWeight(5);
	palette_fill( fraclist[I-1].C );
	triangle( X, Y, X+30, Y+25, X-30, Y+25 );
}


function draw_fracO( O ){
	draw_fraction( O.G, O.nom, O.den, O.x, O.y, O.w, O.C );
}

function draw_fraction( geometry, nom, den, x, y, w, C ){

	switch( geometry ){

		case 0:{ //PIE

			let r = w/2;
			fill(255);
			noStroke();
			ellipse( x, y, w );

			let a = TWO_PI / den;
			palette_fill(C);
			arc( x, y, w, w, -HALF_PI, (nom*a) -HALF_PI, PIE);

			stroke(127);
			strokeWeight(2);
			for (var i = 0; i < den; i++) {
				let t = i*a -HALF_PI;
				line( x, y, x + r*cos(t), y + r*sin(t) );
			}
			if( den % 4 == 0 && den > 8 ){
				strokeWeight(4);
				line( x-r, y, x+r, y );
				line( x, y-r, x, y+r );
			}

			noFill();
			stroke(0);
			strokeWeight(5);
			ellipse( x, y, w );

		} break; //PIE

		case 1:{ //BLOCKS

			let fac1 = ceil(sqrt(den));
			let fac2 = -1;

			if( den % fac1 == 0 ){
				fac2 = den / fac1;
				if( fac1 * fac2 != den ){
					fac1 = -1;
				}
			}
			else fac1 = -1;
			if( fac1 < 0 ){
				for (var i = 6; i >= 1; i--) {
					if( den % i == 0 ){
						fac1 = i;
						fac2 = den / i;
						break;
					}
				}
				if( fac1 < 0 ) return;
			}
			if( fac2 > fac1 ){
				let temp = fac2;
				fac2 = fac1;
				fac1 = temp;
			}

			let r = w / fac1;

			push();
			translate(-w/2, -(r*fac2*0.5) );

			stroke(127);
			strokeWeight(1);
			for (var j = 0; j < fac2; j++) {
				for (var i = 0; i < fac1; i++) {
					if( nom > 0 ) palette_fill(C);
					else fill(255);
					rect(x + i * r, y + j * r, r, r);
					nom -= 1;
				}
			}
			noFill();
			stroke(0);
			strokeWeight(5);
			rect( x, y, fac1*r, fac2*r );
			pop();

		} break; //BLOCKS

		case 2:{ // TRIANGLES

			if( !square_number(den) ) return;

			let L = int(sqrt(den));
			let r = (w/L);// * 1.15;

			fill(255);
			stroke(127);
			strokeWeight(3);
			let q =(sqrt3o4*r);
			let u =(sqrt3o2*r);
			let hr = r * 0.5;
			let Ww = 2*L-1;
			let p = 1;
			push();
			translate( x -(0.55*L*hr), y -(0.55*L*u) );
			strokeJoin(BEVEL);
			for(var j = 0; j < L; j+=1){
				let d = L-j-1;
				for(var i = d; i < Ww-d; i+=1){
					if( nom > 0 ) palette_fill( C );
					else fill(255);
					if(p > 0){
						triangle(((i-1)*hr), ((j+1)*u), ((i+1)*hr), ((j+1)*u), (i*hr), (j*u));
					}
					else{
						triangle(((i-1)*hr), (j*u), ((i+1)*hr), (j*u), (i*hr), ((j+1)*u));
					}
					nom -= 1;
					p *= -1;
				}
				p *= -1;
			}
			noFill();
			stroke(0);
			strokeWeight(5);
			triangle(-hr, (L*u), (Ww*hr), (L*u), (L-1)*hr, 0);
			pop();

		} break;

	}
}

/*
fill(255);
stroke(127);
strokeWeight(3);
let q =(sqrt3o4*r);
let u =(sqrt3o2*r);
let hr = r * 0.5;
let Ww = 4*r;
let Hh = 4*u;
let p = 1;
push();
translate(x,y);
strokeJoin(BEVEL);
for(var j = q; j < Hh; j+=u){
	//p *= -1;
	for(var i = hr; i < Ww; i+=hr){
		if(p > 0){
			triangle(i-hr, j+q, i+hr, j+q, i, j-q);
		}
		else{
			triangle(i-hr, j-q, i+hr, j-q, i, j+q);
		}
		p *= -1;
	}
}
pop();
*/