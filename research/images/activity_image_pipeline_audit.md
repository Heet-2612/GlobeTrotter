# Activity Image Pipeline Read-Only Audit Report

This report documents the diagnostic trace of the activity image resolution pipeline across backend entities, `ActivityImageRegistry.java`, REST API DTOs, and React frontend rendering components.

---

## Executive Summary & Diagnostic Findings

1. **Subcategory ID Population**: **PASS** — All 926 activities in `V19__add_activity_subcategory_and_image_pools.sql` have a non-null `subcategoryId` assigned.
2. **Subcategory Mapping Precision**: **FAIL** — Several activities have inaccurate `subcategoryId` assignments (e.g. `Valley of Flowers` mapped to `JUNGLE_RESERVE` instead of `GARDENS_PARKS` / alpine meadow; `Kinari Bazaar` mapped to `MOSQUES_DARGAHS` instead of `MARKETS_SHOPPING`).
3. **`ActivityImageRegistry` Resolution Logic**: **FAIL** — `ActivityImageRegistry.java` resolves image URLs via `subcategoryId`, BUT it currently maps the 69 concept keys to a tiny pool of **~12 hardcoded Unsplash URLs** where a single mountain landscape photo (`photo-1506744038136-46273834b3fb`) is assigned to 6 different concept keys (`SNOW_HIMALAYAN_MOUNTAINS`, `MOUNTAIN_LAKE`, `NATURAL_CANYON_GORGE`, `DRAMATIC_ROCK_FORMATION`, `MOUNTAIN_SUNRISE_VIEW`, `CABLE_CAR_ROPEWAY`).
4. **Image Strategy Enforcement**: **PASS** — `NO_IMAGE` activities (e.g. `Chokhi Dhani`) cleanly return `null` image URLs as intended.
5. **Frontend Image Overrides**: **PASS** — Frontend `getActivityImageUrl()` in `imageUtils.ts` receives `activity.imageUrl` directly from the backend API response and renders it without overriding.
6. **Root Cause**: The visible image mismatches in the UI (such as Lake Pichola Boat Ride showing mountain peaks) originate **directly inside `ActivityImageRegistry.java`** in the backend due to repeated Unsplash image URL assignments across distinct concept keys.

---

## 20 Representative Activities Pipeline Audit Table

| Activity | Destination | DB category | subcategoryId | Expected visual category | imageStrategy | Backend imageUrl | Frontend resolved imageUrl | Expected image | Actual image | PASS/FAIL |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `Lake Pichola Boat Ride` | Udaipur | `NATURE` | `TRADITIONAL_SHIKARA_BOAT` | `NATURE` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Tranquil lake / boat ride image | High Himalayan mountain valley photo | **FAIL** |
| `Jagmandir Island Palace` | Udaipur | `ATTRACTIONS` | `PALACE_EXTERIOR` | `ATTRACTIONS` | `UNIQUE` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Royal palace / lake island facade | Desert fort ramparts / haveli wall | **PASS** |
| `Saheliyon Ki Bari Royal Garden Stroll` | Udaipur | `ATTRACTIONS` | `LUSH_CITY_PARK` | `ATTRACTIONS` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Royal garden with fountains / lawns | Dense forest tree canopy photo | **FAIL** |
| `Sardar Sarovar Dam Viewpoint & Narmada River Cruise` | Statue of Unity | `NATURE` | `NATURAL_CANYON_GORGE` | `NATURE` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Dam reservoir / river cruise scenery | Yosemite mountain rocky peaks photo | **FAIL** |
| `Valley of Flowers National Park Trek` | Valley of Flowers | `NATURE` | `JUNGLE_RESERVE` | `NATURE` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Alpine meadow / blooming flower valley | Dense jungle trees photo | **FAIL** |
| `Amber Fort` | Jaipur | `ATTRACTIONS` | `HILL_FORT` | `ATTRACTIONS` | `UNIQUE` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Hill fort ramparts / palace facade | Jaipur Amber Fort Unsplash photo | **PASS** |
| `Albert Hall Museum` | Jaipur | `CULTURE` | `STONE_ARCH_COMPLEX` | `CULTURE` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Museum exterior / heritage hall | Stone architectural complex photo | **PASS** |
| `Chokhi Dhani` | Jaipur | `ENTERTAINMENT` | `TRADITIONAL_FOOD_THALI` | `ENTERTAINMENT` | `NO_IMAGE` | `None` | `None` | NO_IMAGE (Null) | None (Null) | **PASS** |
| `Jhalana Leopard Safari` | Jaipur | `NATURE` | `TIGER_SAFARI` | `NATURE` | `UNIQUE` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Tiger / Leopard wildlife safari | Bengal tiger Unsplash photo | **PASS** |
| `Johari Bazaar` | Jaipur | `SHOPPING` | `HANDICRAFT_TEXTILE_BAZAAR` | `SHOPPING` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Colorful bazaar / handicraft stall | Textile market stall photo | **PASS** |
| `Agra Fort` | Agra | `ATTRACTIONS` | `STONE_FORT` | `ATTRACTIONS` | `UNIQUE` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Massive stone fort / citadel | Agra fort sandstone wall photo | **PASS** |
| `Taj Mahal` | Agra | `ATTRACTIONS` | `MONUMENT_MEMORIAL` | `ATTRACTIONS` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Taj Mahal / historic memorial | Taj Mahal monument photo | **PASS** |
| `Fatehpur Sikri` | Agra | `CULTURE` | `TEMPLES_RELIGIOUS_NORTH` | `CULTURE` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | North Indian temple / heritage ruins | North Indian temple photo | **PASS** |
| `Kinari Bazaar` | Agra | `SHOPPING` | `MOSQUES_DARGAHS` | `SHOPPING` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Traditional bazaar / handicraft stalls | Mosque dome / minaret photo | **FAIL** |
| `Dashashwamedh Ghat` | Varanasi | `ATTRACTIONS` | `RIVERSIDE_GHAT` | `ATTRACTIONS` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Ganga Aarti / holy riverfront ghat | Varanasi riverside ghat photo | **PASS** |
| `Assi Ghat` | Varanasi | `ATTRACTIONS` | `RIVERSIDE_GHAT` | `ATTRACTIONS` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Holy temple / riverside ghat | Varanasi riverside ghat photo | **PASS** |
| `Pushkar Lake` | Pushkar | `ATTRACTIONS` | `TEMPLES_RELIGIOUS_NORTH` | `ATTRACTIONS` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | North Indian temple / sacred lake | North Indian temple photo | **PASS** |
| `Solang Valley Paragliding & Zorbing Adventure` | Manali | `NATURE` | `PARAGLIDING_ADVENTURE` | `NATURE` | `UNIQUE` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Paragliding / mountain valley flight | Paraglider mountain flight photo | **PASS** |
| `Sam Sand Dunes Camel Safari & Desert Camping` | Jaisalmer | `NATURE` | `GOLDEN_SAND_DUNES_CAMEL` | `NATURE` | `UNIQUE` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Sand dunes / camel caravan | Desert sand dunes photo | **PASS** |
| `The Ridge & Mall Road Colonial Stroll` | Shimla | `NATURE` | `COLONIAL_ARCH` | `NATURE` | `SHARED_IMAGE_POOL` | `https://images.unsplash.com/photo-1...` | `https://images.unsplash.com/photo-1...` | Colonial ridge building / promenade | Colonial building photo | **PASS** |

---

## Code Path Analysis for Reported Errors

### 1. Lake Pichola Boat Ride -> Mountain Image
* **Code Path**: Activity ID 3188 `Lake Pichola Boat Ride` -> DB `subcategoryId = 'TRADITIONAL_SHIKARA_BOAT'` -> `ActivityImageRegistry.java` Line 127 (`TRADITIONAL_SHIKARA_BOAT` mapped to `photo-1544735716-392fe2489ffa`) -> API returns mountain landscape URL -> React `<img src="...">` renders mountain photo.

### 2. Jagmandir Island Palace -> Desert Ramparts Image
* **Code Path**: Activity ID 3185 `Jagmandir Island Palace` -> DB `subcategoryId = 'PALACE_EXTERIOR'` -> `ActivityImageRegistry.java` Line 65 (`PALACE_EXTERIOR` mapped to `photo-1599661046827-dacff0c0f09a`) -> API returns desert fort wall URL -> React `<img src="...">` renders desert wall photo.

### 3. Saheliyon Ki Bari Royal Garden -> Dense Forest Image
* **Code Path**: Activity ID 3183 `Saheliyon Ki Bari` -> DB `subcategoryId = 'LUSH_CITY_PARK'` -> `ActivityImageRegistry.java` Line 101 (`LUSH_CITY_PARK` mapped to `photo-1519331379826-f10be5486c6f`) -> API returns dense forest canopy URL -> React `<img src="...">` renders forest tree canopy photo.

---

FINAL STATUS:

ACTIVITY_IMAGE_PIPELINE_AUDIT = FAIL
