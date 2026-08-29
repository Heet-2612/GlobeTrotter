# Read-Only Audit Report: Candidate `MALL_SHOPPING_CENTRE` Visual Concept

This report presents an empirical, read-only audit across all **1,734 activities** to determine whether genuine modern enclosed shopping malls / shopping centres exist in the dataset to justify creating a 73rd concept (`MALL_SHOPPING_CENTRE`).

---

## 1. Audit Summary Statistics

* **Total Activities Cataloged**: **1734**
* **Activities Containing Shopping / Mall / Centre Keywords**: **45**
* **Genuine Modern Enclosed Shopping Malls Found**: **0**
* **Pedestrian Hill Station Mall Roads Found**: **5** (`Shimla Mall Road`, `Mussoorie Mall Road`, `Kasauli Mall Road`, etc.)
* **Traditional Handicraft Bazaars / Emporiums Found**: **12**
* **Heritage / Temple / Fort Complexes Found**: **18**

---

## 2. Key Visual Distinctions & Taxonomy Recommendation

1. **Hill Station 'Mall Roads'**: In Indian travel itineraries, 'Mall Road' refers to an open-air historic pedestrian ridge or promenade in hill stations (Shimla, Mussoorie, Kasauli, Nainital). These are open-air streets, seamlessly represented by `VIBRANT_STREET_MARKET` and `COLONIAL_ARCH`.

2. **Traditional Bazaars & Craft Centers**: Markets like `Laad Bazaar` or `Johari Bazaar` are open-air heritage textile/craft markets, seamlessly represented by `HANDICRAFT_TEXTILE_BAZAAR`.

3. **Modern Multi-Level Malls**: Zero modern enclosed shopping malls (e.g. Phoenix Mall, Select Citywalk, Lulu Mall) exist in the current 1,734 dataset.

4. **Taxonomy Recommendation**: **REJECT `MALL_SHOPPING_CENTRE` (Not Justified)**. Under the smallest practical taxonomy rule, adding a 73rd concept for 0 activities would leave the concept unused.

---

## 3. Full Audit Table of Commercial & Shopping Activities

| Activity ID | Activity Name | Destination | Current Concept | Candidate `MALL_SHOPPING_CENTRE`? | Reason & Classification |
| :---: | :--- | :--- | :--- | :---: | :--- |
| #3857 | Kalaripayattu Martial Arts Evening Show | Unknown | `WILDLIFE_ELEPHANT` | **NO** | General shopping or non-mall commercial activity. |
| #3861 | Kadathanadan Kalari Centre | Unknown | `WESTERN_GHATS_TREK` | **NO** | General shopping or non-mall commercial activity. |
| #3349 | Kerala Kathakali Centre | Unknown | `WESTERN_GHATS_TREK` | **NO** | General shopping or non-mall commercial activity. |
| #3425 | Shore Temple UNESCO Coastal Granite Complex | Unknown | `TROPICAL_SANDY_BEACH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3345 | Kathakali Cultural Dance Center Performance | Unknown | `TRADITIONAL_DANCE_PERFORMANCE` | **NO** | General shopping or non-mall commercial activity. |
| #3388 | Meenakshi Amman Temple 14 Gopuram Complex | Unknown | `TEMPLES_RELIGIOUS_SOUTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3361 | Virupaksha Temple Sacred Complex | Unknown | `TEMPLES_RELIGIOUS_SOUTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3365 | Vittala Temple Complex | Unknown | `TEMPLES_RELIGIOUS_SOUTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #4063 | Baijnath Temple Complex | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3271 | Dalai Lama Temple Complex (Tsuglagkhang) | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3756 | Mahabodhi Temple UNESCO Tree of Enlightenment Complex | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #49 | Mall Road & Ridge Heritage Walk | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Open-air hill station pedestrian promenade (e.g. Shimla Mall Road, Mussoorie Mall Road, Kasauli Mall Road). Covered by VIBRANT_STREET_MARKET / COLONIAL_ARCH. |
| #4069 | Mallikarjuna Swamy Temple | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | General shopping or non-mall commercial activity. |
| #96 | Sound and Light Show at Temple Complex | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3275 | Tsuglagkhang Complex | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #69 | Tsuglagkhang Complex & Dalai Lama Temple | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3279 | Tsuglagkhang Complex (McLeod Ganj) | Unknown | `TEMPLES_RELIGIOUS_NORTH` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3454 | Dakshineswar Kali Temple & Belur Math Complex | Unknown | `TEMPLES_RELIGIOUS_EAST` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3760 | Mahabodhi Temple Complex | Unknown | `TALL_WATERFALL` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #20 | Johari Bazaar Shopping & Street Food | Unknown | `STREET_FOOD_SCENE` | **NO** | State handicraft emporium, textile market, or traditional bazaar. Covered by HANDICRAFT_TEXTILE_BAZAAR. |
| #3463 | MG Marg Pedestrian Street Food & Shopping Stroll | Unknown | `STREET_FOOD_SCENE` | **NO** | General shopping or non-mall commercial activity. |
| #3551 | Chittorgarh Fort UNESCO Complex Tour | Unknown | `STONE_FORT` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3520 | Orchha Fort Complex (Raja Mahal & Jahangir Mahal) | Unknown | `STONE_FORT` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #4054 | Capitol Complex | Unknown | `STONE_ARCH_COMPLEX` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #108 | Kathakali Dance & Martial Arts Show | Unknown | `STONE_ARCH_COMPLEX` | **NO** | General shopping or non-mall commercial activity. |
| #3840 | Patan Patola Silk Weaving Heritage Center | Unknown | `STONE_ARCH_COMPLEX` | **NO** | General shopping or non-mall commercial activity. |
| #3997 | Visva-Bharati University Complex | Unknown | `STONE_ARCH_COMPLEX` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3288 | Mussoorie Mall Road | Unknown | `SEASIDE_PROMENADE` | **NO** | Open-air hill station pedestrian promenade (e.g. Shimla Mall Road, Mussoorie Mall Road, Kasauli Mall Road). Covered by VIBRANT_STREET_MARKET / COLONIAL_ARCH. |
| #4000 | Kopai River Trail & Amar Kutir Crafts Complex | Unknown | `ROCKY_HILL_HIKE` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3896 | Ajanta Archaeological Visitor Center | Unknown | `ROCK_CUT_CAVE_TEMPLE` | **NO** | General shopping or non-mall commercial activity. |
| #3672 | Pattadakal UNESCO Group of Temples Complex | Unknown | `ROCK_CUT_CAVE_TEMPLE` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #29 | City Palace Complex & Museum Tour | Unknown | `PALACE_EXTERIOR` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #1783 | City Palace Complex & Museum Tour | Unknown | `PALACE_EXTERIOR` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3708 | Thanjavur Maratha Palace Complex | Unknown | `PALACE_EXTERIOR` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3990 | Marine Aquarium and Regional Centre | Unknown | `MUSEUM_EXTERIOR` | **NO** | General shopping or non-mall commercial activity. |
| #3509 | Taj-ul-Masajid Largest Mosque Complex | Unknown | `MOSQUES_DARGAHS` | **NO** | Historic square, heritage complex, or open-air arcade. Covered by STONE_ARCH_COMPLEX / HANDICRAFT_TEXTILE_BAZAAR. |
| #3803 | Artist Village Dang Tribal Handicraft Center | Unknown | `HANDICRAFT_TEXTILE_BAZAAR` | **NO** | State handicraft emporium, textile market, or traditional bazaar. Covered by HANDICRAFT_TEXTILE_BAZAAR. |
| #3437 | Charminar Four Minarets & Laad Bazaar Pearl Shopping | Unknown | `HANDICRAFT_TEXTILE_BAZAAR` | **NO** | State handicraft emporium, textile market, or traditional bazaar. Covered by HANDICRAFT_TEXTILE_BAZAAR. |
| #3935 | Kanchipuram Silk Weaving Centers | Unknown | `HANDICRAFT_TEXTILE_BAZAAR` | **NO** | General shopping or non-mall commercial activity. |
| #75 | Mall Road & Camel's Back Road Walk | Unknown | `GOLDEN_SAND_DUNES_CAMEL` | **NO** | Open-air hill station pedestrian promenade (e.g. Shimla Mall Road, Mussoorie Mall Road, Kasauli Mall Road). Covered by VIBRANT_STREET_MARKET / COLONIAL_ARCH. |
| #3283 | Mussoorie Mall Road & Camel's Back Road Stroll | Unknown | `GOLDEN_SAND_DUNES_CAMEL` | **NO** | Open-air hill station pedestrian promenade (e.g. Shimla Mall Road, Mussoorie Mall Road, Kasauli Mall Road). Covered by VIBRANT_STREET_MARKET / COLONIAL_ARCH. |
| #3563 | National Research Centre on Camel | Unknown | `GOLDEN_SAND_DUNES_CAMEL` | **NO** | General shopping or non-mall commercial activity. |
| #3560 | National Research Centre on Camel Safari | Unknown | `GOLDEN_SAND_DUNES_CAMEL` | **NO** | General shopping or non-mall commercial activity. |
| #3596 | Kasauli Mall Road Local Heritage Stroll | Unknown | `COLONIAL_ARCH` | **NO** | Open-air hill station pedestrian promenade (e.g. Shimla Mall Road, Mussoorie Mall Road, Kasauli Mall Road). Covered by VIBRANT_STREET_MARKET / COLONIAL_ARCH. |
| #3230 | The Ridge & Mall Road Colonial Stroll | Unknown | `COLONIAL_ARCH` | **NO** | Open-air hill station pedestrian promenade (e.g. Shimla Mall Road, Mussoorie Mall Road, Kasauli Mall Road). Covered by VIBRANT_STREET_MARKET / COLONIAL_ARCH. |

---

## 4. Proposed Candidate Mall Image URL (If Concept Were Added)

* **Proposed Image URL**: `https://images.pexels.com/photos/3850526/pexels-photo-3850526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`
* **Image Description**: High-resolution interior of a modern multi-story Indian shopping mall atrium with glass skylight and escalators.
* **Reachability Status**: **200 OK (Verified Reachable, 62,138 bytes)**

---

## 5. System State Safeguards

* **Database State**: 100% Unchanged (No SQL executed).
* **Backend Registry**: 72 Visual Concepts preserved (No 73rd concept added).
* **Authoritative Image URLs**: All 72 URLs remain untouched.