-- V27__correct_final_activity_image_ambiguities.sql
-- Explicitly correct 7 activity subcategories based on targeted ambiguity audit

UPDATE activities SET subcategory_id = 'DRAMATIC_COASTAL_CLIFF' WHERE id = 3410;
UPDATE activities SET subcategory_id = 'HANDICRAFT_TEXTILE_BAZAAR' WHERE id = 3222;
UPDATE activities SET subcategory_id = 'MOUNTAIN_WATERFALL' WHERE id = 3494;
UPDATE activities SET subcategory_id = 'RIVERSIDE_GHAT' WHERE id IN (41, 54, 87, 3239);
