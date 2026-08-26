-- V14__populate_destination_aliases.sql
-- Populate destination aliases for existing V1 seeded destinations

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Bengaluru', 'bengaluru' FROM destinations WHERE LOWER(name) = 'bangalore';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Alappuzha', 'alappuzha' FROM destinations WHERE LOWER(name) = 'alleppey';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Puducherry', 'puducherry' FROM destinations WHERE LOWER(name) = 'pondicherry';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Mysuru', 'mysuru' FROM destinations WHERE LOWER(name) = 'mysore';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Visakhapatnam', 'visakhapatnam' FROM destinations WHERE LOWER(name) = 'vizag';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Rameswaram', 'rameswaram' FROM destinations WHERE LOWER(name) = 'rameshwaram';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Chhatrapati Sambhajinagar', 'chhatrapati sambhajinagar' FROM destinations WHERE LOWER(name) = 'aurangabad';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Kolhapur', 'kolhapur' FROM destinations WHERE LOWER(name) = 'kohlapur';

INSERT INTO destination_aliases (destination_id, alias_name, canonical_alias)
SELECT id, 'Karjat', 'karjat' FROM destinations WHERE LOWER(name) = 'karjad';
