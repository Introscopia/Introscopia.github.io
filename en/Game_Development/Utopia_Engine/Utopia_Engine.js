/*
[] pause auto-dice for people to have a chance to use the wand
[] night mode
[] (?) buttons explaining the rules of the minigames, other tooltips...
*/
var dice, mapp, mmap, UI_L, UI_R, X, tool_belt, workshop, jar, you_are_here, event_icons;

var color_health, color_components, color_energy, color_selection;

var map_x, map_y, map_w, map_h;
var mm_x, mm_y, mm_w, mm_h;     // mini map
var uir_x, uir_y, uir_w, uir_h; // User Interface Right
var uil_x, uil_y, uil_w, uil_h; // UI Left
var tb_x, tb_y, tb_w, tb_h;     // tool belt
var ig_x, ig_y, ig_w, ig_h;     // item grid
var sg_x, sg_y, sg_w, sg_h;     // stores grid
var ws_x, ws_y, ws_w, ws_h;     // workshop
var sb_x, sb_y, sb_w, sb_h;     // search box
var rb_x, rb_y, rb_w, rb_h;     // roll button
var af_x, af_y, af_w, af_h;     // activation field
var eb_x, eb_y, eb_w, eb_h;     // energy bar
var lf_x, lf_y, lf_w, lf_h;     // link field
var wb_x, wb_y, wb_w, wb_h;     // wastebasket
var frb_y; //fight roll button
var farb_x, farb_y, farb_w, farb_h;  // final activation roll button

var mouse_on_rb = false;
var mouse_on_region = -1;
var mouse_on_tool = -1;
var mouse_on_ig = -1;
var mouse_on_artifact = -1;
var mouse_on_link = -1;
var mouse_on_event = -1;

var roll_face = 0;
var dragging_dice = -1;
var dice_ceiling;
var dddx, dddy;

var copperplate_bold, copperplate_light, DejaVuSansCondensed, DejaVuSansCondensed_Bold;


 let region_names   = [ "Halebeard Peak",  "The Great Wilds", "The Root-Strangled Marshes", "Glassrock Canyon",           "The Ruined City of the Ancients", "The Fiery Maw" ];

 let artifact_names = [ "Seal of Balance", "Hermetic Mirror", "Void Gate",                  "Golden Chassis",             "Scrying Lens",                    "Crystal Battery" ];
             
 let treasure_names = [ "Ice Plate",       "Bracelet of Ios", "Shimmering Moonlace",        "Scale of the Infinity Wurm", "The Ancient Record",              "The Molten Shard" ];
             
let component_names = [ "Silver",          "Quartz",          "Gum",                        "Silica",                     "Wax",                             "Lead" ];

let monster_chart = [ [ "Ice Bear",       "Roving Bandits",    "Blood Wolves",       "Horse Eater Hawk",    "The Hollow Giant (S)" ],
					  [ "Rogue Thief",    "Blanket of Crows",  "Hornback Bison",     "Grassyback Troll",    "Thunder King"         ],
					  [ "Gemscale Boa",   "Ancient Alligator", "Land Shark",         "Abyssal Leech (S)",   "Dweller in the Tides" ],
					  [ "Feisty Gremlin", "Glasswing Drake",   "Reaching Claws (S)", "Terrible Wurm",       "Infinity Wurm (S)"    ],
					  [ "Grave Robbers",  "Ghost Lights (S)",  "Vengeful Shade (S)", "Nightmare Crab",      "The Unnamed"          ],
					  [ "Minor Imp",      "Renegade Warlock",  "Giant Flame Lizard", "Spark Elemental (S)", "Volcano Spirit (S)"   ] ];

let tool_names = [ "Paralysis Wand", "Dowsing Rod", "Focus Charm" ];

let event_names = [ "Active Monsters", "Fleeting Vision", "Good Fortune", "Foul Weather" ];


let artifact_effects = [ "                             Once per game you may ignore the effects of all events in a region of your choice. This effect lasts until you leave the region. (Click to activate once the in region)",
						 "                              You may subtract up to 10 from any search result in the Halebeard Peak and The Fiery Maw. This bonus can be used in conjunction with the Good Fortune event to subtract up to 20. (passive)",
						 "                    Whenever you fall unconscious you recover to full strength in four days instead of six. (passive)",
						 "                             Add 1 to the result of each die while in combat with spirits. Spirit encounters are noted on the monster chart with (S). This effect cannot increase a die’s value above 6. (passive)",
						 "                         You may subtract up to 10 from any search result in the Glassrock Canyon and Root-Strangled Marshes. This bonus can be used in conjunction with the Good Fortune event to subtract up to 20. (passive)",
						 "                             Spend three components to recharge a used tool belt item. (click to activate)" ];
            
let treasure_effects = [ "                  Reduce the attack range of all monsters you encounter by 1. For example, an attack range of 1-3 becomes 1-2. Minimum attack range is 1. (passive)",
						 "                            When activating an Artifact, add one energy point to the Artifact’s energy bar before starting your first attempt. (passive)",
						 "                                         You may ignore encounters. (click to activate)",
						 "                                                 Recover 1 hit point each time you cross out an event day on the time track. (passive)",
						 "                                     Change any single link value to zero. Use this ability any time before beginning final activation, and only once per game. (click to activate)",
						 "                                  Add 1 to your attack range against all monsters. For example, an attack range of 5-6 becomes 4-6. (passive)" ];

var region_rects = [ { x:  24, y: 184, w: 220, h: 64 }, { x: 428, y: 113, w: 332, h: 32 }, { x:  44, y: 506, w: 321, h: 64 }, 
					 { x: 342, y: 356, w: 380, h: 32 }, { x: 117, y: 713, w: 316, h: 64 }, { x: 508, y: 675, w: 291, h: 32 } ];
var region_centroids = [ { x: 100, y: 100 }, { x: 381, y: 133 }, { x: 110, y: 256 },
						 { x: 266, y: 261 }, { x: 140, y: 409 }, { x: 378, y: 372 } ];
var region_underlines = [ [ { xi:  27, xf: 241, y: 213 }, { xi: 27, xf: 122, y: 245 } ],
						  [ { xi: 438, xf: 755, y: 142 }, ],
						  [ { xi:  47, xf: 361, y: 535 }, { xi: 47, xf: 216, y: 567 } ],
						  [ { xi: 346, xf: 717, y: 386 }, ],
						  [ { xi: 120, xf: 343, y: 742 }, { xi: 120, xf: 427, y: 774 } ],
						  [ { xi: 511, xf: 794, y: 705 }, ] ];

var artifacts_found_checkmarks = [ { x: 169, y: 252 }, { x: 449, y: 181 }, { x: 243, y: 579 },
								   { x: 562, y: 428 }, { x: 133, y: 815 }, { x: 523, y: 744 } ];
var treasures_found_checkmarks = [ { x: 169, y: 276 }, { x: 449, y: 205 }, { x: 243, y: 603 },
								   { x: 562, y: 453 }, { x: 133, y: 839 }, { x: 523, y: 769 } ];

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
var event_rects;
var minimap_event_pos;

var region_search_trackers = [ [ -1, -1,  0, -1,  0,  0 ],
							   [ -1,  0,  0, -1,  0,  0 ],
							   [ -1,  0, -1,  0, -1,  0 ],
							   [ -1, -1,  0, -1,  0,  0 ],
							   [ -1,  0, -1,  0, -1,  0 ],
							   [ -1, -1, -1,  0, -1,  0 ] ];

var monster_attack_range = [ [1, 1], [1, 1], [1, 2], [1, 3], [1, 4] ];
var player_attack_range  = [ [5, 6], [6, 6], [6, 6], [6, 6], [6, 6] ];
var monster_attack_range_max;
var player_attack_range_min;

var monster_target;
var player_target;


var engine_parts, part_diameter, part_radius;
var engine_links, link_edge, link_radius;
var link_labels;
let link_pairs =[ [1,3], [5,0], [4,3], [0,1], [3,2], [3,5] ];

let wb_fill = { x: 31, y: 37, w: 70, h: 70 };//wastebasket fill

var UI;
var proceed_button;
var proceed = { b : false };
var item_view = { n : 0 };
var travel_back = { b : false };
var rest = { b : false };
var activate_gods_hand = { b : false };
var log_or_map = { n: 0 };
var biglog;
var days_sacrificed = { n : 0 };
var expert_plusminus;
var pay_health = { b : false };
var pay_health_button;

function preload() {
			copperplate_bold = loadFont('assets/Copperplate Gothic Bold Regular.ttf');
		   copperplate_light = loadFont('assets/CopperplateGothicLight.ttf');
		 DejaVuSansCondensed = loadFont('assets/DejaVuSansCondensed.ttf');
	DejaVuSansCondensed_Bold = loadFont('assets/DejaVuSansCondensed-Bold.ttf');

			dice = loadImage('assets/dice.png');
			mapp = loadImage('assets/map_regions.png');
			mmap = loadImage('assets/map.png');
			UI_R = loadImage('assets/UI-R.png');
			UI_L = loadImage('assets/UI-L.png');
	   tool_belt = loadImage('assets/UI-tools.png');
		workshop = loadImage('assets/workshop.png');
	you_are_here = loadImage('assets/you_are_here.png');
			   X = loadImage('assets/x.png');
			 jar = loadImage('assets/jar.png');
	event_icons = Array(4);
	event_icons[0] = loadImage('assets/monster.png');
	event_icons[1] = loadImage('assets/eye.png');
	event_icons[2] = loadImage('assets/clover.png');
	event_icons[3] = loadImage('assets/thundercloud.png');
}

var moment = 0;

var region;
var hitpoints;
var tools;
var day;
var rest_combo;
var rest_bonus_awarded;
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
var paralysis_wand_effect;
var seal_of_balance_effect;
var seal_of_balance_used;
var ancient_recording;
var ancient_recorded;
var selecting_components_for_battery;
var selecting_tool_to_recharge;

var activating;
var activation_field;
var energy_bar;
var activation_attempt;
var linking;
var linkage_field;
var link_values;
var wastebasket;

var ready_for_final;
var activation_difficulty;
var final_failure;
var utopia_engine_activated;

var score_breakdown;
var final_score;

var log;



var cx, cy;
function setup() {
	//1342 - 646
	width = windowWidth -24;
	height = windowHeight -8;
	let aspect_ratio = width/height;
	if( aspect_ratio < 1.97 || aspect_ratio > 2.1 ){
		height = width / 2.077;
		if( height > windowHeight -8 ){
			height = windowHeight -8;
			width = height * 2.077;
		}
	}
	var canvas = createCanvas( width, height );
	canvas.parent('sketch-holder');

	cx = round(width/2.0);
	cy = round(height/2.0);

	noLoop();
	strokeCap(SQUARE);



	/* DICE TEST: Yup! it's pretty good.
	let co = [ 0, 0, 0, 0, 0, 0 ];
	for (var i = 0; i < 6000; i++) {
		co[ floor(random(0,6)) ] += 1;
	}
	console.log(co);
	*/


	let color_mono = color( "#d37001" );
	color_health = color_mono;
	color_components = color_mono;
	color_energy = color_mono;
	color_selection = color_mono;




	let Ar = mapp.width / mapp.height;
	let Br = width / height;
	var mapscale = 1;
	/*if( Ar > Br ){
		mapscale = width / mapp.width;
		map_h = mapp.height * mapscale;
		map_x = 0;
		map_y = (height - map_h) / 2;
		map_w = width;
	}
	else {*/
		mapscale = height / mapp.height;
		map_w =  mapp.width * mapscale;
		map_x = ((width - map_w) / 2);
		map_y = 0;
		map_h = height;
	//}

	for( var i = 0; i < 6; ++i ){
		region_rects[ i ].x = map_x + ( region_rects[ i ].x * mapscale );
		region_rects[ i ].y = map_y + ( region_rects[ i ].y * mapscale );
		region_rects[ i ].w *= mapscale;
		region_rects[ i ].h *= mapscale;

		for ( var j = 0; j < region_underlines[i].length; j++ ) {
			region_underlines[ i ][ j ].xi = map_x + ( region_underlines[ i ][ j ].xi * mapscale );
			region_underlines[ i ][ j ].xf = map_x + ( region_underlines[ i ][ j ].xf * mapscale );
			region_underlines[ i ][ j ].y = map_y + ( region_underlines[ i ][ j ].y * mapscale );
		}

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
	sg_x = uil_x + ( 159 * uilscale );
	sg_y = uil_x + ( 0 * uilscale );
	sg_w = 146 * uilscale;
	sg_h = 191 * uilscale;

	
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

	let engine_y = 0.25 * map_h;

	let engine_w = 0.76 * map_w;
	let engine_x = map_x + 0.12 * map_w;
	part_diameter = 0.286 * engine_w;
	part_radius = part_diameter / 2.0;
	let tri = 1.5 * part_diameter;
	let trih = 0.8660254 * tri;
	engine_parts = Array(6);
	engine_parts[4] = { x: engine_x + part_radius, y: engine_y + part_radius };          //top left, scrying lens
	engine_parts[2] = { x: engine_x + engine_w - part_radius, y: engine_y + part_radius };          //top right, void gate
	engine_parts[3] = { x: map_x + (0.5   * map_w)              , y: engine_y + part_radius + tri/2 };  //center, Golden Chassis
	engine_parts[1] = { x: engine_parts[4].x,                     y: engine_y + part_radius + tri };    //bottom left, hermetic mirror
	engine_parts[5] = { x: engine_parts[2].x,                     y: engine_y + part_radius + tri };    //bottom right, crystal battery
	engine_parts[0] = { x: map_x + (0.5   * map_w)              , y: engine_y + part_radius + 1.5*tri };//bottom center, Seal of Balance

	link_edge = part_diameter/4.0;
	link_radius = link_edge/2.0;
	engine_links = Array(6);
	engine_links[2] = {x: engine_parts[4].x + trih/2, y: engine_y + part_radius + 0.25*tri  };//top left, Gum
	engine_links[4] = {x: engine_parts[2].x - trih/2, y: engine_links[2].y };                 //top right, Wax
	engine_links[0] = {x: engine_links[2].x,          y: engine_y + part_radius + 0.75*tri }; //middle left, silver
	engine_links[5] = {x: engine_links[4].x,          y: engine_links[0].y };                 //middle right, Lead
	engine_links[3] = {x: engine_links[2].x,          y: engine_y + part_radius + 1.25*tri }; //bottom left,
	engine_links[1] = {x: engine_links[4].x,          y: engine_links[3].y };                 //bottom right, quartz

	link_labels = Array(6);
	link_labels[0] = -0.2  * link_edge; //- 8
	link_labels[1] = -0.15 * link_edge; //- 6
	link_labels[2] =  0; //   
	link_labels[3] =  0.05 * link_edge; //+ 2
	link_labels[4] = -0.05 * link_edge; //- 2
	link_labels[5] =  0.1  * link_edge; //+ 4

	af_x = sb_x;
	af_y = sb_y; 
	af_w = (0.6 * map_w)/4.3;
	af_h = (0.25 * map_h) / 2.0;

	eb_w = 0.333 * map_w;
	eb_x = map_x + (0.333 * map_w);
	eb_w /= 4.3;
	eb_h = eb_w;
	eb_x += eb_w/2;
	eb_y = af_y - 0.575*eb_w;	

	lf_x = map_x + 0.25*map_w;
	lf_y = sb_y; 
	lf_w = (0.5 * map_w)/3.2;
	lf_h = af_h;

	wb_x = map_x + 5;
	wb_y = height - jar.height - 5;
	wb_w = jar.width;
	wb_h = jar.height;
	wb_fill.x = wb_x + ( wb_fill.x );// * 1 );
	//console.log( wb_y, wb_fill.y );
	wb_fill.y = wb_y + ( wb_fill.y );// * 1 );
	//wb_fill.w *= 1;
	//wb_fill.h *= 1;
	wb_fill.y += wb_fill.h;
	wb_fill.h /= 10;

	farb_x = cx - (dice.height/2.0);
	farb_y = map_h * 0.8;
	farb_w = dice.height;
	farb_h = dice.height;


	UI = Array(8);

	UI[0] = new intSet( ma, tb_y + 1.2*tb_h, uil_w/2, bh, 'Artifacts', 0 );
	UI[1] = new intSet( ma+uil_w/2, tb_y + 1.2*tb_h, uil_w/2, bh, 'Treasures', 1 );

	ig_x = ma;
	ig_y = tb_y + 1.2*tb_h + bh;
	ig_w = uil_w / 3.0;
	ig_h = (height - ig_y - 3) / 2.0;

	UI[2] = new Toggle( round(map_x + map_w + ma), round(height -   bh - 3), round(width - map_x - map_w - 3*ma), bh, 'Return to Workshop' );
	UI[3] = new Toggle( UI[2].x, round(height - 2*bh - 6), UI[2].w, bh, 'Rest' );
	UI[4] = new Toggle( UI[2].x, round(height - 3*bh - 9), UI[2].w, bh, "Activate God's Hand" );
	UI[5] = new intSet( UI[2].x,                    round(uir_y + uir_h + 3), UI[2].w/2, bh, 'Log', 0 );
	UI[6] = new intSet( UI[2].x + (UI[2].w/2), round(uir_y + uir_h + 3), UI[2].w/2, bh, 'Map', 1 );
	UI[7] = new Text_viewer( UI[2].x, round(uir_y + uir_h + bh + 6), UI[2].w, UI[4].y - uir_y - uir_h - bh - 9 );

	biglog = new Text_viewer( cx + 20, 0.4*height -30, cx -40, cy );

	expert_plusminus = new PlusMinus( width-220, height - 60, 200, 40, 1, "Expert Mode" );

	pay_health_button = new Toggle( UI[2].x, UI[2].y, UI[2].w, UI[2].h, "Spend Hit Points" );

	Ar = mmap.width / mmap.height;
	Br = UI[7].w / UI[7].h;
	let mmscale = 1;
	if( Ar > Br ){
		mmscale = UI[7].w / mmap.width;
		mm_h = mmap.height * mmscale;
		mm_x = UI[7].x;
		mm_y = UI[7].y + (( UI[7].h - mm_h ) / 2);
		mm_w = UI[7].w;
	}
	else {
		mmscale = UI[7].h / mmap.height;
		mm_w = mmap.width * mmscale;
		mm_x = UI[7].x + (( UI[7].w - mm_w ) / 2);
		mm_y = UI[7].y;
		mm_h = UI[7].h;
	}

	for( var i = 0; i < 6; ++i ){
		region_centroids[ i ].x = mm_x + ( region_centroids[ i ].x * mmscale );
		region_centroids[ i ].y = mm_y + ( region_centroids[ i ].y * mmscale );
		region_centroids[ i ].w *= mmscale;
		region_centroids[ i ].h *= mmscale;
	}



	proceed_button = new Toggle( sb_x, height - 1.5*bh - 3, 3*sb_w, 1.5*bh, "Search Again" );

	ws_w =  workshop.width * (height / workshop.height);
	ws_x = ((width - ws_w) / 2);
	ws_y = 0;
	ws_h = height;

	result = { b: false };
	dice_objs = Array(0);
}












function draw() {
	switch( moment ){

		case 0: //     --o-- --o-- --o-- --o-- --o-- MAIN MENU  --o-- --o-- --o-- --o-- --o-- --o 
			{
			background(255);

			fill( 0 ); noStroke();
			textAlign( CENTER, CENTER );

			textFont( copperplate_bold, 60 );
			text( "Utopia Engine", width/2, height/4 );

			textFont( copperplate_bold, 40 );
			text( "Play", width/2, height/2 );

			textFont( copperplate_light, 20 );
			textAlign( LEFT, BOTTOM );
			text( "Designed by  Nick Hayes\nWeb version by Introscopia\nMade with p5.js", 100, height-100 );
			}
			break;

		case 1: //--o-- --o-- --o-- --o-- --o-- GAME INITIALIZATION  --o-- --o-- --o-- --o-- --o--
			{
			background(255);
			textAlign( LEFT, TOP );
			rectMode(CORNER);
			textFont( DejaVuSansCondensed, 20 );
			text( "    In this game you play as Isodoros, a talented Artificer who has been charged with reconstructing a fabled device called the Utopia Engine. The Utopia Engine is an assembly of several powerful devices, called Artifacts, that sustained an idyllic society millennia ago. Using years of research based on scraps of crumbling texts, you have finally deduced the locations of the Engine’s six primary parts. Your guild believes that these six Artifacts are enough to reactivate the Utopia Engine. All that is left is for you is to find them, activate their internal energies, and reassemble the Engine.\n    Standing in your way are unscrupulous leaders, deadly terrain, and violent creatures. But even more pressing is the fast-approaching Doomsday, which has thrown the world into chaos. For generations, a machine known as the God’s Hand, the pride of the Artificers, had been staying the apocalypse. But now that the end is so close, the device is failing. It is believed that the mythical Utopia Engine is the only way left to avert Doomsday. You have two weeks to reconstruct and activate the Engine. If you fail, the world will be destroyed.", width*0.1, height*0.1, width*0.8, height*0.8 );

			textAlign( CENTER, CENTER );
			textFont( copperplate_bold, 40 );
			text( "Continue", width/2, height*0.75 );

			expert_plusminus.display( days_sacrificed );

			}
			break;

		case 2: //   --o-- --o-- --o-- --o-- --o-- THE WILDERNESS --o-- --o-- --o-- --o-- --o-- --
			{


			background(255);

			if( region < 0 ){

				imageMode(CORNER);
				image( mapp, map_x, map_y, map_w, map_h, 0, 0 );

				fill(0); noStroke();
				textAlign( CENTER, CENTER );
				textFont( copperplate_bold, 30 );
				text( "The Wilderness", cx, map_y + (0.03*map_h) );

				if( mouse_on_region >= 0 ){
					stroke( color_selection );
					strokeWeight(2); 
					for (var i = 0; i < region_underlines[ mouse_on_region ].length; i++) {
						line( region_underlines[ mouse_on_region ][i].xi, region_underlines[ mouse_on_region ][i].y,
								region_underlines[ mouse_on_region ][i].xf, region_underlines[ mouse_on_region ][i].y );
					}
					strokeWeight(1);
				}

				textAlign( CENTER, CENTER );

				for (var i = 0; i < 4; i++) {
					if( event_cycles[i] >= 0 ){
						image( event_icons[i], event_rects[i].x, event_rects[i].y );
					}
				}

				fill( color_selection );
				noStroke();
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

						textSize( 28 );
						textAlign( CENTER, CENTER );
						strokeWeight(2);
						proceed_button.display( proceed );
						strokeWeight(1);
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
						if( player_attack_range_min == player_attack_range[ enemy_lvl-1 ][1] ){
							text( player_attack_range_min, monster_target.x, monster_target.y - 4 );
						}
						else{
							text( player_attack_range_min+"-"+player_attack_range[ enemy_lvl-1 ][1], 
								  monster_target.x, monster_target.y - 4 );
						}

						if( monster_attack_range[ enemy_lvl-1 ][0] == monster_attack_range_max ){
							text( monster_attack_range[ enemy_lvl-1 ][0], player_target.x, player_target.y - 4 );
						}
						else{
							text( monster_attack_range[ enemy_lvl-1 ][0]+"-"+monster_attack_range_max, 
								  player_target.x, player_target.y - 4 );
						}



						//ROLL BUTTON
						if( mouse_on_rb && frameCount % 5 == 0) roll_face = floor(random(0, 6));
						imageMode(CORNER);
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
							//dice_objs[i].display();
							dice_objs[i].repel( monster_target );
							dice_objs[i].repel( player_target );

							if( dice_objs[i].auto ){

								if( dist( dice_objs[i].x, dice_objs[i].y, dice_objs[i].target_X, dice_objs[i].target_Y ) < 3 ){

									if( dice_objs[i].y < frb_y ){// WON THE FIGHT

										if( !enemy_defeated ){
											log_entry( "•You defeat the "+monster_chart[ region ][ enemy_lvl-1 ]+"!\n");
										}

										enemy_defeated = true;
									}
									else{// TOOK A HIT
										take_hits( 1 );
									}

									dice_objs.splice( i, 1 );

								}
							}
							else if( dist( 0, 0, dice_objs[i].vx, dice_objs[i].vy ) < 1 ){

								// PARALYSIS WAND
								if( paralysis_wand_effect ){
									dice_objs[i].face += 2;
									if( dice_objs[i].face > 5 ) dice_objs[i].face = 5;
								}

								dice_objs[i].set_target();

								
								if( !dice_objs[i].auto){

									dice_objs.splice( i, 1 );
								}
							}

							if( dice_objs.length == 0 ){

								//I think this hitpoints check is extraneous.. but I'll leave it in for safety
								if( hitpoints > 0 && enemy_defeated ){

									paralysis_wand_effect = false;

									UI[2].label = "Return to Wilderness";
									if( region_searches[ region ] >= 5 ){
										proceed_button.label = "Region fully searched.";
									}
									else proceed_button.label = "Search again";

									let roll = floor(random(0, 6));
									if( roll <= enemy_lvl ){
										if( enemy_lvl == 5 ){
											treasures_found[ region ] = true;
											log_entry( "•"+monster_chart[ region ][ enemy_lvl-1 ]+" drops a legendary treasure, the "+treasure_names[ region ]+"!\n");
										}
										else{
											component_stores[ region_components[ region ] ] += 1;
											if( component_stores[ region_components[ region ] ] > 4 ){
												component_stores[ region_components[ region ] ] = 4;
											}
											log_entry( "•"+monster_chart[ region ][ enemy_lvl-1 ]+" drops a component!\n");
										}
									}

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
						if( i < search_tracker ) fill(60);
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
					imageMode(CORNER);
					image( dice, rb_x, rb_y, rb_w, rb_w, roll_face*rb_w, 0, rb_w, rb_w );

					fill(0);
					noStroke();
					textFont( copperplate_bold, 23 );
					textAlign(CENTER, TOP);
					text("ROLL", rb_x + (0.5*rb_w), rb_y + rb_w );

					// dice used to live here

					if( result.b ){

						fill(0);
						textFont( copperplate_bold, 70 );
						if( result.n < 0 && result.digits[0] == 0 ){//all because of stupid "-0"
							textAlign( RIGHT, CENTER );
							text( "-", sb_x + 0.5*sb_w-(textWidth("0")/2)-2, sb_y + 2.3*sb_h );
						}
						textAlign( CENTER, CENTER );
						for (var i = 0; i < 3; i++) {
							text( result.digits[ i ], sb_x + (i+0.5)*sb_w, sb_y + 2.3*sb_h );
						}

						textSize( 28 );
						strokeWeight(2);
						proceed_button.display( proceed );
						strokeWeight(1);
					}
				}
			}

			

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

					dice_ceiling = sb_y + 2*sb_h;
					//dice_objs = Array(0);

					region_searches[ region ] += 1;
					let passage_of_time = -region_search_trackers[ region ][ search_tracker-1 ];
					if( passage_of_time > 0 && event_cycles[ 3 ] == region && !seal_of_balance_effect ){// FOUL WEATHER
						passage_of_time *= 2;
						log_entry( "•Foul Weather causes you to waste time...\n");
					}
					console.log( "p.o.t.", passage_of_time );
					advance_day( passage_of_time );
				}
				else if( proceed_button.label[0] == 'F' ){//Fight

					fighting = true;
					rolls = 0;
					result.b = false;
					enemy_defeated = false;
					UI[2].label = "...";

					dice_ceiling = 0;

					if( result.n > 0 ) enemy_lvl = result.digits[0];
					else{
						     if( result.n >= -100 ) enemy_lvl = 1;
						else if( result.n >= -200 ) enemy_lvl = 2;
						else if( result.n >= -300 ) enemy_lvl = 3;
						else if( result.n >= -400 ) enemy_lvl = 4;
						else if( result.n >= -555 ) enemy_lvl = 5;
					}

					// ACTIVE MONSTERS
					if( event_cycles[ 0 ] == region && !seal_of_balance_effect ){
						enemy_lvl += 2;
						if( enemy_lvl > 5 ) enemy_lvl = 5;
					}

					log_entry( "•The "+monster_chart[ region ][ enemy_lvl-1 ]+" appears! Prepare to fight.\n" );
	

					monster_attack_range_max = monster_attack_range[ enemy_lvl-1 ][1];
					player_attack_range_min  = player_attack_range [ enemy_lvl-1 ][0];

					// ICE PLATE
					if( treasures_found[ 0 ] ){
						if( monster_attack_range_max > 1 ) monster_attack_range_max -= 1;
						log_entry( "•The Ice Plate will make you tougher in this fight!.\n");
					}
					// MOLTEN SHARD
					if( treasures_found[ 5 ] ){
						player_attack_range_min -= 1;
						log_entry( "•The Molten Shard will make you stronger in this fight!.\n");
					}
				}
				else if( proceed_button.label[0] == 'R' ){//Region fully searched
					travel_back.b = true;
					if( !artifacts_found[ region ] ){
						advance_day( 1 );
						artifacts_found[ region ] = true;//Extensive search rule

						log_entry( "•By searching the region extensively you finally find the "+ artifact_names[ region ] +".\n");
					}
				}

				proceed.b = false;
			}

			}
			break;

		case 3: //   --o-- --o-- --o-- --o-- --o-- THE WORKSHOP --o-- --o-- --o-- --o-- --o-- --o 
			{
			background(255);
			

			if( activating < 0 && linking < 0 ){

				imageMode(CORNER);
				image( workshop, ws_x, ws_y, ws_w, ws_h, 0, 0 );

				stroke(0); strokeWeight(16);
				for (var i = 0; i < 6; i++) {
					line( engine_parts[ link_pairs[i][0] ].x, engine_parts[ link_pairs[i][0] ].y,
						  engine_parts[ link_pairs[i][1] ].x, engine_parts[ link_pairs[i][1] ].y );
				}

				for (var i = 0; i < 6; i++) {
					stroke(0); strokeWeight(3);
					fill(236);
					if( mouse_on_artifact == i || artifacts_activated[i] ) fill(255);
					ellipse( engine_parts[i].x, engine_parts[i].y, part_diameter, part_diameter );
					rectMode(CENTER);
					fill(236);
					if( mouse_on_link == i ) fill(255);
					rect( engine_links[i].x, engine_links[i].y, link_edge, link_edge );

					noStroke();
					fill(180);
					if( artifacts_activated[i] ) fill( color_energy );
					else if( artifacts_found[i] ) fill(0);
					textFont( copperplate_bold, 20 );
					textAlign(CENTER, CENTER);
					text( artifact_names[i], engine_parts[i].x, engine_parts[i].y, part_diameter*0.82, part_diameter*0.82 );


					if( link_values[i] >= 0 ){
						fill(0); noStroke();
						textSize(27);
						text( link_values[i], engine_links[i].x + (0.09*link_edge), engine_links[i].y - (0.07*link_edge), link_edge, link_edge );
					}

					fill(0); stroke(255); strokeWeight(2);
					textSize(13);
					textAlign(CENTER, BOTTOM);
					text( component_names[i], engine_links[i].x + link_labels[i], engine_links[i].y - link_radius );
				}
				

				if( ready_for_final ){
					textSize( 30 );
					fill(255); strokeWeight(12); stroke(color_energy);
					textAlign(CENTER, TOP);
					text( "Final\nActivation", cx, map_y + (0.1*map_h) );
				}

				strokeWeight(1);
			}
			else{

				//ROLL BUTTON
				fill(255); noStroke();
				rect( rb_x, rb_y + rb_w, rb_w, 25, 0, 0, 4, 4 );
				if( mouse_on_rb && frameCount % 5 == 0) roll_face = floor(random(0, 6));
				imageMode(CORNER);
				image( dice, rb_x, rb_y, rb_w, rb_w, roll_face*rb_w, 0, rb_w, rb_w );

				fill(0);
				noStroke();
				textFont( copperplate_bold, 23 );
				textAlign(CENTER, TOP);
				text("ROLL", rb_x + (0.5*rb_w), rb_y + rb_w );
			}

			fill(0); strokeWeight(14); stroke(255);
			textAlign( CENTER, CENTER );
			textFont( copperplate_bold, 40 );
			let txy = map_y + (0.03*map_h);
			text( "The Workshop", cx, txy );
			txy += 0.75 * textAscent()+textDescent();

			if( activating >= 0 ){

				textAlign( CENTER, TOP );
				fill(0); noStroke();//stroke(255);
				textFont( copperplate_bold, 26);
				text( "Activating the "+artifact_names[ activating ], map_x + (0.1*map_w), txy, (0.80*map_w), 100 );

				textAlign( CENTER, CENTER );
				textSize(50);
				for (var i = 0; i < 4; i++) {

					let ax = af_x + (i*af_w * 1.1);

					for (var j = 0; j < 2; j++) {
						fill(255); stroke(0); strokeWeight(3);
						rect( ax, af_y + j*af_h, af_w, af_h );

						if( activation_field[i][j] > 0 ){
							fill(0); noStroke();
							text( activation_field[i][j], ax + (0.055*af_w), af_y + j*af_h - (0.05*af_h), af_w, af_h );
						}
					}
					fill(255); stroke(0); strokeWeight(3);
					ellipse( ax + (0.5*af_w), af_y + 2.5*af_h, af_h, af_h );

					if( energy_bar > i ) fill( color_energy );
					else fill( 255 ); 
					ellipse( eb_x + (i*1.1*eb_w), eb_y, eb_w, eb_h );

					if( result.digits[i] != 0 ){
						fill(0); noStroke();
						text( result.digits[i], ax + (0.055*af_w), af_y + 2*af_h - (0.05*af_h), af_w, af_h );
					}
				}
				strokeWeight(1);

				noStroke(); fill(0);
				textFont( copperplate_light, 20);
				textAlign( CENTER, BOTTOM );
				let str = "1st Attempt";
				if( activation_attempt > 0 ) str = "2nd Attempt";
				text( str, cx, eb_y - (eb_h/2) - 5 );

				if( result.b ){

					rectMode(CORNER);
					textAlign( CENTER, CENTER );
					textFont( copperplate_bold, 28);
					strokeWeight(2);
					proceed_button.display( proceed );
					strokeWeight(1);

					if( proceed.b ){
						if( proceed_button.label[0] == 'P' ){
							activating = -1;
							UI[2].label = "Return to Wilderness";
						}
						else if( proceed_button.label[0] == 'T' ){
							advance_day( 1 );
							activation_attempt += 1;
							activation_field = [ [0,0], [0,0], [0,0], [0,0] ];
							for( var i = 0; i < 4; ++i ) result.digits[i] = 0;
							result.b = false;
							rolls = 0;
						}
						proceed.b = false;
					}
				}
				

			}
			else if( linking >= 0 ){
				
				textAlign( CENTER, TOP );
				fill(0); noStroke();//stroke(255);
				textFont( copperplate_bold, 25);
				text( "Linking the "+artifact_names[ link_pairs[linking][0] ]+" to the "+
					                 artifact_names[ link_pairs[linking][1] ], map_x + (0.1*map_w), txy, (0.80*map_w), 100 );

				textAlign( CENTER, CENTER );
				textSize(50);
				for (var i = 0; i < 3; i++) {
					let lx = lf_x + i*(lf_w * 1.1);
					for (var j = 0; j < 2; j++) {
						fill(255); stroke(0); strokeWeight(3);
						rect( lx, lf_y + j*lf_h, lf_w, lf_h );

						if( linkage_field[i][j] > 0 ){
							fill(0); noStroke();
							text( linkage_field[i][j], lx + (0.055*lf_w), lf_y + j*lf_h - (0.05*lf_h), lf_w, lf_h );
						}
					}
					fill(255); stroke(0); strokeWeight(3);
					ellipse( lx + (0.5*lf_w), lf_y + 2.5*lf_h, lf_h, lf_h );

					if( result.digits[i] >= 0 ){
						fill(0); noStroke();
						text( result.digits[i], lx + (0.055*lf_w), lf_y + 2*lf_h - (0.05*lf_h), lf_w, lf_h );
					}
				}
				strokeWeight(1);

				rectMode(CORNER);
				noStroke(); fill(180);
				let h = wastebasket * wb_fill.h;
				rect( wb_fill.x, wb_fill.y - h, wb_fill.w, h );

				image( jar, wb_x, wb_y, wb_w, wb_h );

				noStroke(); fill(0);
				textFont( copperplate_light, 20);
				textAlign( LEFT, BOTTOM );
				text("Wastebaket", wb_x + wb_w, height - 5 );
			}

			}
			break;

		case 4://  --o-- --o-- --o-- --o-- --o-- FINAL ACTIVATION --o-- --o-- --o-- --o-- --o-- --
			{
				background(255);

				textFont( copperplate_bold, 50 );
				fill(255); strokeWeight(14); stroke(color_energy);
				textAlign(CENTER, TOP);
				text( "Final Activation", cx, map_y + (0.1*height) );

				textSize(45);
				textAlign(CENTER, CENTER);
				fill(0); noStroke();
				text( activation_difficulty, cx, height*0.45 );

				if( mouse_on_rb && frameCount % 5 == 0) roll_face = floor(random(0, 6));
				imageMode(CORNER);
				image( dice, farb_x, farb_y, farb_w, farb_h, roll_face*rb_w, 0, rb_w, rb_w );

				if( dice_objs.length == 2 ){
					dice_objs[0].repel( dice_objs[1] );
					dice_objs[1].repel( dice_objs[0] );
					for (var i = 0; i < dice_objs.length; i++) {
						dice_objs[i].display();
					}
					if( !final_failure && 
						dist( 0, 0, dice_objs[0].vx, dice_objs[0].vy ) < 0.1 && 
						dist( 0, 0, dice_objs[1].vx, dice_objs[1].vy ) < 0.1 ){

						let FR = dice_objs[0].face + dice_objs[1].face + 2;
						if( FR >= activation_difficulty ){
							log_entry( "•The Utopia Engine bursts to life in a blinding flash!! Doomsday is averted. You win!\n");
							utopia_engine_activated = true;
							tally_up();
						}
						else{
							final_failure = true;

							hitpoints -= 1;
							if( hitpoints < 0 ){
								log_entry( "•Isodoros was killed trying to activate the Utopia Engine.\n");
								tally_up();
							}
							else{
								log_entry( "•You failed to activate the Utopia Engine today.\n");
								day += 1;
								if( day >= 15 + doomsday_delay ){
									tally_up();
								}
							}
						}

					}
				}
				else{
					strokeWeight(1);
					textFont( copperplate_bold, 18 );
					pay_health_button.display( pay_health );

					if( pay_health.b ){
						if( hitpoints > 0 ){
							hitpoints -= 1;
							activation_difficulty -= 1;
						}
						pay_health.b = false;
					}
				}
			}
			break;

		case 5://      --o-- --o-- --o-- --o-- --o-- GAME OVER --o-- --o-- --o-- --o-- --o-- --o--
			{
			background(255);

			fill(0); noStroke();
			textAlign( CENTER, CENTER );
			textFont( copperplate_bold, 60 );
			text( "Game Over", cx, 0.08*height );

			textFont( copperplate_bold, 30 );
			if( utopia_engine_activated ){
				text( "The world is saved. You Win!", cx, 0.2*height );
			}
			else{
				text( "The world was destroyed.", cx, 0.2*height );
			}

			textFont( copperplate_light, 18 );
			text( "press any key to return", cx, height - 20 );

			textAlign( RIGHT, TOP );

			textFont( copperplate_bold, 25 );
			text( "Scoring", cx, 0.4*height -30 );

			textFont( copperplate_light, 25 );
			for (var i = 0; i < score_breakdown.length; i++) {
				text( score_breakdown[i], cx, 0.4*height + (26*i) );
			}
			textFont( copperplate_bold, 25 );
			text( "Final Score: "+final_score, cx, 0.4*height + 265 );

			rectMode(CORNER);
			biglog.display(log);

			}
			break;
	}

	strokeWeight(1);

	//UI-R
	if( moment == 2 || moment == 3 || final_failure ){
		rectMode(CORNER);
		fill( color_health ); noStroke();
		rect( hp_x[ hitpoints ], hp_y, hp_r - hp_x[ hitpoints ], hp_h );

		fill( color_energy ); 
		for( var i = 0; i < gods_hand; ++i ){
			if( i > 6 ) break;
			circle( gods_hand_dot.x, gods_hand_dot.y - (i*gods_hand_dot_diameter), 0.65* gods_hand_dot_diameter );
		}

		imageMode(CORNER);
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
	}

	//UI-rest
	if( moment == 2 || moment == 3 ){
		
		rectMode(CORNER);
		textAlign( CENTER, CENTER );
		//item grid
		for( var i = 0; i < 3; ++i ){
			for( var j = 0; j < 2; ++j ){
				stroke(0);
				noFill();
				rect( ig_x + (i * ig_w), ig_y + (j * ig_h), ig_w, ig_h );
				noStroke();
				if( item_view.n == 0 ){
					textFont( copperplate_bold, 18 );
					fill(200);
					if( artifacts_found[ (j*3)+i ] ) fill( 0 );
					if( artifacts_activated[ (j*3)+i ] ) fill( color_energy );
					text( artifact_names[ (j*3)+i ], ig_x + (i * ig_w) + 3, ig_y + (j * ig_h), ig_w, ig_h );
						
				}
				else if ( item_view.n == 1 ){
					textFont( copperplate_bold, 16 );
					fill(200);
					if( treasures_found[ (j*3)+i ] ) fill( 0 );
					text( treasure_names[ (j*3)+i ], ig_x + (i * ig_w) + 3, ig_y + (j * ig_h), ig_w, ig_h );
				}
			}
		}


		noStroke();
		fill( color_components );
		for( var i = 0; i < 6; ++i ){
			for( var cc = 0; cc < 4; ++cc ){
				if( component_stores[i] > cc ){
					circle( stores_dots[ (i*4)+cc ].x, stores_dots[ (i*4)+cc ].y, stores_dots_diameter );
				}
			}
		}
		image( UI_L, uil_x, uil_y, uil_w, uil_h, 0, 0 );

		
		image( tool_belt, tb_x, tb_y, tb_w, tb_h, 0, 0 );

		if( mouse_on_tool >= 0 ){
			fill(color_selection); noStroke();
			rect( tool_boxes[ mouse_on_tool ].x, tool_boxes[ mouse_on_tool ].y, tool_box_width, tool_box_width );
		}
		fill(0);noStroke();
		textAlign( CENTER, CENTER );
		textFont( copperplate_bold, 18 );
		for (var i = 0; i < 3; i++) {
			text( tools[i], tool_boxes[i].x + 2, tool_boxes[i].y -2, tool_box_width, tool_box_width );
		}

		textFont( copperplate_bold, 24 );
		UI[0].display( item_view );
		UI[1].display( item_view );
		textFont( copperplate_bold, 18 );
		UI[4].display( activate_gods_hand );
		UI[3].display( rest );
		UI[2].display( travel_back );
		UI[5].display( log_or_map );
		UI[6].display( log_or_map );
		if( log_or_map.n == 0 ){
			UI[7].display( log );
		}
		else{ // MINIMAP

			image( mmap, mm_x, mm_y, mm_w, mm_h );

			stroke(0);
			noFill();
			rect( mm_x, mm_y, mm_w, mm_h );

			imageMode(CENTER);

			if( event_cycles[0] >= 0 ){
				for (var i = 0; i < 4; i++) {
					image( event_icons[i], minimap_event_pos[i].x, minimap_event_pos[i].y );
				}
			}
			if( region >= 0 ){
				image( you_are_here, minimap_event_pos[4].x, minimap_event_pos[4].y );
			}
		}

		if( moment == 2 && mouse_on_event >= 0 ){
			fill(0); stroke(255); strokeWeight(12);
			textFont( DejaVuSansCondensed, 20 );
			textAlign( CENTER, BOTTOM );
			text( event_names[ mouse_on_event ], event_rects[ mouse_on_event ].x + ( event_rects[ mouse_on_event ].w / 2 ),
												 event_rects[ mouse_on_event ].y - 3 );
			strokeWeight(1);
		}

		if( dice_objs.length == 2 ){
			if( dragging_dice != 0 ) dice_objs[0].repel( dice_objs[1] );
			if( dragging_dice != 1 ) dice_objs[1].repel( dice_objs[0] );
		}
		imageMode(CORNER);
		for (var i = 0; i < dice_objs.length; i++) {
			dice_objs[i].display();
			if( dragging_dice != i ){
				if( dice_objs[i].y > height - dice.height ) dice_objs[i].vy -= 0.4;
				if( dice_objs[i].y < dice_ceiling ) dice_objs[i].vy += 0.4;
			}
		}

		if( mouse_on_ig >= 0 ){
			fill(255); stroke(0); strokeWeight(2);
			rect( map_x+7, ig_y+ig_h, map_w-9, ig_h, 3, 3, 3, 3 );
			fill(0); noStroke(); strokeWeight(1);
			textAlign(LEFT,TOP);
		     if( item_view.n == 0 ){
		     	textFont( DejaVuSansCondensed_Bold, 18 );
		     	text( artifact_names[ mouse_on_ig ]+": ", map_x + 12, ig_y + ig_h + 5 );
		     	//let tw = textWidth( artifact_names[ mouse_on_ig ]+": " );
		     	textFont( DejaVuSansCondensed, 18 );
		     	text( artifact_effects[ mouse_on_ig ], map_x + 12, ig_y + ig_h + 5, map_w-14, ig_h );
		     }
		     else if( item_view.n == 1 ){
		     	textFont( DejaVuSansCondensed_Bold, 18 );
		     	text( treasure_names[ mouse_on_ig ]+": ", map_x + 12, ig_y + ig_h + 5 );
		     	//let tw = textWidth( artifact_names[ mouse_on_ig ]+": " );
		     	textFont( DejaVuSansCondensed, 18 );
		     	text( treasure_effects[ mouse_on_ig ], map_x + 12, ig_y + ig_h + 5, map_w-14, ig_h );
		     }
		}
	}

	if( travel_back.b ){
		if( moment == 2 ){
			if( region < 0 ){
				UI[2].label = "Return to Wilderness";
				moment = 3;
				mouse_on_artifact = -1;
				mouse_on_link = -1;
			}
			else{
				if( rolls == 0 || ( result.b && proceed_button.label[0] != 'F' ) || enemy_defeated ){

					if( rolls > 0 ){
						region_searches[ region ] += 1;
						let passage_of_time = -region_search_trackers[ region ][ search_tracker-1 ];
						if( passage_of_time > 0 && event_cycles[ 3 ] == region && !seal_of_balance_effect ){// FOUL WEATHER
							passage_of_time *= 2;
							log_entry( "•Foul Weather causes you to waste time...\n");
						}
						//console.log( "p.o.t.", passage_of_time );
						advance_day( passage_of_time );
					}
					fighting = false;
					region = -1;
					UI[2].label = "Return to Workshop";
					if( seal_of_balance_effect ){
						seal_of_balance_effect = false;
						seal_of_balance_used = true;
					}
				}
			}
		}
		else if( moment == 3 ){
			moment = 2;
			UI[2].label = "Return to Workshop";
		}
		rest_combo = 0;
		rest_bonus_awarded = false;
		travel_back.b = false;
	}

	if( activate_gods_hand.b ){
		if( gods_hand >= 3 && doomsday_delay < 7 ){
			gods_hand -= 3;
			doomsday_delay += 1;
			log_entry( "•The God's Hand device delays the end of the world by a day.\n");
		}
		activate_gods_hand.b = false;
	}

	if( rest.b  && !fighting ){

		log_entry( "•You take a day off to recover.\n");

		advance_day( 1 );
		hitpoints += 1;
		if( hitpoints > 6 ) hitpoints = 6;

		if( moment == 3 && rest_combo >= 3 && !rest_bonus_awarded){
			rest_bonus_awarded = true;
			hitpoints += 1;
		}
		rest.b = false;
		rest_combo++;
	}
	
}

function log_entry( str ){
	log += str;	
	UI[7].update( log );
}

function advance_day( delta ){
	let pday = day;
	day += delta;
	//console.log( pday, day, search_tracker, region_search_trackers[ search_tracker-1 ] );
	if( day > pday ){
		for (var i = pday+1; i <= day; i++){
			if( event_days[i] == 1 ){

				event_rects = Array(4);

				for (var j = 0; j < 4; j++){
					event_cycles[j] = floor(random(0, 6));

					var dx = 0;
					for (var k = 0; k < j; k++){
						if( event_cycles[j] == event_cycles[k] ) ++dx;
					}
					event_rects[j] = { x: region_rects[ event_cycles[j] ].x + (dx * event_icons[j].width * 1.1), 
						               y: region_rects[ event_cycles[j] ].y - event_icons[j].height,
						               w: event_icons[j].width, h: event_icons[j].height };
				}

				
				set_minimap_icons();

				log_entry( "•The Events move through the Wilderness...\n");

				//Scale of the Infinity Wurm	
				if( treasures_found[ 3 ] ){
					hitpoints += 1;
					if( hitpoints > 6 ) hitpoints = 6;
					log_entry( "•The Scale of the Infinity Wurm heals you.\n");
				}
			}
		}

		if( day >= 15 + doomsday_delay ){
			tally_up();
		}
	}
}

function set_minimap_icons(){
	minimap_event_pos = Array(5);
	let ec = [0,0,0,0,0,0];
	if( region >= 0 ){
		ec[ region ] = 1;
	}
	if( event_cycles[0] >= 0 ){
		for (var j = 0; j < 4; j++){
			ec[ event_cycles[j] ] += 1;
		}
		let mdx = [0,0,0,0,0,0];
		for (var j = 0; j < 4; j++){
			if( ec[ event_cycles[j] ] <= 0 ) continue;
			switch( ec[ event_cycles[j] ] ){
				case 1:
					minimap_event_pos[j] = { x: region_centroids[ event_cycles[j] ].x, 
						                     y: region_centroids[ event_cycles[j] ].y };
					break;
				case 2:
					minimap_event_pos[j] = { x: region_centroids[ event_cycles[j] ].x + (( mdx[ event_cycles[j] ] - 0.5)*event_icons[j].width), 
						                     y: region_centroids[ event_cycles[j] ].y };
					mdx[ event_cycles[j] ] += 1;
					break;
				case 3:
				case 4:
				case 5:
					minimap_event_pos[j] = { x: region_centroids[ event_cycles[j] ].x + (((mdx[ event_cycles[j] ] % 2) - 0.5)*event_icons[j].width), 
					                         y: region_centroids[ event_cycles[j] ].y + ((floor(mdx[ event_cycles[j] ]/2.0)- 0.5)*event_icons[j].height) };
					mdx[ event_cycles[j] ] += 1;
					break;
			}
		}
	}
	if( region >= 0 ){
		switch( ec[ region ] ){
			case 1:
				minimap_event_pos[4] = { x: region_centroids[ region ].x, 
					                     y: region_centroids[ region ].y };
				break;
			case 2:
				minimap_event_pos[4] = { x: region_centroids[ region ].x + (0.5*event_icons[0].width), 
					                     y: region_centroids[ region ].y };
				break;
			case 3:
				minimap_event_pos[4] = { x: region_centroids[ region ].x, 
				                         y: region_centroids[ region ].y + (0.5*event_icons[0].height) };
				break;
			case 4:
				minimap_event_pos[4] = { x: region_centroids[ region ].x + (0.5*event_icons[0].width), 
				                         y: region_centroids[ region ].y + (0.5*event_icons[0].height) };
				break;
			case 5:
				minimap_event_pos[4] = { x: region_centroids[ region ].x + (-1.5*event_icons[0].width), 
				                         y: region_centroids[ region ].y };
				break;
		}
	}
}

function take_hits( delta ){

	hitpoints -= delta;

	if( hitpoints == 0 ){//.....UNCONCIOUS

		log_entry( "•You're knocked unconscious!\n");

		// VOID GATE
		if( artifacts_activated[ 2 ] ){
			advance_day( 4 );
		}
		else{
			advance_day( 6 );
		}

		if( moment == 5 ){//day >= 15 + doomsday_delay ){// Slept through the apocalypse
			log_entry( "•Isodoros slept through the end of the world.\n");
		}
		else{
			if( artifacts_activated[ 2 ] ){
				log_entry( "•The Void Gate helps you to recover in only 4 days!\n");
			}
			else{
				log_entry( "•You awaken in your workshop 6 days later...\n");
			}
			region = -1;
			fighting = false;
			moment = 3;
			hitpoints = 6;
			activating = -1;
			linking = -1;
			UI[2].label = "Return to the Wilderness";
			dice_objs = Array(0);
			if( seal_of_balance_effect ){
				seal_of_balance_effect = false;
				seal_of_balance_used = true;
			}
			paralysis_wand_effect = false;
		}

	}
	else if( hitpoints < 0 ){ // DEAD
		/*
		switch( moment ){
			case 2:
				if( fighting )	log_entry( "•Isodoros was killed by the "+monster_chart[ region ][ enemy_lvl-1 ]+".\n");
				break;
			case 3:
				log_entry( "•Isodoros died in the workshop. How?\n");
				break;
			case 4:
				log_entry( "•Isodoros was killed trying to activate the Utopia Engine.\n");
				break;
		}*/
		tally_up();
	}
}

function tally_up(){
	score_breakdown = Array(10);

	let N = 0;
	for (var i = 0; i < 6; i++) if( artifacts_found[i] ) N += 1;
	let partial = 10 * N;
	score_breakdown[0] = "Each Artifact found: 10 x "+N+" = "+nf(partial, 2);
	final_score = partial;

	N = 0;
	for (var i = 0; i < 6; i++) if( artifacts_activated[i] ) N += 1;
	partial = 5 * N;
	score_breakdown[1] = "Each Artifact activated: 05 x "+N+" = "+nf(partial, 2);
	final_score += partial;

	N = 0;
	for (var i = 0; i < 6; i++) if( link_values[i] >= 0 ) N += 1;
	partial = 5 * N;
	score_breakdown[2] = "Each link completed: 05 x "+N+" = "+nf(partial, 2);
	final_score += partial;

	partial = 10 * doomsday_delay;
	score_breakdown[3] = "Each skull crossed out: 10 x "+doomsday_delay+" = "+nf(partial, 2);
	final_score += partial;

	N = 0;
	for (var i = 0; i < 3; i++) if( tools[i] > 0 ) N += 1;
	partial = 10 * N;
	score_breakdown[4] = "Each charged tool belt item: 10 x "+N+" = "+nf(partial, 2);
	final_score += partial;

	N = 0;
	for (var i = 0; i < 6; i++) if( treasures_found[i] ) N += 1;
	partial = 20 * N;
	score_breakdown[5] = "Each Legendary Treasure found: 20 x "+N+" = "+nf(partial, 2);
	final_score += partial;

	if( utopia_engine_activated ){
		score_breakdown[6] = "Utopia Engine activated: 50 [X] = 50";
		final_score += 50;
	}else{
		score_breakdown[6] = "Utopia Engine activated: 50 [ ] = 00";
	}

	N = (15 + doomsday_delay) - day;
	partial = 5 * N;
	if( partial < 0 || isNaN(partial) ){
		N = 0;
		partial = 0;
	}
	score_breakdown[7] = "Each day remaining: 05 x "+N+" = "+nf(partial, 2);
	final_score += partial;
	
	score_breakdown[8] = "Each hit point remaining: 01 x "+hitpoints+" = "+nf(hitpoints, 2);
	final_score += hitpoints;

	partial = 10 * days_sacrificed.n;
	score_breakdown[9] = "(Expert mode) Each day sacrificed: 10 x "+days_sacrificed.n+" = "+nf(partial, 2);
	final_score += partial;
	
	moment = 5;
	final_failure = false;
	biglog.update(log);
}













function mouseMoved(){

	let is2 = moment == 2;
	let is3 = moment == 3;

	if( is2 || is3 ){

		mouse_on_ig = -1;
		let igx = floor( (mouseX - ig_x) / ig_w );
		let igy = floor( (mouseY - ig_y) / ig_h );
		if( igx >= 0 && igx < 3 && igy >= 0 && igy < 2 ){
			mouse_on_ig = (igy * 3) + igx;
		}

		mouse_on_tool = -1;
		for (var i = 0; i < 3; i++) {
			if( mouseX > tool_boxes[i].x && mouseX < tool_boxes[i].x + tool_button_widths[i] && 
				mouseY > tool_boxes[i].y && mouseY < tool_boxes[i].y + tool_box_width ){

				mouse_on_tool = i;
				break;
			}
		}

		if( is2 ){

			

			if( region < 0 ){

				mouse_on_region = -1;
				if( mouseX > map_x && mouseX < map_x + map_w ){
					for (var i = 0; i < region_rects.length; i++) {
						if( mouseX > region_rects[i].x && mouseX < region_rects[i].x + region_rects[i].w &&
							mouseY > region_rects[i].y && mouseY < region_rects[i].y + region_rects[i].h ){

							mouse_on_region = i;
							break;
						}
					}

					mouse_on_event = -1;
					for (var i = 0; i < event_rects.length; i++) {
						if( mouseX > event_rects[i].x && mouseX < event_rects[i].x + event_rects[i].w &&
							mouseY > event_rects[i].y && mouseY < event_rects[i].y + event_rects[i].h ){

							mouse_on_event = i;
							break;
						}
					}
				}
			}
			else{

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

		}
		else if ( is3 ){

			if( activating < 0 && linking < 0 ){
				mouse_on_artifact = -1;
				mouse_on_link = -1;
				for (var i = 0; i < 6; i++) {
					if( dist( engine_parts[i].x, engine_parts[i].y, mouseX, mouseY ) < part_radius ){
						mouse_on_artifact = i;
						break;
					}
				}
				if( mouse_on_artifact < 0 ){
					for (var i = 0; i < 6; i++) {
						if( abs(engine_links[i].x - mouseX) <= link_radius && abs(engine_links[i].y - mouseY) <= link_radius ){
							mouse_on_link = i;
							break;
						}
					}
				}
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
	}
	else if( moment == 4 ){
		mouse_on_rb = false;
		if( mouseX > farb_x && mouseX < farb_x + farb_w && mouseY > farb_y && mouseY < farb_y + farb_h ){
			mouse_on_rb = true;
		}
	}

}

function mouseDragged(){
	if( moment == 2 || moment == 3 ){
		if( dragging_dice >= 0 ){
			dice_objs[ dragging_dice ].x = mouseX - dddx;
			dice_objs[ dragging_dice ].y = mouseY - dddy;
		}
	}
	UI[7].dragged( log );
	biglog.dragged( log );
}

function mousePressed(){
	if( moment == 2 || moment == 3 ){

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
	UI[7].pressed( log );
	if( moment == 5 ) biglog.pressed( log );
}

function mouseReleased(){
	switch( moment ){
		case 0:
			if( mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ){
				moment = 1;
				loop();//redraw();
			}
			break;

		case 1:

			if( expert_plusminus.released( days_sacrificed ) == 1 ){}

			else if( mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ){
				moment = 2;
				region = -1;
				hitpoints = 6;
				tools = new Array(3);
				for( var i = 0; i < 3; ++i ) tools[i] = 1;
				day = days_sacrificed.n;
				rest_combo = 0;
				rest_bonus_awarded = false;
				doomsday_delay = 0;
				component_stores = [ 0, 0, 0, 0, 0, 0 ];
				event_cycles = [ -1, -1, -1, -1 ];
				event_rects = Array(0);
				search_tracker = 0;
				region_searches = [ 0, 0, 0, 0, 0, 0 ];
				dice_objs = Array(0);
				search_box = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];
				result = { b: false, n: 0, digits: [ 0, 0, 0 ] };
				gods_hand = 0;
				artifacts_found = [ false, false, false, false, false, false ];
				artifacts_activated = [ false, false, false, false, false, false ];
				fleeting_visions = [ false, false, false, false, false, false ];
				treasures_found = [ false, false, false, false, false, false ];
				fighting = false;
				paralysis_wand_effect = false;
				seal_of_balance_effect = false;
				seal_of_balance_used = false;
				ancient_recording = false;
				ancient_recorded = false;
				selecting_components_for_battery = 0;
				selecting_tool_to_recharge = false;

				activating = -1;
				activation_field = [ [0,0], [0,0], [0,0], [0,0] ];
				energy_bar = 0;
				activation_attempt = 0;
				linking = -1;
				linkage_field = [ [0,0], [0,0], [0,0] ];
				link_values = [ -1, -1, -1, -1, -1, -1 ];
				wastebasket = 0;
				ready_for_final = false;
				activation_difficulty = 0;
				final_failure = false;
				utopia_engine_activated = false;

				UI[2].label = "Return to Workshop";
				
				log = "•Isodoros sets off on his journey. Good Luck!\n";
				UI[7].update( log );
			}

		case 2:
			{
			if( region < 0 ){

				UI[2].released( travel_back );

				// the wilderness
				if( mouse_on_region >= 0 && region_searches[ mouse_on_region ] < 6 ){

					region = mouse_on_region;
					search_tracker = 0;
					search_box = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ];
					rolls = 0;
					result = { b: false, n: 0, digits: [ 0, 0, 0 ] };
					dice_objs = Array(0);
					dice_ceiling = sb_y + 2*sb_h;
					log_entry( "•You travel to "+region_names[ region ]+".\n" );
					UI[2].label = "Return to the Wilderness";
					fighting = false;
					enemy_defeated = false;
					set_minimap_icons();
					break;
				}
			}
			else{ // searching or fighting


				if( mouse_on_rb ){//                  ROLL!
					//console.log( "rolling", dice_objs.length, result.b );
					if( dice_objs.length == 0 && !result.b && !enemy_defeated ){
						dice_objs = Array(2);
						for (var i = 0; i < 2; i++) {
							let a = random( (7/8.0)*PI, (9/8.0)*PI );
							let v = random( 10, 16 );
							dice_objs[i] = new Dice( floor(random(0,6)), rb_x, rb_y, v*cos(a), v*sin(a) );
							if( fighting ) dice_objs[i].y = frb_y;
						}
						//GOLDEN CHASSIS
						if( fighting && artifacts_activated[ 3 ] && dice_objs[i].face < 5 ){
							let len = monster_chart[ region ][ enemy_lvl-1 ].length;
							if( monster_chart[ region ][ enemy_lvl-1 ][len-1] == ")" ){
								dice_objs[i].face += 1;
								log_entry( "•Golden Chassis improved your rolls!\n");
							}
						}
						UI[2].label = "...";
						rolls++;
					}
				}

				else if( dragging_dice >= 0 ){//  Dropping dice into the search box

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

								// GOOD FORTUNE
								if( event_cycles[ 2 ] == region && result.n > 0 && !seal_of_balance_effect ){
									result.n -= 10;
									if( result.n < 0 ) result.n = 0;
									log_entry( "•The Good Fortune Event reduces the result to "+result.n+".\n");
								}

								// HERMETIC MIRROR
								if( artifacts_activated[ 1 ] && (region == 0 || region == 5) && result.n > 0 ){
									result.n -= 10;
									if( result.n < 0 ) result.n = 0;
									log_entry( "•The Hermetic Mirror reduces the result to "+result.n+".\n");
								}

								// SCRYING LENS
								if( artifacts_activated[ 4 ] && (region == 3 || region == 2) && result.n > 0 ){
									result.n -= 10;
									if( result.n < 0 ) result.n = 0;
									log_entry( "•The Scrying Lens reduces the result to " +result.n+".\n");
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

								
								if( result.n >= 0 ){
									if( result.n == 0 ){
										if( artifacts_found[ region ] ){
											component_stores[ region_components[ region ] ] += 2;
											log_entry( "•You find 2 components!\n");
										}
										else{
											artifacts_found[ region ] = true;
											artifacts_activated[ region ] = true;
											gods_hand += 2;
											if( gods_hand > 6 ) gods_hand = 6;
											log_entry( "•You find the "+artifact_names[ region ]+" fully activated, and gain 2 energy for the God's Hand device!\n");
										}
									}
									else if( result.n <= 10 ){
										if( artifacts_found[ region ] ){
											component_stores[ region_components[ region ] ] += 1;
											log_entry( "•You find a component!\n");
										}
										else{
											artifacts_found[ region ] = true;

											log_entry( "•You find the "+artifact_names[ region ]+"!\n");

											if( event_cycles[ 1 ] == region  && !seal_of_balance_effect ){//FLEETING VISIONS
												fleeting_visions[ region ] = true;
												log_entry( "•You see fleeting visions which will surely help you to activate this artifact later...\n");
											}
										}
									}
									else if( result.n < 100 ){
										component_stores[ region_components[ region ] ] += 1;
										log_entry( "•You find a component!\n");
									}

									if( component_stores[ region_components[ region ] ] > 4 ){
										component_stores[ region_components[ region ] ] = 4;
									}
								}

								search_tracker += 1;
								if( result.n < 0 || result.n >= 100 ){
									proceed_button.label = "Fight!";
								}
								else{
									UI[2].label = "Return to Wilderness";
									if( region_searches[ region ] >= 5 ){
										proceed_button.label = "Region fully searched.";
									}
									else proceed_button.label = "Search again";
								}
							}
						}
					}
				}

				else if( result.b ){

					//THE DOWSING ROD
					if( tools[1] > 0 && mouse_on_tool == 1 && (!artifacts_found[ region ]) ){
						
						if( result.n >= 11 && result.n <= 99 ){

							result.n = 1;
							result.digits[0] = 0;
							result.digits[1] = 0;
							result.digits[2] = 1;

							tools[1] -= 1;

							component_stores[ region_components[ region ] ] -= 1;
							// swap the component for the artifact
							artifacts_found[ region ] = true;

							log_entry( "•The Dowsing Rod Leads you directly to the "+artifact_names[ region ]+"!\n");
						}
					}

					// Shimmering Moonlace
					if( treasures_found[ 2 ] && item_view.n == 1 && mouse_on_ig == 2 && 
						proceed_button.label[0] == 'F' ){

						fighting = false;

						if( region_searches[ region ] >= 5 ){
							proceed_button.label = "Region fully searched.";
						}
						else proceed_button.label = "Search again";

						log_entry( "•You avoid the encounter safely with your Shimmering Moonlace!\n");
					}

					UI[2].released( travel_back ); 
					proceed_button.released( proceed );
				}

				else if( fighting ){

					// Shimmering Moonlace
					if( treasures_found[ 2 ] && item_view.n == 1 && mouse_on_ig == 2 && rolls <= 0 ){

						fighting = false;
						result.b = true;
						UI[2].label = "Return to Wilderness";

						if( region_searches[ region ] >= 5 ){
							proceed_button.label = "Region fully searched.";
						}
						else proceed_button.label = "Search again";

						log_entry( "•You get away from the "+monster_chart[ region ][ enemy_lvl-1 ]+" safely with your Shimmering Moonlace!\n");
					}

					// PARALYSIS WAND
					if( tools[0] > 0 && mouse_on_tool == 0 ){
						
						if( dice_objs.length == 2 ){
							for (var i = 0; i < 2; i++) {
								dice_objs[i].face += 2;
								if( dice_objs[i].face > 5 ) dice_objs[i].face = 5;
								if( dice_objs[i].auto ){
									dice_objs[i].set_target();
								}
							}
							tools[0] -= 1;
							log_entry( "•The Paralysis Wand improves your rolls!\n");
						}
						else if( dice_objs.length == 0 ){
							tools[0] -= 1;
							paralysis_wand_effect = true;
							log_entry( "•You ready your Paralysis Wand...\n");
						}
					}

					if( enemy_defeated && dice_objs.length == 0 ){
						UI[2].released( travel_back );
						proceed_button.released( proceed );
					}
				}

				else if( rolls == 0 ){
					UI[2].released( travel_back );
				}

				if( mouse_on_ig >= 0 ){

					//SEAL OF BALANCE
					if( mouse_on_ig == 0 ){
						if( !seal_of_balance_used ){
							seal_of_balance_effect = true;
							log_entry( "•You engage the Seal of Balance. Events will have no effect during your search of "+region_names[ region ]+".\n");
						}
					}

				}
			}
			}
			break;

		case 3:
			{

			if( activating < 0 && linking < 0 ){

				if( mouse_on_artifact >= 0 && artifacts_found[ mouse_on_artifact ] && 
					                         !artifacts_activated[ mouse_on_artifact ] ){

					activating = mouse_on_artifact;
					activation_field = [ [0,0], [0,0], [0,0], [0,0] ];
					energy_bar = 0;
					//BRACELET OF IOS
					if( treasures_found[ 1 ] ){
						energy_bar = 1;
						log_entry( "•The Bracelet of Ios helps you charge the artifact.\n");
					}
					activation_attempt = 0;
					result = { b: false, digits: [ 0, 0, 0, 0 ] };
					rolls = 0;
					dice_ceiling = af_y + 3*af_h;
					UI[2].label = "Return to Workshop";
					mouse_on_artifact = -1;
				}
				else if( mouse_on_link >= 0 ){
					if( ancient_recording ){
						link_values[ mouse_on_link ] = 0;
						ancient_recording = false;
						ancient_recorded = true;
						log_entry( "•The Ancient Record helps you establish a perfect link!\n" );
						activation_difficulty = 0;//refresh activation difficulty
						for (var i = 0; i < 6; i++) {
							activation_difficulty += link_values[i];
						}
					}
					else if( link_values[ mouse_on_link ] < 0 && 
						     component_stores[ region_components[mouse_on_link] ] > 0 &&
							 artifacts_found[ link_pairs[ mouse_on_link ][0] ] &&
				    		 artifacts_found[ link_pairs[ mouse_on_link ][1] ] ){

						component_stores[ region_components[mouse_on_link] ] -= 1;
						linking = mouse_on_link;
						linkage_field = [ [0,0], [0,0], [0,0] ];
						result = { b: false, digits: [ -1, -1, -1 ] };
						rolls = 0;
						dice_ceiling = lf_y + 3*lf_h;
						UI[2].label = "Return to Workshop";
						mouse_on_link = -1;
					}
				}
				else if( ready_for_final && mouseX > map_x && mouseX < map_x + map_w && mouseY < 0.3*map_h ){
					moment = 4;
					final_failure = true;
				}
				//ANCIENT RECORD
				else if( item_view.n == 1 && mouse_on_ig == 4 && treasures_found[ 4 ] && !ancient_recorded ){
					ancient_recording = true;
					log_entry( "•Choose a link on which to use The Ancient Record...\n" );
				}

				UI[2].released( travel_back );
			}
			else{
				if( mouse_on_rb ){//                  ROLL!
					if( dice_objs.length == 0 && !result.b ){
						dice_objs = Array(2);
						for (var i = 0; i < 2; i++) {
							let a = random( (5/6.0)*PI, (7/6.0)*PI );
							let v = random( 10, 16 );
							dice_objs[i] = new Dice( floor(random(0,6)), rb_x, rb_y, v*cos(a), v*sin(a) );
						}
						UI[2].label = "...";
						rolls++;
					}
				}

				if( activating >= 0 ){
					if( dragging_dice >= 0 ){//  Dropping dice into the search box

						let bx = floor( (dice_objs[ dragging_dice ].x + (dice.height/2) - af_x) / af_w );
						let by = floor( (dice_objs[ dragging_dice ].y + (dice.height/2) - af_y) / af_h );

						if( bx >= 0 && bx < 4 && by >= 0 && by < 2 ){
							if( activation_field[ bx ][ by ] == 0 ){

								activation_field[ bx ][ by ] = dice_objs[ dragging_dice ].face + 1;
								dice_objs.splice( dragging_dice, 1 );

								if( activation_field[ bx ][0] > 0 && activation_field[ bx ][1] > 0 ){
									let dif = activation_field[ bx ][0] - activation_field[ bx ][1];
									if( dif == 5 ){
										result.digits[ bx ] = 2;
										energy_bar += 2;
									}
									else if( dif == 4 ){
										result.digits[ bx ] = 1;
										energy_bar += 1;
									}
									else if( dif == 0 ){
										activation_field[ bx ][0] = 0;
										activation_field[ bx ][1] = 0;
									}
									else{
										if( dif < 0 ){
											take_hits( 1 );
											log_entry( "•The artifact backfires and deals one damage to you.(negative result on activation)\n");
											if( activating < 0 ) return;
										}
										result.digits[ bx ] = "X";
									}

									let complete = true;
									let total = 0;
									for( var i = 0; i < 4; ++i ){
										if( result.digits[ i ] == 0 ){
											complete = false;
											break;
										}
										if( result.digits[ i ] != "X" ) total += result.digits[ i ];
									}

									if( complete ){

										result.b = true;

										let required = 4;
										if( fleeting_visions[ activating ] ) required = 3;

										if( energy_bar >= required ){
											gods_hand += (energy_bar - required );
											if( gods_hand > 6 ) gods_hand = 6;
											artifacts_activated[ activating ] = true;
											if( fleeting_visions[ activating ] ) log_entry( "•The Fleeting Visions you saw regarding this artfact made it easier to activate.\n");
											log_entry( "•You succesfully activated the "+artifact_names[activating]+"!\n");
											proceed_button.label = "Proceed";
										}
										else{

											//advance_day( 1 );

											if( activation_attempt > 0 ){
												advance_day( 1 );
												artifacts_activated[ activating ] = true;
												log_entry( "•After two days you manage to activate the "+artifact_names[ activating ]+".\n");
												proceed_button.label = "Proceed";
											}
											else{
												proceed_button.label = "Try again tomorrow";
											}
										}

										if( artifacts_activated[ activating ] ){
											ready_for_final = true;
											for (var i = 0; i < 6; i++) {
												if( !artifacts_activated[i] ){
													ready_for_final = false;
													break;
												}
											}
											if( ready_for_final ){
												for (var i = 0; i < 6; i++) {
													if( link_values[i] < 0 ){
														ready_for_final = false;
														break;
													}
												}
											}
											if( ready_for_final ){
												activation_difficulty = 0;
												for (var i = 0; i < 6; i++) {
													activation_difficulty += link_values[i];
												}
											}
										}

									}//</complete>
								}
							}
						}
					}
					//FOCUS CHARM
					else if( tools[2] > 0 && mouse_on_tool == 2 ){
						
						tools[2] -= 1;
						energy_bar += 2;
						log_entry( "•The Focus Charm helps power the artifact!\n");

						let required = 4;
						if( fleeting_visions[ activating ] ) required = 3;

						if( energy_bar >= required ){
							result.b = true;
							gods_hand += (energy_bar - required );
							if( gods_hand > 6 ) gods_hand = 6;
							artifacts_activated[ activating ] = true;
							if( fleeting_visions[ activating ] ) log_entry( "•The Fleeting Visions you saw regarding this artfact made it easier to activate.\n");
							log_entry( "•You succesfully activated the "+artifact_names[activating]+"!\n");
							proceed_button.label = "Proceed";
							dice_objs = Array(0);
						}
					}
					else if( result.b ){
						proceed_button.released( proceed );
					}
				}

				if( linking >= 0 ){
					if( dragging_dice >= 0 ){//  Dropping dice into the search box
						let dcx = dice_objs[ dragging_dice ].x + (dice.height/2);
						let dcy = dice_objs[ dragging_dice ].y + (dice.height/2);
						let bx = floor( (dcx - lf_x) / lf_w );
						let by = floor( (dcy - lf_y) / lf_h );

						if( bx >= 0 && bx < 3 && by >= 0 && by < 2 ){
							if( linkage_field[ bx ][ by ] == 0 ){

								linkage_field[ bx ][ by ] = dice_objs[ dragging_dice ].face + 1;
								dice_objs.splice( dragging_dice, 1 );

								if( linkage_field[ bx ][0] > 0 && linkage_field[ bx ][1] > 0 ){
									let dif = linkage_field[ bx ][0] - linkage_field[ bx ][1];
									if( dif < 0 ){
										take_hits( 1 );
										log_entry( "•Energy arcs wildly from the device, vaporizing the component you used and dealing one damage to you. (negative result on a link)\n");
										if( component_stores[ region_components[linking] ] > 0 ){
											component_stores[ region_components[linking] ] -= 1;
											result.digits[ bx ] = 2;
										}
										else{
											linking = -1;
											UI[2].label = "Return to Wilderness";
											dice_objs = Array(0);
										}
									}
									else{
										result.digits[ bx ] = dif;
									}

									let complete = true;
									let total = 0;
									for( var i = 0; i < 3; ++i ){
										if( result.digits[ i ] < 0 ){
											complete = false;
											break;
										}
										total += result.digits[ i ];
									}

									if( complete ){
										//remaining dice must be dealt with.
										if( dice_objs.length > 0 ){
											if( wastebasket < 10 ){
												wastebasket += 1;
											}
											else{
												take_hits(1);
												log_entry( "•There was no room left in the wastebasket or in the linkage field, so you receive a peanalty of one damage for the remaining dice.\n");
											}
											dice_objs = Array(0);
										}

										link_values[ linking ] = total;
										log_entry( "•You succesfully forged the "+component_names[linking]+" link!\n");
										linking = -1;
										UI[2].label = "Return to Wilderness";

										ready_for_final = true;
										for (var i = 0; i < 6; i++) {
											if( link_values[i] < 0 ){
												ready_for_final = false;
												break;
											}
										}
										
										if( ready_for_final ){
											for (var i = 0; i < 6; i++) {
												if( !artifacts_activated[i] ){
													ready_for_final = false;
													break;
												}
											}
										}
										if( ready_for_final ){
											activation_difficulty = 0;
											for (var i = 0; i < 6; i++) {
												activation_difficulty += link_values[i];
											}
										}

									}
								}
							}
						}
						else{
							//WASTEBASKET
							if( dcx > wb_x && dcx < wb_x + wb_w && dcy > wb_y && dcy < wb_y + wb_h ){
								if( wastebasket < 10 ){
									wastebasket += 1;
									dice_objs.splice( dragging_dice, 1 );
								}
							}
						}
					}
				}

				if( rolls <= 0 ){
					UI[2].released( travel_back );

					if( travel_back.b ){

						activating = -1;
						if( linking >= 0 ){
							//refund
							component_stores[ region_components[ linking ] ] += 1;
							linking = -1;
						}
						UI[2].label = "Return to Wilderness";
						travel_back.b = false;
					}
				}
			}

			}
			break;

		case 4:
			if( mouse_on_rb ){
				if( dice_objs.length == 0 || final_failure ){
					final_failure = false;
					dice_objs = Array(2);
					for (var i = 0; i < 2; i++) {
						let a = random( -PI, 0 );
						let v = random( 10, 16 );
						dice_objs[i] = new Dice( floor(random(0,6)), farb_x, farb_y, v*cos(a), v*sin(a) );
					}
					rolls++;
				}
			}
			if( dice_objs.length == 0 ){
				pay_health_button.released( pay_health );
			}
			break;

		case 5:
			biglog.released( log );
			break;
	}

	if( moment == 2 || moment == 3 ){

		let on_map = ( mouseX > map_x && mouseX < map_x + map_w );
		if( !on_map ){
			UI[0].released( item_view );
			UI[1].released( item_view );
			UI[3].released( rest );
			UI[4].released( activate_gods_hand );
			UI[5].released( log_or_map );
			UI[6].released( log_or_map );
			UI[7].released( log );

			//Crystal Battery
			if( artifacts_activated[ 5 ] && item_view.n == 0 && mouse_on_ig == 5 ){

				let any_used = false;
				for (var i = 0; i < 3; i++) {
					if( tools[i] <= 0 ){
						any_used = true;
						break;
					}
				}
				if( any_used ){

					if( selecting_components_for_battery == 0 ){
						selecting_components_for_battery = 3;
						log_entry( "•Select 3 components from your stores to fuel the Crystal Battery.\n");
					}
					else{
						selecting_components_for_battery = 0;
					}
				}
			}
			if( selecting_components_for_battery > 0 ){
				let SX = floor( (mouseX - sg_x)/sg_w );
				let SY = floor( (mouseY - sg_y)/sg_h );
				if( SX >= 0 && SX < 3 && SY >= 0 && SY < 2 ){
					if( component_stores[ SX + (SY*3) ] > 0 ){
						component_stores[ SX + (SY*3) ] -= 1;
						selecting_components_for_battery -= 1;
						if( selecting_components_for_battery <= 0 ){
							selecting_tool_to_recharge = true;
							log_entry( "•Now select which tool to recharge.\n");
						}
						else{
							log_entry( selecting_components_for_battery+" more.\n");
						}
					}
				}
			}
			if( selecting_tool_to_recharge ){
				if( mouse_on_tool >= 0 ){
					if( tools[ mouse_on_tool ] <= 0 ){
						tools[ mouse_on_tool ] += 1;
						selecting_tool_to_recharge = false;
						log_entry( "•The Crystal Battery charges your "+tool_names[ mouse_on_tool ]+"!\n");
					}
					else{
						log_entry( "•You must select a used tool.\n");
					}
				}
			}
		}

		dragging_dice = -1;
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
			
			break;
		case 4:
			
			break;
		case 5:
			moment = 0;
			final_failure = false;
			noLoop();
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

function vertical_scrollbar( x, y, w, h ){
	this.x = x;
	this.y = y+1;
	this.w = w;
	this.h = floor(h-1);
	this.bar_y = y;
	this.bar_h = 0;
	this.dragging = false;
	this.holding = false;
	this.mouse_offset = 0;
	this.max_scroll = 0;

	this.update = function ( total_content_height, scroll ){
		this.bar_h = constrain( round(  sq( this.h ) / total_content_height ), this.w, this.h);
		if( total_content_height < this.h ) this.max_scroll = 0;
		else this.max_scroll = total_content_height - this.h;
		this.bar_y = this.y + this.h - this.bar_h;
		scroll.n = round(this.max_scroll);
	}

	this.pressed = function(){
		if( mouseX > this.x && mouseX < this.x+this.w ){
			if( mouseY > this.bar_y && mouseY < this.bar_y + this.bar_h ){
				this.mouse_offset = mouseY - this.bar_y;
				this.dragging = true;
			}
			else if( mouseY > this.y && mouseY < this.y+this.h ){
				this.mouse_offset = mouseY;
				this.holding = true;
			}
		}
	}

	this.dragged = function( scroll ){
		if( this.dragging && this.max_scroll > 0 ){
			let bottom = this.y + this.h - this.bar_h;
			this.bar_y = constrain( mouseY - this.mouse_offset, this.y, bottom );
			scroll.n = round( map( this.bar_y, this.y, bottom, 0, this.max_scroll ) );
		}
		else if( this.holding ){
			this.mouse_offset = mouseY - this.y;
		}
	}

	this.released = function(){
		this.dragging = false;
		this.holding = false;
	}

	this.display = function( scroll ){

		if( this.holding && this.max_scroll > 0 ){
			let bottom = this.y + this.h - this.bar_h;
			this.bar_y = constrain( lerp( this.bar_y, this.mouse_offset - (this.bar_h * 0.5), 0.125 ), this.y, bottom );
			scroll.n = round( map( this.bar_y, this.y, bottom, 0, this.max_scroll ) );
			if( abs( this.mouse_offset - this.bar_y + (this.bar_h/2) ) < 4 || 
			    this.bar_y >= bottom || this.bar_y <= 0 ){
				//this.mouse_offset = round( this.bar_h * 0.5 );
				this.mouse_offset = mouseY - this.y;
				this.dragging = true;
				this.holding = false;
			}
		}

		fill(200);
		noStroke();
		rect( this.x, this.y, this.w, this.h);
		strokeWeight(this.w);
		stroke(150);
		line( this.x + this.w/2, this.bar_y, this.x + this.w/2, this.bar_y + this.bar_h );
		strokeWeight(1);


	}
};

function Text_viewer( x, y, w, h ){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.scroll = { n: 0 };
	this.SB = new vertical_scrollbar( x + w - 18, y, 18, h );
	this.surf = createGraphics(w-20, h-2);
	this.ps = 0;

	this.update = function( the_text ){

		if( this.ps != the_text.length ){
			let spl = split( the_text + '', '\n' );
			let lines = 0;
			for (var i = 0; i < spl.length; i++) {
				lines += ceil( this.surf.textWidth( spl[i] ) / (this.w-22) );
			}
			//console.log( lines );
			//console.log( ( this.surf.textAscent() + this.surf.textDescent() ) );
			// it's just 23, ok???
			this.SB.update( 23 * lines, this.scroll );
			this.ps = the_text.length;
		}

		this.surf.background(255);
		this.surf.fill(0);
		this.surf.textFont( DejaVuSansCondensed, 18 );
		this.surf.textAlign(LEFT, TOP);
		this.surf.text( the_text, 3, 3-this.scroll.n, this.w-22, 9999 );
	}

	this.pressed = function( the_text ){
		this.SB.pressed();
		this.update( the_text );
	}

	this.dragged = function( the_text ){
		this.SB.dragged( this.scroll );
		this.update( the_text );
	}

	this.released = function( the_text ){
		this.SB.released();
		this.update( the_text );
	}
	
	this.display = function( the_text ){
		stroke(0);
		noFill();
		rect( this.x, this.y, this.w, this.h );

		this.SB.display( this.scroll );
		if( this.SB.holding ){
			this.update( the_text );
		}

		image( this.surf, this.x+1, this.y+1 );
	}
};

function PlusMinus(x, y, w, h, step, label ){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.step = step;
	this.label = label;
	this.cx = x + (w * 0.5);
	this.cy = y + (h * 0.5);
	this.rx = x + w - h;
	
	this.display = function( incumbency ){
		fill(255); stroke(0);
		rect( this.x, this.y, this.w, this.h, 3, 3, 3, 3 );
		rect( this.x, this.y, this.h, this.h, 3, 3, 3, 3 );
		rect( this.rx, this.y, this.h, this.h, 3, 3, 3, 3 );
		fill(0); noStroke();
		textSize(20);
		text( incumbency.n, this.cx, this.cy );
		textSize(26);
		text( "-", this.x + (this.h/2), this.cy-2 );
		text( "+", this.x + this.w - (this.h/2), this.cy-2 );
		textSize(20);
		text( this.label, this.cx, this.cy -this.h );
	}
	
	this.released = function( incumbency ){
		if( mouseX > this.x  &&  mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h ){
			if( mouseX < this.x + this.h ){
				incumbency.n -= this.step;
			}
			else if( mouseX > this.x + this.w - this.h ){
				incumbency.n += this.step;
			}
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
	this.set_target = function(){
		this.auto = false;
		if( this.face + 1 >= monster_attack_range[ enemy_lvl-1 ][0] &&
			this.face + 1 <= monster_attack_range_max ){

			this.target_X = player_target.x - (dice.height/2);
			this.target_Y = player_target.y - (dice.height/2);
			this.auto = true;
		}
		else if ( this.face + 1 >= player_attack_range_min &&
				  this.face + 1 <= player_attack_range[ enemy_lvl-1 ][1] ){

			this.target_X = monster_target.x - (dice.height/2);
			this.target_Y = monster_target.y - (dice.height/2);
			this.auto = true;
		}
	}
	this.repel = function( other ){
		let fx = this.x - other.x;
		let fy = this.y - other.y;
		let hypotsq = sq(fx) + sq(fy);
		if( isNaN(hypotsq) || hypotsq < 0.1 ) hypotsq = 0.1;
		if( hypotsq < sq(dice.height) ){
			fx *= 0.05 * ( dice.height / hypotsq );
			fy *= 0.05 * ( dice.height / hypotsq );
			this.vx += fx;
			this.vy += fy;
			var mag = sqrt( sq(this.vx) + sq(this.vy) );
			if( mag > 16 ){
				this.vx *= (16 / mag);
				this.vy *= (16 / mag);
			}
		}
	}
};