# Phase 2D Implementation Notes — Destination Exploration & Activity Selection

## Overview & Goal

Phase 2D implements the portfolio-grade **Destination Exploration & Activity Selection Experience** ([`DestinationExplorationModal.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/components/destination/DestinationExplorationModal.tsx)).

When travelers open a trip stop or destination planning view, they are presented with:
1. **Compact Destination Header**: Destination image, name, region/state, and type badge.
2. **Curated Highlights**: Primary recommended handpicked authentic attractions (loads automatically).
3. **Discover More**: Secondary live place discovery layer (search bar + category filters) without exposing external provider names or technical terms (`"Geoapify"`, `"source"`, `"externalId"`).

---

## Architecture & Visual Hierarchy

```
+-------------------------------------------------------------------+
|  [Destination Cover Image]                                       |
|  Region / State • Destination Type                                |
|  Destination Name                                                 |
+-------------------------------------------------------------------+
|  CURATED HIGHLIGHTS                                               |
|  Handpicked authentic attractions & experiences                   |
|  [Card 1] [Card 2] [Card 3] ... (Add to Trip / ✓ Added)          |
+-------------------------------------------------------------------+
|  DISCOVER MORE                                                    |
|  Search places... [Search]                                        |
|  [All] [Attractions] [Nature] [Food] [Shopping] [Culture] [...]   |
|  [Discovered Place 1] [Discovered Place 2] ... (Add to Trip / ✓ Added) |
+-------------------------------------------------------------------+
```

---

## Detailed Component Specifications

### 1. Destination Header
- Renders cover photo via [`getDestinationImageUrl(name, imageUrl)`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/utils/imageUtils.ts) with `onCityImageError` fallback handling.
- Displays destination name, State/UT region name, and destination type (`HILL_STATION`, `BEACH`, `CITY`, etc.).

### 2. Curated Highlights Section
- **API Call**: Automatically calls `api.getCuratedActivitiesByDestination(destinationId)` (or `api.searchActivities(destinationId)`) when modal opens.
- **Card Display**: Renders image (via [`getActivityImageUrl`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/utils/imageUtils.ts)), name, category badge, description, and estimated duration/cost.
- **Button State & Duplicate Prevention**:
  - Compares activity IDs against `existingTripActivities`.
  - If already attached: Displays **"✓ Added"** (disabled badge).
  - If not attached: Displays **"Add to Trip"** button.
  - Clicking "Add to Trip" calls `api.createTripActivity(tripId, stopId, { activityId })`, updates itinerary list, and immediately switches button state to **"✓ Added"**.

### 3. Discover More Section
- **Behavior**: Does **NOT** execute automatic API calls on initial page/modal load to save external API quota.
- **Trigger**: Search input `"Search places..."` + category pill buttons (`All`, `Attractions`, `Nature`, `Food`, `Shopping`, `Culture`, `Entertainment`).
- **API Call**: Executes `api.discoverPlacesByDestination(destinationId, query, category)`.
- **Card Display**: Discovered place cards showing name, category badge, address/description, image, and **"Add to Trip"** button.
- **Duplicate Prevention**: Checks `externalId` against existing trip activities and local state `addedDiscoveredExternalIds`. Displays **"✓ Added"** once attached.

### 4. Strict UI Terminology & Privacy
- **Allowed Terms**: `"Curated Highlights"`, `"Discover More"`, `"Search places..."`.
- **Prohibited Terms**: `"Geoapify"`, `"Live Places (Geoapify)"`, `"externalId"`, `"source"`.

---

## Error & Loading States

- **Curated Loading State**: Inline spinner loader (`loadingCurated`).
- **Curated Error State**: Red banner with retry action (`loadCuratedHighlights`).
- **Discover Loading State**: Inline spinner loader (`loadingDiscover`).
- **Discover Error State**: User-friendly notice: *"Couldn't load more places right now. Try again."*
- **Empty Search Results**: Friendly state: *"No places found. Try a different search."*

---

## Technical Files Modified & Created

1. **New Component**: [`frontend/src/components/destination/DestinationExplorationModal.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/components/destination/DestinationExplorationModal.tsx)
2. **Updated Page**: [`frontend/src/pages/ItineraryBuilderPage.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/pages/ItineraryBuilderPage.tsx) (integrated `DestinationExplorationModal`).

---

## Verification & Test Results

### 1. Frontend Build & Lint
- `npm run lint` (`tsc --noEmit`): **Passed with 0 errors**.
- `npm run build` (`vite build`): **Built successfully in 2.22s**.

### 2. Backend Integration Suite
- `mvn test`: **107 tests run, 0 failures, 0 errors** (`BUILD SUCCESS`).

---

## Safety & Remote Verification
- Personal repository: `portfolio` $\rightarrow$ `https://github.com/Aditya240606/GlobeTrotter.git`
- Evaluation repository (`origin` $\rightarrow$ `https://github.com/Heet-2612/GlobeTrotter.git`): **UNTOUCHED**.
- No commit or push performed.
