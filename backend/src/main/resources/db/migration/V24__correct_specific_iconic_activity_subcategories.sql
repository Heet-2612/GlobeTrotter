-- V24__correct_specific_iconic_activity_subcategories.sql
-- Correct specific activity subcategories based on final visual-semantic quality audit

-- 1. Hawa Mahal Photography & Walk -> PALACE_EXTERIOR
UPDATE activities
SET subcategory_id = 'PALACE_EXTERIOR'
WHERE id IN (17, 3182) OR name ILIKE '%Hawa Mahal%';

-- 2. Kochrab Satyagraha Ashram / Sabarmati Ashram -> MONUMENT_MEMORIAL
UPDATE activities
SET subcategory_id = 'MONUMENT_MEMORIAL'
WHERE id IN (3184, 3500) OR name ILIKE '%Ashram%' OR name ILIKE '%Kochrab%';

-- 3. Badami Cave Temples -> ROCK_CUT_CAVE_TEMPLE
UPDATE activities
SET subcategory_id = 'ROCK_CUT_CAVE_TEMPLE'
WHERE id = 3675 OR name ILIKE '%Badami Cave%';

-- 4. Konark Historic Heritage & Temple Tour -> TEMPLES_RELIGIOUS_EAST
UPDATE activities
SET subcategory_id = 'TEMPLES_RELIGIOUS_EAST'
WHERE id = 205 OR name ILIKE '%Konark Historic Heritage%';
