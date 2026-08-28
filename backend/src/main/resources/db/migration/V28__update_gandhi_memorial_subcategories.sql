-- V28__update_gandhi_memorial_subcategories.sql
-- Update subcategory_id to MONUMENT_MEMORIAL for activities #127, #3390, and #3489

UPDATE activities SET subcategory_id = 'MONUMENT_MEMORIAL' WHERE id IN (127, 3390, 3489);
