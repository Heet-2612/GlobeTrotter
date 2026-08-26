-- V15__seed_state_regions_and_curated_destinations.sql
-- Seed 29 State & Union Territory Regions and map all 137 Curated Destinations

-- 1. Seed 29 State / Union Territory Regions
INSERT INTO regions (name, canonical_name, country, description) VALUES
('Andaman & Nicobar Islands', 'andaman-nicobar-islands', 'India', 'Tropical archipelago, coral reefs, and pristine beaches.'),
('Andhra Pradesh', 'andhra-pradesh', 'India', 'Sacred hill shrines, coastal ports, and lush valleys.'),
('Arunachal Pradesh', 'arunachal-pradesh', 'India', 'High-altitude Buddhist monasteries, tribal heritage, and mountain passes.'),
('Assam', 'assam', 'India', 'One-horned rhino sanctuaries, tea gardens, and Brahmaputra river islands.'),
('Bihar', 'bihar', 'India', 'Ancient seats of learning, UNESCO Mahabodhi temple, and Buddhist pilgrimage.'),
('Dadra and Nagar Haveli and Daman and Diu', 'dadra-nagar-haveli-daman-diu', 'India', 'Portuguese coastal forts, tranquil beaches, and island ramparts.'),
('Delhi', 'delhi', 'India', 'National Capital Territory, Mughal monuments, and historic heritage.'),
('Goa', 'goa', 'India', 'Sun-kissed beaches, Latin Quarter architecture, and coastal fortresses.'),
('Gujarat', 'gujarat', 'India', 'Great Rann white salt desert, Asiatic lion sanctuaries, and stepwell architecture.'),
('Himachal Pradesh', 'himachal-pradesh', 'India', 'Pine-forested hill stations, mountain passes, and Himalayan valleys.'),
('Jammu & Kashmir', 'jammu-kashmir', 'India', 'Dal Lake houseboats, alpine snow slopes, and holy cave shrines.'),
('Karnataka', 'karnataka', 'India', 'Tech hub capital, royal palaces, Vijayanagara rock ruins, and tiger reserves.'),
('Kerala', 'kerala', 'India', 'Tranquil backwater houseboats, tea gardens, cliffside beaches, and Ayurveda.'),
('Ladakh', 'ladakh', 'India', 'High-altitude cold desert, blue lakes, and clifftop Buddhist monasteries.'),
('Lakshadweep', 'lakshadweep', 'India', 'Coral atolls, crystal-clear lagoons, and marine biodiversity.'),
('Madhya Pradesh', 'madhya-pradesh', 'India', 'UNESCO erotic temple carvings, tiger reserves, and ancient forts.'),
('Maharashtra', 'maharashtra', 'India', 'Coastal metropolis, UNESCO rock-cut caves, Sahyadri forts, and vineyards.'),
('Meghalaya', 'meghalaya', 'India', 'Living root bridges, India tallest plunge waterfalls, and crystal rivers.'),
('Mizoram', 'mizoram', 'India', 'Scenic Mizo hills, traditional villages, and lush green valleys.'),
('Odisha', 'odisha', 'India', 'Jagannath sacred coast, UNESCO Sun Temple chariot, and brackish lagoon.'),
('Puducherry', 'puducherry', 'India', 'French White Town heritage promenade, Auroville golden dome, and ashrams.'),
('Punjab', 'punjab', 'India', 'Sikh Golden Temple, frontier heritage, and rich agricultural traditions.'),
('Rajasthan', 'rajasthan', 'India', 'Royal palaces, desert forts, Thar sand dunes, and vibrant heritage.'),
('Sikkim', 'sikkim', 'India', 'Kanchenjunga Himalayan panoramas, sacred alpine lakes, and monasteries.'),
('Tamil Nadu', 'tamil-nadu', 'India', 'Dravidian gopuram temples, Nilgiri hill stations, and Chola bronzes.'),
('Telangana', 'telangana', 'India', 'Historic Deccan citadel, Charminar, and technology hubs.'),
('Uttar Pradesh', 'uttar-pradesh', 'India', 'Sacred Ganges ghats, Taj Mahal, and ancient holy pilgrimage cities.'),
('Uttarakhand', 'uttarakhand', 'India', 'Himalayan Char Dham shrines, tiger reserves, and mountain lakes.'),
('West Bengal', 'west-bengal', 'India', 'Cultural metropolis, Darjeeling tea hills, and Sundarbans mangroves.')
ON CONFLICT (canonical_name) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Reset default curation flags on existing destinations
UPDATE destinations SET is_curated = false, source = 'CURATED';

-- 3. Update region_id for all retained non-curated V1 destinations
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 1;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 2;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 3;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 4;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 5;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 6;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 7;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh') WHERE id = 8;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh') WHERE id = 9;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 10;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'punjab') WHERE id = 11;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'ladakh') WHERE id = 12;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir') WHERE id = 13;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh') WHERE id = 14;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 15;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 16;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 17;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 18;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 19;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 20;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala') WHERE id = 21;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala') WHERE id = 22;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala') WHERE id = 23;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 24;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 25;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 26;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'puducherry') WHERE id = 27;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 28;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala') WHERE id = 29;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 30;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 31;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala') WHERE id = 32;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala') WHERE id = 33;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 34;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 35;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 36;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 37;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 38;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 39;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 40;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 41;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'sikkim') WHERE id = 42;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'meghalaya') WHERE id = 43;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'meghalaya') WHERE id = 44;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'assam') WHERE id = 45;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 46;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 47;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 48;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 49;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 50;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 51;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 52;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 53;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 54;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 55;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 56;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 57;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 58;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 59;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 60;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 61;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 62;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh') WHERE id = 63;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 64;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 65;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 66;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 67;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 68;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 69;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan') WHERE id = 70;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'punjab') WHERE id = 71;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh') WHERE id = 72;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh') WHERE id = 73;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh') WHERE id = 74;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 75;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 76;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 77;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand') WHERE id = 78;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir') WHERE id = 79;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir') WHERE id = 80;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir') WHERE id = 81;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'arunachal-pradesh') WHERE id = 82;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'assam') WHERE id = 83;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'assam') WHERE id = 84;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'assam') WHERE id = 85;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'mizoram') WHERE id = 86;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'assam') WHERE id = 87;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'golden-triangle-north-india-plains') WHERE id = 88;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'sikkim') WHERE id = 89;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'assam') WHERE id = 90;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'arunachal-pradesh') WHERE id = 91;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andaman-nicobar-islands') WHERE id = 92;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andaman-nicobar-islands') WHERE id = 93;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andaman-nicobar-islands') WHERE id = 94;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'lakshadweep') WHERE id = 95;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'lakshadweep') WHERE id = 96;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 97;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 98;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 99;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 100;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 101;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 102;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 103;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 104;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 105;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 106;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka') WHERE id = 107;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 108;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 109;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 110;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 111;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 112;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu') WHERE id = 113;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 114;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 115;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 116;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 117;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 118;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 119;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 120;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 121;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 122;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 123;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 124;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 125;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 126;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh') WHERE id = 127;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 128;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 129;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 130;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 131;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 132;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 133;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 134;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana') WHERE id = 135;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 136;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 137;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 138;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 139;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 140;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 141;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 142;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 143;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 144;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh') WHERE id = 145;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 146;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 147;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 148;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 149;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 150;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha') WHERE id = 151;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 152;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 153;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 154;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 155;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 156;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 157;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal') WHERE id = 158;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 159;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 160;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 161;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 162;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 163;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 164;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 165;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 166;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 167;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 168;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 169;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 170;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar') WHERE id = 171;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 172;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 173;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 174;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 175;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 176;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 177;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 178;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 179;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 180;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 181;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 182;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 183;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 184;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra') WHERE id = 185;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 186;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 187;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 188;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 189;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 190;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 191;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 192;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 193;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 194;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 195;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 196;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 197;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 198;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat') WHERE id = 199;
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'dadra-nagar-haveli-daman-diu') WHERE id = 200;

-- 4. Update the 105 existing V1 destinations that belong to the 137 Curated Catalog
UPDATE destinations SET name = 'Andaman Islands', region_id = (SELECT id FROM regions WHERE canonical_name = 'andaman-nicobar-islands'), destination_type = 'ARCHIPELAGO', canonical_name = 'andaman-islands', is_curated = true, source = 'CURATED' WHERE id = 92;
UPDATE destinations SET name = 'Tirupati', region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh'), destination_type = 'PILGRIMAGE', canonical_name = 'tirupati', is_curated = true, source = 'CURATED' WHERE id = 114;
UPDATE destinations SET name = 'Visakhapatnam', region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh'), destination_type = 'CITY', canonical_name = 'visakhapatnam', is_curated = true, source = 'CURATED' WHERE id = 115;
UPDATE destinations SET name = 'Araku Valley', region_id = (SELECT id FROM regions WHERE canonical_name = 'andhra-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'araku-valley', is_curated = true, source = 'CURATED' WHERE id = 116;
UPDATE destinations SET name = 'Tawang', region_id = (SELECT id FROM regions WHERE canonical_name = 'arunachal-pradesh'), destination_type = 'PILGRIMAGE', canonical_name = 'tawang', is_curated = true, source = 'CURATED' WHERE id = 82;
UPDATE destinations SET name = 'Ziro Valley', region_id = (SELECT id FROM regions WHERE canonical_name = 'arunachal-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'ziro-valley', is_curated = true, source = 'CURATED' WHERE id = 91;
UPDATE destinations SET name = 'Kaziranga', region_id = (SELECT id FROM regions WHERE canonical_name = 'assam'), destination_type = 'NATIONAL_PARK', canonical_name = 'kaziranga', is_curated = true, source = 'CURATED' WHERE id = 45;
UPDATE destinations SET name = 'Majuli', region_id = (SELECT id FROM regions WHERE canonical_name = 'assam'), destination_type = 'ISLAND', canonical_name = 'majuli', is_curated = true, source = 'CURATED' WHERE id = 90;
UPDATE destinations SET name = 'Bodh Gaya', region_id = (SELECT id FROM regions WHERE canonical_name = 'bihar'), destination_type = 'PILGRIMAGE', canonical_name = 'bodh-gaya', is_curated = true, source = 'CURATED' WHERE id = 159;
UPDATE destinations SET name = 'Ahmedabad', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'CITY', canonical_name = 'ahmedabad', is_curated = true, source = 'CURATED' WHERE id = 53;
UPDATE destinations SET name = 'Rann of Kutch', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'CIRCUIT', canonical_name = 'rann-of-kutch', is_curated = true, source = 'CURATED' WHERE id = 54;
UPDATE destinations SET name = 'Statue of Unity', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'HERITAGE_SITE', canonical_name = 'statue-of-unity', is_curated = true, source = 'CURATED' WHERE id = 192;
UPDATE destinations SET name = 'Dwarka', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'PILGRIMAGE', canonical_name = 'dwarka', is_curated = true, source = 'CURATED' WHERE id = 186;
UPDATE destinations SET name = 'Somnath', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'PILGRIMAGE', canonical_name = 'somnath', is_curated = true, source = 'CURATED' WHERE id = 187;
UPDATE destinations SET name = 'Gir', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'NATIONAL_PARK', canonical_name = 'gir', is_curated = true, source = 'CURATED' WHERE id = 188;
UPDATE destinations SET name = 'Saputara', region_id = (SELECT id FROM regions WHERE canonical_name = 'gujarat'), destination_type = 'HILL_STATION', canonical_name = 'saputara', is_curated = true, source = 'CURATED' WHERE id = 193;
UPDATE destinations SET name = 'Manali', region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'manali', is_curated = true, source = 'CURATED' WHERE id = 8;
UPDATE destinations SET name = 'Shimla', region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'shimla', is_curated = true, source = 'CURATED' WHERE id = 9;
UPDATE destinations SET name = 'Dharamshala', region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'dharamshala', is_curated = true, source = 'CURATED' WHERE id = 14;
UPDATE destinations SET name = 'Spiti Valley', region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh'), destination_type = 'CIRCUIT', canonical_name = 'spiti-valley', is_curated = true, source = 'CURATED' WHERE id = 74;
UPDATE destinations SET name = 'Dalhousie', region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'dalhousie', is_curated = true, source = 'CURATED' WHERE id = 72;
UPDATE destinations SET name = 'Kasauli', region_id = (SELECT id FROM regions WHERE canonical_name = 'himachal-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'kasauli', is_curated = true, source = 'CURATED' WHERE id = 73;
UPDATE destinations SET name = 'Srinagar', region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir'), destination_type = 'CITY', canonical_name = 'srinagar', is_curated = true, source = 'CURATED' WHERE id = 13;
UPDATE destinations SET name = 'Gulmarg', region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir'), destination_type = 'HILL_STATION', canonical_name = 'gulmarg', is_curated = true, source = 'CURATED' WHERE id = 79;
UPDATE destinations SET name = 'Pahalgam', region_id = (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir'), destination_type = 'HILL_STATION', canonical_name = 'pahalgam', is_curated = true, source = 'CURATED' WHERE id = 80;
UPDATE destinations SET name = 'Bengaluru', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'CITY', canonical_name = 'bengaluru', is_curated = true, source = 'CURATED' WHERE id = 38;
UPDATE destinations SET name = 'Mysuru', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'CITY', canonical_name = 'mysuru', is_curated = true, source = 'CURATED' WHERE id = 24;
UPDATE destinations SET name = 'Hampi', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'HERITAGE_SITE', canonical_name = 'hampi', is_curated = true, source = 'CURATED' WHERE id = 25;
UPDATE destinations SET name = 'Murudeshwar', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'PILGRIMAGE', canonical_name = 'murudeshwar', is_curated = true, source = 'CURATED' WHERE id = 104;
UPDATE destinations SET name = 'Gokarna', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'BEACH', canonical_name = 'gokarna', is_curated = true, source = 'CURATED' WHERE id = 39;
UPDATE destinations SET name = 'Chikkamagaluru', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'HILL_STATION', canonical_name = 'chikkamagaluru', is_curated = true, source = 'CURATED' WHERE id = 98;
UPDATE destinations SET name = 'Badami-Pattadakal', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'HERITAGE_SITE', canonical_name = 'badami-pattadakal', is_curated = true, source = 'CURATED' WHERE id = 101;
UPDATE destinations SET name = 'Dandeli', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'NATIONAL_PARK', canonical_name = 'dandeli', is_curated = true, source = 'CURATED' WHERE id = 106;
UPDATE destinations SET name = 'Nagarhole', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'NATIONAL_PARK', canonical_name = 'nagarhole', is_curated = true, source = 'CURATED' WHERE id = 100;
UPDATE destinations SET name = 'Bandipur', region_id = (SELECT id FROM regions WHERE canonical_name = 'karnataka'), destination_type = 'NATIONAL_PARK', canonical_name = 'bandipur', is_curated = true, source = 'CURATED' WHERE id = 99;
UPDATE destinations SET name = 'Kochi', region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala'), destination_type = 'CITY', canonical_name = 'kochi', is_curated = true, source = 'CURATED' WHERE id = 23;
UPDATE destinations SET name = 'Alappuzha', region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala'), destination_type = 'TOWN', canonical_name = 'alappuzha', is_curated = true, source = 'CURATED' WHERE id = 21;
UPDATE destinations SET name = 'Munnar', region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala'), destination_type = 'HILL_STATION', canonical_name = 'munnar', is_curated = true, source = 'CURATED' WHERE id = 22;
UPDATE destinations SET name = 'Wayanad', region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala'), destination_type = 'HILL_STATION', canonical_name = 'wayanad', is_curated = true, source = 'CURATED' WHERE id = 29;
UPDATE destinations SET name = 'Varkala', region_id = (SELECT id FROM regions WHERE canonical_name = 'kerala'), destination_type = 'BEACH', canonical_name = 'varkala', is_curated = true, source = 'CURATED' WHERE id = 33;
UPDATE destinations SET name = 'Ladakh', region_id = (SELECT id FROM regions WHERE canonical_name = 'ladakh'), destination_type = 'CIRCUIT', canonical_name = 'ladakh', is_curated = true, source = 'CURATED' WHERE id = 12;
UPDATE destinations SET name = 'Lakshadweep', region_id = (SELECT id FROM regions WHERE canonical_name = 'lakshadweep'), destination_type = 'ARCHIPELAGO', canonical_name = 'lakshadweep', is_curated = true, source = 'CURATED' WHERE id = 95;
UPDATE destinations SET name = 'Bhopal', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'CITY', canonical_name = 'bhopal', is_curated = true, source = 'CURATED' WHERE id = 56;
UPDATE destinations SET name = 'Ujjain', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'PILGRIMAGE', canonical_name = 'ujjain', is_curated = true, source = 'CURATED' WHERE id = 57;
UPDATE destinations SET name = 'Gwalior', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'CITY', canonical_name = 'gwalior', is_curated = true, source = 'CURATED' WHERE id = 58;
UPDATE destinations SET name = 'Orchha', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'TOWN', canonical_name = 'orchha', is_curated = true, source = 'CURATED' WHERE id = 59;
UPDATE destinations SET name = 'Khajuraho', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'HERITAGE_SITE', canonical_name = 'khajuraho', is_curated = true, source = 'CURATED' WHERE id = 20;
UPDATE destinations SET name = 'Bhedaghat', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'OTHER', canonical_name = 'bhedaghat', is_curated = true, source = 'CURATED' WHERE id = 136;
UPDATE destinations SET name = 'Kanha', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'NATIONAL_PARK', canonical_name = 'kanha', is_curated = true, source = 'CURATED' WHERE id = 137;
UPDATE destinations SET name = 'Bandhavgarh', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'NATIONAL_PARK', canonical_name = 'bandhavgarh', is_curated = true, source = 'CURATED' WHERE id = 138;
UPDATE destinations SET name = 'Pachmarhi', region_id = (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), destination_type = 'HILL_STATION', canonical_name = 'pachmarhi', is_curated = true, source = 'CURATED' WHERE id = 60;
UPDATE destinations SET name = 'Mumbai', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'CITY', canonical_name = 'mumbai', is_curated = true, source = 'CURATED' WHERE id = 49;
UPDATE destinations SET name = 'Alibaug', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'BEACH', canonical_name = 'alibaug', is_curated = true, source = 'CURATED' WHERE id = 175;
UPDATE destinations SET name = 'Tarkarli', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'BEACH', canonical_name = 'tarkarli', is_curated = true, source = 'CURATED' WHERE id = 180;
UPDATE destinations SET name = 'Pune', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'CITY', canonical_name = 'pune', is_curated = true, source = 'CURATED' WHERE id = 50;
UPDATE destinations SET name = 'Lonavala-Khandala', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'HILL_STATION', canonical_name = 'lonavala-khandala', is_curated = true, source = 'CURATED' WHERE id = 51;
UPDATE destinations SET name = 'Mahabaleshwar', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'HILL_STATION', canonical_name = 'mahabaleshwar', is_curated = true, source = 'CURATED' WHERE id = 52;
UPDATE destinations SET name = 'Chhatrapati Sambhajinagar', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'CITY', canonical_name = 'chhatrapati-sambhajinagar', is_curated = true, source = 'CURATED' WHERE id = 174;
UPDATE destinations SET name = 'Nashik', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'PILGRIMAGE', canonical_name = 'nashik', is_curated = true, source = 'CURATED' WHERE id = 173;
UPDATE destinations SET name = 'Matheran', region_id = (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), destination_type = 'HILL_STATION', canonical_name = 'matheran', is_curated = true, source = 'CURATED' WHERE id = 177;
UPDATE destinations SET name = 'Shillong', region_id = (SELECT id FROM regions WHERE canonical_name = 'meghalaya'), destination_type = 'HILL_STATION', canonical_name = 'shillong', is_curated = true, source = 'CURATED' WHERE id = 43;
UPDATE destinations SET name = 'Cherrapunji (Sohra)', region_id = (SELECT id FROM regions WHERE canonical_name = 'meghalaya'), destination_type = 'HILL_STATION', canonical_name = 'cherrapunji-sohra', is_curated = true, source = 'CURATED' WHERE id = 44;
UPDATE destinations SET name = 'Champhai / Aizawl Circuit', region_id = (SELECT id FROM regions WHERE canonical_name = 'mizoram'), destination_type = 'HILL_STATION', canonical_name = 'champai-aizawl', is_curated = true, source = 'CURATED' WHERE id = 86;
UPDATE destinations SET name = 'Puri', region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha'), destination_type = 'PILGRIMAGE', canonical_name = 'puri', is_curated = true, source = 'CURATED' WHERE id = 46;
UPDATE destinations SET name = 'Konark', region_id = (SELECT id FROM regions WHERE canonical_name = 'odisha'), destination_type = 'HERITAGE_SITE', canonical_name = 'konark', is_curated = true, source = 'CURATED' WHERE id = 48;
UPDATE destinations SET name = 'Puducherry', region_id = (SELECT id FROM regions WHERE canonical_name = 'puducherry'), destination_type = 'TOWN', canonical_name = 'puducherry', is_curated = true, source = 'CURATED' WHERE id = 27;
UPDATE destinations SET name = 'Amritsar', region_id = (SELECT id FROM regions WHERE canonical_name = 'punjab'), destination_type = 'PILGRIMAGE', canonical_name = 'amritsar', is_curated = true, source = 'CURATED' WHERE id = 11;
UPDATE destinations SET name = 'Jaipur', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'CITY', canonical_name = 'jaipur', is_curated = true, source = 'CURATED' WHERE id = 1;
UPDATE destinations SET name = 'Udaipur', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'CITY', canonical_name = 'udaipur', is_curated = true, source = 'CURATED' WHERE id = 4;
UPDATE destinations SET name = 'Jodhpur', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'CITY', canonical_name = 'jodhpur', is_curated = true, source = 'CURATED' WHERE id = 5;
UPDATE destinations SET name = 'Jaisalmer', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'TOWN', canonical_name = 'jaisalmer', is_curated = true, source = 'CURATED' WHERE id = 6;
UPDATE destinations SET name = 'Pushkar', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'PILGRIMAGE', canonical_name = 'pushkar', is_curated = true, source = 'CURATED' WHERE id = 7;
UPDATE destinations SET name = 'Chittorgarh', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'HERITAGE_SITE', canonical_name = 'chittorgarh', is_curated = true, source = 'CURATED' WHERE id = 64;
UPDATE destinations SET name = 'Bikaner', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'CITY', canonical_name = 'bikaner', is_curated = true, source = 'CURATED' WHERE id = 65;
UPDATE destinations SET name = 'Mount Abu', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'HILL_STATION', canonical_name = 'mount-abu', is_curated = true, source = 'CURATED' WHERE id = 66;
UPDATE destinations SET name = 'Bundi', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'TOWN', canonical_name = 'bundi', is_curated = true, source = 'CURATED' WHERE id = 70;
UPDATE destinations SET name = 'Ranthambore', region_id = (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), destination_type = 'NATIONAL_PARK', canonical_name = 'ranthambore', is_curated = true, source = 'CURATED' WHERE id = 67;
UPDATE destinations SET name = 'Gangtok', region_id = (SELECT id FROM regions WHERE canonical_name = 'sikkim'), destination_type = 'HILL_STATION', canonical_name = 'gangtok', is_curated = true, source = 'CURATED' WHERE id = 42;
UPDATE destinations SET name = 'Chennai', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'CITY', canonical_name = 'chennai', is_curated = true, source = 'CURATED' WHERE id = 36;
UPDATE destinations SET name = 'Ooty', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'HILL_STATION', canonical_name = 'ooty', is_curated = true, source = 'CURATED' WHERE id = 26;
UPDATE destinations SET name = 'Madurai', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'PILGRIMAGE', canonical_name = 'madurai', is_curated = true, source = 'CURATED' WHERE id = 28;
UPDATE destinations SET name = 'Rameswaram', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'PILGRIMAGE', canonical_name = 'rameswaram', is_curated = true, source = 'CURATED' WHERE id = 113;
UPDATE destinations SET name = 'Kodaikanal', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'HILL_STATION', canonical_name = 'kodaikanal', is_curated = true, source = 'CURATED' WHERE id = 34;
UPDATE destinations SET name = 'Mahabalipuram', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'HERITAGE_SITE', canonical_name = 'mahabalipuram', is_curated = true, source = 'CURATED' WHERE id = 35;
UPDATE destinations SET name = 'Thanjavur', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'HERITAGE_SITE', canonical_name = 'thanjavur', is_curated = true, source = 'CURATED' WHERE id = 112;
UPDATE destinations SET name = 'Kanyakumari', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'PILGRIMAGE', canonical_name = 'kanyakumari', is_curated = true, source = 'CURATED' WHERE id = 31;
UPDATE destinations SET name = 'Yercaud', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'HILL_STATION', canonical_name = 'yercaud', is_curated = true, source = 'CURATED' WHERE id = 108;
UPDATE destinations SET name = 'Valparai', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'HILL_STATION', canonical_name = 'valparai', is_curated = true, source = 'CURATED' WHERE id = 110;
UPDATE destinations SET name = 'Chettinad', region_id = (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), destination_type = 'CIRCUIT', canonical_name = 'chettinad', is_curated = true, source = 'CURATED' WHERE id = 111;
UPDATE destinations SET name = 'Hyderabad', region_id = (SELECT id FROM regions WHERE canonical_name = 'telangana'), destination_type = 'CITY', canonical_name = 'hyderabad', is_curated = true, source = 'CURATED' WHERE id = 37;
UPDATE destinations SET name = 'Agra', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), destination_type = 'CITY', canonical_name = 'agra', is_curated = true, source = 'CURATED' WHERE id = 2;
UPDATE destinations SET name = 'Varanasi', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), destination_type = 'PILGRIMAGE', canonical_name = 'varanasi', is_curated = true, source = 'CURATED' WHERE id = 3;
UPDATE destinations SET name = 'Lucknow', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), destination_type = 'CITY', canonical_name = 'lucknow', is_curated = true, source = 'CURATED' WHERE id = 61;
UPDATE destinations SET name = 'Ayodhya', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), destination_type = 'PILGRIMAGE', canonical_name = 'ayodhya', is_curated = true, source = 'CURATED' WHERE id = 62;
UPDATE destinations SET name = 'Prayagraj', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), destination_type = 'PILGRIMAGE', canonical_name = 'prayagraj', is_curated = true, source = 'CURATED' WHERE id = 63;
UPDATE destinations SET name = 'Mathura-Vrindavan', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), destination_type = 'CIRCUIT', canonical_name = 'mathura-vrindavan', is_curated = true, source = 'CURATED' WHERE id = 18;
UPDATE destinations SET name = 'Haridwar', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), destination_type = 'PILGRIMAGE', canonical_name = 'haridwar', is_curated = true, source = 'CURATED' WHERE id = 17;
UPDATE destinations SET name = 'Rishikesh', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), destination_type = 'PILGRIMAGE', canonical_name = 'rishikesh', is_curated = true, source = 'CURATED' WHERE id = 10;
UPDATE destinations SET name = 'Mussoorie', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), destination_type = 'HILL_STATION', canonical_name = 'mussoorie', is_curated = true, source = 'CURATED' WHERE id = 15;
UPDATE destinations SET name = 'Nainital', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), destination_type = 'HILL_STATION', canonical_name = 'nainital', is_curated = true, source = 'CURATED' WHERE id = 16;
UPDATE destinations SET name = 'Auli', region_id = (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), destination_type = 'HILL_STATION', canonical_name = 'auli', is_curated = true, source = 'CURATED' WHERE id = 75;
UPDATE destinations SET name = 'Kolkata', region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal'), destination_type = 'CITY', canonical_name = 'kolkata', is_curated = true, source = 'CURATED' WHERE id = 40;
UPDATE destinations SET name = 'Darjeeling', region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal'), destination_type = 'HILL_STATION', canonical_name = 'darjeeling', is_curated = true, source = 'CURATED' WHERE id = 41;
UPDATE destinations SET name = 'Sundarbans', region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal'), destination_type = 'NATIONAL_PARK', canonical_name = 'sundarbans', is_curated = true, source = 'CURATED' WHERE id = 154;
UPDATE destinations SET name = 'Kalimpong', region_id = (SELECT id FROM regions WHERE canonical_name = 'west-bengal'), destination_type = 'HILL_STATION', canonical_name = 'kalimpong', is_curated = true, source = 'CURATED' WHERE id = 88;

-- 5. Insert newly added Curated Destinations
INSERT INTO destinations (name, country, region, cost_index, popularity, image_url, region_id, canonical_name, destination_type, source, is_curated) VALUES
('Manas', 'India', 'Assam', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'assam'), 'manas', 'NATIONAL_PARK', 'CURATED', true),
('Diu', 'India', 'Dadra and Nagar Haveli and Daman and Diu', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'dadra-nagar-haveli-daman-diu'), 'diu', 'ISLAND', 'CURATED', true),
('Delhi', 'India', 'Delhi', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'delhi'), 'delhi', 'CITY', 'CURATED', true),
('Goa', 'India', 'Goa', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'goa'), 'goa', 'BEACH', 'CURATED', true),
('Champaner-Pavagadh', 'India', 'Gujarat', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'gujarat'), 'champaner-pavagadh', 'HERITAGE_SITE', 'CURATED', true),
('Dholavira', 'India', 'Gujarat', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'gujarat'), 'dholavira', 'HERITAGE_SITE', 'CURATED', true),
('Modhera-Patan', 'India', 'Gujarat', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'gujarat'), 'modhera-patan', 'CIRCUIT', 'CURATED', true),
('Vaishno Devi', 'India', 'Jammu & Kashmir', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'jammu-kashmir'), 'vaishno-devi', 'PILGRIMAGE', 'CURATED', true),
('Shettihalli / Sakleshpur', 'India', 'Karnataka', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'karnataka'), 'sakleshpur', 'HILL_STATION', 'CURATED', true),
('Kerala', 'India', 'Kerala', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'kerala'), 'kerala', 'REGION_CLUSTER', 'CURATED', true),
('Thekkady-Periyar', 'India', 'Kerala', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'kerala'), 'thekkady-periyar', 'NATIONAL_PARK', 'CURATED', true),
('Kumarakom', 'India', 'Kerala', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'kerala'), 'kumarakom', 'BEACH', 'CURATED', true),
('Bekal', 'India', 'Kerala', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'kerala'), 'bekal', 'HERITAGE_SITE', 'CURATED', true),
('Vagamon', 'India', 'Kerala', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'kerala'), 'vagamon', 'HILL_STATION', 'CURATED', true),
('Kozhikode', 'India', 'Kerala', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'kerala'), 'kozhikode', 'CITY', 'CURATED', true),
('Sanchi', 'India', 'Madhya Pradesh', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), 'sanchi', 'HERITAGE_SITE', 'CURATED', true),
('Omkareshwar', 'India', 'Madhya Pradesh', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'madhya-pradesh'), 'omkareshwar', 'PILGRIMAGE', 'CURATED', true),
('Ajanta Caves', 'India', 'Maharashtra', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), 'ajanta-caves', 'HERITAGE_SITE', 'CURATED', true),
('Ellora Caves', 'India', 'Maharashtra', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), 'ellora-caves', 'HERITAGE_SITE', 'CURATED', true),
('Bhimashankar', 'India', 'Maharashtra', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), 'bhimashankar', 'PILGRIMAGE', 'CURATED', true),
('Lonar', 'India', 'Maharashtra', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'maharashtra'), 'lonar', 'OTHER', 'CURATED', true),
('Dawki', 'India', 'Meghalaya', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'meghalaya'), 'dawki', 'OTHER', 'CURATED', true),
('Chilika Lake', 'India', 'Odisha', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'odisha'), 'chilika-lake', 'OTHER', 'CURATED', true),
('Ajmer', 'India', 'Rajasthan', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), 'ajmer', 'PILGRIMAGE', 'CURATED', true),
('Shekhawati', 'India', 'Rajasthan', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), 'shekhawati', 'CIRCUIT', 'CURATED', true),
('Ranakpur', 'India', 'Rajasthan', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'rajasthan'), 'ranakpur', 'HERITAGE_SITE', 'CURATED', true),
('Kanchipuram', 'India', 'Tamil Nadu', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'tamil-nadu'), 'kanchipuram', 'PILGRIMAGE', 'CURATED', true),
('Sarnath', 'India', 'Uttar Pradesh', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'uttar-pradesh'), 'sarnath', 'HERITAGE_SITE', 'CURATED', true),
('Jim Corbett', 'India', 'Uttarakhand', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), 'jim-corbett', 'NATIONAL_PARK', 'CURATED', true),
('Valley of Flowers', 'India', 'Uttarakhand', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), 'valley-of-flowers', 'NATIONAL_PARK', 'CURATED', true),
('Kedarnath', 'India', 'Uttarakhand', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), 'kedarnath', 'PILGRIMAGE', 'CURATED', true),
('Badrinath', 'India', 'Uttarakhand', 2.00, 80, NULL, (SELECT id FROM regions WHERE canonical_name = 'uttarakhand'), 'badrinath', 'PILGRIMAGE', 'CURATED', true);

-- 6. Clean up old V12 broad region rows that are no longer referenced
DELETE FROM regions WHERE canonical_name NOT IN (
    'andaman-nicobar-islands', 'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar',
    'dadra-nagar-haveli-daman-diu', 'delhi', 'goa', 'gujarat', 'himachal-pradesh',
    'jammu-kashmir', 'karnataka', 'kerala', 'ladakh', 'lakshadweep',
    'madhya-pradesh', 'maharashtra', 'meghalaya', 'mizoram', 'odisha',
    'puducherry', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu',
    'telangana', 'uttar-pradesh', 'uttarakhand', 'west-bengal'
);
