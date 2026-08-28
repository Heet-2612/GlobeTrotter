-- V26__implement_72_concept_activity_image_taxonomy.sql
-- Explicitly update activity subcategories for SIKH_GURUDWARA, DAM_RESERVOIR, RESTAURANT_FINE_DINING, and verified mismatches

-- 1. SIKH_GURUDWARA Activities (Explicit IDs)
UPDATE activities SET subcategory_id = 'SIKH_GURUDWARA' WHERE id IN (3249, 3253, 57, 3963, 4059);

-- 2. DAM_RESERVOIR Activities (Explicit IDs)
UPDATE activities SET subcategory_id = 'DAM_RESERVOIR' WHERE id IN (3794, 3403, 3340, 130, 3986, 103, 3694, 3398, 3336, 3692, 3835, 3797, 4070, 3494, 3670);

-- 3. RESTAURANT_FINE_DINING Activities (Explicit IDs)
UPDATE activities SET subcategory_id = 'RESTAURANT_FINE_DINING' WHERE id IN (3190, 3884, 3222, 3227, 3410, 3387);

-- 4. Verified Specific Mismatches (Explicit IDs)
UPDATE activities SET subcategory_id = 'ROCK_CUT_CAVE_TEMPLE' WHERE id = 3671;
UPDATE activities SET subcategory_id = 'ANCIENT_RUINS' WHERE id = 4046;
