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
        // Register 69 Authoritative Visual Concepts with Researched Image URLs

        // TEMPLES_RELIGIOUS
        register("TEMPLES_RELIGIOUS_NORTH", "TEMPLES_RELIGIOUS", "North Indian Hindu Temple", "SHARED_IMAGE_POOL", List.of("https://www.easeindiatrip.com/blog/wp-content/uploads/2025/01/Akshardham-Temple-Delhi-1024x649.jpg"));
        register("TEMPLES_RELIGIOUS_SOUTH", "TEMPLES_RELIGIOUS", "South Indian Hindu Temple / Gopuram", "SHARED_IMAGE_POOL", List.of("https://static.wixstatic.com/media/537d91_14cd3a934957447f9d594c0ff514bf48~mv2.png/v1/fill/w_925,h_744,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/537d91_14cd3a934957447f9d594c0ff514bf48~mv2.png"));
        register("TEMPLES_RELIGIOUS_EAST", "TEMPLES_RELIGIOUS", "East Indian Hindu Temple", "SHARED_IMAGE_POOL", List.of("https://static2.tripoto.com/media/filter/tst/img/109540/TripDocument/1619598623_c9d7f769_254b_48d9_aa77_0df3288a5fdb.jpeg"));
        register("TEMPLES_RELIGIOUS_WEST", "TEMPLES_RELIGIOUS", "West Indian Hindu Temple", "SHARED_IMAGE_POOL", List.of("https://s7ap1.scene7.com/is/image/incredibleindia/dwarkadish-temple-01-attr-hero?qlt=82&ts=1726734784547"));
        register("MONASTERIES_GOMPAS", "TEMPLES_RELIGIOUS", "Buddhist Monastery / Himalayan Gompa", "SHARED_IMAGE_POOL", List.of("https://static.toiimg.com/photo/105076947.cms"));
        register("BUDDHIST_STUPAS", "TEMPLES_RELIGIOUS", "Buddhist Stupa", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLt8xFcgVEVDAa5fOrRpKxsmqizDajP66_wMMilTpt2Q&s=10"));
        register("MOSQUES_DARGAHS", "TEMPLES_RELIGIOUS", "Indian Mosque / Dargah", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyUd9r6k72dCVHk-3Cge0K1IBnFeUzwKH93anAX67AoRxck1z9nIDmVG5n&s=10"));
        register("CHURCHES_CATHEDRALS", "TEMPLES_RELIGIOUS", "Indian Church / Basilica", "SHARED_IMAGE_POOL", List.of("https://upload.wikimedia.org/wikipedia/commons/a/aa/Santhome_Basilica.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"));

        // HERITAGE_ARCHITECTURE
        register("INDO_ISLAMIC_ARCH", "HERITAGE_ARCHITECTURE", "Mughal / Indo-Islamic Architecture", "SHARED_IMAGE_POOL", List.of("https://www.eurasiareview.com/wp-content/uploads/2023/11/c-46.png"));
        register("COLONIAL_ARCH", "HERITAGE_ARCHITECTURE", "Colonial Indian Architecture", "SHARED_IMAGE_POOL", List.of("https://s7ap1.scene7.com/is/image/incredibleindia/st-paul-cathedral-kolkata-west-bengal-1-attr-hero?qlt=82&ts=1742154281271"));
        register("ANCIENT_RUINS", "HERITAGE_ARCHITECTURE", "Ancient Indian Ruins", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIAXl_MEkGeWEgnWyIzOVMTDr5C7vdXsAnzFFjiCAxdg&s=10"));
        register("HERITAGE_HAVELI", "HERITAGE_ARCHITECTURE", "Heritage Haveli", "SHARED_IMAGE_POOL", List.of("https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/19/55/31/ranthambhore-heritage.jpg?w=900&h=-1&s=1"));
        register("MONUMENT_MEMORIAL", "HERITAGE_ARCHITECTURE", "Indian Monument / Memorial", "SHARED_IMAGE_POOL", List.of("https://static.toiimg.com/thumb/60776671/A-walk-through-prominent-historical-monuments-of-India.jpg?width=636&height=358&resize=4"));
        register("STONE_ARCH_COMPLEX", "HERITAGE_ARCHITECTURE", "Stone Architectural Complex", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn16Kk1uJhGRaeYAMDVNWxqjci8UHJ1x2peGx8sS7SIQ&s=10"));
        register("STEPWELL_VAV", "HERITAGE_ARCHITECTURE", "Indian Stepwell / Vav", "UNIQUE", List.of("https://ychef.files.bbci.co.uk/1280x720/p09yg91f.jpg"));

        // SIKH_GURUDWARA
        register("SIKH_GURUDWARA", "TEMPLES_RELIGIOUS", "Sikh Gurudwara & Golden Temple Complex", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qQQD7nkl01MwGTe_Em4eH1jdZlUvpITcYpF-LSPGlw&s=10"));

        // FORTS_PALACES
        register("HILL_FORT", "FORTS_PALACES", "Rajasthan Hill Fort", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVM2_t469AeXlusV6FI88RBXgURzFj6bkIFr-CmdBTDIagXAPQ_6kYX4c1&s=10"));
        register("STONE_FORT", "FORTS_PALACES", "Massive Stone Fort / Citadel", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRh6f71HILbaKmfT14qmf8qw9zKe4-FHZ3W6h3RWBb9fW-OhcWcC23_TI-&s=10"));
        register("PALACE_EXTERIOR", "FORTS_PALACES", "Ornate Indian Palace Exterior", "SHARED_IMAGE_POOL", List.of("https://thearchitectsdiary.com/wp-content/uploads/2023/12/Palace-Design-Image-13-jpg.webp"));
        register("PALACE_COURTYARD", "FORTS_PALACES", "Palace Courtyard / Interior", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs20TzZN8rGEfrQPM3n8HNNSBxtsBteyJv0NqyrKvA98sP04iPolkIVvA&s=10"));
        register("COASTAL_FORT", "FORTS_PALACES", "Sea Fort / Coastal Fort", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6YhmTUBxSbBLt1a13GyxR3ByUs-keH2y1rr9g6XnLrDytjBWqZqVlISFx&s=10"));

        // WILDLIFE_SAFARI
        register("TIGER_SAFARI", "WILDLIFE_SAFARI", "Tiger Safari / Jeep Safari", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGoqTarVT-gZMqaVXoNAxYXhFavrp_1YhbXiQ9c4O-hoaLlWf8UMdRaqQ&s=10"));
        register("JUNGLE_RESERVE", "WILDLIFE_SAFARI", "Indian Jungle / Forest Reserve", "SHARED_IMAGE_POOL", List.of("https://i.pinimg.com/736x/5d/21/bc/5d21bcd66bac9f83d0c888712986ff1f.jpg"));
        register("WILDLIFE_LION", "WILDLIFE_SAFARI", "Asiatic Lion / Wildlife", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlXoXiTaCjEpd6EKIiXEQP1uFYZmBdogYaVpPMBxLZfPLL_tD-R3PwTiLu&s=10"));
        register("WILDLIFE_ELEPHANT", "WILDLIFE_SAFARI", "Indian Elephant / Large Wildlife", "SHARED_IMAGE_POOL", List.of("https://www.wildlifeluxuries.com/wp-content/uploads/2025/03/2025-03-22_Why-we-need-to-save-wildlife-in-India-02_Blog_WLI.jpg"));
        register("WETLAND_BIRDS", "WILDLIFE_SAFARI", "Indian Wetland / Birds", "SHARED_IMAGE_POOL", List.of("https://static.toiimg.com/thumb/107084219/Loktak-wetland.jpg?width=1200&height=900"));

        // BEACHES_COASTAL
        register("TROPICAL_SANDY_BEACH", "BEACHES_COASTAL", "Tropical Indian Sandy Beach", "SHARED_IMAGE_POOL", List.of("https://static.toiimg.com/thumb/imgsize-114060,msid-123856743/123856743.jpg?width=500&resizemode=4"));
        register("PALM_LINED_BEACH", "BEACHES_COASTAL", "Palm-Lined Beach", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9R44ah9KFkpYZSjv-U5PPyaCsaPepcZcVj49d1hNlXgijLLMEFHWUs2Y&s=10"));
        register("DRAMATIC_COASTAL_CLIFF", "BEACHES_COASTAL", "Dramatic Coastal Cliff", "SHARED_IMAGE_POOL", List.of("https://images.stockcake.com/public/1/f/4/1f411634-a593-4299-9215-40aacf8a4a51_large/majestic-coastal-cliffs-stockcake.jpg"));
        register("SEASIDE_PROMENADE", "BEACHES_COASTAL", "Indian Seaside Promenade", "SHARED_IMAGE_POOL", List.of("https://lacedilleindia.com/wp-content/uploads/2025/05/Promenade-Beach-Pondicherry-Explore-the-Coastal-Charm-from-the-Heart-of-White-Town.jpg"));

        // MUSEUMS_GALLERIES
        register("MUSEUM_EXTERIOR", "MUSEUMS_GALLERIES", "Grand Indian Museum Exterior", "SHARED_IMAGE_POOL", List.of("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Indian_Museum%2C_Courtyard%2C_Kolkata%2C_India.jpg/1280px-Indian_Museum%2C_Courtyard%2C_Kolkata%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail"));
        register("MUSEUM_INTERIOR", "MUSEUMS_GALLERIES", "Museum Interior / Artifacts", "SHARED_IMAGE_POOL", List.of("https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/c4/5b/5d/heritage-museum-of-asian.jpg?w=1100&h=600&s=1"));
        register("ART_GALLERY", "MUSEUMS_GALLERIES", "Indian Art Gallery", "SHARED_IMAGE_POOL", List.of("https://contemporarylynx.co.uk/wp-content/uploads/2022/02/contemporary-art-galleries-in-India-7.jpg"));

        // TREKKING_HIKING
        register("SNOW_HIMALAYAN_MOUNTAINS", "TREKKING_HIKING", "Snow-Covered Himalayan Mountains", "SHARED_IMAGE_POOL", List.of("https://images.imagerenderer.com/images/artworkimages/mediumlarge/2/snow-covered-himalayan-mountain-peak-andrew-castellano.jpg"));
        register("HIGH_ALTITUDE_ROCKY_TRAIL", "TREKKING_HIKING", "High-Altitude Rocky Himalayan Trail", "SHARED_IMAGE_POOL", List.of("https://himalayandaredevils.com/storage/uploads/69d92b5340782.webp"));
        register("GREEN_HIMALAYAN_FOREST_TRAIL", "TREKKING_HIKING", "Green Himalayan Forest Trail", "SHARED_IMAGE_POOL", List.of("https://worldheritagesites.net/wp-content/uploads/2025/08/The-Great-Himalayan-National-Park.jpg"));
        register("WESTERN_GHATS_TREK", "TREKKING_HIKING", "Western Ghats / Lush Tropical Trekking Trail", "SHARED_IMAGE_POOL", List.of("https://c.ndtvimg.com/2025-06/uplmd97_western-ghat_625x300_06_June_25.jpg?im=FaceCrop,algorithm=dnn,width=773,height=435"));
        register("ROCKY_HILL_HIKE", "TREKKING_HIKING", "Rocky Hill / Mountain Hiking Trail", "SHARED_IMAGE_POOL", List.of("https://images.alltrails.com/eyJidWNrZXQiOiJhc3NldHMuYWxsdHJhaWxzLmNvbSIsImtleSI6InVwbG9hZHMvcGhvdG8vaW1hZ2UvMTEyNzc0NTUwLzMzNGZkZDFiMTJiNTc5MTQ1M2UxYTU2NmIxMmEyYjM0LmpwZyIsImVkaXRzIjp7InRvRm9ybWF0Ijoid2VicCIsInJlc2l6ZSI6eyJ3aWR0aCI6IjIwNDgiLCJoZWlnaHQiOiIyMDQ4IiwiZml0IjoiaW5zaWRlIn0sInJvdGF0ZSI6bnVsbCwianBlZyI6eyJ0cmVsbGlzUXVhbnRpc2F0aW9uIjp0cnVlLCJvdmVyc2hvb3REZXJpbmdpbmciOnRydWUsIm9wdGltaXNlU2NhbnMiOnRydWUsIm9wdGltaXNlU2NhbnMiOnRydWUsInF1YW50aXNhdGlvblRhYmxlIjozfX19"));

        // LAKES_RIVERS
        register("MOUNTAIN_LAKE", "LAKES_RIVERS", "Mountain Lake", "SHARED_IMAGE_POOL", List.of("https://static.toiimg.com/photo/msid-113486286,width-96,height-65.cms"));
        register("SCENIC_VALLEY_LAKE", "LAKES_RIVERS", "Scenic Valley / Lake Landscape", "SHARED_IMAGE_POOL", List.of("https://images.pexels.com/photos/26448272/pexels-photo-26448272.jpeg?_gl=1*tvdgnq*_ga*ODM3MjIzMzk3LjE3ODc5MTE1NDc.*_ga_8JE65Q40S6*czE3ODc5MTE1NDYkbzEkZzAkdDE3ODc5MTE1NDYkajYwJGwwJGgw"));
        register("RIVER_WITH_BOAT", "LAKES_RIVERS", "Indian River with Boat", "SHARED_IMAGE_POOL", List.of("https://adventurerivercruises.com/blog/admin/assets/img/post/image_2026-06-23-07-38-30_6a3a37f66a42a.jpg"));
        register("DAM_RESERVOIR", "LAKES_RIVERS", "Water Dam & Hydroelectric Reservoir", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3zI_1aYDCb6hUcvaHjYuvSAbGYsvWdmirF--9-qSD9A&s"));
        register("RIVERSIDE_GHAT", "LAKES_RIVERS", "Indian Riverside Ghat", "SHARED_IMAGE_POOL", List.of("https://www.myindianproducts.com/images/travel/places/dalmau-ghat-raebareli-uttar-pradesh-india.webp"));

        // GARDENS_PARKS
        register("LUSH_CITY_PARK", "GARDENS_PARKS", "Lush Indian City Park", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeXKMmqkDdUTtiuK_NSd4RvbZ0m6u0fNEg8COJ7IjeeCpdHpKMlrBQAmE&s=10"));
        register("FORMAL_MUGHAL_GARDEN", "GARDENS_PARKS", "Formal / Mughal Garden", "SHARED_IMAGE_POOL", List.of("https://vajiramias.sgp1.cdn.digitaloceanspaces.com/wp/current-affairs/2025/03/what_are_the_general_features_of_mughal_gardens.jpg?v=2"));
        register("TEA_PLANTATION", "GARDENS_PARKS", "Tea Plantation", "SHARED_IMAGE_POOL", List.of("https://upload.wikimedia.org/wikipedia/commons/c/cc/Tea_plantation_in_Ciwidey%2C_Bandung_2014-08-21.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original"));
        register("COFFEE_PLANTATION", "GARDENS_PARKS", "Coffee Plantation", "SHARED_IMAGE_POOL", List.of("https://viewtraveling.com/wp-content/uploads/2020/07/chikmagalur.jpg"));

        // CAVES_ROCK_FORMATIONS
        register("ROCK_CUT_CAVE_TEMPLE", "CAVES_ROCK_FORMATIONS", "Ancient Rock-Cut Cave Temple", "SHARED_IMAGE_POOL", List.of("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ellora_Cave_16_si0308.jpg/1280px-Ellora_Cave_16_si0308.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=thumbnail"));
        register("NATURAL_CANYON_GORGE", "CAVES_ROCK_FORMATIONS", "Massive Natural Canyon / Gorge", "SHARED_IMAGE_POOL", List.of("https://www.easemytrip.com/travel/img/Canyons.jpg"));
        register("DRAMATIC_ROCK_FORMATION", "CAVES_ROCK_FORMATIONS", "Dramatic Indian Rock Formation", "SHARED_IMAGE_POOL", List.of("https://images.pexels.com/photos/12299356/pexels-photo-12299356.jpeg?auto=compress&w=1260&h=750&dpr=2"));

        // SCENIC_VIEWPOINTS
        register("MOUNTAIN_SUNRISE_VIEW", "SCENIC_VIEWPOINTS", "Mountain Sunrise Viewpoint", "SHARED_IMAGE_POOL", List.of("https://thewoodsresorts.com/uploads/media/sunrise-valley-view-point66a363ac65ed4.webp"));
        register("VALLEY_PANORAMA_VIEW", "SCENIC_VIEWPOINTS", "Valley Panoramic Viewpoint", "SHARED_IMAGE_POOL", List.of("https://media1.thrillophilia.com/filestore/tckt2nhvewuxbi7bi4f7wxh0xs66_47374073501_ab2d785b03_b.jpg?w=1440&dpr=2"));
        register("CABLE_CAR_ROPEWAY", "SCENIC_VIEWPOINTS", "Cable Car / Ropeway over Mountains", "SHARED_IMAGE_POOL", List.of("https://blog.explurger.com/wp-content/uploads/2026/06/Jade-Dragon-Snow-Mountain-Ropeway-1.jpeg"));

        // WATERFALLS
        register("TROPICAL_FOREST_WATERFALL", "WATERFALLS", "Tropical Forest Waterfall", "SHARED_IMAGE_POOL", List.of("https://d4g0cdul6yygp.cloudfront.net/uploads/2023/01/75047305-3EFB-4A81-8665-42A5C96B968F.jpeg"));
        register("TALL_WATERFALL", "WATERFALLS", "Tall Waterfall", "SHARED_IMAGE_POOL", List.of("https://blogs.tripzygo.in/wp-content/uploads/2025/02/kunchikal-waterfalls-1024x683.jpg"));
        register("MOUNTAIN_WATERFALL", "WATERFALLS", "Mountain Waterfall", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5sS-kdXf5ed1aGQNBGiXSuiGUUHIHfLABn3Mm4F42XgHiGSvbCys3Ow&s=10"));

        // FOOD_CULINARY
        register("STREET_FOOD_SCENE", "FOOD_CULINARY", "Indian Street-Food Scene", "SHARED_IMAGE_POOL", List.of("https://images.firstpost.com/uploads/2026/06/Indore-street-food-2026-06-344a123a25308e46e871fd7fa6f24868-1200x675.jpg?im=Resize,width=720,aspect=fit,type=normal"));
        register("TRADITIONAL_FOOD_THALI", "FOOD_CULINARY", "Indian Traditional Food / Thali", "SHARED_IMAGE_POOL", List.of("https://i0.wp.com/post.healthline.com/wp-content/uploads/2020/07/thali-indian-1296x728-header.jpg?w=1575"));
        register("RESTAURANT_FINE_DINING", "FOOD_CULINARY", "Restaurant & Indoor Dining Ambiance", "SHARED_IMAGE_POOL", List.of("https://b.zmtcdn.com/data/pictures/3/22036163/4cc0c0550800c3a527eadfa73e47d30f.jpg?fit=around|960:500&crop=960:500;*,*"));

        // BACKWATERS_BOATING
        register("KERALA_HOUSEBOAT", "BACKWATERS_BOATING", "Kerala Houseboat on Backwaters", "SHARED_IMAGE_POOL", List.of("https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/e7/89/dd.jpg"));
        register("TRADITIONAL_SHIKARA_BOAT", "BACKWATERS_BOATING", "Traditional Indian Boat / Shikara", "SHARED_IMAGE_POOL", List.of("https://alleppeyhouseboat.in/wp-content/uploads/2020/02/shikara-2.jpg"));
        register("TROPICAL_BACKWATER_LANDSCAPE", "BACKWATERS_BOATING", "Tropical Backwater Landscape", "SHARED_IMAGE_POOL", List.of("https://keralatourism.travel/images/v2/packages/destinations-kasargod-tourism.jpg"));

        // MARKETS_SHOPPING
        register("HANDICRAFT_TEXTILE_BAZAAR", "MARKETS_SHOPPING", "Colorful Indian Handicraft / Textile Bazaar", "SHARED_IMAGE_POOL", List.of("https://i.pinimg.com/736x/78/ac/cc/78accc53f19529b45d15a23847664f35.jpg"));
        register("VIBRANT_STREET_MARKET", "MARKETS_SHOPPING", "Vibrant Indian Street Market", "SHARED_IMAGE_POOL", List.of("https://blogs.revv.co.in/blogs/wp-content/uploads/2020/10/Janpath-Market-1024x768.jpg"));

        // ADVENTURE_SPORTS
        register("WHITE_WATER_RAFTING", "ADVENTURE_SPORTS", "White-Water Rafting", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbuT8vcylw5nOOYzJw1CFBVaTfranRtsgeWgquH9PT-vqDTekJOPNVWVJI&s=10"));
        register("PARAGLIDING_ADVENTURE", "ADVENTURE_SPORTS", "Paragliding", "SHARED_IMAGE_POOL", List.of("https://media.easemytrip.com/media/Blog/India/638285706022033478/638285706022033478UDEtF4.jpg"));
        register("COASTAL_WATERSPORT", "ADVENTURE_SPORTS", "Indian Coastal Watersport", "SHARED_IMAGE_POOL", List.of("https://www.holidaymonk.com/wp-content/uploads/2022/04/Watersports-in-India.jpg"));

        // DESERT_DUNES
        register("GOLDEN_SAND_DUNES_CAMEL", "DESERT_DUNES", "Rajasthan Golden Sand Dunes + Camel", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNvQOuSJehzzUYXK313p4FCNLLFGGJWweNaM9Cfa5AEw&s=10"));
        register("DESERT_SUNSET_DUNES", "DESERT_DUNES", "Desert Sunset / Dunes", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB6GiENEIBIbHu12yJoZ73jcY7_LGyLjIl5Pn8WGl_aU-wa65mjZ4Ew4zF&s=10"));
        register("WHITE_SALT_DESERT_RANN", "DESERT_DUNES", "White Salt Desert / Rann Landscape", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdN4okfzwgo_Kek40izTWb8mCmPp9qQ_AyJN6Pf5_E4a5yHbSNB8gnXst9&s=10"));

        // CULTURAL_EXPERIENCES
        register("TRADITIONAL_DANCE_PERFORMANCE", "CULTURAL_EXPERIENCES", "Indian Classical / Traditional Dance Performance", "SHARED_IMAGE_POOL", List.of("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREFI6q9UrdGXX49IgdXqpz0xvcCEx08GuBqXXXq429p4IU_tFYNQnrkrM&s=10"));
        register("CULTURAL_CEREMONY_FESTIVAL", "CULTURAL_EXPERIENCES", "Indian Cultural Ceremony / Festival", "SHARED_IMAGE_POOL", List.of("https://assets.cntraveller.in/photos/643d485d0916b606416b4a07/master/w_1600%2Cc_limit/IH-%2520Ramlila.jpg"));
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

        String subcatId = activity.getSubcategoryId();
        String strategy = activity.getImageStrategy();

        // 1. NO_IMAGE strategy explicitly returns null
        if ("NO_IMAGE".equalsIgnoreCase(strategy)) {
            return null;
        }

        Long actId = activity.getId() != null ? activity.getId() : 0L;

        // 2. Try resolving from authoritative subcategory concept image pool
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

        // 3. Fallback: Infer subcategory ID from name, category, and city name
        String cityName = (activity.getDestination() != null && activity.getDestination().getName() != null)
                ? activity.getDestination().getName() : "";
        String inferredSubcat = inferSubcategoryId(activity.getName(), activity.getCategory(), cityName);
        if (inferredSubcat != null && subcatMap.containsKey(inferredSubcat)) {
            SubcategoryConcept concept = subcatMap.get(inferredSubcat);
            List<String> pool = concept.getImageUrls();
            if (pool != null && !pool.isEmpty()) {
                int index = Math.floorMod(actId.hashCode(), pool.size());
                return pool.get(index);
            }
        }

        // 4. Explicit activity-specific image URL fallback
        if (activity.getImageUrl() != null && !activity.getImageUrl().trim().isEmpty()
                && !activity.getImageUrl().equalsIgnoreCase("null")) {
            return activity.getImageUrl().trim();
        }

        // 5. Fallback to null
        return null;
    }

    public String resolveImageUrlForPlace(String name, String category, String cityName) {
        String subcat = inferSubcategoryId(name, category, cityName);
        if (subcat != null && subcatMap.containsKey(subcat)) {
            List<String> pool = subcatMap.get(subcat).getImageUrls();
            if (pool != null && !pool.isEmpty()) {
                int index = Math.floorMod(name != null ? name.hashCode() : 0, pool.size());
                return pool.get(index);
            }
        }
        return null;
    }

    public String inferSubcategoryId(String name, String category, String cityName) {
        if (name == null) name = "";
        if (category == null) category = "";
        if (cityName == null) cityName = "";

        String n = name.toLowerCase();
        String c = cityName.toLowerCase();
        String cat = category.toUpperCase();

        // Gurudwaras
        if (n.contains("gurudwara") || n.contains("gurdwara") || n.contains("golden temple") || n.contains("harmandir") || n.contains("sahib")) {
            return "SIKH_GURUDWARA";
        }

        // Dams & Reservoirs
        if (n.contains("dam") || n.contains("reservoir") || n.contains("barrage")) {
            return "DAM_RESERVOIR";
        }

        // Sand Dunes / Desert
        if (n.contains("dunes") || n.contains("camel") || n.contains("rann") || n.contains("desert")) {
            if (n.contains("rann") || n.contains("white") || n.contains("salt") || c.contains("kutch")) {
                return "WHITE_SALT_DESERT_RANN";
            }
            return "GOLDEN_SAND_DUNES_CAMEL";
        }

        // Haveli
        if (n.contains("haveli")) {
            return "HERITAGE_HAVELI";
        }

        // Fort / Palace
        if (n.contains("fort")) {
            if (n.contains("hill") || c.contains("rajasthan") || c.contains("jaipur") || c.contains("jodhpur") || c.contains("jaisalmer")) {
                return "HILL_FORT";
            }
            return "STONE_FORT";
        }
        if (n.contains("palace") || n.contains("mahal")) {
            return "PALACE_EXTERIOR";
        }

        // Waterfall
        if (n.contains("waterfall") || n.contains(" falls")) {
            if (n.contains("mountain") || c.contains("himalaya") || c.contains("manali") || c.contains("shimla") || c.contains("dharamshala")) {
                return "MOUNTAIN_WATERFALL";
            }
            return "TROPICAL_FOREST_WATERFALL";
        }

        // Cable Car / Ropeway
        if (n.contains("ropeway") || n.contains("cable car") || n.contains("gondola")) {
            return "CABLE_CAR_ROPEWAY";
        }

        // Food / Dining
        if (n.contains("restaurant") || n.contains("dining") || n.contains("thali") || n.contains("food") || cat.contains("FOOD")) {
            if (n.contains("restaurant") || n.contains("bistro") || n.contains("cafe") || n.contains("fine dining")) {
                return "RESTAURANT_FINE_DINING";
            }
            if (n.contains("thali") || n.contains("dining hall")) {
                return "TRADITIONAL_FOOD_THALI";
            }
            return "STREET_FOOD_SCENE";
        }

        // Market / Shopping
        if (n.contains("bazaar") || n.contains("bazar") || n.contains("market") || n.contains("craft") || n.contains("souvenir") || cat.contains("SHOPPING")) {
            return "HANDICRAFT_TEXTILE_BAZAAR";
        }

        // Temple / Heritage
        if (n.contains("temple") || n.contains("mandir") || n.contains("kovil") || cat.contains("CULTURE")) {
            if (c.contains("tamil nadu") || c.contains("chennai") || c.contains("madurai") || c.contains("thanjavur") || c.contains("rameshwaram") || c.contains("kanyakumari") || c.contains("kochi") || c.contains("kerala") || c.contains("bengaluru") || c.contains("hampi") || c.contains("mysore") || c.contains("tirupati")) {
                return "TEMPLES_RELIGIOUS_SOUTH";
            }
            if (c.contains("puri") || c.contains("bhubaneswar") || c.contains("odisha") || c.contains("kolkata") || c.contains("west bengal")) {
                return "TEMPLES_RELIGIOUS_EAST";
            }
            if (c.contains("dwarka") || c.contains("somnath") || c.contains("gujarat") || c.contains("ahmedabad") || c.contains("maharashtra")) {
                return "TEMPLES_RELIGIOUS_WEST";
            }
            return "TEMPLES_RELIGIOUS_NORTH";
        }

        // Default fallbacks by Category
        if (cat.contains("NATURE")) return "GREEN_HIMALAYAN_FOREST_TRAIL";
        if (cat.contains("SIGHTSEEING") || cat.contains("ATTRACTION")) return "STONE_ARCH_COMPLEX";

        return "STONE_ARCH_COMPLEX";
    }
}
