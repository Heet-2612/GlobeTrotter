-- V13__evolve_cities_to_destinations.sql
-- Evolve cities table into destinations and update foreign keys safely

-- 1. Rename cities table to destinations
ALTER TABLE cities RENAME TO destinations;

-- 2. Add new V2 destination columns
ALTER TABLE destinations 
    ADD COLUMN region_id BIGINT REFERENCES regions(id),
    ADD COLUMN canonical_name VARCHAR(100),
    ADD COLUMN destination_type VARCHAR(50) NOT NULL DEFAULT 'CITY',
    ADD COLUMN source VARCHAR(30) NOT NULL DEFAULT 'CURATED',
    ADD COLUMN is_curated BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN latitude NUMERIC(10,7),
    ADD COLUMN longitude NUMERIC(10,7);

CREATE INDEX idx_destinations_canonical_name ON destinations(canonical_name);
CREATE INDEX idx_destinations_region_id ON destinations(region_id);
CREATE INDEX idx_destinations_type ON destinations(destination_type);

-- 3. Populate canonical_name for existing destinations
UPDATE destinations SET canonical_name = LOWER(REPLACE(TRIM(name), ' ', '-'));

-- 4. Map existing V1 region strings to region_id
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'golden-triangle-north-india-plains') WHERE region = 'North India';
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'south-india-temples-heritage') WHERE region = 'South India';
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'east-northeast-india') WHERE region = 'East India' OR region = 'Northeast India';
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'goa-west-coast') WHERE region = 'West India';
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'central-india-wildlife') WHERE region = 'Central India';
UPDATE destinations SET region_id = (SELECT id FROM regions WHERE canonical_name = 'golden-triangle-north-india-plains') WHERE region_id IS NULL;

-- 5. Rename foreign key columns on activities and trip_stops
ALTER TABLE activities RENAME COLUMN city_id TO destination_id;
ALTER TABLE trip_stops RENAME COLUMN city_id TO destination_id;

-- 6. Add foreign key constraint for destination_aliases
ALTER TABLE destination_aliases ADD CONSTRAINT fk_destination_aliases_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE;

-- 7. Seed initial canonical aliases for common destination names
INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Bangalore', 'bangalore' FROM destinations WHERE LOWER(name) = 'bengaluru'
UNION ALL
SELECT id, 'Mysore', 'mysore' FROM destinations WHERE LOWER(name) = 'mysuru'
UNION ALL
SELECT id, 'Alleppey', 'alleppey' FROM destinations WHERE LOWER(name) = 'alappuzha'
UNION ALL
SELECT id, 'Pondicherry', 'pondicherry' FROM destinations WHERE LOWER(name) = 'puducherry'
UNION ALL
SELECT id, 'Trivandrum', 'trivandrum' FROM destinations WHERE LOWER(name) = 'thiruvananthapuram'
UNION ALL
SELECT id, 'Vizag', 'vizag' FROM destinations WHERE LOWER(name) = 'visakhapatnam'
UNION ALL
SELECT id, 'Rameshwaram', 'rameshwaram' FROM destinations WHERE LOWER(name) = 'rameswaram'
UNION ALL
SELECT id, 'Kohlapur', 'kohlapur' FROM destinations WHERE LOWER(name) = 'kolhapur'
UNION ALL
SELECT id, 'Karjad', 'karjad' FROM destinations WHERE LOWER(name) = 'karjat';
