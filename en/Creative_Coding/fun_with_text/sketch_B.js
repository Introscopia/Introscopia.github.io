var sketch_B = function(p){

	var font;
	var str;
	var lmx, lx, ly, lz, lzi, off;
	var lg, lgd;
	var center;

	p.preload = function(){
		font = p.loadFont('Cutive-Regular.ttf');
	}

	function input_str(){
		var db = document.getElementById("strbox");
		str = db.value;

		lx = Array( str.length+1 );
		for (var i = 0; i <= str.length; i++){
			lx[i] = p.textWidth( str.substring(0, i) );
		}
		lmx = 0.5 * ( p.width - lx[str.length] );
		lg = Array( str.length );
		lgd = Array( str.length );
		lz = Array( str.length );
		lzi = Array( str.length );
		for (var i = 0; i < str.length; i++){
			let lw = p.textWidth( str[i] );
			lz[i] = 200;
			lzi[i] = 0;

			lg[i] = p.createGraphics( lw, 85 ); //0.730124 * (p.textAscent() + p.textDescent())
			lg[i].fill( 255 );
			lg[i].textAlign(p.LEFT, p.TOP);
			lg[i].textFont(font);
			lg[i].textSize( 75 );
			lg[i].text( str[i], 0, -24 );

			lgd[i] = p.createGraphics( lw, 85 ); //0.730124 * (p.textAscent() + p.textDescent())
			//lgd[i].background(127);
			lgd[i].fill( 80 );
			lgd[i].textAlign(p.LEFT, p.TOP);
			lgd[i].textFont(font);
			lgd[i].textSize( 75 );
			lgd[i].text( str[i], 0, -24 );
		}
		ly = 0.5 * ( p.height - 85 );

		center = p.createVector( p.width/2, p.height/2 + 20 );

		off = Array( str.length );
		for (var i = 0; i < str.length; i++){
			off[i] = p.createVector( lmx + lx[i], ly );
			off[i].sub( center );
			//console.log( off[i] );
		}
	}
	sketch_B.input_str = input_str;


	p.setup = function(){
		let w = document.getElementById('sketch-holder-B').clientWidth
		let h = document.getElementById('sketch-holder-B').clientHeight
		const canvas = p.createCanvas(w, h);
		canvas.parent('sketch-holder-B');

		p.textFont(font);
		p.textSize( 75 );

		input_str();
	}

	p.draw = function(){
		p.background("#0c0d0d");
		p.noFill();
		p.stroke(255);
		p.rect( 1, 1, p.width-2, p.height-2 );

		for (var i = 0; i < str.length; i++){
			lz[i] *= 0.93;
		}

		//p.fill( 255 );
		if( p.mouseY > ly && p.mouseY < ly+85 && 
			p.mouseX > lmx && p.mouseX < lmx + lx[str.length] ){
			for (var i = 0; i < str.length; i++){
				if( i < str.length-1 ){
					if( p.mouseX - lmx < lx[i+1] ){
						if( i > 0 ) lzi[i-1] += 1;
						lzi[i] += 2.5;
						lzi[i+1] += 1;
						break;
					}
				}
				else{
					lzi[str.length-2] += 1;
					lzi[str.length-1] += 2.5;
				}
			}
		}
		for (var i = 0; i < str.length; i++){
			lz[i] += lzi[i];
			lzi[i] *= 0.82;
		}

		if( p.mouseIsPressed && p.mouseY > 0 && p.mouseY < p.height && p.mouseX > 0 && p.mouseX < p.width ){
			for (var i = 0; i < str.length; i++){
				lzi[i] += 2;
			}
		}

		p.push();
		p.translate(center.x, center.y);
		//console.log('center:', center.x, center.y);
		for(var i = 0; i < str.length; i++){
			for(var j = 0; j < 20; j++){
				p.push();
				p.scale( p.constrain( p.map( j + lz[i], 0, 20, 0.999, 0.85 ), 0, 1) );
				p.image( lgd[i], off[i].x, off[i].y );
				p.pop();
			}
		}
		for(var i = 0; i < str.length; i++){
			p.push();
			p.scale( p.constrain( p.map( lz[i], 0, 20, 0.999, 0.85 ), 0, 1) );
			p.image( lg[i], off[i].x, off[i].y );
			p.pop();
		}
		p.pop();
	}
}
var sA = new p5(sketch_B);
