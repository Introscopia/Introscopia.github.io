var sketch_A = function(p){

	var font;
	var str;
	var lmx, lmy, lx, ly, lvy;
	var pQ, Qc;

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
		lmy = 0.5 * ( p.height - 85 );
		ly = Array( str.length );
		lvy = Array( str.length );
		for (var i = 0; i < str.length; i++){
			//let lw = p.textWidth( str[i] );
			ly[i] = lmy;
			lvy[i] = 0;
		}
	}
	sketch_A.input_str = input_str;

	p.setup = function(){
		let w = document.getElementById('sketch-holder-A').clientWidth
		let h = document.getElementById('sketch-holder-A').clientHeight
		const canvas = p.createCanvas(w, h);
		canvas.parent('sketch-holder-A');

		p.textFont(font);
		p.textSize( 75 );
		p.textAlign( p.LEFT, p.TOP );

		input_str();

		pQ = -1;
		Qc = 0;
	}

	p.draw = function(){
		p.background("#0c0d0d");
		p.noFill();
		p.stroke(255);
		p.rect( 1, 1, p.width-2, p.height-2 );

		if( p.mouseY > lmy && p.mouseY < lmy+85 && 
			p.mouseX > lmx && p.mouseX < lmx + lx[str.length] ){
			let Q = -1;
			for (var i = 0; i < str.length; i++){
				if( i < str.length-1 ){
					if( p.mouseX - lmx < lx[i+1] ){
						Q = i;	
						break;
					}
				} else{
					Q= str.length-1;
				}
			}
			if( Q >= 0 ){
				if( pQ == Q ){
					Qc++;
				}else{
					pQ = Q;
					Qc = 0;
				}
				if( Qc > 12 ){
					let edg = 0.6 * ( 1 - (2 * p.abs((Q / str.length)-0.5)) );
					if( p.mouseIsPressed ) lvy[Q] *= 1.4 + edg;
					else lvy[Q] *= 1.3 + edg;
				} else{
					let s = ( ly[Q] > lmy )? 1 : -1;
					lvy[Q] += s * p.map( p.abs(lmy - ly[Q]), 0, 40, 5, 0 );
					lvy[Q] += 0.05 * (ly[Q] + 42 - p.mouseY);
				}
			}
		}

		for (var i = 0; i < str.length -1; i++){
			let dy = p.abs( ly[i+1] - ly[i] );
			lvy[i  ] += 0.05 * ( ly[i+1] - ly[i  ] );
			lvy[i+1] += 0.05 * ( ly[i  ] - ly[i+1] );
		}
		for (var i = 0; i < str.length; i++){
			lvy[i] += 0.03 * ( lmy - ly[i] );
			ly[i] += lvy[i];
			lvy[i] *= p.map(p.abs(lvy[i]), 0, 25, 0.95, 0.5);
		}

		p.noStroke();
		p.fill(255);
		for(var i = 0; i < str.length; i++){
			p.text( str[i], lmx + lx[i], ly[i] );
		}
	}
}
var sA = new p5(sketch_A);
