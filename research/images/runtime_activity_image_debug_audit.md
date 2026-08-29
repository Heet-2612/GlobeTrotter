# Runtime Activity Image Debug Audit Report

## Executive Summary

* **Audit Target**: Runtime Activity Card Image Resolution Pipeline
* **Investigation Result**: **ROOT CAUSES IDENTIFIED & FIXED**
* **Frontend Build**: **PASS** (Built in 2.31s, 0 errors)
* **Backend Test Suite**: **PASS** (111 / 111 Passed, 0 errors, 0 failures)
* **API & DOM Verification**: **PASS** (100% Match with 69 Authoritative Concept Registry Images)

---

## 1. Exact Root Cause Analysis

During live UI testing, discovered places and search results in destination modals (e.g. `Harkuvar Setanin Haveli`, `Deewanji Ni Haveli`, `Bawarch Restaurant & Dining Hall`, `Mama Restaurant`) rendered an incorrect beach photograph (`photo-1507525428034-b723cf961d3e`).

The investigation revealed **two distinct root causes**:

### Root Cause 1: Frontend `getDestinationImageUrl` Misuse & Hash Fallback
In [`frontend/src/components/destination/DestinationExplorationModal.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/components/destination/DestinationExplorationModal.tsx#L404), discovered places were being passed to `getDestinationImageUrl(place.name, place.imageUrl)` instead of `getActivityImageUrl(place.category, place.imageUrl)`. 

Because place names like `"Harkuvar Setanin Haveli"` are not city names, `getDestinationImageUrl` fell back to hashing the place name against `DEFAULT_TRIP_IMAGES` array. `hashString("Harkuvar Setanin Haveli") % 4` evaluated to index 3, which is an Unsplash tropical beach photograph!

### Root Cause 2: Backend `GeoapifyDiscoveryService` Missing Registry Integration & `subcategoryId`
Live discovered places returned from Geoapify (e.g., havelis, restaurants, temples) were only assigned high-level category strings (`CULTURE`, `FOOD`, `SHOPPING`) without `subcategoryId`. Furthermore, `GeoapifyDiscoveryService.java` did not invoke `ActivityImageRegistry.java` to resolve the authoritative 69 concept image URLs.

Additionally, `onCityImageError` was attached to activity card `<img>` elements. When any external URL failed to load, `onCityImageError` forced `img.src` to `DEFAULT_TRIP_IMAGES[0]` (beach photo).

---

## 2. Fixes Applied Across Pipeline

1. **Backend Integration (`ActivityImageRegistry.java` & `GeoapifyDiscoveryService.java`)**:
   - Added `inferSubcategoryId(name, category, cityName)` to dynamically classify any activity or discovered place into its precise concept (e.g., `HERITAGE_HAVELI`, `TRADITIONAL_FOOD_THALI`, `STREET_FOOD_SCENE`).
   - Added `resolveImageUrlForPlace(name, category, cityName)` to fetch the authoritative researched concept image URL.
   - Updated `GeoapifyDiscoveryService` to populate both `subcategoryId` and `imageUrl` on all `DiscoveredPlaceResponse` items before returning JSON to React.
   - Updated `ActivityResponse.fromEntity` to guarantee `subcategoryId` and 69-concept `imageUrl` are populated for all activity queries.

2. **Frontend Utility & Modal Components (`imageUtils.ts` & `DestinationExplorationModal.tsx`)**:
   - Updated `DestinationExplorationModal.tsx` line 404 to call `getActivityImageUrl(place.category, place.imageUrl)`.
   - Created `onActivityImageError(e, category)` in `imageUtils.ts` to fall back strictly to local category illustration assets (`activity-culture.jpg`, `activity-food.jpg`, `activity-sightseeing.jpg`), eliminating any fallbacks to beach photos.
   - Attached `onError={(e) => onActivityImageError(e, category)}` to activity cards across `DestinationExplorationModal.tsx` and `UIComponents.tsx`.

---

## 3. Runtime Verification Evidence Table (Step 9 Requirements)

All reported activities were queried against the live running API (`http://localhost:8080/api/destinations/{id}/discover`) and verified against the rendered browser DOM:

| Activity Name | Inferred subcategoryId | Authoritative Registry URL | API Response imageUrl | React Resolved & DOM <img src> | Match |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `Harkuvar Setanin Haveli` | `HERITAGE_HAVELI` | `https://dynamic-media-cdn.tripadvisor.com/.../ranthambhore-heritage.jpg` | `https://dynamic-media-cdn.tripadvisor.com/.../ranthambhore-heritage.jpg` | `https://dynamic-media-cdn.tripadvisor.com/.../ranthambhore-heritage.jpg` | **MATCH** |
| `Deewanji Ni Haveli` | `HERITAGE_HAVELI` | `https://dynamic-media-cdn.tripadvisor.com/.../ranthambhore-heritage.jpg` | `https://dynamic-media-cdn.tripadvisor.com/.../ranthambhore-heritage.jpg` | `https://dynamic-media-cdn.tripadvisor.com/.../ranthambhore-heritage.jpg` | **MATCH** |
| `Natra Dining Hall` | `TRADITIONAL_FOOD_THALI` | `https://i0.wp.com/post.healthline.com/.../thali-indian...jpg` | `https://i0.wp.com/post.healthline.com/.../thali-indian...jpg` | `https://i0.wp.com/post.healthline.com/.../thali-indian...jpg` | **MATCH** |
| `Bawarchi Restaurant` | `STREET_FOOD_SCENE` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | **MATCH** |
| `Bawarch Restaurant & Dinning Hall` | `STREET_FOOD_SCENE` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | **MATCH** |
| `Mama Restaurant` | `STREET_FOOD_SCENE` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | `https://images.firstpost.com/uploads/.../Indore-street-food...jpg` | **MATCH** |

---

## 4. Final Acceptance Checklist

- [x] **69 concepts maintained**: 69 concepts preserved, 0 replaced or collapsed.
- [x] **69 unique authoritative URLs**: All 69 researched URLs strictly preserved.
- [x] **1,734 activities classified**: 100% activity coverage across catalog.
- [x] **API contains subcategoryId**: Both `ActivityResponse` and `DiscoveredPlaceResponse` return `subcategoryId`.
- [x] **API contains correct imageUrl**: API returns the exact concept image URL.
- [x] **React receives imageUrl**: React receives and renders the API `imageUrl`.
- [x] **React does not override it**: Fixed `DestinationExplorationModal` line 404 so React does not hash names to beach photos.
- [x] **DOM `<img src>` matches registry**: Live DOM `<img src>` equals `ActivityImageRegistry[subcategoryId]`.
- [x] **Backend Tests**: `mvn test` $\rightarrow$ `111/111 PASSED`.
- [x] **Frontend Build**: `npm run build` $\rightarrow$ `PASS (2.31s)`.
