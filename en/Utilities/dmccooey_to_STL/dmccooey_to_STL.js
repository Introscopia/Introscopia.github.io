var inp, out;

function setup() {
	//var canvas = createCanvas(900, 150);
	//canvas.parent('sketch-holder');
	inp = document.getElementById("inputer");
	out = document.getElementById("outputer");
}

//function draw() {
//	background('#ADD8D4');
//	text("Click anywhere to convert", 10, 10);
//	text( inp.value.length, 10, 100 );
//}

function convert(){
	out.value = "...";
	out.value = to_stl( inp.value );
}

function to_stl( inp ){
	let lines = split(inp, '\n');
	var out = "solid ";
	out += lines[0].replace( / /gi, '_' );
	out += '\n\n';

	var i = 2;
	var variables = {};
	while( i < lines.length && lines[i].length > 0 ){
		let tokens = splitTokens( lines[i], ' =' );
		var val = parseFloat(tokens[1]).toExponential();
		variables[ tokens[0] ] = { n : val };
		++i;
	}

	let verts_length = 0;
	++i;
	let verts_start = i;
	while( i < lines.length && lines[i].length > 0 ){
		++verts_length;
		++i;
	}
	
	var vertices = Array(verts_length);
	i = verts_start;
	var c = 0;
	while( c < verts_length ){
		//print( c );
		vertices[c] = "";
		var postparen = false;
		var minus = false;
		for (var j = 5; j < lines[i].length; j++) {
			let C = lines[i].charAt(j);
			if( postparen ){
				if( C == ' ' ) continue;
				else if( C == '-') minus = true;
				else if( C == 'C'){
					var coord = "";
					while( lines[i].charAt(j) != ',' && lines[i].charAt(j) != ')' && j < lines[i].length ){
						coord += lines[i].charAt(j);
						++j;
					}
					if( minus ) vertices[c] += '-';
					//print(coord);
					vertices[c] += variables[coord].n + ' ';
					minus = false;
				}
				else{
					let token = "";
					if( minus ) token += '-';
					while( lines[i].charAt(j) != ',' && j < lines[i].length ){
						token += lines[i].charAt(j);
						++j;
					}
					vertices[c] += parseFloat(token).toExponential();
					vertices[c] += ' ';
					minus = false;
		 		}
		 		continue;
		 	}
		 	if( C == '(' ) postparen = true;
		}
		++c;
		++i;
	}
	
	i += 2;

	while( i < lines.length ) {	
		let indices = splitTokens( lines[i], '{ ,}');
		
		if( indices.length == 3 ){
			out += "facet normal 0e+0 0e+0 0e+0\n\touter loop\n";
			for (var j = 0; j < 3; j++) {
				out += '\t\tvertex ' + vertices[ parseInt(indices[j]) ] + '\n';
			}
			out += '\tendloop\nendfacet\n\n';
		}
		else{
			for (var j = 0; j < indices.length-2; j++) {
				out += "facet normal 0e+0 0e+0 0e+0\n\touter loop\n";
				out += '\t\tvertex ' + vertices[ parseInt(indices[0]) ] + '\n';
				out += '\t\tvertex ' + vertices[ parseInt(indices[j+1]) ] + '\n';
				out += '\t\tvertex ' + vertices[ parseInt(indices[j+2]) ] + '\n';
				out += '\tendloop\nendfacet\n\n';
			}
		}
		++i;
	}

	return out;
}
