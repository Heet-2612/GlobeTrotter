# Activity 69 Image Registry Initial Audit Report

This report audits the existing image mappings in `ActivityImageRegistry.java` across all 69 visual concept keys.

---

## Initial Audit Summary

* **Total Visual Concepts Registered**: 69 / 69
* **Concepts with Duplicated Image URLs**: 44 / 69
* **Unique Image URLs**: 41
* **Concepts Requiring Unique Curation**: 69 / 69

---

## Detailed 69 Concepts Audit Table

| Subcategory ID | Display Concept Name | Parent Category | Strategy | Activity Count | Current Image URL | Duplicated? | Assessment |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| `TEMPLES_RELIGIOUS_NORTH` | North Indian Hindu Temple | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 123 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `TEMPLES_RELIGIOUS_SOUTH` | South Indian Hindu Temple / Gopuram | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 4 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `TEMPLES_RELIGIOUS_EAST` | East Indian Hindu Temple | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 2 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TEMPLES_RELIGIOUS_WEST` | West Indian Hindu Temple | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 4 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `MONASTERIES_GOMPAS` | Buddhist Monastery / Himalayan Gompa | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 13 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `BUDDHIST_STUPAS` | Buddhist Stupa | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 9 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `MOSQUES_DARGAHS` | Indian Mosque / Dargah | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 9 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `CHURCHES_CATHEDRALS` | Indian Church / Basilica | `TEMPLES_RELIGIOUS` | `SHARED_IMAGE_POOL` | 17 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `INDO_ISLAMIC_ARCH` | Mughal / Indo-Islamic Architecture | `HERITAGE_ARCHITECTURE` | `SHARED_IMAGE_POOL` | 7 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `COLONIAL_ARCH` | Colonial Indian Architecture | `HERITAGE_ARCHITECTURE` | `SHARED_IMAGE_POOL` | 14 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `ANCIENT_RUINS` | Ancient Indian Ruins | `HERITAGE_ARCHITECTURE` | `SHARED_IMAGE_POOL` | 8 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `HERITAGE_HAVELI` | Heritage Haveli | `HERITAGE_ARCHITECTURE` | `SHARED_IMAGE_POOL` | 7 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `MONUMENT_MEMORIAL` | Indian Monument / Memorial | `HERITAGE_ARCHITECTURE` | `SHARED_IMAGE_POOL` | 11 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `STONE_ARCH_COMPLEX` | Stone Architectural Complex | `HERITAGE_ARCHITECTURE` | `SHARED_IMAGE_POOL` | 88 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `STEPWELL_VAV` | Indian Stepwell / Vav | `HERITAGE_ARCHITECTURE` | `UNIQUE` | 5 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `HILL_FORT` | Rajasthan Hill Fort | `FORTS_PALACES` | `UNIQUE` | 5 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `STONE_FORT` | Massive Stone Fort / Citadel | `FORTS_PALACES` | `UNIQUE` | 31 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `PALACE_EXTERIOR` | Ornate Indian Palace Exterior | `FORTS_PALACES` | `UNIQUE` | 38 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `PALACE_COURTYARD` | Palace Courtyard / Interior | `FORTS_PALACES` | `UNIQUE` | 0 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `COASTAL_FORT` | Sea Fort / Coastal Fort | `FORTS_PALACES` | `SHARED_IMAGE_POOL` | 5 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TIGER_SAFARI` | Tiger Safari / Jeep Safari | `WILDLIFE_SAFARI` | `UNIQUE` | 48 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `JUNGLE_RESERVE` | Indian Jungle / Forest Reserve | `WILDLIFE_SAFARI` | `SHARED_IMAGE_POOL` | 6 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `WILDLIFE_LION` | Asiatic Lion / Wildlife | `WILDLIFE_SAFARI` | `SHARED_IMAGE_POOL` | 3 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `WILDLIFE_ELEPHANT` | Indian Elephant / Large Wildlife | `WILDLIFE_SAFARI` | `SHARED_IMAGE_POOL` | 8 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `WETLAND_BIRDS` | Indian Wetland / Birds | `WILDLIFE_SAFARI` | `SHARED_IMAGE_POOL` | 8 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `TROPICAL_SANDY_BEACH` | Tropical Indian Sandy Beach | `BEACHES_COASTAL` | `SHARED_IMAGE_POOL` | 44 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `PALM_LINED_BEACH` | Palm-Lined Beach | `BEACHES_COASTAL` | `SHARED_IMAGE_POOL` | 2 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `DRAMATIC_COASTAL_CLIFF` | Dramatic Coastal Cliff | `BEACHES_COASTAL` | `SHARED_IMAGE_POOL` | 9 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `SEASIDE_PROMENADE` | Indian Seaside Promenade | `BEACHES_COASTAL` | `SHARED_IMAGE_POOL` | 11 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `MUSEUM_EXTERIOR` | Grand Indian Museum Exterior | `MUSEUMS_GALLERIES` | `SHARED_IMAGE_POOL` | 15 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `MUSEUM_INTERIOR` | Museum Interior / Artifacts | `MUSEUMS_GALLERIES` | `SHARED_IMAGE_POOL` | 0 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `ART_GALLERY` | Indian Art Gallery | `MUSEUMS_GALLERIES` | `SHARED_IMAGE_POOL` | 6 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `SNOW_HIMALAYAN_MOUNTAINS` | Snow-Covered Himalayan Mountains | `TREKKING_HIKING` | `UNIQUE` | 14 | `https://images.unsplash.com/photo-1...` | YES (6x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `HIGH_ALTITUDE_ROCKY_TRAIL` | High-Altitude Rocky Himalayan Trail | `TREKKING_HIKING` | `UNIQUE` | 3 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `GREEN_HIMALAYAN_FOREST_TRAIL` | Green Himalayan Forest Trail | `TREKKING_HIKING` | `SHARED_IMAGE_POOL` | 10 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `WESTERN_GHATS_TREK` | Western Ghats / Lush Tropical Trekking Trail | `TREKKING_HIKING` | `SHARED_IMAGE_POOL` | 6 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `ROCKY_HILL_HIKE` | Rocky Hill / Mountain Hiking Trail | `TREKKING_HIKING` | `SHARED_IMAGE_POOL` | 25 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `MOUNTAIN_LAKE` | Mountain Lake | `LAKES_RIVERS` | `SHARED_IMAGE_POOL` | 1 | `https://images.unsplash.com/photo-1...` | YES (6x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `SCENIC_VALLEY_LAKE` | Scenic Valley / Lake Landscape | `LAKES_RIVERS` | `SHARED_IMAGE_POOL` | 23 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `RIVER_WITH_BOAT` | Indian River with Boat | `LAKES_RIVERS` | `SHARED_IMAGE_POOL` | 11 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `RIVERSIDE_GHAT` | Indian Riverside Ghat | `LAKES_RIVERS` | `SHARED_IMAGE_POOL` | 18 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `LUSH_CITY_PARK` | Lush Indian City Park | `GARDENS_PARKS` | `SHARED_IMAGE_POOL` | 18 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `FORMAL_MUGHAL_GARDEN` | Formal / Mughal Garden | `GARDENS_PARKS` | `SHARED_IMAGE_POOL` | 5 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `TEA_PLANTATION` | Tea Plantation | `GARDENS_PARKS` | `UNIQUE` | 7 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `COFFEE_PLANTATION` | Coffee Plantation | `GARDENS_PARKS` | `UNIQUE` | 4 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `ROCK_CUT_CAVE_TEMPLE` | Ancient Rock-Cut Cave Temple | `CAVES_ROCK_FORMATIONS` | `UNIQUE` | 20 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `NATURAL_CANYON_GORGE` | Massive Natural Canyon / Gorge | `CAVES_ROCK_FORMATIONS` | `SHARED_IMAGE_POOL` | 14 | `https://images.unsplash.com/photo-1...` | YES (6x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `DRAMATIC_ROCK_FORMATION` | Dramatic Indian Rock Formation | `CAVES_ROCK_FORMATIONS` | `SHARED_IMAGE_POOL` | 18 | `https://images.unsplash.com/photo-1...` | YES (6x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `MOUNTAIN_SUNRISE_VIEW` | Mountain Sunrise Viewpoint | `SCENIC_VIEWPOINTS` | `SHARED_IMAGE_POOL` | 8 | `https://images.unsplash.com/photo-1...` | YES (6x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `VALLEY_PANORAMA_VIEW` | Valley Panoramic Viewpoint | `SCENIC_VIEWPOINTS` | `SHARED_IMAGE_POOL` | 9 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `CABLE_CAR_ROPEWAY` | Cable Car / Ropeway over Mountains | `SCENIC_VIEWPOINTS` | `SHARED_IMAGE_POOL` | 7 | `https://images.unsplash.com/photo-1...` | YES (6x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TROPICAL_FOREST_WATERFALL` | Tropical Forest Waterfall | `WATERFALLS` | `SHARED_IMAGE_POOL` | 6 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TALL_WATERFALL` | Tall Waterfall | `WATERFALLS` | `UNIQUE` | 12 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `MOUNTAIN_WATERFALL` | Mountain Waterfall | `WATERFALLS` | `SHARED_IMAGE_POOL` | 24 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `STREET_FOOD_SCENE` | Indian Street-Food Scene | `FOOD_CULINARY` | `SHARED_IMAGE_POOL` | 8 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `TRADITIONAL_FOOD_THALI` | Indian Traditional Food / Thali | `FOOD_CULINARY` | `NO_IMAGE` | 5 | `NONE` | NO | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `KERALA_HOUSEBOAT` | Kerala Houseboat on Backwaters | `BACKWATERS_BOATING` | `UNIQUE` | 17 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TRADITIONAL_SHIKARA_BOAT` | Traditional Indian Boat / Shikara | `BACKWATERS_BOATING` | `SHARED_IMAGE_POOL` | 35 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TROPICAL_BACKWATER_LANDSCAPE` | Tropical Backwater Landscape | `BACKWATERS_BOATING` | `SHARED_IMAGE_POOL` | 1 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `HANDICRAFT_TEXTILE_BAZAAR` | Colorful Indian Handicraft / Textile Bazaar | `MARKETS_SHOPPING` | `SHARED_IMAGE_POOL` | 9 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `VIBRANT_STREET_MARKET` | Vibrant Indian Street Market | `MARKETS_SHOPPING` | `NO_IMAGE` | 3 | `NONE` | NO | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `WHITE_WATER_RAFTING` | White-Water Rafting | `ADVENTURE_SPORTS` | `UNIQUE` | 9 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `PARAGLIDING_ADVENTURE` | Paragliding | `ADVENTURE_SPORTS` | `UNIQUE` | 5 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `COASTAL_WATERSPORT` | Indian Coastal Watersport | `ADVENTURE_SPORTS` | `UNIQUE` | 4 | `https://images.unsplash.com/photo-1...` | YES (2x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `GOLDEN_SAND_DUNES_CAMEL` | Rajasthan Golden Sand Dunes + Camel | `DESERT_DUNES` | `UNIQUE` | 10 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `DESERT_SUNSET_DUNES` | Desert Sunset / Dunes | `DESERT_DUNES` | `UNIQUE` | 4 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `WHITE_SALT_DESERT_RANN` | White Salt Desert / Rann Landscape | `DESERT_DUNES` | `UNIQUE` | 5 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |
| `TRADITIONAL_DANCE_PERFORMANCE` | Indian Classical / Traditional Dance Performance | `CULTURAL_EXPERIENCES` | `SHARED_IMAGE_POOL` | 4 | `https://images.unsplash.com/photo-1...` | NO | APPROPRIATE |
| `CULTURAL_CEREMONY_FESTIVAL` | Indian Cultural Ceremony / Festival | `CULTURAL_EXPERIENCES` | `SHARED_IMAGE_POOL` | 3 | `https://images.unsplash.com/photo-1...` | YES (3x) | REPLACE WITH UNIQUE CONCEPT IMAGE |

---

## Key Identified Defects in Initial Registry

1. **Mass Image Duplication**: Image URL `https://images.unsplash.com/photo-1506744038136-46273834b3fb` is duplicated across 6 completely different concepts (`SNOW_HIMALAYAN_MOUNTAINS`, `MOUNTAIN_LAKE`, `NATURAL_CANYON_GORGE`, `DRAMATIC_ROCK_FORMATION`, `MOUNTAIN_SUNRISE_VIEW`, `CABLE_CAR_ROPEWAY`).
2. **Boat Ride Mismatch**: `TRADITIONAL_SHIKARA_BOAT` shared a mountain valley URL (`photo-1544735716-392fe2489ffa`), causing Lake Pichola boat rides to render high mountain peaks.
3. **Park & Garden Mismatch**: `LUSH_CITY_PARK` shared a dense wilderness forest photo (`photo-1519331379826-f10be5486c6f`), rendering forest tree canopies for fountain gardens like Saheliyon Ki Bari.
4. **Palace Exterior Mismatch**: `PALACE_EXTERIOR` shared a desert fort wall photo (`photo-1599661046827-dacff0c0f09a`), rendering fort walls for island lake palaces.

---

## Action Plan

Construct `research/images/final_69_activity_images.txt` with 69 verified, high-resolution, unique travel photography URLs (from Wikimedia Commons and Unsplash) so that every single visual concept receives its own distinct representative image.
