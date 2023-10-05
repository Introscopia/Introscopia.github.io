var sketch_C = function(p){

	var font;
	var str;
	var ssrc; //source rect
	var sV; //stalk vertices
	var slen; //stalk piece length
	var sO; //offset
	var std; //transformed dimensions
	var lg;
	var center;
	var see_stalk = false;

	function propagate( adj, vec, l ){
		let dx = adj.x - vec.x;
		let dy = adj.y - vec.y;
		let angle = p.atan2(dy, dx);
		vec.x = adj.x - p.cos(angle) * l;
		vec.y = adj.y - p.sin(angle) * l;
	}

	p.preload = function(){
		font = p.loadFont('Cutive-Regular.ttf');
	}

	function input_str(){
		var db = document.getElementById("strbox");
		str = db.value;

		ly = 0.5 * ( p.height - 85 );
		lx = Array( str.length+1 );
		for (var i = 0; i <= str.length; i++){
			lx[i] = p.textWidth( str.substring(0, i) );
		}
		lmx = 0.5 * ( p.width - lx[str.length] );
		  lg = Array( str.length );
		  sV = Array( str.length );
		slen = Array( str.length );
		  sO = Array( str.length );
		slen = 8;
		for (var i = 0; i < str.length; i++){
			let lw = p.textWidth( str[i] );

			lg[i] = p.createGraphics( lw, 85 ); //0.730124 * (p.textAscent() + p.textDescent())
			lg[i].fill( 255 );
			lg[i].textAlign(p.LEFT, p.TOP);
			lg[i].textFont(font);
			lg[i].textSize( 75 );
			lg[i].text( str[i], 0, -24 );

			sV[i] = Array(6);
			for (var j = sV[i].length - 1; j >= 0; j--) {
				sV[i][j] = p.createVector( lmx + lx[i] + 0.5*lw, ly + 85 + (sV[i].length -1 -j)*slen );
			}
			sO[i] = p.createVector( 0.5 * lw,  85 );
		}
		

		center = p.createVector( p.width/2, p.height/2 + 20 );

		off = Array( str.length );
		for (var i = 0; i < str.length; i++){
			off[i] = p.createVector( lmx + lx[i], ly );
			off[i].sub( center );
			//console.log( off[i] );
		}
	}
	sketch_C.input_str = input_str;


	p.setup = function(){
		let w = document.getElementById('sketch-holder-C').clientWidth
		let h = document.getElementById('sketch-holder-C').clientHeight
		const canvas = p.createCanvas(w, h);
		canvas.parent('sketch-holder-C');

		p.textFont(font);
		p.textSize( 75 );

		input_str();
	}

	p.draw = function(){
		p.background("#0c0d0d");
		p.noFill();
		p.stroke(255);
		p.rect( 1, 1, p.width-2, p.height-2 );

		let cursor = p.createVector( p.mouseX, p.mouseY ); 
		let force = p.createVector( p.movedX, p.movedY ).mult(0.02);

		for(var i = 0; i < str.length; i++){
			let dist = p5.Vector.dist( cursor, sV[i][sV[i].length-1] );
			let F = p5.Vector.mult( force, p.constrain(p.map(dist, 0, 160, 5, 0), 0, 5) );
			for (var j = sV[i].length - 1; j > 0; j--){
				sV[i][sV[i].length-1].add( F );
				F.mult(0.75);
			}
			sV[i][sV[i].length-1].y -= slen * 0.04;//the "up" force
			for (var j = sV[i].length - 1; j > 1; j--) {
				propagate( sV[i][j], sV[i][j-1], slen );
			}
			for (var j = 0; j < sV[i].length-1; j++) {
				propagate( sV[i][j], sV[i][j+1], slen );
			}

			p.push();
			p.translate( sV[i][sV[i].length-1].x, sV[i][sV[i].length-1].y );
			p.rotate( p.atan2( sV[i][sV[i].length-2].y - sV[i][sV[i].length-1].y, 
						       sV[i][sV[i].length-2].x - sV[i][sV[i].length-1].x) - p.HALF_PI );

			p.image( lg[i], -sO[i].x, -sO[i].y );
			p.pop();

			if( see_stalk ){
				p.stroke(255,127);
				for (var j = 0; j < sV[i].length-1; j++) {
					p.line( sV[i][j].x, sV[i][j].y, sV[i][j+1].x, sV[i][j+1].y );
				}
			}
		}
	}
}
var sA = new p5(sketch_C);
