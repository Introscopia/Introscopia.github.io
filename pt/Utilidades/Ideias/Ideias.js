/*
✓ labels (right click and drag? sure, I mean...)
✓ text wrap
✓✓✓ board encoding
✓ clipboard
✓ resize cards
✓ spacebar scrolls the page down...
✓ graphic design (random color pallete?)
✓ dockable categories
✓ different color blocks for category sections
* fancy tooltip
✓ more presets
✓ preset buttons, on a grid, fancy style?
* sci-fi content?
* spin the wheel?
* cursor on the label editor?


arm/wing multiplier
*/

let digits = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '@', '#', '$' ];
var digitmap;

function base64_encode( N, max ){
  var C = Array(0);
  for( var i = 0; i < max; ++i ){
    C.splice(0, 0, digits[ N % 64] );
    N = floor( N / 64 );
  }
  return C.join("");
}
function base64_decode( C ){
  let N = 0;
  for( var i = 0; i < C.length; ++i ){
      N = 64 * N + digitmap[ C[i] ].n;
  }
  return N;
}

var th;

function wrapped_text( phrase, x, y, w, h ){
  if( th <= h ){
    if( textWidth( phrase ) >= w ){
      let spl = split( phrase, ' ' );
      let wids = Array( spl.length );
      for( var i = 0; i < spl.length; ++i ) wids[i] = textWidth( spl[i] );
      let sp = textWidth( ' ' );
      for( var i = spl.length-1; i >= 0; --i ){
        let wid = 0;
        for( var j = 0; j <= i; ++j ) wid += wids[j];
        if( wid < w ){
          text( join( spl.slice(0, j), ' ' ), x, y );
          return wrapped_text( join( spl.slice(j, spl.length), ' ' ), x, y + th, w, h - th );
        }
      }
    }
    else{
      text( phrase, x, y );
      return 1;
    }
  }
  else return -1;
}

document.oncontextmenu = function() { 
  return true; 
}

var lib = [
 [ "00", "Etnias Humanas",   "Abazins", "Abkhazians", "Acehnese", "Acholi", "Adjoukrou", "Afar", "Afemai", "Afrikaners", "Agaw", "Ahom", "Aimaq", "Aja", "Akan", "Akha", "Albanians", "Alur", "Ambonese", "Ambundu", "Amhara", "Amis", "Anaang", "Anuak", "Apache", "Arabs", "Argobba", "Armenians", "Aromanians", "Assyrians", "Atoni", "Atyap", "Austrians", "Avars", "Awadhis", "Aymara", "Azerbaijanis", "Bahnar", "Bai", "Bakossi", "Balanta", "Balinese", "Balkars", "Balochs", "Balti", "Bamars", "Bambara", "Bamileke", "Bamum", "Banda", "Banjarese", "Bari", "Bariba", "Bashkirs", "Basques", "Bassa", "Batak", "Beja", "Belarusians", "Bemba", "Bembe", "Bengalis", "Berbers", "Berom", "Berta", "Betawis", "Beti", "Bhils", "Bhojpuris", "Bhumij", "Bicolanos", "Bidayuh", "Bilala", "Bishnupriya", "Bissa", "Blaan", "Boa", "Bodo", "Bosniaks", "Bouyei", "Bozo", "Brahuis", "Bretons", "Bru", "Budu", "Buduma", "Buginese", "Bulgarians", "Burusho", "Butonese", "Bwa", "Catalans", "Chakmas", "Chamorro", "Chams", "Chechens", "Cherokee", "Chewa", "Chin", "Choctaw", "Chokwe", "Chutiya", "Chuukese", "Chuvash", "Circassians", "Cornish", "Corsicans", "Cree", "Croats", "Cuyunon", "Czechs", "Dagaaba", "Dagombas", "Damara", "Danes", "Dargins", "Dinka", "Dogon", "Dogra", "Dongxiangs", "Dubla", "Dutch", "Dyula", "Ebira", "Edo", "Efik", "Egyptians", "Ekoi", "Emberá", "English", "Esan", "Estonians", "Ewe", "Fang", "Fijians", "Finns", "Flemings", "Fon", "French", "Frisians", "Friulians", "Fula", "Fur", "Ga-Adangbe", "Gagauz", "Galicians", "Ganda", "Garifuna", "Garos", "Gayonese", "Gbagyi", "Gbaya", "Gedeo", "Gelao", "Georgians", "Germans", "Gola", "Gonds", "Gorontaloans", "Greeks", "Guan", "Guaraní", "Gujarati", "Gumuz", "Gurage", "Gurma", "Gurunsi", "Hadiya", "Han", "Hani", "Harari", "Hausa", "Hawaiians", "Hazaras", "Herero", "Hmong", "Huli", "Hungarians", "Hutu", "Iban", "Ibanag", "Ibibio", "Icelanders", "Idoma", "Igbo", "Igede", "Igorot", "Ijaw", "Ilocano", "Ingush", "Inuit", "Iranun", "Irish", "Iroquois", "Isan", "Isoko", "Italians", "Itawes", "Japanese", "Jarai", "Javanese", "Jews", "Jingpo", "Jola", "Jukun", "Kadazan-Dusun", "Kalanga", "Kalenjin", "Kalinago", "Kamba", "Kanaks", "Kannadigas", "Kanuri", "Kapampangans", "Kapsiki", "Karachays", "Karakalpaks", "Karbi", "Karen", "Kashmiris", "Kashubians", "Kazakhs", "Khas", "Khmer", "Khonds", "Khorasani", "Kikuyu", "Kilba", "Kirati", "Kissi", "Kofyar", "Komi", "Kongo", "Konjo", "Konkani", "Konso", "Koreans", "Kpelle", "Kposo", "Kru", "Kumyks", "Kunama", "Kurds", "Kurukh", "Kuteb", "Kyrgyz", "Laks", "Lamaholot", "Lampungs", "Lao", "Latvians", "Laz", "Lega", "Lezgins", "Li", "Limba", "Lisu", "Lithuanians", "Luba", "Luhya", "Luo", "Lurs", "Luxembourgers", "Maasai", "Macedonians", "Madi", "Madurese", "Mafa", "Magahi", "Magars", "Maguindanao", "Maithils", "Makassarese", "Makonde", "Makua", "Malagasy", "Malayali", "Malays", "Maldivians", "Maltese", "Mambila", "Manchu", "Mandarese", "Mandinka", "Manggarai", "Manjak", "M?ori", "Mapuche", "Maranao", "Marathi", "Mari", "Masa", "Masalit", "Maya", "Mazahua", "Mazatec", "Mbaka", "Mehri", "Meitei", "Melanau", "Mende", "Mien", "Mijikenda", "Minahasan", "Minangkabau", "Mising", "Miskito", "Mixe", "Mixtec", "Mi?kmaq", "Mon", "Mongo", "Mongols", "Mongondow", "Montenegrins", "Mordvins", "Mossi", "Mumuye", "Munanese", "Mundas", "Murut", "Muscogee", "Musgum", "Mwera", "Naga", "Nagpuri", "Nahuas", "Nama", "Nanai", "Navajo", "Newar", "Ngaju", "Ngalop", "Ngbandi", "Nias", "Nogais", "Norwegians", "Nubians", "Nuer", "Nùng", "Nuristanis", "Nyishi", "Occitans", "Odia", "Ogoni", "Ojibwe", "Oromo", "Ossetians", "Ot", "Otomi", "Ovambo", "Ovimbundu", "Pa'O", "Pamiris", "Pangasinese", "Papel", "Pare", "Pashayi", "Pashtuns", "Pedi", "Pende", "Persians", "Poles", "Portuguese", "Punjabis", "Purépecha", "Qashqai", "Qiang", "Quechua", "Rade", "Rajasthanis", "Rajbongshi", "Rakhine", "Rejangese", "Rohingyas", "Roma", "Romanians", "Russians", "Rusyns", "Ryukyuans", "Saho", "Salar", "Sama-Bajau", "Sambal", "Sámi", "Samoans", "Sangirese", "Santal", "Sara", "Sardinians", "Sasak", "Savu", "Scots", "Senufo", "Serbs", "Serer", "Shan", "Sharchops", "Sherbro", "Shilluk", "Shona", "Sibe", "Sidama", "Siddi", "Sika", "Silesians", "Silt'e", "Sindhis", "Sinhalese", "Sioux", "Slovaks", "Slovenes", "Soga", "Somalis", "Songhai", "Soninke", "Sotho", "Spaniards", "Sui", "Sukuma", "Sumba", "Sumbawa", "Sundanese", "Surma", "Susu", "Swahili", "Swazi", "Swedes", "Sylhetis", "Tabasaran", "Tagalogs", "Tahitians", "Tajiks", "Talysh", "Tama", "Tamils", "Tarok", "Tatars", "Taus?g", "Tboli", "Telugu", "Temne", "Thais", "Tibetans", "Tigrayans", "Tigre", "Tiv", "Tiwa", "Tlapanec", "Toraja", "Toubou", "Toucouleur", "Tripuri", "Tsonga", "Tswana", "Tujia", "Tupuri", "Turkana", "Turkmens", "Turks", "Tutsi", "Tuvans", "Udmurts", "Ukrainians", "Urhobos", "Uyghurs", "Uzbeks", "Venda", "Vietnamese", "Visayans", "Wa", "Walloons", "Waxiang", "Welayta", "Welsh", "Wolof", "Xhosa", "Yakan", "Yakö", "Yakuts", "Yao", "Yi", "Yoruba", "Zaghawa", "Zande", "Zapotecs", "Zhuang", "Zulu" ],
 [ "01", "Raças de Fantasia",       "Humano", "Elfo", "Anão", "Halfling", "Gnomo", "Orc", "Meio-orc", "Meio-elfo", "Meio-Anão", "Goblin" ],
 [ "02", "Cabelo",                "Careca", "Calvície masculina", "Raspado", "Corte pixie", "curto", "Mullet", "Tigela", "Até o Ombro", "Rabo de cavalo", "Coque", "Chiquinhas", "Moicano", "Raspado nas laterais", "Liso, cumprido", "Cumprido, selvagem", "Tranças", "Trançona", "Afro", "Dreadlocks" ],
 [ "03", "Cabelo Facial",         "Bigode", "Barba por fazer", "Barbudo", "Barbudão", "Barba trançada", "Cavanhaque", "Costeletas", "Costeletas de carneiro", "Soul Patch" ],
 [ "04", "Gordura Corporal",            "Pele e osso", "Magrelo", "magro", "Em forma", "Acima do peso", "Fofinho", "Obeso", "Obesidade mórbida" ],
 [ "05", "Musculatura",         "Débil", "Frágil", "Fraca", "Adequada", "Atlética", "Bem forte", "Hercúlea", "O Hulk"],
 [ "06", "Idade",                 "Neném", "Criancinha", "Criança", "Pré-adolescente", "Adolescente", "Jovem adulto", "Adulto", "Maduro", "Meia Idade", "Idoso", "Ancião"],
 
 //CHIMERA
 [ "08", "Estilo de Hibridização", "Cabeça de Animal", "Estilo Fauno/Sereia (membros inferiores, atributos secundários)", "Estilo Centauro (cabeça e torso humanos + torso e membros animais)", "Cabeça, mãos e pés animais", "Estilo Medusa" ],
 [ "0I", "Parte do Corpo",           "Cabeça", "Braço, ombro, peito", "Braço inteiro", "Braço acima do cotovelo", "Antebraço", "Mão", "Perna acima do joelho", "Perna abaixo do joelho" ],
 [ "07", "Animal",              "Gato", "Leão", "Urso", "Tigre de bengala", "Tigre branco", "Jaguar", "Pantera", "Raposa", "Chacal", "Coiote", "Lobo", "Cavalo", "Veado", "Cabra", "Pato", "Macaco", "Peixe", "Tubarão", "Golfinho", "Enguia", "Polvo", "Águia", "Coruja", "Urubu", "Serpente", "Lagarto", "Crocodilo", "Cobra", "Sapo", "Aranha", "Escorpião", "abelha", "Mosquito", "Elefante", "Rinoceronte", "Canguru" ],
 [ "09", "Materiais",           "Espectral", "Gênio (mitologia árabe)", "Gosma", "Plantas trepadeiras", "Esqueleto", "Puro fogo", "Esqueleto em chamas", "Magma", "Cerâmica", "Madeira", "Rocha", "Mármore", "Cristal", "Quartzo rosa", "Diamante", "Pedra preciosa", "Ouro", "Prata", "Cobre", "Latão", "Aço", "Robótico, cromado", "Robótico, ferro velho", "Mecanismos, engrenagens", "Vidro vulcânico", "Vidro", "Gelo", "Areia", "Concreto", "Sobra", "Luz", "Corrupção" ],
 [ "0A", "Asas",               "Águia", "Falcão", "Pomba", "Coruja", "Arara", "secretário, serpentário", "Urubu", "Beija-flor", "Morcego vampiro", "Morcego Corynorhinus townsendii", "Raposa-voadora, Pacó", "Pterodáctilo", "Borboleta", "Libélula" ],
 [ "0B", "Chifres",               "Carneiro", "Ibex", "Argali", "Dik-dik", "Greater kudu", "Addax", "Reedbuck", "Hartebeest", "Impala", "Alce (galhada!)", "Rena (galhada!)", "Rinoceronte", "Touro", "Longhorn", "Ayrshire Bull", "Bisão", "Narval" ],
 [ "0C", "Caudas",                "Felina", "Raposa", "Macaco", "Lagarto", "Camaleão", "Veado", "Escorpião", "Demônio", "Enguia", "Lêmure" ],
 [ "0D", "Olhos",                "Humano, íris escura", "Humano, íris clara", "Humano, heterocromia", "Humanoide, só pupila, sem íris", "Humanoide, só branco (sem pupila, sem íris)", "Humanoide, só preto (sem pupila, sem íris)", "Réptil", "Felinos", "Anfíbio", "Coruja", "Roedor" ],
 [ "0E", "Terceiro Olho",           "Não", "Tattoo", "Pintado", "Fechado", "Aberto", "aberto, todo branco", "Aberto, colorido" ],
 [ "0F", "Dentes",               "Metal", "Caninos de Vampiro", "Presas de Javali", "Carnívoros", "Dentes de sabre", "Roedor" ],
 [ "0G", "Orelhas",                "Elfo, curtas", "Elfo, médias", "Elfo, longas", "Felinas", "Lince", "Mamífero, caídas", "Lhama", "Morcego" ],
 
 [ "0H", "Condição",           "Amaldiçoado", "Possuído", "Abençoado", "Inspirado com o poder de um grande espírito", "Bem descançado", "Totalmente energizado", "Inspirado", "Emocionado", "Sonolento", "Exausto", "Esfomeado", "Dormindo", "Hipnotizado", "Desmaiado", "Derrubado", "Amputação", "Sofrendo sob alta aceleração", "membro quebrado", "Sangrando", "Doente", "Lacerações", "Olho roxo", "Amarrado", "Mãos atadas", "Quase soterrado", "Flecha enfiada", "Adaga enfiada", "Cego", "Cego, surdo e mudo", "Dor de cabeça", "Em chamas", "Todo molhado" ],
 
 [ "0J", "Classe de RPG",           "Lutador", "Guerreiro", "Paladino", "Ladino", "Arqueiro", "Bardo", "Sacerdote", "Mago", "Bruxa(o)", "Feiticeiro(a)", "Invocador", "Oraculo", "Xamã", "Druida", "Monge" ],
 [ "0K", "Armadura",               "Tanga", "Farrapos", "Túnica almofadada", "Manto", "Casca de árvore", "Bambu", "Folhas, trepadeiras", "Pele de bicho", "Couro", "Couro cravejado", "Osso", "Marfim", "Conhas, couraças de crustáceos", "Vidro vulcânico", "Vidro", "Cristal", "Pedra preciosa", "Turmalina negra", "Cota de malha", "Ouro", "Ouro rosado", "Prata", "Cobre", "Latão", "Aço", "Titânio", "Alumínio", "Plástico", "Nanobots" ],
 [ "0L", "Roupas",             "Vestido para ocasião formal", "vestido casualmente", "Trajes rituais", "Pintura corporal e facial cerimonial", "Vestido para a batalha", "Roupas de Trabalho", "Roupas roubadas", "Vestido como nobreza", "Século XX", "Disfarçado como o inimigo", "Vestido para um primeiro encontro", "Algo confortável", "Trapos", "Pijamas", "Traje de banho", "Uniforme" ],
 [ "0M", "Acessório da Cabeça",        "Tiara", "Coroa", "Gorro", "Auréola", "Tapa-olho", "Doutor da peste", "Capacete", "Bandana", "Chapéu-coco", "Cartola", "Chapéu Tricórnio", "Véu", "Glifo de luz flutuando sobre a cabeça", "Olho de luz flutuando sobre a cabeça", "Mascara de baile", "Máscara de metal", "Flores no cabelo", "Louros" ],
 [ "0N", "Arma",              "Soco inglês", "Nunchucks", "Chicote", "Corrente", "Faca", "Adaga", "Espada curta", "Espada & Escudo", "Escudo", "Kopis", "Gladius", "Rapieira", "Katana", "Cimitarra", "Espada longa", "Espada larga", "Pique", "Lança", "Lança de Justa", "Armas de haste", "Alabarda", "Bidente", "Tridente", "Bastão", "Bastão Mágico", "Varinha", "Machado", "waraxe", "Martelo de guerra", "Maço", "Clava", "Maça", "Cetro", "Mangual", "Maça cravada", "Foice", "Gadanha", "Shuriken", "Zarabatana", "Mosquete"],
 [ "0S", "Magia",               "Fogo", "Água", "Vento", "Terra", "Raio", "Gelo", "Vida", "Morte", "Vazio", "Prismática", "Luz", "Escuridão", "Gravidade", "Tempo", "Espaço", "Ilusão", "Invisibilidade", "Transmutação", "Psíquico", "Telecinésia", "Teletransporte", "Abrir um portal", "Invocação", "Adivinhação" ], 
 [ "0O", "Item",                "Flor", "Fruta", "Cesta de Vegetais", "Pão", "Concha", "Tocha", "Lanterna", "Coroa", "Vassoura", "Carta de Tarot", "Bola de cristal", "Cristal", "Pedra preciosa", "Grande ovo", "Livro", "Pergaminho", "Envelope", "Anel de chaves", "Medalhão", "Relógio de bolso", "Cálice", "Anel", "Colar", "Joia", "Smartphone", "Tecido", "Bandeira", "Estandarte", "Luneta", "Lupa", "Saco de moedas", "Candelabro", "Estatueta", "Pena de escrever", "Martelo e formão", "Arma", "Sólido platônico feito de [material]", "Caveira" ],
 [ "0P", "Pets",                "Papagaio", "Falcão", "Coruja", "Beija-flor", "Camaleão", "Camundongo", "Cão", "Gato", "Fantasma", "Zumbi acorrentado", "Porco", "Coelho", "Feneco", "Esquilo", "Capivara", "Mico-Leão dourado", "Rã", "Gárgola", "Diabo", "Fada", "anjinho & diabinho" ],
 [ "0Q", "Montaria",               "Cavalo", "Veado", "Camelo", "Lagarto", "Pterodáctilo", "Urso", "Tigre", "Leão", "Pégaso", "Unicórnio", "Grifo", "Dragão", "Elefante", "Besouro gigante", "Dinossauro Herbívoro", "Dinossauro Carnívoro", "Avestruz" ],
 [ "0R", "Veículo",             "Palanquim", "Carruagem", "Biga", "Trenó", "Nuvem mágica", "Vassoura", "Skateboard", "Rollerskates", "Surfboard", "Scooter", "Bicicleta", "Unicíclo", "Motocicleta", "Triciclo", "Tapete", "Balão", "Máquina voadora do Da Vinci" ],

 //scene
 [ "0U", "Geografia",           "Lago", "Rio", "Riacho", "Delta de rio", "Praia", "Colina", "Topo da colina", "Montanha", "Pico da montanha", "Mar", "Oceano", "Ilha", "Península", "Istmo", "Vale", "Pé do penhasco", "Beira do penhasco", "Campo", "Floresta", "Mata", "Tundra", "Pântano", "Brejo", "Prado", "Clareira", "Pradaria", "Savana", "Mesa", "Planalto", "Geleira", "Iceberg", "Planíces nevadas", "Cânion", "Fjord", "Dunas de areia", "Deserto de sal", "Vulcão", "Gêiser", "Cratera", "Caverna" ],
 [ "0V", "Hora",                "Logo antes da alvorada", "Alvorada", "Manhãzinha", "Meio-dia", "de tarde", "de tardinha", "Crepúsculo", "Por do sol", "Madrugada", "Sob a lua cheia", "Equinócio vernal", "Solstício de verão", "Uma manhã fria de inverso", "Uma tarde nublada de outono", "O dia mais quente do verão", "Nas chuvas da primavera", "No dia do ano novo"],
 [ "0W", "Tempo",             "Agradável", "Dia ensolarado", "Parcialmente nublado", "Nublado", "Chuvisco", "Enquanto a chuva desaba", "O fim da tempestade, um arco-íris", "Ventania", "Raios e trovões", "Tempestade elétrica", "Geada", "Snowstorm", "Primeira neve do ano", "Aurora boreal" ],
 [ "0T", "Culturas Antigas",    "Maia", "Inca", "Asteca", "Babilônia", "Grécia", "Roma", "Cartago", "Celta", "Nórdica", "Sengoku Jidai Japão", "Dinastia Qin, China", "Egito", "Zulu", "Mali", "Persa", "Aksum", "Maori", "Vale do Rio Indo", "Tupi Guarani", "Haudenosaunee" ],
 [ "0X", "Fase da Lua",          "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘" ],
 
 //utilities
 [ "0Y", "Cores",              "Vermelho", "Laranja", "Amarelo", "Rosa", "Magenta", "Verde", "Azul", "Ciano", "Roxo", "Violeta", "Marrom", "Preto", "Branco", "Cinza" ],
 [ "0Z", "Moeda",            "Cara", "Coroa" ],
 [ "0a", "Pedra, Papel ou Tesoura","Pedra", "Papel", "Tesoura" ],//"✊", "✋", "✌"
 [ "0b", "D4",                  "1", "2", "3", "4" ],
 [ "0c", "D6",                  "⚀", "⚁", "⚂", "⚃", "⚄", "⚅" ],
 [ "0d", "D8",                  "1", "2", "3", "4", "5", "6", "7", "8" ],
 [ "0e", "D12",                 "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ],
 [ "0f", "D20",                 "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20" ],
 [ "0g", "D100",                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69 (nice)", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100" ],
 [ "0h", "Signos do Zodíaco",        "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓" ],
 [ "0i", "Símbolos de Alquimia",  "🜀", "🜁", "🜂", "🜃", "🜄", "🜅", "🜆", "🜇", "🜈", "🜉", "🜊", "🜋", "🜌", "🜍", "🜎", "🜏", "🜐", "🜑", "🜒", "🜓", "🜔", "🜕", "🜖", "🜗", "🜘", "🜙", "🜚", "🜛", "🜜", "🜝", "🜞", "🜟", "🜠", "🜡", "🜢", "🜣", "🜤", "🜥", "🜦", "🜧", "🜨", "🜩","🜪", "🜫", "🜬", "🜭", "🜮", "🜯", "🜰", "🜱", "🜲", "🜳", "🜴", "🜵", "🜶", "🜷", "🜸", "🜹", "🜺", "🜻", "🜼", "🜽", "🜾", "🜿", "🝀", "🝁", "🝂", "🝃", "🝄", "🝅", "🝆", "🝇", "🝈", "🝉", "🝊", "🝋", "🝌", "🝍", "🝎", "🝏", "🝐", "🝑", "🝒", "🝓", "🝔", "🝕", "🝖", "🝗", "🝘", "🝙", "🝚", "🝛", "🝜", "🝝", "🝞", "🝟", "🝠", "🝡", "🝢", "🝣", "🝤", "🝥", "🝦", "🝧", "🝨", "🝩", "🝪", "🝫", "🝬", "🝭", "🝮", "🝯", "🝰", "🝱", "🝲", "🝳" ],
 [ "0j", "Símbolos dos Planetas",      "☿", "♀", "♁", "♂", "♃", "♄", "♅", "♆" ],
 [ "0k", "Letras Gregas [mai]",  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "ς", "σ", "τ", "υ", "φ", "χ", "ψ", "ω" ],
 [ "0l", "Letras Gregas [min]",  "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π", "Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω" ]
 ];
 
let lib_blocks = [ 7, 11, 1, 10, 5, 14 ];

function random_from_lib( ID ){
  return lib[ID][ floor(random(2, lib[ID].length )) ];
}

var libIDmap;

var preset_boards = [ "013v2F3w1a⁝003v3u3w1a⁝0J902B3w1a⁝0N915T3w1a⁝0P91793w1a⁝053v7B3w1a⁝023v5Y3w1a⁝0K913n3w1a⁝0UDp4n3w1a⁝0UDv793w1a⁝0WDn283w1a⯌Retrato de Personagem de Fantasia•8f184c0K⁝Pisando sobre:•Du4K3Y0U⁝Na distância:•Dz6m3m0X",
                      "003W3g2t14⁝023W4p2t1A⁝063X622t18⁝086g543N2E⁝076h7M3M1G⁝0AAA532h1B⁝0BD2532g1B⁝0GD36I2f1F⁝0DD47b2e1I⁝0IFp522h1E⁝09Fp6K2h1D⁝0CAC7u2i1E⁝0bBr2C1W1X⁝0bGk2N1f1W⁝0bAA6b2k1H⯌Retraro de uma Criatura Estranha•8#0z4U0L⁝Forma humanoide de base•3U3E3c0L⁝1•8D4d0j0S⁝2•BT4i0r0M⁝3•EE4j0S0L⁝4•Gw4i0X0P⁝Tipo de Alteração:•AF2h1X0j⁝Segunda alteração(?):•F02f1u0s⁝Pares de asas:•AD6K2f0L",
                      "07Eg2B2q1C⁝07Eg3S2q1G⁝0AEh4o2p1G⁝0CEi662p1K⁝0BEh7V2q1G⁝004M2F3#1A⁝0K4L3e401E⁝0P4J6b3#1P⁝0N4I57411H⁝0a6w8C3Z1N⁝0aB38A3a1P⁝0UD@014g1I⯌Cabeça, torso•HZ2X1L0h⁝Membros•HV3u1S0T⁝Caçando a Besta•9u1P2P0U⁝VS•Ay4@0e0V",
                      "00412w3t1Z⁝0K8q3M3v1I⁝078r5H3w1a⁝0ODv2@3w1a⁝0PDt6Y3w1a⁝02414Z3u19⁝04425n3u12⁝05426u3u1G⁝0H8w7x3w1a⁝0RDu4i3w1a⯌Com imagem em relevo ou pintura de:•8R4r4p0M⁝O Viajante•9o1G1a0M",
                      "005G373a1P⁝00Cy323f1Q⁝0U7Z1W351L⁝0N5G643b1Z⁝0SC@4Y3d1a⁝0K5F4Z3b1S⁝0PCz6B3e1V⁝0WAw1U331O⁝0H5F7f3c1W⁝0HCz7k3e1Q⯌Duelo do Destino•9#112H0J⁝VS•An5y0f0a",
                      "003L22321N⁝013M3S311K⁝013N4n2#1R⁝0O6R1@2w1Q⁝0P3N6E301S⁝0N6Q3S2x1K⁝0M6O4p381N⁝0TDS1M4I1D⁝0TDT2x4G1I⁝0UDU4M4H1K⁝0OAv8U3C1N⁝09ED8U361P⁝0KDj6C3b1E⯌Explorando a Cidade Perdida•9V0e2x0T⁝Nossos 4 intrépidos exploradores•4F1R4V0L⁝A Cidade:•Ei0s1Z0K⁝+•FO2f0V0J⁝Tesouro:•DO801T0O⁝Armadura Assombrada Guardiã:•Bz6O1t0u",
                      "003k483V1L⁝063j5V3W1P⁝0L3i6w3X1T⁝0YDz4N3H1D⁝0AD@5e3G17⁝0BAl4P3B1C⁝0CAk5f3C1B⁝0EDz6p3I1A⁝0GDz803J1F⁝0FAk813C1F⁝0DAk6s3C19⁝0dDP2u1t1L⁝0dFI2t1j1M⁝0V7T1m3Y0@⯌Protagonista abstraído•3y3e310R⁝Encontro com os Seres de Outro Mundo•751G5E0J⁝(pele)•F64P0y0L⁝Os Estrangeiros•Cp2H2a0M⁝Duas características:•Ac3P3D0g⁝1•AK4w0U0R⁝2•HX4z0T0c⁝3•AK6F0X0P⁝4•HV680X0i⁝5•AK7K0T0j⁝6•HU7L0a0l⁝7•AM8T0S0O⁝8•HV8b0T0U",
                      "0I3@5P3B16⁝09406w3911⁝00401c361K⁝0K408U3814⁝0Q7U5W2@1V⁝0SCV3N5M1K⁝0XCW4l2I1b⁝0iEt4l3D1b⁝0B42323A17⁝0C424C3913⁝0O7R3o311T⁝0a8q7p3W1J⁝0aDJ7n3Z1L⯌Prótese feita de•436Z2l0N⁝Avambraços e grevas•41893N0W⁝Lidando com uma armadilha ou tranca mágica•CX2s5p0K⁝X•Cj8I0S0S⁝Um Curioso Aventureiro•5p123A0M",
                      "076Q3X3M1A⁝0A6Q4k3N1J⁝0Q6Q633N1K⁝0SAK4q3O2a⁝0b7O261Z1O⁝09AK3Y3O1G⁝0YAM7R3N1M⁝0bBE271T1P⁝0P6Q7O3N1N⯌Pocket Monster•951K290Q⁝1•5m3z0Q0R⁝2•5m5A0X0P⁝4•5o7t0a0Z⁝2 ou 4•E85y150b⁝1•EF3z0a0Z⁝3•EE81100f⁝3•5m6W0V0R"
                    ];
 
var category_buttons;
var selected_category = { n : -1 };
var cats;
var cat_scroll, csm;

var cards;
let selected_card = -1;

var labels;
let selected_label = -1;

var catbar = { b : true };
var randall = { b : false };
var addlab = { b : false };
var closall = { b : false };

var labcorner;
var menu;

function preload(){
  document.getElementById("databox").size = "60";
  digitmap = {};// this is basically a hashmap! neat.
  for( var i = 0; i < 64; ++i ){
    digitmap[digits[i]] = { n: i };
  }
}

var T;
var uic_bg, uic_dimmer, uic_dim, uic_light, uic_lighter, uic_border, uitc_light, uitc_dim;
var black, white;
var colorlib;

function setup(){
  var canvas = createCanvas(1200, 640);
  canvas.parent('sketch-holder');
  
  textSize(18);
  th = (textDescent() + textAscent()) * 0.92;
  
  //var C = base64_encode( 1245, 2 );
  //print( C );
  //print( base64_decode( C ) );
  white = color(255);
  black = color(0);
  colorlib = [ color('#555C5F'), color('#FFFEEA'), color('#2F708E'), color('#B2F7FF'), color('#953D1D'), color('#4F1A64'), color('#092709'), color('#FCBAF8'), color('#BCB135'), color('#0B0D0D') ];
  T = floor(random(0, colorlib.length ));
  refresh_theme();
  
  category_buttons = Array( lib.length );
  libIDmap = {};//= Array( lib.length );
  for( var i = 0; i < lib.length; ++i ){
    category_buttons[i] = new intSet( 2, 2+(i*26), 195, 24, lib[i][1], i );// + " " + i
    libIDmap[lib[i][0]] = { n: i };
  }
  cat_scroll = 0;
  csm = 4 + (category_buttons.length - ceil(620/26.0) + 1) * 26;
  refresh_cats();
  cards = Array(0);
  labels = Array(0);
  menu = Array(4);
  let l = 150;
  menu[0] = new Toggle( 200, 1, l, 30, "Aleatorizar Tudo" );
  menu[1] = new Toggle( 200+ l, 1, l, 30, "Criar Legenda" );
  menu[2] = new Toggle( 200+ 2*l, 1, l, 30, "Remover Tudo" );
  menu[3] = new Toggle( 0, 1, 200, 30, "Categorias" );
  //menu[4] = new Toggle( 200+ 4*l, 0, l, 30, "Load Board" );
  
  var db = document.getElementById("databox");
  
  db.value = "⯌🠈 Clique em uma categoria para inserir cartões e criar seu quadro•3N4E8D0S⁝Ou selecione um quadro pronto da lista abaixo•5R4q6F0N⁝Aperte T para mudar o Tema•Ed8n3p0P⁝Clique e arraste os cartões e as legendas para reposicioná-los•CR414M0i⁝Clique com o botão do meio para redimensioná-los•CU4u4E0d⁝Bem-Vindo ao Gerador de Idéias para ilustrações de Introscopia•6s1C890N⁝Aperte <Delete> para remover a legenda selecionada.•CV5i4H0f";
  load_board();
  db.value = "";
  
  noStroke();
}

//--+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- 
function draw(){
  background( uic_bg );
  
  for( var i = cards.length-1; i >= 0; --i ){
    cards[i].display();
    if( cards[i].randomize_me.b ){
      cards[i].content = random_from_lib( cards[i].libID );
      cards[i].randomize_me.b = false;
    }
    if( cards[i].close_me.b ) cards.splice(i, 1);
  }
  
  for( var i = 0; i < labels.length; ++i ){
    labels[i].display();
  }

  if( addlab.b ){
    if( labcorner != null ){
      push();
      noFill();
      stroke(0, 255, 0);
      rectMode(CORNERS);
      rect( labcorner.x, labcorner.y, mouseX, mouseY );
      pop();
    }
  }
  if( selected_label >= 0 ){
    push();
    noFill();
    stroke(0, 255, 0);
    labels[ selected_label ].display_rect();
    pop();
  }
  
  menu[0].display_tab( randall );
  menu[1].display_tab( addlab );
  menu[2].display_tab( closall );
  menu[3].display_tab( catbar );
  if( catbar.b ) image( cats, 2, 32 );
}
//--+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- --+-- 

function load_preset( N ){
  var db = document.getElementById("databox");
  db.value = preset_boards[ N ];
  load_board();
}

function load_board(){
  var db = document.getElementById("databox");
  let sections = split( db.value, "⯌");
  if( sections.length == 2 ){
    
    cards = Array(0);
    if( sections[0].length > 0 ){
      let C = split( sections[0], "⁝" );
      
      for( var i = 0; i < C.length; ++i ){
        let N = libIDmap[C[i].substring(0, 2)].n;//base64_decode( C[i].substring(0, 2) );
        let X = base64_decode( C[i].substring(2, 4) );
        let Y = base64_decode( C[i].substring(4, 6) );
        let W = base64_decode( C[i].substring(6, 8) );
        let H = base64_decode( C[i].substring(8, 10) );
        cards.push( new Card( X, Y, W, H, lib[N][1], N ) );
      }
    }
    
    labels = Array(0);
    if( sections[1].length > 0 ){
      let L = split( sections[1], "⁝" );
      for( var i = 0; i < L.length; ++i ){
        let spl = split( L[i], "•" );
        if( spl.length === 2 ){
          let X = base64_decode( spl[1].substring(0, 2) );
          let Y = base64_decode( spl[1].substring(2, 4) );
          let W = base64_decode( spl[1].substring(4, 6) );
          let H = base64_decode( spl[1].substring(6, 8) );
          //print( X, Y, W, H, spl[0] );
          labels.push( new Draggable_Label( X, Y, W, H, spl[0] ) );
        }
      }
    }
  }
}
//var C = base64_encode( 1245, 2 );
  //print( C );
  //print( base64_decode( C ) );

function save_board(){
  var S = "";
  for( var i = 0; i < cards.length; ++i ){
    S += lib[cards[i].libID][0] + base64_encode( floor(cards[i].x), 2 ) + base64_encode( floor(cards[i].y), 2 ) + base64_encode( floor(cards[i].w), 2 ) + base64_encode( floor(cards[i].h), 2 );
    if( i < cards.length-1 ) S += "⁝";
  }
  S += "⯌";
  for( var i = 0; i < labels.length; ++i ){
    S += labels[i].label + "•" + base64_encode( floor(labels[i].x), 2 ) + base64_encode( floor(labels[i].y), 2 ) + base64_encode( floor(labels[i].w), 2 ) + base64_encode( floor(labels[i].h), 2 );
    if( i < labels.length-1 ) S += "⁝";
  }
  var db = document.getElementById("databox");
  db.value = S;
  db.select();
  db.setSelectionRange(0, 99999);
  document.execCommand("copy");
  //alert("Copied to clipboard");
}


function mousePressed(){
  selected_label = -1;
  if( !catbar.b || mouseX > cats.width ){
    for( var i = 0; i < cards.length; ++i ){
      if( cards[i].pressed() ){
        selected_card = i;
        break;
      }
    }
  }
  if( selected_card < 0 ){
    for( var i = 0; i < labels.length; ++i ){
      if( labels[i].pressed() ){
        selected_label = i;
        break;
      }
    }
  }
  if( addlab.b ){
    labcorner = createVector( mouseX, mouseY );
  }
  if (mouseButton === CENTER) return false;
}
function mouseDragged(){
  if( selected_card >= 0 ){
    if (mouseButton === LEFT) cards[ selected_card ].dragged();
    else if (mouseButton === CENTER) cards[ selected_card ].resize();
  }
  else if( selected_label >= 0 ){
    if (mouseButton === LEFT) labels[ selected_label ].dragged();
    else if (mouseButton === CENTER) labels[ selected_label ].resize();
  }
}

function mouseReleased(){
  if( selected_card >= 0 ){
    selected_card = -1;
  }
  else if( addlab.b ){
    let w = mouseX-labcorner.x;
    if( w < 10 ) w = 10;
    let h = mouseY-labcorner.y;
    if( h < 10 ) h = 10;
    labels.push( new Draggable_Label( labcorner.x, labcorner.y, w, h, '' ) );
    selected_label = labels.length -1;
    cursor(ARROW);
    addlab.b = false;
  }
  else{
    for( var i = 0; i < cards.length; ++i ){
      cards[i].released();
    }
    menu[0].released( randall );
    if( randall.b ){
      for( var i = 0; i < cards.length; ++i ) cards[i].randomize_me.b = true;
      randall.b = false;
    }
    menu[1].released( addlab );
    if( addlab.b ){
      cursor( TEXT );
      labcorner = null;
    }
    menu[2].released( closall );
    if( closall.b ){
      //for( var i = 0; i < cards.length; ++i ) cards[i].close_me.b = true;
      cards = Array(0);
      labels = Array(0);
      closall.b = false;
    }
    menu[3].released( catbar );
    //menu[4].released( loadb );
    if( mouseX < 200 && mouseY > 30 && catbar.b ){
      for( var i = 0; i < category_buttons.length; ++i ){
        if( category_buttons[i].released( selected_category, cat_scroll -32 ) > 0 ){
          //refresh_cats();
          break;
        }
      }
      if( selected_category.n >= 0 ){
        cards.push( new Card( mouseX, mouseY, 250, 100, lib[selected_category.n][1], selected_category.n ) );
        selected_category.n = -1;
      }
    }
  }
}

function mouseWheel(event) {
  if( mouseX > 1 && mouseY > 31 && mouseX < cats.width && mouseY < height ){
    cat_scroll = constrain( cat_scroll + 8 * event.delta, 0, csm );
    refresh_cats();
    return false;
  }
}

function keyPressed() {
  if( selected_label >= 0 ){
    if( keyCode === BACKSPACE ){
      if( labels[ selected_label ].label.length >= 1 ){
        labels[ selected_label ].label = labels[ selected_label ].label.substring( 0, labels[ selected_label ].label.length-1 );
        return false;
      }
    }
    else if( keyCode === DELETE ){
      labels.splice(selected_label, 1);
      selected_label = -1;
    }
  }
}
function keyTyped() {
  if( selected_label >= 0 ){
    labels[ selected_label ].label += key;
  }
  else if( key == 't' ){
    T += 1;
    if( T >= colorlib.length ) T = 0;
    refresh_theme();
    refresh_cats();
  }
  if( key == ' '  ) return false;
}

function refresh_theme(){
  uic_dim = colorlib[ T ];  
  uic_light = lerpColor( uic_dim, white, 0.2 );
  
  if( lightness( uic_dim ) > 50 ){ // Light themes
    uitc_light = color(0);
    uitc_dim = color(15);
    uic_bg = lerpColor( uic_dim, white, 0.333 );
    uic_lighter = lerpColor( uic_dim, black, 0.04 );
    uic_dimmer = lerpColor( uic_dim, black, 0.05 );
    uic_border = lerpColor( uic_dim, black, 0.5);
  }
  else{ // Dark themes
    uitc_light = color(255);
    uitc_dim = color(240);
    uic_bg = lerpColor( uic_dim, black, 0.333 );
    uic_lighter = lerpColor( uic_dim, white, 0.275 );
    uic_dimmer = lerpColor( uic_dim, black, 0.2 );
    uic_border = lerpColor( uic_dim, white, 0.1);
  }
}

function refresh_cats(){
  cats = createGraphics(200, height-31);
  cats.stroke( uic_border );
  cats.fill( uic_dim );
  cats.rect( 0, 0, cats.width, cats.height );
  
  cats.textAlign(CENTER, CENTER);
  cats.push();
  cats.translate( 0, -cat_scroll );
  var block = 0;
  var c = 0;
  var Q = true;
  cats.fill( uic_light );
  for( var i = 0; i < category_buttons.length; ++i ){
    if( c >= lib_blocks[block] ){
      c = 0;
      ++block;
      Q = !Q;
    }
    cats.stroke( uic_border );
    if( Q ) cats.fill( uic_light );
    else cats.fill( uic_lighter );
    category_buttons[i].displaypg_rect( cats );
    cats.noStroke();
    cats.fill( uitc_light );
    category_buttons[i].displaypg_label( cats );
    ++c;
  }
  cats.pop();
  cats.stroke( uic_border );
  cats.noFill();
  cats.rect( 0, 0, cats.width-1, cats.height-2 );
}


function Toggle(x, y, w, h, label ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  
  this.display = function( incumbency ){
    stroke( uic_border );
    if( incumbency.b ) fill( uic_light );
    else fill( uic_dim );
    rect( this.x, this.y, this.w, this.h, 4, 4, 4, 4 );
    noStroke();
    if( incumbency.b ) fill( uitc_light );
    else fill( uitc_dim );
    textAlign(CENTER, CENTER);
    text( this.label, this.cx, this.cy );
  }
  this.display_tab = function( incumbency ){
    stroke(uic_border);
    if( incumbency.b ) fill( uic_light );
    else fill( uic_dim );
    rect( this.x, this.y, this.w, this.h, 0, 0, 4, 4 );
    noStroke();
    if( incumbency.b ) fill( uitc_light );
    else fill( uitc_dim );
    textAlign(CENTER, CENTER);
    text( this.label, this.cx, this.cy );
  }
  this.released = function( incumbency ){
    if( mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h ){
      incumbency.b = !incumbency.b;
      return 1;
    }
    return 0;
  }
  this.released_relative = function( incumbency, mx, my ){
    if( mx > this.x && mx < this.x+this.w && my > this.y && my < this.y+this.h ){
      incumbency.b = !incumbency.b;
      return 1;
    }
    return 0;
  }
  this.resize = function( x, y, w, h ){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cx = x + (w * 0.5);
    this.cy = y + (h * 0.5);
  }
};


function intSet(x, y, w, h, label, set ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.set = set;
  this.cx = x + (w * 0.5);
  this.cy = y + (h * 0.5);
  
  this.displaypg_rect = function( pg ){
    pg.rect( this.x, this.y, this.w, this.h );
  }
  this.displaypg_label = function( pg ){ 
    pg.text( this.label, this.cx, this.cy );
  }
  
  this.display = function( incumbency ){
    stroke(255);
    if( incumbency.n == this.set ) fill(255);
    else fill(0);
    rect( this.x, this.y, this.w, this.h );
    
    noStroke();
    if( incumbency.n == this.set ) fill(0);
    else fill(255);
    textAlign(CENTER, CENTER);
    text( this.label, this.cx, this.cy );
  }
  this.released = function( incumbency, ty ){
    if( mouseX > this.x && mouseX < this.x+this.w && mouseY +ty > this.y && mouseY +ty < this.y+this.h ){
      incumbency.n = this.set;
      return 1;
    }
    return 0;
  }
};

function Draggable_Label (x, y, w, h, label){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.tx = 0;
  this.ty = 0;
  this.label = label;
  
  this.display = function(){
    noStroke();
    fill( uitc_light );
    textAlign(LEFT, TOP);
    wrapped_text( this.label, this.x, this.y, this.w - 15, this.h );
  }
  this.display_rect = function(){
    rect( this.x, this.y, this.w, this.h );
  }
  this.pressed = function(){
    if( mouseX > this.x && mouseY > this.y && mouseX < this.x + this.w && mouseY < this.y + this.h ){
      this.tx = mouseX - this.x;
      this.ty = mouseY - this.y;
      return true;
    }
    else return false;
  }
  this.dragged = function(){
    this.x = mouseX - this.tx;
    this.y = mouseY - this.ty;
  }
  this.resize = function(){
    this.w = mouseX - this.x;
    this.h = mouseY - this.y;
  }
}

function Card (x, y, w, h, label, libID ){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.tx = 0;
  this.ty = 0;
  this.label = label;
  this.content = "";
  this.libID = libID;
  this.k = h * 0.25;
  this.close_me = { b : false };
  this.close = new Toggle( w - this.k, 0, this.k, this.k, "x" );
  this.randomize_me = { b : false };
  this.randomize = new Toggle( w - this.k, this.k, this.k, (h * 0.75)-1, "🎲" );
  this.hline = th + 6;
  
  this.display = function(){
    fill( uic_dimmer );
    stroke( uic_border );
    rect( this.x, this.y, this.w, this.h, 5, 0, 0, 5 );
    
    push();
    translate( this.x, this.y );
    stroke( uitc_dim );
    line( 0, this.hline, this.close.x, this.hline );
    noStroke();
    fill( uitc_light );
    textAlign(LEFT, TOP);
    text( this.label, 5, 5 );
    if( this.content.length < 3 ){
      push();
      textSize(50);
      text( this.content, 20, this.hline + 10 );
      pop();
    }
    else wrapped_text( this.content, 5, this.hline + 10, this.w - this.close.w - 30, this.h-35 );
    
    this.close.display( this.close_me );
    this.randomize.display( this.randomize_me );
    pop();
  }
  this.pressed = function(){
    if( mouseX > this.x && mouseY > this.y && mouseX < this.x + this.close.x && mouseY < this.y + this.h ){
      this.tx = mouseX - this.x;
      this.ty = mouseY - this.y;
      return true;
    }
    else return false;
  }
  this.dragged = function(){
    this.x = mouseX - this.tx;
    this.y = mouseY - this.ty;
    this.hline = th + 6;
  }
  this.resize = function(){
    if( mouseX > this.x +10 && mouseY > this.y +10 ){
      this.w = mouseX - this.x;
      this.h = mouseY - this.y;
      this.k = this.h * 0.25;
      this.close.resize( this.w - this.k, 0, this.k, this.k );
      this.randomize.resize( this.w - this.k, this.k, this.k, (this.h * 0.75)-1 );
    }
  }
  this.released = function( ){
    this.close.released_relative( this.close_me, mouseX-this.x, mouseY - this.y );
    this.randomize.released_relative( this.randomize_me, mouseX-this.x, mouseY - this.y );
  }
};
