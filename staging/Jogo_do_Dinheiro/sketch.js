

var food;
var food_src = { x: 5, y: 4, w: 24, h: 24 };
var food_dst;
var food_names = ["Maçã",     "Banana",   "Cereja",  "Uva",    "Laranja",
				  "Melancia", "Morango",  "Kiwi",    "Limão",  "Pera",
				  "Batata",   "Cenoura",  "Abobora", "Tomate", "Berinjela",
				  "Carne",    "Linguiça", "Peixe",   "Ovo",    "Queijo" ];
var money;
var money_src = [ {x: 291, y: 0, w: 80, h: 78, l: 5},
				  {x: 0, y: 6, w: 289, h: 156, l: 37 },
				  {x: 0, y: 175, w: 304, h: 155, l: 35 },
				  {x: 0, y: 342, w: 319, h: 154, l: 56 },
				  {x: 0, y: 511, w: 339, h: 155, l: 66 },
				  {x: 0, y: 674, w: 356, h: 166, l: 65 },
				  {x: 0, y: 840, w: 371, h: 168, l: 82 } ];

//                0  1  2  3   4   5   6
var money_val = [ 1, 2, 5, 10, 20, 50, 100 ];


var BILL, BILL_current;
var CARDS;
var WALLET;
var FRIDGE;
var ON_HAND;

var fridgebox;// fridgebox.w, fridgebox.x, fridgebox.cols, fridgebox.y;
var Cx, Cy, Cw, Ch, Cm;
var walletbox;// walletbox.y, walletbox.h;
var waldst;
var billbox;
var Z;

var font;

function preload(){
	food = loadImage("Assets/food.png");
	money = loadImage("Assets/money.png");
	font = loadFont("Assets/MouseMemoirs-Regular.ttf");
}



function setup() {

	let w = document.getElementById('sketch-holder').clientWidth;
	let h = document.getElementById('sketch-holder').clientHeight;
	var canvas = createCanvas(w, h);
	canvas.parent('sketch-holder');

	fridgebox = { x: 8, y: 0, w: 0, h: 0 };
	fridgebox.w = 0.13 * width;
	fridgebox.cols = round( fridgebox.w / 50.0 );
	fridgebox.w = (fridgebox.cols*50)+16;
	//fridgebox.x = 0.5*(fridgebox.w - (fridgebox.cols*48));
	walletbox = { x: 0, y: 0, w: 0, h: 0 };
	walletbox.y = 0.78 * height;
	walletbox.h = height - walletbox.y;
	Cx = fridgebox.w + 3;
	Cy = 3;
	Cw = 0.2 * (width - fridgebox.w -6);
	Ch = 0.25 * (walletbox.y -6);
	Cm = 0.05 * Cw;
	food_dst = { x: Cw-48-Cm, y: Ch-Cm-48, w: 48, h: 48 };
	Z = (height - (Cy + 4*Ch) - 4) / money_src[6].h;

	textFont(font);
	textSize(Ch * 0.24);
	let frtbox = font.textBounds("Minha Geladeira:", 8, 8, Ch * 0.24 );
	fridgebox.y = 24 + frtbox.h;
	fridgebox.w -= 16;
	fridgebox.h = 4 * Ch - fridgebox.y - textLeading();
	walletbox.w = Cx + 4*Cw;
	billbox = { x: Cx + 4*Cw, y: Cy + 4*Ch, w: Cw-4, h: Ch-4 };

	WALLET = [ 3, 1 ,0,0,0 ];
	//WALLET = [];
	//for (var i = 0; i < 80; i++) {
	//	WALLET.push( int(random(1,7)) );
	//}
	position_money_in_wallet();
	//FRIDGE = [ int(random(20)) ];
	FRIDGE = [];
	for (var i = 0; i < 3; i++) {
		FRIDGE.push( int(random(20)) );
	}
	//FRIDGE.sort();

	ON_HAND = [];

	BILL = 50;
	build_level();

}

function draw() {

	background(255, 255, 255);

	for (var i = 0; i < CARDS.length; i++) {
		draw_card( CARDS[i], Cx + (i%5)*Cw, Cy + int(i/5)*Ch );
	}

	textFont(font);
	textSize(Ch * 0.24);

	fill(0); noStroke();
	textAlign( LEFT, TOP );
	text( "Minha Geladeira:", 8, 8 );
	noSmooth();
	stroke(0); noFill();
	rect( fridgebox.x-2, fridgebox.y-2, fridgebox.w+2, fridgebox.h+2, 3, 3, 3, 3 );
	for (var i = 0; i < FRIDGE.length; i++) {
		image( food, fridgebox.x + (i % fridgebox.cols )*50, fridgebox.y + int(i / fridgebox.cols )*50, 48, 48,
			   (FRIDGE[i] % food_src.x) * food_src.w, int(FRIDGE[i] / food_src.x) * food_src.h, food_src.w, food_src.h );
	}
	smooth();

	fill(240); stroke(0);
	strokeWeight(3);
	rect( billbox.x, billbox.y, billbox.w, billbox.h );
	fill(0); noStroke();
	textAlign( LEFT, TOP );
	text( "Contas a pagar:", billbox.x + Cm, billbox.y + Cm/2 );
	textFont('arial');
	textAlign( LEFT, BOTTOM );
	textSize(Ch * 0.18);
	text( "R$"+BILL_current, billbox.x + Cm, Cy + 5*Ch -Cm );

	fill(255);noStroke();//fridge clip bottom
	rect( 0, Cy + 4*Ch - textLeading(), fridgebox.w, 1000 );

	fill(0); noStroke();
	textFont(font);
	textSize(Ch * 0.24);
	textAlign( LEFT, BOTTOM );
	text( "Minha Carteira:", 8, Cy + 4*Ch );
	noFill(); stroke(0);
	strokeWeight(1);
	for (var i = WALLET.length - 1; i >= 0; i--) {
		image( money, waldst[i].x, waldst[i].y, waldst[i].w, waldst[i].h,
			   money_src[WALLET[i]].x, money_src[WALLET[i]].y,
			   money_src[WALLET[i]].w, money_src[WALLET[i]].h );
		if( WALLET[i] > 0 ){
			rect( waldst[i].x, waldst[i].y, waldst[i].w, waldst[i].h );
		}
	}

	//noFill(); stroke(0);
	//rect(walletbox.x, walletbox.y, walletbox.w, walletbox.h);

	let ci = 0;
	let bi = 0;
	for (var i = 0; i < ON_HAND.length; i++) {
		if( ON_HAND[i].t == 'f' ){
			noSmooth();
			image( food, mouseX + i * 20, mouseY -50, 48, 48,
			   	   (ON_HAND[i].id % food_src.x) * food_src.w, int(ON_HAND[i].id / food_src.x) * food_src.h, food_src.w, food_src.h );
			smooth();
		}
		else if( ON_HAND[i].t == 'm' ){
			if( WALLET[ ON_HAND[i].id ] == 0 ){
				waldst[ ON_HAND[i].id ].x = mouseX - waldst[ ON_HAND[i].id ].w;
				waldst[ ON_HAND[i].id ].y = mouseY + ci * waldst[ ON_HAND[i].id ].h;
				ci += 1;
			}else{
				waldst[ ON_HAND[i].id ].x = mouseX + bi * 5;
				waldst[ ON_HAND[i].id ].y = mouseY + bi * 5;
				bi += 1;
			}
		}
	}

}




function build_level(){

	BILL *= 2;
	BILL_current = BILL;

	CARDS = [];

	let fooddeck = Array(20);
	for (var i = 0; i < 20; i++) fooddeck[i] = i;
	fooddeck = shuffle_arr( fooddeck );
	let Fi = 0;//food index

	let co = [ 1, 1, 1, 1, 2, 2, 2, 3 ];

	while( CARDS.length < 20 ){

		let sellers = random(co);
		let buyers = random(co);
		let duds = constrain( round(random(-3, 2)), 0, 2);
		let T = sellers+buyers+duds;
		//console.log( CARDS.length, T, sellers, buyers, duds );
		if( CARDS.length + T == 19 ){
			if( duds == 0 ) duds = 1;
			else sellers += 1;
			T+=1;
		}
		if( CARDS.length + T > 20 ){
			let m = (CARDS.length + T) - 20;
			m -= duds;
			duds = 0;
			if( m > 0 ){
				if( m < buyers ){
					buyers -= m;
				}
				else{
					m -= (buyers-1);
					buyers = 1;
					if( m < sellers ){
						sellers -= m;
					}
					else{
						sellers = 1;
						//console.log("fuck?");
					}
				}
			}
			T = sellers+buyers+duds;
			if( CARDS.length + T == 19 ){
				if( duds == 0 ) duds = 1;
				else sellers += 1;
			}
		}

		let min_profit = BILL * (T / 20.0);
		let quants = Array(sellers);
		let vol = 0;
		for (var i = 0; i < sellers; i++){
			quants[i] = int(random(1,13));
			vol += quants[i];
		}
		let avgval = round((min_profit / vol) / 0.3);// 0.3 is a little less than the avg profit rate.

		let cost = 0;
		for (var i = 0; i < sellers; i++){
			CARDS.push( { act: 'S', id: fooddeck[Fi], Q: quants[i], V: round(random(0.6,0.99)*avgval), credit: 0 } );
			cost += CARDS[CARDS.length-1].Q * CARDS[CARDS.length-1].V;
		}
		let revenue = 0;
		for (var i = 0; i < buyers; i++){
			let q = 0;
			if( i < buyers-1 ) q = int(random(vol-buyers+i+1))+1;
			else q = round(random(1.0,1.2) * vol);
			CARDS.push( { act: 'B', id: fooddeck[Fi], Q: q, V: round(random(1.01,1.4)*avgval), credit: 0 } );
			vol -= q;
			revenue += q * CARDS[CARDS.length-1].V;
		}
		let profit = revenue - cost;
		let balance = 0;
		for (var i = 0; i < WALLET.length; i++) {
			balance += money_val[WALLET[i]];
		}
		for (var i = 0; i < FRIDGE.length; i++) {
			let val = 0;
			for (var j = 0; j < CARDS.length; j++) {
				if( CARDS[j].act == 'B' && CARDS[j].id == FRIDGE[i] ){
					if( CARDS[j].V > val ) val = CARDS[j];
				}
			}
			balance += val;
		}
		if( profit + balance < BILL ){

			let deficit = BILL - (profit + balance);

			do{
				let c = int(random(CARDS.length));
				if( CARDS[c].act == 'B' ){
					CARDS[c].V += 1;
					deficit -= CARDS[c].Q;
				}
				else if( CARDS[c].act == 'S' ){
					if( CARDS[c].V > 1 ){
						CARDS[c].V -= 1;
						deficit -= CARDS[c].Q;
					}
				}
			} while( deficit > 0 );
		}

		for (var i = 0; i < duds; i++){
			CARDS.push( { act: 'B', id: fooddeck[Fi], Q: int(random(1,13)), V: round(random(0.60,0.99)*avgval), credit: 0 } );
		}
		Fi += 1;
	}

	CARDS = shuffle_arr( CARDS );
}

function draw_card( C, x, y ){

	if( C == null) return;

	let rct = { x: x, y: y, w: Cw-4, h: Ch-4 };
	fill(240); 
	strokeWeight(3);
	if( coords_in_rct(mouseX, mouseY, rct) ) stroke(80);
	else stroke(0);
	rect( rct.x, rct.y, rct.w, rct.h, 5, 5, 5, 5 );
	textFont(font);
	textAlign( LEFT, TOP );
	textSize(Ch * 0.3);
	fill(0); noStroke();
		 if( C.act == 'S' ) text( "VENDE-SE:", x+Cm, y + Cm/2 );
	else if( C.act == 'B' ) text( "COMPRA-SE:", x+Cm, y + Cm/2 );
	noSmooth();
	image( food, x+food_dst.x, y+food_dst.y, food_dst.w, food_dst.h, 
		   (C.id % food_src.x) * food_src.w, int(C.id / food_src.x) * food_src.h, food_src.w, food_src.h );
	smooth();
	textFont('arial');
	textAlign( LEFT, BOTTOM );
	textSize(Ch * 0.18);
	text( food_names[ C.id ] + " ("+ C.Q +")\nR$" + C.V + " cada", x+Cm, y+Ch-Cm );

	if( C.act == 'S' && C.credit > 0 ){
		fill( '#73cc3b' );
		textSize(Ch * 0.12);
		textAlign( RIGHT, TOP );
		text( "credito:\nR$"+C.credit, x + Cw - Cm, y + Cm );
	}
}

function position_money_in_wallet(){

	WALLET.sort().reverse();

	waldst = Array( WALLET.length );

	let mw = 0;
	for (var i = 0; i < WALLET.length; i++) {
		mw += Z * money_src[WALLET[i]].w;
	}
	if( mw < walletbox.w ){
		//console.log("wide fit");
		let mx = 4;
		for (var i = 0; i < WALLET.length; i++) {
			let W = WALLET[i];
			waldst[i] = { x: mx, y: Cy+4*Ch, w: Z * money_src[W].w, h: Z * money_src[W].h };
			mx += waldst[i].w;
		}
	}
	else{
		let lw = 0;
		for (var i = 0; i < WALLET.length; i++) {
			lw += Z * money_src[WALLET[i]].l;
		}
		if( lw < walletbox.w ){
			//console.log("scrunch fit");
			let slack = (walletbox.w - lw) / WALLET.length;
			let mx = Z * (- money_src[WALLET[0]].w + money_src[WALLET[0]].l) + slack;
			for (var i = 0; i < WALLET.length; i++){
				let W = WALLET[i];
				waldst[i] = { x: mx, y: Cy+4*Ch, w: Z * money_src[W].w, h: Z * money_src[W].h };
				mx += Z * money_src[W].l + slack;
			}
		}
		else{
			//console.log("scruch rows");
			let jumps = [];
			let mx = Z * (- money_src[WALLET[0]].w + money_src[WALLET[0]].l);
			let my = Cy+4*Ch;
			for (var i = 0; i < WALLET.length; i++) {
				let W = WALLET[i];
				if( mx + (Z * money_src[W].w) > walletbox.w ){
					mx = Z * (- money_src[W].w + money_src[W].l);
					my += Z * 52;
					jumps.push(i);					
				}
				waldst[i] = { x: mx, y: my, w: Z * money_src[W].w, h: Z * money_src[W].h };
				mx += Z * money_src[W].l;
			}
			let nJ = 0;
			for (var i = jumps.length; i >= 0 ; i--) {
				let J = jumps[i] + nJ;
				let rest = WALLET.splice( J, WALLET.length - J );
				rest.reverse();
				for (var j = 0; j < rest.length; j++) {
					WALLET.splice( nJ, 0, rest[j] );
				}
				rest = waldst.splice( J, waldst.length-J );
				rest.reverse();
				for (var j = 0; j < rest.length; j++) {
					waldst.splice( nJ, 0, rest[j] );
				}
				nJ += rest.length;
			}
		}
	}

	
}



function mousePressed() {

	if( coords_in_rct(mouseX, mouseY, fridgebox) ){
		let I = int((mouseX - fridgebox.x) / 50);
		let J = int((mouseY - fridgebox.y) / 50);
		let O = I + (fridgebox.cols * J);
		if( O < FRIDGE.length ){
			ON_HAND.push( { t:'f', id: FRIDGE.splice( O, 1 ) } );
		}
		else if( ON_HAND.length > 0 ){
			for (var i = ON_HAND.length-1; i >= 0; i--) {
				if( ON_HAND[i].t == 'f' ){
					FRIDGE.push( ON_HAND[i].id );
					ON_HAND.splice(i, 1);
				}
			}
		}
	}
	else if( coords_in_rct(mouseX, mouseY, walletbox) ){
		let gotone = false;
		for (var i = 0; i < waldst.length; i++) {
			if( coords_in_rct(mouseX, mouseY, waldst[i]) ){
				ON_HAND.push( { t:'m', id: i } );
				waldst[i].w *= 0.3;
				waldst[i].h *= 0.3;
				gotone = true;
				break;
			}
		}
		if( !gotone && ON_HAND.length > 0 ){
			let there_was = false;
			for (var i = ON_HAND.length-1; i >= 0; i--) {
				if( ON_HAND[i].t == 'm' ){
					there_was = true;
					ON_HAND.splice(i, 1);
				}
			}
			if( there_was ) position_money_in_wallet();
		}
	}
	else{
		let I = int((mouseX - Cx) / Cw);
		let J = int((mouseY - Cy) / Ch);
		let O = I + (5 * J);
		if( O >= 0 && O < 20 && CARDS[O] != null ){
			if( ON_HAND.length > 0 ){
				if( CARDS[O].act == 'S' ){//CARD IS SELLING, I AM BUYING FOOD
					let MO = 0;
					let rem = [];
					for (var i = ON_HAND.length-1; i >= 0; i--){
						if( ON_HAND[i].t == 'm' ){
							MO += money_val[ WALLET[ ON_HAND[i].id ] ];
							rem.push( ON_HAND[i].id );
							ON_HAND.splice( i, 1 );
						}
					}
					rem.sort();
					for (var i = rem.length - 1; i >= 0; i--){
						WALLET.splice( rem[i], 1 ); 
						waldst.splice( rem[i], 1 ); 
					}
					if( MO > 0 ){
						let n = (MO + CARDS[O].credit) / CARDS[O].V;
						console.log( "I am buying "+n+"/"+CARDS[O].Q+", "+MO+", "+CARDS[O].credit+", "+CARDS[O].V );
						if( n >= 1 ){
							let ni = constrain( int(n), 1, CARDS[O].Q );
							MO += CARDS[O].credit;
							CARDS[O].credit = 0;
							MO -= ni * CARDS[O].V;
							for (var i = 0; i < ni; i++) {
								ON_HAND.push( {t: 'f', id: CARDS[O].id} );
							}
							CARDS[O].Q -= ni;
							if( CARDS[O].Q <= 0 ){
								CARDS[O] = null;
							}
							if( MO > 0 ){
								let change = billify( MO );
								for (var i = 0; i < change.length; i++) {
									WALLET.push( change[i] );
									waldst.push( { x: mouseX, y: mouseY, 
												   w: 0.3 * Z * money_src[ change[i] ].w, 
												   h: 0.3 * Z * money_src[ change[i] ].h } );
									ON_HAND.push( {t:'m', id: WALLET.length-1} );
								}
							}
						}
						else{
							CARDS[O].credit += MO;
						}
					}
				}
				else if( CARDS[O].act == 'B' ){//CARD IS BUYING FOOD, I AM SELLING
					let FO = 0;
					for (var i = ON_HAND.length-1; i >= 0; i--) {
						if( ON_HAND[i].t == 'f' &&CARDS[O].id == ON_HAND[i].id ){
							FO += 1;
						}
					}	
					if( FO > 0 ){
						if( FO > CARDS[O].Q ) FO = CARDS[O].Q;
						CARDS[O].Q -= FO;
						let payment = billify( FO * CARDS[O].V );
						for (var j = 0; j < payment.length; j++) {
							WALLET.push( payment[j] );
							waldst.push( { x: mouseX, y: mouseY, 
										   w: 0.3 * Z * money_src[ payment[j] ].w, 
										   h: 0.3 * Z * money_src[ payment[j] ].h } );
							ON_HAND.push( {t:'m', id: WALLET.length-1} );
						}	
						for (var i = ON_HAND.length-1; i >= 0; i--) {
							if( ON_HAND[i].t == 'f' && CARDS[O].id == ON_HAND[i].id ){
								ON_HAND.splice(i, 1);
								FO -= 1;
								if( FO <= 0 ) break;
							}
						}
						if( CARDS[O].Q <= 0 ){
							CARDS[O] = null;
						}
					}
				}
			}
		}
		else if( coords_in_rct(mouseX, mouseY, billbox) ){
			let MO = 0;
			let rem = [];
			for (var i = ON_HAND.length-1; i >= 0; i--){
				if( ON_HAND[i].t == 'm' ){
					MO += money_val[ WALLET[ ON_HAND[i].id ] ];
					rem.push( ON_HAND[i].id );
					ON_HAND.splice( i, 1 );
				}
			}
			rem.sort();
			for (var i = rem.length - 1; i >= 0; i--){
				WALLET.splice( rem[i], 1 ); 
				waldst.splice( rem[i], 1 ); 
			}
			if( MO > BILL_current ){
				let change = billify( MO - BILL_current );
				for (var i = 0; i < change.length; i++) {
					WALLET.push( change[i] );
					waldst.push( { x: mouseX, y: mouseY, 
								   w: 0.3 * Z * money_src[ change[i] ].w, 
								   h: 0.3 * Z * money_src[ change[i] ].h } );
					ON_HAND.push( {t:'m', id: WALLET.length-1} );
				}
				build_level();
			}
			else{
				BILL_current -= MO;
				if( BILL_current <= 0 ){
					build_level();
				}
			}
		}
	}
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

function coords_in_rct( x, y, R ){
	return ( x > R.x && x < R.x + R.w ) && ( y > R.y && y < R.y + R.h );
}

function billify( N ){
	let l = []
	do{
		for (var i = money_val.length - 1; i >= 0; i--) {
			if( N >= money_val[i] ){
				N -= money_val[i];
				l.push( i );
				break;
			}
		}

	} while( N > 0 );
	return l;
}