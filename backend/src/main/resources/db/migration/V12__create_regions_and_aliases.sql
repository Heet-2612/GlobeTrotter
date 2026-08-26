-- V12__create_regions_and_aliases.sql
-- Create regions and destination_aliases tables

CREATE TABLE regions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    canonical_name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_canonical_name ON regions(canonical_name);

CREATE TABLE destination_aliases (
    id BIGSERIAL PRIMARY KEY,
    destination_id BIGINT NOT NULL,
    alias_name VARCHAR(100) NOT NULL,
    canonical_alias VARCHAR(100) NOT NULL
);

CREATE INDEX idx_destination_aliases_name ON destination_aliases(LOWER(alias_name));
CREATE INDEX idx_destination_aliases_dest_id ON destination_aliases(destination_id);

-- Seed 12 primary travel regions
INSERT INTO regions (name, canonical_name, country, description) VALUES
('Golden Triangle & North India Plains', 'golden-triangle-north-india-plains', 'India', 'Historic capital cities, Mughal monuments, and sacred Ganges riverfronts.'),
('Rajasthan Circuit', 'rajasthan-circuit', 'India', 'Royal palaces, desert forts, stepwells, and vibrant cultural heritage.'),
('Goa & West Coast', 'goa-west-coast', 'India', 'Sun-kissed beaches, coastal fortresses, and Konkan seafood traditions.'),
('Kerala & Backwaters', 'kerala-backwaters', 'India', 'Tranquil backwater houseboats, tea gardens, and tropical coastlines.'),
('Western Ghats & Maharashtra', 'western-ghats-maharashtra', 'India', 'UNESCO rock-cut caves, hill station valleys, and Maratha forts.'),
('Himachal Pradesh & Jammu-Kashmir', 'himachal-pradesh-jammu-kashmir', 'India', 'Himalayan peaks, alpine valleys, monasteries, and mountain trails.'),
('Uttarakhand & Char Dham', 'uttarakhand-char-dham', 'India', 'High-altitude holy shrines, national park reserves, and river sources.'),
('South India Temples & Heritage', 'south-india-temples-heritage', 'India', 'Dravidian gopuram temples, ancient Vijayanagara ruins, and coastal heritage.'),
('Central India & Wildlife', 'central-india-wildlife', 'India', 'High-density tiger reserves, Khajuraho temples, and heritage forts.'),
('Gujarat Circuit', 'gujarat-circuit', 'India', 'White salt desert, world tallest monument, stepwells, and lion sanctuaries.'),
('East & Northeast India', 'east-northeast-india', 'India', 'Colonial heritage, living root bridges, tea plantations, and Buddhist monasteries.'),
('Islands Archipelago', 'islands-archipelago', 'India', 'Crystal-clear lagoons, coral reefs, and tropical island beaches.');
