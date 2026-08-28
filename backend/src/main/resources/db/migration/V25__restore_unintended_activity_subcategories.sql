-- V25__restore_unintended_activity_subcategories.sql
-- Restore unintended rows affected by broad V24 predicates back to their exact pre-V24 subcategory values

-- Restore Activity ID 3182 (Jagdish Temple Indo-Aryan Carvings) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3182;

-- Restore Activity ID 3184 (City Palace Udaipur) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3184;

-- Restore Activity ID 3148 (Hawa Mahal Palace of Winds Photography) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3148;

-- Restore Activity ID 55 (Beatles Ashram Tour Rishikesh) -> STONE_ARCH_COMPLEX
UPDATE activities SET subcategory_id = 'STONE_ARCH_COMPLEX' WHERE id = 55;

-- Restore Activity ID 3241 (Beatles Ashram Meditation Trail) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3241;

-- Restore Activity ID 3244 (The Beatles Ashram) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3244;

-- Restore Activity ID 3380 (Sri Aurobindo Ashram Meditation Hall) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3380;

-- Restore Activity ID 3384 (Sri Aurobindo Ashram) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 3384;

-- Restore Activity ID 4062 (Anashakti Ashram) -> NULL
UPDATE activities SET subcategory_id = NULL WHERE id = 4062;
