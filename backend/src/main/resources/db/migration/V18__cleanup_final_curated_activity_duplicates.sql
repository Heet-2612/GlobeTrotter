-- V18__cleanup_final_curated_activity_duplicates.sql
-- Remove 5 confirmed semantic duplicate CURATED activities and insert 5 distinct replacements
-- Authoritative Dataset: research/recommendations/final_165_activity_dataset.json

-- 1. Delete 5 confirmed duplicate CURATED records from live database
DELETE FROM activities WHERE source = 'CURATED' AND destination_id = (SELECT id FROM destinations WHERE canonical_name = 'bandipur') AND name = 'Gopalaswamy Betta Hilltop Temple & Foggy Trail';
DELETE FROM activities WHERE source = 'CURATED' AND destination_id = (SELECT id FROM destinations WHERE canonical_name = 'jaipur') AND name = 'Amber Fort & Sheesh Mahal Tour';
DELETE FROM activities WHERE source = 'CURATED' AND destination_id = (SELECT id FROM destinations WHERE canonical_name = 'jaipur') AND name = 'City Palace Museum & Mubarak Mahal';
DELETE FROM activities WHERE source = 'CURATED' AND destination_id = (SELECT id FROM destinations WHERE canonical_name = 'jaipur') AND name = 'Jantar Mantar UNESCO Astronomical Observatory';
DELETE FROM activities WHERE source = 'CURATED' AND destination_id = (SELECT id FROM destinations WHERE canonical_name = 'udaipur') AND name = 'City Palace Complex & Museum Tour';

-- 2. Insert 5 distinct high-quality replacement CURATED records
INSERT INTO activities (destination_id, name, description, category, estimated_duration_minutes, estimated_cost, currency, image_url, source, latitude, longitude) VALUES
((SELECT id FROM destinations WHERE canonical_name = 'bandipur'), 'Moyar River & Gorge Viewpoint', 'Scenic viewpoint overlooking the deep Moyar River canyon that forms a natural boundary between Bandipur and Mudumalai reserves.', 'NATURE', 90, 0.00, 'INR', NULL, 'CURATED', 11.6020, 76.5850),
((SELECT id FROM destinations WHERE canonical_name = 'jaipur'), 'Nahargarh Biological Park & Tiger Safari', 'Sprawling wildlife park and open-air safari enclosure located at the foot of the Aravalli hills.', 'NATURE', 120, 0.00, 'INR', NULL, 'CURATED', 27.0250, 75.8850),
((SELECT id FROM destinations WHERE canonical_name = 'jaipur'), 'Sisodia Rani Garden & Royal Terraced Palaces', '18th-century multi-tiered royal garden complex featuring fountains, pavilions, and Radha-Krishna murals.', 'CULTURE', 75, 0.00, 'INR', NULL, 'CURATED', 26.8920, 75.8620),
((SELECT id FROM destinations WHERE canonical_name = 'jaipur'), 'Galtaji Temple & Monkey Palace Gorge', 'Ancient Hindu pilgrimage site built inside a narrow mountain pass with holy natural water tanks and Macaque monkeys.', 'CULTURE', 90, 0.00, 'INR', NULL, 'CURATED', 26.9180, 75.8580),
((SELECT id FROM destinations WHERE canonical_name = 'udaipur'), 'Sajjangarh Monsoon Palace & Biological Sanctuary', '19th-century hilltop palace built on Bansdara peak at 944m elevation offering panoramic views of Udaipur lakes.', 'ATTRACTIONS', 120, 0.00, 'INR', NULL, 'CURATED', 24.5905, 73.6330);
