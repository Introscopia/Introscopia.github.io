
var dice, map, UI_L, UI_R, X, tool_belt, workshop, event_icons;
var map_x, map_y, map_w, map_h;
var uir_x, uir_y, uir_w, uir_h; // User Interface Right
var uil_x, uil_y, uil_w, uil_h; // UI Left
var tb_x, tb_y, tb_w, tb_h;     // tool belt
var ig_x, ig_y, ig_w, ig_h;     // item grid
var ws_x, ws_y, ws_w, ws_h;     // workshop
var sb_x, sb_y, sb_w, sb_h;     // search box
var rb_x, rb_y, rb_w, rb_h;     // roll button
var frb_y; //fight roll button

var mouse_on_rb = false;
var roll_face = 0;
var dragging_dice = -1;
var dddx, dddy;

var copperplate_bold, copperplate_light, DejaVuSansCondensed, DejaVuSansCondensed_Bold;

var region_rects = [ { x:  24, y: 184, w: 220, h: 64 }, { x: 428, y: 113, w: 332, h: 32 }, { x:  44, y: 506, w: 321, h: 64 }, 
                     { x: 342, y: 356, w: 380, h: 32 }, { x: 117, y: 713, w: 316, h: 64 }, { x: 508, y: 675, w: 291, h: 32 } ];

var artifacts_found_checkmarks = [ { x: 169, y: 252 }, { x: 449, y: 181 }, { x: 243, y: 579 },
								   { x: 562, y: 428 }, { x: 133, y: 815 }, { x: 523, y: 744 } ];
var treasures_found_checkmarks = [ { x: 169, y: 276 }, { x: 449, y: 205 }, { x: 243, y: 603 },
								   { x: 562, y: 453 }, { x: 133, y: 839 }, { x: 523, y: 769 } ];

var region_names = [ "Halebeard Peak", "The Great Wilds", "The Root-Strangled Marshes", "Glassrock Canyon", "The Ruined City of the Ancients", "The Fiery Maw" ];

var region_components = [ 0, 1, 3, 2, 4, 5 ]; // so annoying!

let hp_x = [ 650.0, 618.0, 586.0, 553.0, 519.0, 487.0, 454.0 ];
let hp_y = 302.0;
let hp_r = 650.0;
let hp_h = 51.0;

var stores_dots = [ { x: 250, y: 124 }, { x: 211, y: 124 }, { x: 250, y:  90 }, { x: 211, y:  90 }, 
					{ x: 401, y: 125 }, { x: 362, y: 125 }, { x: 401, y:  91 }, { x: 362, y:  91 }, 
					{ x: 552, y: 125 }, { x: 514, y: 125 }, { x: 552, y:  91 }, { x: 514, y:  91 }, 
					{ x: 245, y: 330 }, { x: 206, y: 330 }, { x: 245, y: 296 }, { x: 206, y: 296 }, 
					{ x: 398, y: 330 }, { x: 360, y: 330 }, { x: 398, y: 296 }, { x: 360, y: 296 }, 
					{ x: 547, y: 332 }, { x: 508, y: 332 }, { x: 547, y: 298 }, { x: 508, y: 298 } ];
let stores_dots_diameter = 30;

var day_checkboxes = [ { x: 562, y: 222 }, { x: 628, y: 192 }, { x: 561, y: 162 }, { x: 501, y: 161 }, { x: 438, y: 162 }, { x: 377, y: 160 }, 
					   { x: 315, y: 160 }, { x: 264, y: 127 }, { x: 315, y:  96 }, { x: 384, y:  96 }, { x: 450, y:  96 }, { x: 519, y:  97 }, 
					   { x: 588, y:  94 }, { x: 655, y:  94 }, { x: 724, y:  96 }, { x: 723, y: 139 }, { x: 723, y: 183 }, { x: 724, y: 226 }, 
					   { x: 721, y: 268 }, { x: 724, y: 313 }, { x: 724, y: 360 }, { x: 724, y: 402 } ];

var gods_hand_dot = { x: 817, y: 309 };
var gods_hand_dot_diameter = 29;

var tool_boxes = [ { x: 186, y: 69 }, { x: 132, y: 107 }, { x: 77, y: 146 } ];
var tool_box_width = 29;
var tool_button_widths = [ 242, 205, 210 ];

let dd_x = 757;
let dd_y = 80;
let dd_w = 27;
let dd_h = 44;

var event_days = [ 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 ];

var region_search_trackers = [ [ -1, -1,  0, -1,  0,  0 ],
							   [ -1,  0,  0, -1,  0,  0 ],
							   [ -1,  0, -1,  0, -1,  0 ],
							   [ -1, -1,  0, -1,  0,  0 ],
							   [ -1,  0, -1,  0, -1,  0 ],
							   [ -1, -1, -1,  0, -1,  0 ] ];

let artifact_names = [ "Seal of Balance", "Hermetic Mirror", "Void Gate", "Golden Chassis", "Scrying Lens", "Crystal Battery" ];
let treasure_names = [ "Ice Plate", "Bracelet of Ios", "Shimmering Moonlace", "Scale of the Infinity Wurm", "The Ancient Record", "The Molten Shard" ];

let monster_chart = [ [ "Ice Bear",       "Roving Bandits",    "Blood Wolves",       "Horse Eater Hawk",    "The Hollow Giant (S)" ],
					  [ "Rogue Thief",    "Blanket of Crows",  "Hornback Bison",     "Grassyback Troll",    "Thunder King"         ],
					  [ "Gemscale Boa",   "Ancient Alligator", "Land Shark",         "Abyssal Leech (S)",   "Dweller in the Tides" ],
					  [ "Feisty Gremlin", "Glasswing Drake",   "Reaching Claws (S)", "Terrible Wurm",       "Infinity Wurm (S)"    ],
					  [ "Grave Robbers",  "Ghost Lights (S)",  "Vengeful Shade (S)", "Nightmare Crab",      "The Unnamed"          ],
					  [ "Minor Imp",      "Renegade Warlock",  "Giant Flame Lizard", "Spark Elemental (S)", "Volcano Spirit (S)"   ] ];

monster_attack_range = [ [1, 1], [1, 1], [1, 2], [1, 3], [1, 4] ];
player_attack_range  = [ [5, 6], [6, 6], [6, 6], [6, 6], [6, 6] ];

var monster_target;
var player_target;


var WILD_UI;
var WORK_UI;
var proceed_button;
var proceed = { b : false };
var item_view = { n : 0 };
var travel_back = { b : false };
var rest = { b : false };
var activate_gods_hand = { b : false };

function preload() {
	        copperplate_bold = loadFont('assets/Copperplate Gothic Bold Regular.ttf');
	       copperplate_light = loadFont('assets/CopperplateGothicLight.ttf');
	     DejaVuSansCondensed = loadFont('assets/DejaVuSansCondensed.ttf');
	DejaVuSansCondensed_Bold = loadFont('assets/DejaVuSansCondensed-Bold.ttf');

	     dice = loadImage('assets/dice.png');
	      map = loadImage('assets/map_regions.png');
	     UI_R = loadImage('assets/UI-R.png');
	     UI_L = loadImage('assets/UI-L.png');
	tool_belt = loadImage('assets/UI-tools.png');
	 workshop = loadImage('assets/workshop.png');
	        X = loadImage('assets/x.png');
	event_icons = Array(4);
	event_icons[0] = loadImage('assets/monster.png');
	event_icons[1] = loadImage('assets/eye.png');
	event_icons[2] = loadImage('assets/clover.png');
	event_icons[3] = loadImage('assets/thundercloud.png');
}

var moment = 0;//{ n : 0 };

var region;
var hitpoints;
var tools;
var day;
var rest_combo;
var doomsday_delay;
var component_stores;
var event_cycles;
var search_tracker;
var region_searches;//number of times each region has been searched
var search_box;
var rolls;
var result;
var gods_hand;
var artifacts_found;
var artifacts_activated;
var fleeting_visions;
var treasures_found;
var dice_objs;
var fighting;
var enemy_lvl;
var enemy_defeated;
var seal_of_balance_effect;
var seal_of_balance_used;








function setup() {
	//createCanvas( 1280, 620 );
	var canvas = createCanvas(windowWidth * 0.96, windowHeight * 0.96);
	canvas.parent('sketch-holder');
	//noLoop();

	let Ar = map.width / map.height;
	let Br = width / height;
	var mapscale = 1;
	if( Ar > Br ){
		mapscale = width / map.width;
		map_h = map.height * mapscale;
		map_x = 0;
		map_y = (height - map_h) / 2;
		map_w = width;
	}
	else {
		mapscale = height / map.height;
		map_w =  map.width * mapscale;
		map_x = ((width - map_w) / 2);
		map_y = 0;
		map_h = height;
	}

	for( var i = 0; i < 6; ++i ){
		region_rects[ i ].x = map_x + ( region_rects[ i ].x * mapscale );
		region_rects[ i ].y = map_y + ( region_rects[ i ].y * mapscale );
		region_rects[ i ].w *= mapscale;
		region_rects[ i ].h *= mapscale;
		artifacts_found_checkmarks[ i ].x = map_x + ( artifacts_found_checkmarks[ i ].x * mapscale ) + 4;
		artifacts_found_checkmarks[ i ].y = map_y + ( artifacts_found_checkmarks[ i ].y * mapscale ) - 7;
		treasures_found_checkmarks[ i ].x = map_x + ( treasures_found_checkmarks[ i ].x * mapscale ) + 4;
		treasures_found_checkmarks[ i ].y = map_y + ( treasures_found_checkmarks[ i ].y * mapscale ) - 7;
	}

	monster_target = { x: round(width/2.0), y: round(map_y + (0.4*map_h)) };
	player_target = { x: round(width/2.0), y: round(height - dice.height) };
	
	sb_x = map_x + 0.2*map_w;
	sb_y = map_y + 0.3*map_h;
	sb_w = (0.6 * map_w) / 3.0;
	sb_h = (0.33 * map_h) / 2.0;

	rb_x = map_x + 0.76*map_w;
	rb_h = dice.height + 25;
	rb_y = (sb_y + 2*sb_h) + ( height - (sb_y + 2*sb_h) - rb_h ) / 2;
	rb_w = dice.height;
	frb_y = monster_target.y + ((player_target.y - monster_target.y)/2.0) - (rb_h/2.0);
	
	uir_x = map_x + (0.9*map_w);
	uir_y = 4;
	uir_w = width - uir_x;
	uir_x -= 4;
	let uirscale = (uir_w / UI_R.width);
	uir_h = UI_R.height * uirscale;

	for( var i = 0; i < 7; ++i )  hp_x[ i ] = uir_x + ( hp_x[ i ] * uirscale );
	hp_y = uir_y + ( hp_y * uirscale );
	hp_r = uir_x + (hp_r * uirscale);
	hp_h *= uirscale;

	X.resize( X.width * uirscale * 0.8, 0 );
	for( var i = 0; i < 22; ++i ){
		day_checkboxes[ i ].x = uir_x + ( day_checkboxes[ i ].x * uirscale );
		day_checkboxes[ i ].y = uir_y + ( day_checkboxes[ i ].y * uirscale );
	}
	gods_hand_dot.x = uir_x + ( gods_hand_dot.x * uirscale );
	gods_hand_dot.y = uir_y + ( gods_hand_dot.y * uirscale );
	gods_hand_dot_diameter *= uirscale;

	dd_x = uir_x + ( dd_x * uirscale );
	dd_y = uir_y + ( dd_y * uirscale );
	dd_w *= uirscale;
	dd_h *= uirscale;

	uil_x = 0;
	uil_y = 4;
	uil_w = (width - map_w) / 2;
	let uilscale = uil_w / UI_L.width;
	uil_h = UI_L.height * uilscale;

	for( var i = 0; i < 24; ++i ){
		stores_dots[ i ].x = uil_x + ( stores_dots[ i ].x * uilscale );
		stores_dots[ i ].y = uil_y + ( stores_dots[ i ].y * uilscale );
	}
	stores_dots_diameter *= 0.5 * uilscale;
	
	tb_x = 4;
	tb_y = uil_y + 1.1*uil_h;
	tb_w = uil_w;
	let tbscale = tb_w / tool_belt.width;
	tb_h = tool_belt.height * tbscale;

	for (var i = 0; i < 3; i++) {
		tool_boxes[i].x = tb_x + ( tool_boxes[i].x * tbscale );
		tool_boxes[i].y = tb_y + ( tool_boxes[i].y * tbscale );
		tool_button_widths[i] *= tbscale;
	}
	tool_box_width *= tbscale;

	let ma = 2;
	let bh = 30;

	WILD_UI = Array(5);

	WILD_UI[0] = new intSet( ma, tb_y + 1.2*tb_h, uil_w/2, bh, 'Artifacts', 0 );
	WILD_UI[1] = new intSet( ma+uil_w/2, tb_y + 1.2*tb_h, uil_w/2, bh, 'Treasures', 1 );

	ig_x = ma;
	ig_y = tb_y + 1.2*tb_h + bh;
	ig_w = uil_w / 3.0;
	ig_h = (height - ig_y - 3) / 2.0;

	WILD_UI[2] = new Toggle( map_x + map_w + ma, height -   bh - 3, width - map_x - map_w - 3*ma, bh, 'Return to Workshop' );
	WILD_UI[3] = new Toggle( map_x + map_w + ma, height - 2*bh - 6, width - map_x - map_w - 3*ma, bh, 'Rest' );
	WILD_UI[4] = new Toggle( map_x + map_w + ma, height - 3*bh - 9, width - map_x - map_w - 3*ma, bh, "Activate God's Hand" );

	proceed_button = new Toggle( sb_x, height - 1.5*bh - 3, 3*sb_w, 1.5*bh, "Search Again" );

	ws_w =  workshop.width * (height / workshop.height);
	ws_x = ((width - ws_w) / 2);
	ws_y = 0;
	ws_h = height;

	dice_objs = Array(0);
}












function draw() {
	switch( moment ){

		case 0: // --o-- --o-- --o-- --o-- --o-- MAIN MENU  --o-- --o-- --o-- --o-- --o-- --o-- --o-- 

			background(255);

			fill( 0 );
			textAlign( CENTER, CENTER );

			textFont( copperplate_bold, 60 );
			text( "Utopia Engine", width/2, height/4 );

			textFont( copperplate_bold, 40 );
			text( "Play", width/2, height/2 );

			textFont( copperplate_light, 20 );
			textAlign( LEFT, BOTTOM );
			text( "Designed by  Nick Hayes\nWeb version by Introscopia\nMade with p5.js", 100, height-100 );



			break;
		case 1: // --o-- --o-- --o-- --o-- --o-- GAME INITIALIZATION  --o-- --o-- --o-- --o-- --o--



			region = -1;
			hitpoints = 6;
			tools = new Array(3);
			for( var i = 0; i < 3; ++i ) tools[i] = 1;
			day = 0;
			doomsday_delay = 0;
			component_stores = new Array( 6 );
			for( var i = 0; i < 6; ++i ) component_stores[i] = 0;//floor(random(0, 5));
			event_cycles = new Array(4);
			for( var i = 0; i < 4; ++i ) event_cycles[i] = -1;
			search_tracker = 0;
			region_searches = new Array( 6 );
			for( var i = 0; i < 6; ++i ) region_searches[i] = 0;
			search_box = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];
			result = { b: false, n: 0, digits: [ '0', '0', '0' ] };
			gods_hand = 0;
			artifacts_found = new Array( 6 );
			for( var i = 0; i < 6; ++i ) artifacts_found[i] = false;
			artifacts_activated = new Array( 6 );
			for( var i = 0; i < 6; ++i ) artifacts_activated[i] = false;
			fleeting_visions = new Array( 6 );
			for( var i = 0; i < 6; ++i ) fleeting_visions[i] = false;
			treasures_found = new Array( 6 );
			for( var i = 0; i < 6; ++i ) treasures_found[i] = false;
			fighting = false;
			seal_of_balance_effect = false;
			seal_of_balance_used = false;
			

			background(255);
			textAlign( LEFT, TOP );
			textFont( DejaVuSansCondensed, 20 );
			text( "    In this game you play as Isodoros, a talented Artificer who has been charged with reconstructing a fabled device called the Utopia Engine. The Utopia Engine is an assembly of several powerful devices, called Artifacts, that sustained an idyllic society millennia ago. Using years of research based on scraps of crumbling texts, you have finally deduced the locations of the Engine’s six primary parts. Your guild believes that these six Artifacts are enough to reactivate the Utopia Engine. All that is left is for you is to find them, activate their internal energies, and reassemble the Engine.\n    Standing in your way are unscrupulous leaders, deadly terrain, and violent creatures. But even more pressing is the fast-approaching Doomsday, which has thrown the world into chaos. For generations, a machine known as the God’s Hand, the pride of the Artificers, had been staying the apocalypse. But now that the end is so close, the device is failing. It is believed that the mythical Utopia Engine is the only way left to avert Doomsday. You have two weeks to reconstruct and activate the Engine. If you fail, the world will be destroyed.", width*0.1, height*0.1, width*0.8, height*0.8 );

			textAlign( CENTER, CENTER );
			textFont( copperplate_bold, 40 );
			text( "Continue", width/2, height*0.75 );



			break;
		case 2: // --o-- --o-- --o-- --o-- --o-- THE WILDERNESS --o-- --o-- --o-- --o-- --o-- 



			background(255);

			if( region < 0 ){

				imageMode(CORNER);
				image( map, map_x, map_y, map_w, map_h, 0, 0 );

				fill(0);
				textAlign( CENTER, CENTER );
				textFont( copperplate_bold, 30 );
				text( "The Wilderness", map_x + (0.5*map_w), map_y + (0.03*map_h) );

				for (var i = 0; i < 4; i++) {
					if( event_cycles[i] >= 0 ){
						var dx = 0;
						for (var j = 0; j < i; j++){
							if( event_cycles[i] == event_cycles[j] ) ++dx;
						}
						image( event_icons[i], region_rects[ event_cycles[i] ].x + (dx * event_icons[i].width * 1.1), region_rects[ event_cycles[i] ].y - event_icons[i].height );
					}
				}

				fill(0, 200, 60);
				textFont( DejaVuSansCondensed, 30 );
				for (var i = 0; i < 6; i++) {
					if( artifacts_found[ i ] ) text( "✓", artifacts_found_checkmarks[ i ].x, artifacts_found_checkmarks[ i ].y );
					if( treasures_found[ i ] ) text( "✓", treasures_found_checkmarks[ i ].x, treasures_found_checkmarks[ i ].y );
				}

			}
			else{

				if( fighting ){

					fill(0);
					textAlign( CENTER, TOP );
					textFont( copperplate_bold, 30 );
					text( "Fighting at " + region_names[ region ], map_x + (0.1*map_w), map_y + (0.03*map_h), map_w * 0.8, 80 );
					textSize(25);
					text( "A level "+enemy_lvl+" Enounter:\n"+monster_chart[ region ][ enemy_lvl-1 ], map_x + (0.125*map_w), map_y + (0.2*map_h), map_w * 0.75, 80 );

					if( enemy_defeated && dice_objs.length == 0 ){

						text( monster_chart[ region ][ enemy_lvl-1 ] + " is defeated.", map_x + (0.125*map_w), frb_y, map_w * 0.75, 80 );

						textSize( 30 );
						textAlign( CENTER, CENTER );
						proceed_button.display( proceed );
					}
					else{

						noFill();
						stroke(0);
						strokeWeight(4);
						rectMode(CENTER);
						rect( monster_target.x, monster_target.y, dice.height, dice.height, 5, 5, 5, 5 );
						rect( player_target.x, player_target.y, dice.height, dice.height, 5, 5, 5, 5 );
						strokeWeight(1);

						fill(0);
						noStroke();
						textAlign( CENTER, CENTER );
						textSize(40);
						if( player_attack_range[ enemy_lvl-1 ][0] == player_attack_range[ enemy_lvl-1 ][1] ){
							text( player_attack_range[ enemy_lvl-1 ][0], monster_target.x, monster_target.y - 4 );
						}
						else{
							text( player_attack_range[ enemy_lvl-1 ][0]+"-"+player_attack_range[ enemy_lvl-1 ][1], 
								  monster_target.x, monster_target.y - 4 );
						}

						if( monster_attack_range[ enemy_lvl-1 ][0] == monster_attack_range[ enemy_lvl-1 ][1] ){
							text( monster_attack_range[ enemy_lvl-1 ][0], player_target.x, player_target.y - 4 );
						}
						else{
							text( monster_attack_range[ enemy_lvl-1 ][0]+"-"+monster_attack_range[ enemy_lvl-1 ][1], 
								  player_target.x, player_target.y - 4 );
						}



						//ROLL BUTTON
						if( mouse_on_rb && frameCount % 5 == 0) roll_face = floor(random(0, 6));
						image( dice, rb_x, frb_y, rb_w, rb_w, roll_face*rb_w, 0, rb_w, rb_w );

						fill(0);
						noStroke();
						textFont( copperplate_bold, 23 );
						textAlign(CENTER, TOP);
						text("ROLL", rb_x + (0.5*rb_w), frb_y + rb_w );

						if( dice_objs.length == 2 ){
							dice_objs[0].repel( dice_objs[1] );
							dice_objs[1].repel( dice_objs[0] );
						}

						for (var i = 0; i < dice_objs.length; i++) {
							dice_objs[i].display();
							dice_objs[i].repel( monster_target );
							dice_objs[i].repel( player_target );

							if( dice_objs[i].auto ){

								if( dist( dice_objs[i].x, dice_objs[i].y, dice_objs[i].target_X, dice_objs[i].target_Y ) < 3 ){

									if( dice_objs[i].y < frb_y ){//.WON THE FIGHT

										enemy_defeated = true;

									}
									else{// TOOK A HIT

										hitpoints -= 1;
									}

									dice_objs.splice( i, 1 );


									if( dice_objs.length == 0 ){

										if( hitpoints > 0 && enemy_defeated ){

											if( region_searches[ region ] >= 6 ){
												proceed_button.label = "Region fully searched.";
											}
											else proceed_button.label = "Search again";

											let roll = floor(random(0, 6));
											if( roll <= enemy_lvl ){
												if( enemy_lvl == 5 ){
													treasures_found[ region ] = true;
												}
												else{
													component_stores[ region_components[ region ] ] += 1;
													if( component_stores[ region_components[ region ] ] > 4 ){
														component_stores[ region_components[ region ] ] = 4;
													}
												}
											}

										}
										else if( hitpoints == 0 ){//.....UNCONCIOUS

											day += 6;

											// VOID GATE
											if( artifacts_activated[ 2 ] ){
												day -= 2;
											}

											if( day >= 15 + doomsday_delay ){// Slept through the apocalypse

												moment = 4;

											}
											else{
												region = -1;
												fighting = false;
												moment = 3;
												hitpoints = 6;
												for( var i = 0; i < 6; ++i ) region_searches[i] = 0;
											}

										}
										else if( hitpoints < 0 ){//.DEAD

											moment = 4;

										}
									}

								}
							}
							else if( dist( 0, 0, dice_objs[i].vx, dice_objs[i].vy ) < 1 ){

								if( dice_objs[i].face + 1 >= monster_attack_range[ enemy_lvl-1 ][0] &&
									dice_objs[i].face + 1 <= monster_attack_range[ enemy_lvl-1 ][1] ){

									dice_objs[i].target_X = player_target.x - (dice.height/2);
									dice_objs[i].target_Y = player_target.y - (dice.height/2);
									dice_objs[i].auto = true;
								}
								else if ( dice_objs[i].face + 1 >= player_attack_range[ enemy_lvl-1 ][0] &&
										  dice_objs[i].face + 1 <= player_attack_range[ enemy_lvl-1 ][1] ){

									dice_objs[i].target_X = monster_target.x - (dice.height/2);
									dice_objs[i].target_Y = monster_target.y - (dice.height/2);
									dice_objs[i].auto = true;
								}
								else{

									dice_objs.splice( i, 1 );
								}
							}
						}
					}
				}
				else{ // Searching

					fill(0);
					textAlign( CENTER, TOP );
					textFont( copperplate_bold, 30 );
					text( "Searching " + region_names[ region ], map_x + (0.1*map_w), map_y + (0.03*map_h), map_w * 0.8, 80 );

					let y = 80 + ((sb_y-80)/2.0);
					textFont( copperplate_light, 22 );
					for (var i = 0; i < 6; i++) {
						if( i < search_tracker ) fill(0);
						else noFill();
						stroke(0);
						strokeWeight(2);
						let x = sb_x + 18 + i*39;
						ellipse( x, y, 36, 36 );

						if( region_search_trackers[ region ][ i ] < 0 ){
							fill(0);
							noStroke();
							textAlign( CENTER, CENTER );
							text( region_search_trackers[ region ][ i ], x, y-3 );
						}
					}
					fill(0);
					noStroke();
					textAlign( LEFT, CENTER );
					text( "search tracker", sb_x + 236, y-3 );

					
					for (var i = 0; i < 3; i++) {
						for (var j = 0; j < 2; j++) {
							noFill();
							stroke(0);
							strokeWeight(3);
							rect( sb_x + i*sb_w, sb_y + j*sb_h, sb_w, sb_h );

							if( search_box[ i ][ j ] > 0 ){
								fill(0);
								textAlign( CENTER, CENTER );
								textFont( copperplate_bold, 70 );
								text( search_box[ i ][ j ], sb_x + (i+0.5)*sb_w, sb_y + (j+0.5)*sb_h - 4 );
							}
						}
					}
					strokeWeight(1);


					//ROLL BUTTON
					if( mouse_on_rb && frameCount % 5 == 0) roll_face = floor(random(0, 6));
					image( dice, rb_x, rb_y, rb_w, rb_w, roll_face*rb_w, 0, rb_w, rb_w );

					fill(0);
					noStroke();
					textFont( copperplate_bold, 23 );
					textAlign(CENTER, TOP);
					text("ROLL", rb_x + (0.5*rb_w), rb_y + rb_w );

					if( dice_objs.length == 2 ){
						if( dragging_dice != 0 ) dice_objs[0].repel( dice_objs[1] );
						if( dragging_dice != 1 ) dice_objs[1].repel( dice_objs[0] );
					}
					for (var i = 0; i < dice_objs.length; i++) {
						dice_objs[i].display();
						if( dragging_dice != i ){
							if( dice_objs[i].y > height - dice.height ) dice_objs[i].vy -= 0.4;
							if( dice_objs[i].y < sb_y + 2*sb_h ) dice_objs[i].vy += 0.4;
						}
					}

					if( result.b ){

						fill(0);
						textFont( copperplate_bold, 70 );
						if( result.n < 0 && result.digits[0] == 0 ){//all because of stupid "-0"
							textAlign( RIGHT, CENTER );
							text( "-", sb_x + (i+0.5)*sb_w-(textWidth("0")/2)-2, sb_y + 2.3*sb_h );
						}
						textAlign( CENTER, CENTER );
						for (var i = 0; i < 3; i++) {
							text( result.digits[ i ], sb_x + (i+0.5)*sb_w, sb_y + 2.3*sb_h );
						}

						textSize( 30 );
						proceed_button.display( proceed );
					}
				}
			}

			

			rectMode(CORNER);
			fill( 190, 50, 50 );
			rect( hp_x[ hitpoints ], hp_y, hp_r - hp_x[ hitpoints ], hp_h );

			fill( 80, 120, 190 );
			for( var i = 0; i < gods_hand; ++i ){
				if( i > 6 ) break;
				circle( gods_hand_dot.x, gods_hand_dot.y - (i*gods_hand_dot_diameter), 0.65* gods_hand_dot_diameter );
			}

			image( UI_R, uir_x, uir_y, uir_w, uir_h, 0, 0 );

			imageMode(CENTER);
			for( var i = 0; i < day; ++i ){
				image( X, day_checkboxes[ i ].x, day_checkboxes[ i ].y );
			}
			imageMode(CORNER);

			fill(255);
			noStroke();
			for( var i = 0; i < doomsday_delay; ++i ){
				rect( dd_x, dd_y + (i*dd_h), dd_w, dd_h );
			}


			noStroke();
			fill( 190, 150, 50 );
			for( var i = 0; i < 6; ++i ){
				for( var cc = 0; cc < 4; ++cc ){
					if( component_stores[i] > cc ){
						circle( stores_dots[ (i*4)+cc ].x, stores_dots[ (i*4)+cc ].y, stores_dots_diameter );
					}
				}
			}
			image( UI_L, uil_x, uil_y, uil_w, uil_h, 0, 0 );

			image( tool_belt, tb_x, tb_y, tb_w, tb_h, 0, 0 );

			fill(0);
			textAlign( CENTER, CENTER );
			textFont( copperplate_bold, 18 );
			for (var i = 0; i < 3; i++) {
				text( tools[i], tool_boxes[i].x + 2, tool_boxes[i].y -2, tool_box_width, tool_box_width );
			}

			
			textFont( copperplate_bold, 24 );
			WILD_UI[0].display( item_view );
			WILD_UI[1].display( item_view );

	
			for( var i = 0; i < 3; ++i ){
				for( var j = 0; j < 2; ++j ){
					stroke(0);
					noFill();
					rect( ig_x + (i * ig_w), ig_y + (j * ig_h), ig_w, ig_h );
					noStroke();
					if( item_view.n == 0 ){
						if( artifacts_found[ (j*3)+i ] ){
							textFont( copperplate_bold, 18 );
							fill( 100 );
							if( artifacts_activated[ (j*3)+i ] ) fill( 50, 50, 190 );
							text( artifact_names[ (j*3)+i ], ig_x + (i * ig_w) + 3, ig_y + (j * ig_h), ig_w, ig_h );
							
						}
					}
					else if ( item_view.n == 1 ){
						if( treasures_found[ (j*3)+i ] ){
							textFont( copperplate_bold, 16 );
							fill( 0 );
							text( treasure_names[ (j*3)+i ], ig_x + (i * ig_w) + 3, ig_y + (j * ig_h), ig_w, ig_h );
						}
					}
				}
			}

			textFont( copperplate_bold, 18 );
			WILD_UI[4].display( activate_gods_hand );
			WILD_UI[3].display( rest );
			WILD_UI[2].display( travel_back );

			if( proceed.b ){
				if( proceed_button.label[0] == 'S' ){//Search Again
					for (var i = 0; i < 3; i++) {
						for (var j = 0; j < 2; j++) {
							search_box[i][j] = 0;
						}
					}
					rolls = 0;
					result.b = false;
					fighting = false;
					enemy_defeated = false;
					//dice_objs = Array(0);
				}
				else if( proceed_button.label[0] == 'F' ){//Fight

					fighting = true;
					rolls = 0;
					result.b = false;
					enemy_defeated = false;

					if( result.n > 0 ) enemy_lvl = result.digits[0];
					else{
						     if( result.n >= -100 ) enemy_lvl = 1;
						else if( result.n >= -200 ) enemy_lvl = 2;
						else if( result.n >= -300 ) enemy_lvl = 3;
						else if( result.n >= -400 ) enemy_lvl = 4;
						else if( result.n >= -555 ) enemy_lvl = 5;
					}

					if( event_cycles[ 0 ] == region ){// ACTIVE MONSTERS

						enemy_lvl += 2;
						if( enemy_lvl > 5 ) enemy_lvl = 5;
					}

				}
				else if( proceed_button.label[0] == 'R' ){//Region fully searched
					if( !artifacts_found[ region ] ){
						day += 1;
						if( event_days[ day ] == 1 ){
							for (var i = 0; i < 4; i++){
								event_cycles[i] = floor(random(0, 6));
							}
						}
						artifacts_found[ region ] = true;//Extensive search rule
					}
					travel_back.b = true;
				}

				proceed.b = false;
			}


			break;
		case 3:

			background(255);
			image( workshop, ws_x, ws_y, ws_w, ws_h, 0, 0 );

			break;
		case 4:

			background(255);

			fill(0);
			textAlign( CENTER, CENTER );
			textFont( copperplate_bold, 60 );
			text( "Game Over", width/2, 0.25*height );

			break;
	}

	if( travel_back.b ){
		if( moment == 2 ){
			if( region < 0 ) moment = 3;
			else{
				if( rolls == 0 || ( result.b && proceed_button.label[0] != 'F' ) ){
					region = -1;
					WILD_UI[2].label = "Return to Workshop";
				}
			}
		}
		else if( moment == 3 ) moment = 2;
		travel_back.b = false;
	}

	if( activate_gods_hand.b ){
		if( gods_hand >= 3 ){
			gods_hand -= 3;
			doomsday_delay += 1;
		}
		activate_gods_hand.b = false;
	}

	if( rest.b ){
		day += 1;
		hitpoints += 1;
		if( event_days[ day ] == 1 ){
			for (var i = 0; i < 4; i++){
				event_cycles[i] = floor(random(0, 6));
			}
		}
		// How to track rest combo?
		// how to make sure the bonus is only awarded once per streak?
		// if( moment == 3 && rest_combo >= 3 ) hitpoints += 1;
		rest.b = false;
	}
	
}














function mouseMoved(){
	switch( moment ){
		case 2:
			if( region >= 0 ){

				if( dragging_dice >= 0 ){

					dice_objs[ dragging_dice ].x = mouseX - dddx;
					dice_objs[ dragging_dice ].y = mouseY - dddy;

				}
				else{
					mouse_on_rb = false;
					let y = rb_y;
					if( fighting ) y = frb_y;
					if( mouseX > rb_x && mouseX < rb_x + rb_w && mouseY > y && mouseY < y + rb_h ){
						mouse_on_rb = true;
					}
				}
			}
			break;
	}
}

function mouseDragged(){
	switch( moment ){
		case 2:
			if( region >= 0 ){

				if( dragging_dice >= 0 ){

					dice_objs[ dragging_dice ].x = mouseX - dddx;
					dice_objs[ dragging_dice ].y = mouseY - dddy;

				}

			}
			break;
	}
}

function mousePressed(){
	switch( moment ){
		case 2:
			if( region >= 0 ){

				for (var i = 0; i < dice_objs.length; i++) {
					if( mouseX > dice_objs[i].x && mouseX < dice_objs[i].x + dice.height && 
						mouseY > dice_objs[i].y && mouseY < dice_objs[i].y + dice.height ){

						dddx = mouseX - dice_objs[i].x;
						dddy = mouseY - dice_objs[i].y;
						dice_objs[i].vx = 0;
						dice_objs[i].vy = 0;
						dragging_dice = i;
						break;
					}
				}

			}
			break;
	}
}

function mouseReleased(){
	switch( moment ){
		case 0:
			moment = 1;
			break;
		case 1:
			moment = 2;
			break;
		case 2:

			let on_map = ( mouseX > map_x && mouseX < map_x + map_w );

			if( on_map && region < 0 ){// the wilderness
				for (var i = 0; i < region_rects.length; i++) {
					if( mouseX > region_rects[i].x && mouseX < region_rects[i].x + region_rects[i].w &&
						mouseY > region_rects[i].y && mouseY < region_rects[i].y + region_rects[i].h ){

						region = i;
						search_tracker = 0;
						search_box = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];
						rolls = 0;
						result = { b: false, n: 0, digits: [ '0', '0', '0' ] };
						dice_objs = Array(0);
						WILD_UI[2].label = "Return to the Wilderness";
						break;
					}
				}
			}
			else{ // searching or fighting

				//console.log( ">>>", dragging_dice, mouse_on_rb, result.b );

				if( dragging_dice >= 0 ){//  Dropping dice into the search box

					let bx = floor( (dice_objs[ dragging_dice ].x + (dice.height/2) - sb_x) / sb_w );
					let by = floor( (dice_objs[ dragging_dice ].y + (dice.height/2) - sb_y) / sb_h );


					if( bx >= 0 && bx < 3 && by >= 0 && by < 2 ){
						if( search_box[ bx ][ by ] == 0 ){

							search_box[ bx ][ by ] = dice_objs[ dragging_dice ].face + 1;
							dice_objs.splice( dragging_dice, 1 );

							//console.log( dice_objs.length, rolls );

							if( dice_objs.length == 0 && rolls == 3 ){ // Search complete

								let top = search_box[2][0] + (10 * search_box[1][0]) + (100 * search_box[0][0]);
								let bot = search_box[2][1] + (10 * search_box[1][1]) + (100 * search_box[0][1]);

								result.n = top - bot;

								if( event_cycles[ 2 ] == region ){// GOOD FORTUNE
									result.n -= 10;
									if( result.n < 0 ) result.n = 0;
								}

								// HERMETIC MIRROR
								if( artifacts_activated[ 4 ] && (region == 0 || region == 5) ){
									result.n -= 10;
									if( result.n < 0 ) result.n = 0;
								}

								// SCRYING LENS
								if( artifacts_activated[ 4 ] && (region == 3 || region == 2) ){
									result.n -= 10;
									if( result.n < 0 ) result.n = 0;
								}

								//console.log( top, bot, result.n );
								let neg = false;
								if( result.n < 0 ){
									result.n *= -1;
									neg = true;
								}

								let hun = floor( result.n / 100.0 );
								result.digits[0] = hun;
								let dec = floor( (result.n - (100*hun) ) / 10.0 );
								result.digits[1] = dec;
								result.digits[2] = floor( result.n - (10*dec) - (100*hun) );

								if( neg ){
									result.n *= -1;
									result.digits[0] *= -1;
								}

								result.b = true;

								region_searches[ region ] += 1;
								search_tracker += 1;

								let pday = day;
								let passage_of_time = -region_search_trackers[ region ][ search_tracker-1 ];

								if( event_cycles[ 3 ] == region ){// FOUL WEATHER
									passage_of_time *= 2;
								}

								day += passage_of_time;
								//console.log( pday, day, search_tracker, region_search_trackers[ search_tracker-1 ] );
								if( day > pday ){
									for (var i = pday+1; i <= day; i++){ 
										if( event_days[i] == 1 ){
											for (var i = 0; i < 4; i++){
												event_cycles[i] = floor(random(0, 6));
											}
											break;
										}
									}
								}

								if( result.n >= 0 ){
									if( result.n == 0 ){
										if( artifacts_found[ region ] ){
											component_stores[ region_components[ region ] ] += 1;
										}
										else{
											artifacts_found[ region ] = true;
											artifacts_activated[ region ] = true;
										}
									}
									else if( result.n <= 10 ){
										if( artifacts_found[ region ] ){
											component_stores[ region_components[ region ] ] += 1;
										}
										else{
											artifacts_found[ region ] = true;

											if( event_cycles[ 1 ] == region ){//FLEETING VISIONS
												fleeting_visions[ region ] = true;
											}
										}
									}
									else if( result.n < 100 ){
										component_stores[ region_components[ region ] ] += 1;
									}

									if( component_stores[ region_components[ region ] ] > 4 ){
										component_stores[ region_components[ region ] ] = 4;
									}
								}


								if( result.n < 0 || result.n >= 100 ){
									proceed_button.label = "Fight!";
								}
								else{
									if( region_searches[ region ] >= 6 ){
										proceed_button.label = "Region fully searched.";
									}
									else proceed_button.label = "Search again";
								}
							}
						}
					}

					dragging_dice = -1;
				}

				else if( mouse_on_rb ){//                  ROLL!
					//console.log( "rolling", dice_objs.length, result.b );
					if( dice_objs.length == 0 && !result.b ){
						dice_objs = Array(2);
						for (var i = 0; i < 2; i++) {
							let a = random( (5/6.0)*PI, (7/6.0)*PI );
							let v = random( 10, 16 );
							dice_objs[i] = new Dice( floor(random(0,6)), rb_x, rb_y, v*cos(a), v*sin(a) );
							if( fighting ) dice_objs[i].y = frb_y;

							//GOLDEN CHASSIS
							if( artifacts_activated[ 3 ] && dice_objs[i].face < 5 ){
								let len = monster_chart[ region ][ enemy_lvl-1 ].length;
								if( monster_chart[ region ][ enemy_lvl-1 ][len-1] == ")" ){
									dice_objs[i].face += 1;
								}
							}
						}
						rolls++;
					}
				}

				else if( result.b ){

					//THE DOWSING ROD
					if( tools[1] > 0 && (!artifacts_found[ region ]) &&
						mouseX > tool_boxes[1].x && mouseX < tool_boxes[1].x + tool_button_widths[1] && 
						mouseY > tool_boxes[1].y && mouseY < tool_boxes[1].y + tool_box_width ){
						
						if( result.n >= 11 && result.n <= 99 ){

							result.n = 1;
							result.digits[0] = 0;
							result.digits[1] = 0;
							result.digits[2] = 1;

							tools[1] -= 1;

							component_stores[ region_components[ region ] ] -= 1;
							// swap the component for the artifact
							artifacts_found[ region ] = true;
						}
					}
					proceed_button.released( proceed );
				}

				else if( fighting ){

					// PARALYSIS WAND
					if( tools[0] > 0 &&
						mouseX > tool_boxes[0].x && mouseX < tool_boxes[0].x + tool_button_widths[0] && 
						mouseY > tool_boxes[0].y && mouseY < tool_boxes[0].y + tool_box_width ){
						
						for (var i = 0; i < dice_objs.length; i++) {
							dice_objs[i].face += 2;
							if( dice_objs[i].face > 5 ) dice_objs[i].face = 5;
						}
						tools[0] -= 1;

					}

					if( enemy_defeated && dice_objs.length == 0 ){
						proceed_button.released( proceed );
						WILD_UI[2].released( travel_back );
					}
				}
			}
			if( !on_map ){
				WILD_UI[0].released( item_view );
				WILD_UI[1].released( item_view );
				WILD_UI[2].released( travel_back );
				WILD_UI[3].released( rest );
				WILD_UI[4].released( activate_gods_hand );
			}
			break;
		case 3:
			moment = 2;
			break;
		case 4:
			moment = 0;
			break;
	}
	//redraw();
}

function keyReleased() {
	switch( moment ){
		case 0:
			moment = 1;
			break;
		case 1:
			moment = 2;
			break;
		case 2:
			
			break;
		case 3:
			moment = 2;
			break;
		case 4:
			moment = 0;
			break;
	}
	//redraw();
}


//-=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=--=-=-==-=-=-

function intSet(x, y, w, h, label, set ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.set = set;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5)-2;
  
  this.display = function( incumbency ){
    stroke(0);
    noFill();
    rect( this.x, this.y, this.w, this.h, 2, 2, 2, 2 );
    
    noStroke();
    if( incumbency.n == this.set ) fill(0);
    else fill(127);
    text( this.label, this.cx, this.cy );
  }
  this.released = function( incumbency ){
    if( mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h ){
      incumbency.n = this.set;
      return 1;
    }
    return 0;
  }
};

function Toggle(x, y, w, h, label ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  
  this.display = function( incumbency ){
    stroke(0);
    noFill();
    rect( this.x, this.y, this.w, this.h, 2, 2, 2, 2 );

    //if( incumbency.b ) fill(0);
    //else fill(35);
    fill(0);
    noStroke();
    text( this.label, this.cx, this.cy );
  }
  this.released = function( incumbency ){
    if( mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h ){
      incumbency.b = !incumbency.b;
      return 1;
    }
    return 0;
  }
};

function Dice( face, x, y, vx, vy ){
	this.face = face;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.target_X = 0;
	this.target_Y = 0;
	this.auto = false;
	
	this.display = function(){
		image( dice, this.x, this.y, dice.height, dice.height, this.face * dice.height, 0, dice.height, dice.height );
		this.x += this.vx;
		this.y += this.vy;
		if( this.auto ){
			let dx = this.target_X - this.x;
			let dy = this.target_Y - this.y;
			let hypot = sqrt( sq(dx) + sq(dy) );
			if( isNaN(hypot) || hypot < 0.1 ) hypot = 0.1;
			dx = 6 * dx / hypot;
			dy = 6 * dy / hypot;
			this.vx = dx;
			this.vy = dy;
		}
		else{
			this.vx *= 0.942;
			this.vy *= 0.942;
		}
	}
	this.repel = function( other ){
		let fx = this.x - other.x;
		let fy = this.y - other.y;
		let hypot = sqrt( sq(fx) + sq(fy) );
		if( isNaN(hypot) || hypot < 0.1 ) hypot = 0.1;
		if( hypot < 1.2*dice.height ){
			fx *= 0.05 * ( dice.height / sq(hypot) );
			fy *= 0.05 * ( dice.height / sq(hypot) );
			this.vx += fx;
			this.vy += fy;
		}
	}
};