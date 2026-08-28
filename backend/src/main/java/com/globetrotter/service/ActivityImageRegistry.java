package com.globetrotter.service;

import com.globetrotter.entity.Activity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ActivityImageRegistry {

    public static class SubcategoryConcept {
        private final String subcategoryId;
        private final String parentCategoryId;
        private final String displayName;
        private final String strategy; // UNIQUE, SHARED_IMAGE_POOL, NO_IMAGE
        private final List<String> imageUrls;

        public SubcategoryConcept(String subcategoryId, String parentCategoryId, String displayName, String strategy, List<String> imageUrls) {
            this.subcategoryId = subcategoryId;
            this.parentCategoryId = parentCategoryId;
            this.displayName = displayName;
            this.strategy = strategy;
            this.imageUrls = imageUrls != null ? imageUrls : Collections.emptyList();
        }

        public String getSubcategoryId() { return subcategoryId; }
        public String getParentCategoryId() { return parentCategoryId; }
        public String getDisplayName() { return displayName; }
        public String getStrategy() { return strategy; }
        public List<String> getImageUrls() { return imageUrls; }
    }

    private final Map<String, SubcategoryConcept> subcatMap = new HashMap<>();
    private final Map<String, List<String>> parentCategoryPools = new HashMap<>();

    public ActivityImageRegistry() {
        initTaxonomy();
    }

    private void initTaxonomy() {
        // Register 69 Visual Concepts across 18 Parent Categories
        
        // 1. Temples & Religious Sites
        register("TEMPLES_RELIGIOUS_NORTH", "TEMPLES_RELIGIOUS", "North Indian Hindu Temple", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"));
        register("TEMPLES_RELIGIOUS_SOUTH", "TEMPLES_RELIGIOUS", "South Indian Hindu Temple / Gopuram", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"));
        register("TEMPLES_RELIGIOUS_EAST", "TEMPLES_RELIGIOUS", "East Indian Hindu Temple", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=1200&q=80"));
        register("TEMPLES_RELIGIOUS_WEST", "TEMPLES_RELIGIOUS", "West Indian Hindu Temple", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80"));
        register("MONASTERIES_GOMPAS", "TEMPLES_RELIGIOUS", "Buddhist Monastery / Himalayan Gompa", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&w=1200&q=80"));
        register("BUDDHIST_STUPAS", "TEMPLES_RELIGIOUS", "Buddhist Stupa", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80"));
        register("MOSQUES_DARGAHS", "TEMPLES_RELIGIOUS", "Indian Mosque / Dargah", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80"));
        register("CHURCHES_CATHEDRALS", "TEMPLES_RELIGIOUS", "Indian Church / Basilica", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=1200&q=80"));

        // 2. Heritage & Architecture
        register("INDO_ISLAMIC_ARCH", "HERITAGE_ARCHITECTURE", "Mughal / Indo-Islamic Architecture", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"));
        register("COLONIAL_ARCH", "HERITAGE_ARCHITECTURE", "Colonial Indian Architecture", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80"));
        register("ANCIENT_RUINS", "HERITAGE_ARCHITECTURE", "Ancient Indian Ruins", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80"));
        register("HERITAGE_HAVELI", "HERITAGE_ARCHITECTURE", "Heritage Haveli", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80"));
        register("MONUMENT_MEMORIAL", "HERITAGE_ARCHITECTURE", "Indian Monument / Memorial", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80"));
        register("STONE_ARCH_COMPLEX", "HERITAGE_ARCHITECTURE", "Stone Architectural Complex", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"));
        register("STEPWELL_VAV", "HERITAGE_ARCHITECTURE", "Indian Stepwell / Vav", "UNIQUE", List.of("https://images.unsplash.com/photo-1617854818583-09e7f077a156?auto=format&fit=crop&w=1200&q=80"));

        // 3. Forts & Palaces
        register("HILL_FORT", "FORTS_PALACES", "Rajasthan Hill Fort", "UNIQUE", List.of("https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"));
        register("STONE_FORT", "FORTS_PALACES", "Massive Stone Fort / Citadel", "UNIQUE", List.of("https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80"));
        register("PALACE_EXTERIOR", "FORTS_PALACES", "Ornate Indian Palace Exterior", "UNIQUE", List.of("https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80"));
        register("PALACE_COURTYARD", "FORTS_PALACES", "Palace Courtyard / Interior", "UNIQUE", List.of("https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80"));
        register("COASTAL_FORT", "FORTS_PALACES", "Sea Fort / Coastal Fort", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"));

        // 4. Wildlife & Safaris
        register("TIGER_SAFARI", "WILDLIFE_SAFARI", "Tiger Safari / Jeep Safari", "UNIQUE", List.of("https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80"));
        register("JUNGLE_RESERVE", "WILDLIFE_SAFARI", "Indian Jungle / Forest Reserve", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=80"));
        register("WILDLIFE_LION", "WILDLIFE_SAFARI", "Asiatic Lion / Wildlife", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80"));
        register("WILDLIFE_ELEPHANT", "WILDLIFE_SAFARI", "Indian Elephant / Large Wildlife", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80"));
        register("WETLAND_BIRDS", "WILDLIFE_SAFARI", "Indian Wetland / Birds", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80"));

        // 5. Beaches & Coastal
        register("TROPICAL_SANDY_BEACH", "BEACHES_COASTAL", "Tropical Indian Sandy Beach", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"));
        register("PALM_LINED_BEACH", "BEACHES_COASTAL", "Palm-Lined Beach", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80"));
        register("DRAMATIC_COASTAL_CLIFF", "BEACHES_COASTAL", "Dramatic Coastal Cliff", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"));
        register("SEASIDE_PROMENADE", "BEACHES_COASTAL", "Indian Seaside Promenade", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80"));

        // 6. Museums & Galleries
        register("MUSEUM_EXTERIOR", "MUSEUMS_GALLERIES", "Grand Indian Museum Exterior", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80"));
        register("MUSEUM_INTERIOR", "MUSEUMS_GALLERIES", "Museum Interior / Artifacts", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80"));
        register("ART_GALLERY", "MUSEUMS_GALLERIES", "Indian Art Gallery", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80"));

        // 7. Trekking & Hiking
        register("SNOW_HIMALAYAN_MOUNTAINS", "TREKKING_HIKING", "Snow-Covered Himalayan Mountains", "UNIQUE", List.of("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"));
        register("HIGH_ALTITUDE_ROCKY_TRAIL", "TREKKING_HIKING", "High-Altitude Rocky Himalayan Trail", "UNIQUE", List.of("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"));
        register("GREEN_HIMALAYAN_FOREST_TRAIL", "TREKKING_HIKING", "Green Himalayan Forest Trail", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"));
        register("WESTERN_GHATS_TREK", "TREKKING_HIKING", "Western Ghats / Lush Tropical Trekking Trail", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"));
        register("ROCKY_HILL_HIKE", "TREKKING_HIKING", "Rocky Hill / Mountain Hiking Trail", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"));

        // 8. Lakes, Rivers & Ghats
        register("MOUNTAIN_LAKE", "LAKES_RIVERS", "Mountain Lake", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"));
        register("SCENIC_VALLEY_LAKE", "LAKES_RIVERS", "Scenic Valley / Lake Landscape", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"));
        register("RIVER_WITH_BOAT", "LAKES_RIVERS", "Indian River with Boat", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"));
        register("RIVERSIDE_GHAT", "LAKES_RIVERS", "Indian Riverside Ghat", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"));

        // 9. Gardens, Parks & Plantations
        register("LUSH_CITY_PARK", "GARDENS_PARKS", "Lush Indian City Park", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80"));
        register("FORMAL_MUGHAL_GARDEN", "GARDENS_PARKS", "Formal / Mughal Garden", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80"));
        register("TEA_PLANTATION", "GARDENS_PARKS", "Tea Plantation", "UNIQUE", List.of("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"));
        register("COFFEE_PLANTATION", "GARDENS_PARKS", "Coffee Plantation", "UNIQUE", List.of("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"));

        // 10. Caves & Rock Formations
        register("ROCK_CUT_CAVE_TEMPLE", "CAVES_ROCK_FORMATIONS", "Ancient Rock-Cut Cave Temple", "UNIQUE", List.of("https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=1200&q=80"));
        register("NATURAL_CANYON_GORGE", "CAVES_ROCK_FORMATIONS", "Massive Natural Canyon / Gorge", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"));
        register("DRAMATIC_ROCK_FORMATION", "CAVES_ROCK_FORMATIONS", "Dramatic Indian Rock Formation", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"));

        // 11. Scenic Viewpoints
        register("MOUNTAIN_SUNRISE_VIEW", "SCENIC_VIEWPOINTS", "Mountain Sunrise Viewpoint", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"));
        register("VALLEY_PANORAMA_VIEW", "SCENIC_VIEWPOINTS", "Valley Panoramic Viewpoint", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"));
        register("CABLE_CAR_ROPEWAY", "SCENIC_VIEWPOINTS", "Cable Car / Ropeway over Mountains", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"));

        // 12. Waterfalls
        register("TROPICAL_FOREST_WATERFALL", "WATERFALLS", "Tropical Forest Waterfall", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80"));
        register("TALL_WATERFALL", "WATERFALLS", "Tall Waterfall", "UNIQUE", List.of("https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80"));
        register("MOUNTAIN_WATERFALL", "WATERFALLS", "Mountain Waterfall", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80"));

        // 13. Food & Culinary
        register("STREET_FOOD_SCENE", "FOOD_CULINARY", "Indian Street-Food Scene", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80"));
        register("TRADITIONAL_FOOD_THALI", "FOOD_CULINARY", "Indian Traditional Food / Thali", "NO_IMAGE", Collections.emptyList());

        // 14. Backwaters & Boating
        register("KERALA_HOUSEBOAT", "BACKWATERS_BOATING", "Kerala Houseboat on Backwaters", "UNIQUE", List.of("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"));
        register("TRADITIONAL_SHIKARA_BOAT", "BACKWATERS_BOATING", "Traditional Indian Boat / Shikara", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"));
        register("TROPICAL_BACKWATER_LANDSCAPE", "BACKWATERS_BOATING", "Tropical Backwater Landscape", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"));

        // 15. Markets & Shopping
        register("HANDICRAFT_TEXTILE_BAZAAR", "MARKETS_SHOPPING", "Colorful Indian Handicraft / Textile Bazaar", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80"));
        register("VIBRANT_STREET_MARKET", "MARKETS_SHOPPING", "Vibrant Indian Street Market", "NO_IMAGE", Collections.emptyList());

        // 16. Adventure & Watersports
        register("WHITE_WATER_RAFTING", "ADVENTURE_SPORTS", "White-Water Rafting", "UNIQUE", List.of("https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80"));
        register("PARAGLIDING_ADVENTURE", "ADVENTURE_SPORTS", "Paragliding", "UNIQUE", List.of("https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80"));
        register("COASTAL_WATERSPORT", "ADVENTURE_SPORTS", "Indian Coastal Watersport", "UNIQUE", List.of("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"));

        // 17. Desert & Sand Dunes
        register("GOLDEN_SAND_DUNES_CAMEL", "DESERT_DUNES", "Rajasthan Golden Sand Dunes + Camel", "UNIQUE", List.of("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"));
        register("DESERT_SUNSET_DUNES", "DESERT_DUNES", "Desert Sunset / Dunes", "UNIQUE", List.of("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"));
        register("WHITE_SALT_DESERT_RANN", "DESERT_DUNES", "White Salt Desert / Rann Landscape", "UNIQUE", List.of("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80"));

        // 18. Cultural & Performing Arts
        register("TRADITIONAL_DANCE_PERFORMANCE", "CULTURAL_EXPERIENCES", "Indian Classical / Traditional Dance Performance", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=1200&q=80"));
        register("CULTURAL_CEREMONY_FESTIVAL", "CULTURAL_EXPERIENCES", "Indian Cultural Ceremony / Festival", "SHARED_IMAGE_POOL", List.of("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"));
    }

    private void register(String subcatId, String parentCatId, String displayName, String strategy, List<String> urls) {
        subcatMap.put(subcatId, new SubcategoryConcept(subcatId, parentCatId, displayName, strategy, urls));
    }

    public SubcategoryConcept getConcept(String subcategoryId) {
        return subcatMap.get(subcategoryId);
    }

    public Collection<SubcategoryConcept> getAllConcepts() {
        return subcatMap.values();
    }

    /**
     * Priority Resolution Algorithm:
     * 1. Activity-specific image URL
     * 2. NO_IMAGE strategy check -> returns null
     * 3. Subcategory image pool (deterministic selection via Math.floorMod)
     * 4. Parent category fallback pool (deterministic selection via Math.floorMod)
     * 5. NULL fallback
     */
    public String resolveImageUrl(Activity activity) {
        if (activity == null) return null;

        // 1. Explicit activity-specific image URL
        if (activity.getImageUrl() != null && !activity.getImageUrl().trim().isEmpty()
                && !activity.getImageUrl().equalsIgnoreCase("null")) {
            return activity.getImageUrl().trim();
        }

        String subcatId = activity.getSubcategoryId();
        String strategy = activity.getImageStrategy();

        // 2. NO_IMAGE strategy explicitly returns null
        if ("NO_IMAGE".equalsIgnoreCase(strategy)) {
            return null;
        }

        Long actId = activity.getId() != null ? activity.getId() : 0L;

        // 3. Try resolving from subcategory image pool
        if (subcatId != null && subcatMap.containsKey(subcatId)) {
            SubcategoryConcept concept = subcatMap.get(subcatId);
            if ("NO_IMAGE".equalsIgnoreCase(concept.getStrategy())) {
                return null;
            }
            List<String> pool = concept.getImageUrls();
            if (pool != null && !pool.isEmpty()) {
                int index = Math.floorMod(actId.hashCode(), pool.size());
                return pool.get(index);
            }
        }

        // 4. Try parent category fallback pool
        String parentCategory = activity.getCategory();
        if (parentCategory != null && parentCategoryPools.containsKey(parentCategory.toUpperCase())) {
            List<String> parentPool = parentCategoryPools.get(parentCategory.toUpperCase());
            if (parentPool != null && !parentPool.isEmpty()) {
                int index = Math.floorMod(actId.hashCode(), parentPool.size());
                return parentPool.get(index);
            }
        }

        // 5. Fallback to null
        return null;
    }
}
