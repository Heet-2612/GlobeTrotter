# Phase 2C Implementation Notes — V2 Create Trip Wizard Frontend

## Overview & Goal

Phase 2C replaces the legacy V1 single-city Create Trip form with a portfolio-grade **V2 Multi-Step Create Trip Wizard** ([`CreateTripPage.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/pages/CreateTripPage.tsx)).

The new flow removes mandatory budget estimation prompts and empowers travelers to seamlessly build multi-destination trips spanning across multiple States & Union Territories.

---

## Target User Journey & Wizard Steps

```
Step 1: Trip Details (Name, Start Date, End Date, Description)
   ↓
Step 2: Choose State / UT (Browse 29 Indian States & UTs with destination counts)
   ↓
Step 3: Choose Destination(s) (Multi-select curated destinations; supports cross-state selections)
   ↓
Step 4: Review & Confirm (Summary grouped by State/UT -> POST /api/trips -> POST /api/trips/{id}/stops)
   ↓
Step 5: Navigate to Itinerary Builder
```

---

## Detailed Step Specification

### Step 1 — Trip Name & Travel Dates
- **Fields**: `Trip Name` (required), `Start Date` (required), `End Date` (required), `Description` (optional).
- **Removed**: Budget input field (decoupled from initial creation wizard).
- **Validation**: Enforces non-empty name, required start/end dates, and `startDate <= endDate`.

### Step 2 — State / UT Region Selector
- Fetches all 29 Indian regions via `api.getRegions()`.
- Calculates destination availability badge for each State/UT (e.g. Karnataka: 11 destinations, Rajasthan: 13 destinations).
- Features live State/UT search/filter input.
- Visual region cards with hover states and destination count indicators.

### Step 3 — Multi-Destination Picker
- Renders curated destination cards (`isCurated = true`) for the selected State/UT.
- Cards show destination image (via [`getDestinationImageUrl`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/utils/imageUtils.ts)), destination name, and type (`CITY`, `HILL_STATION`, `HERITAGE_SITE`, etc.).
- Multi-select toggle checkmarks with sticky selection summary badge.
- **Multi-State Support**: Users can navigate back to Step 2 to select another State/UT without losing previously chosen destinations across other states.

### Step 4 — Review & Confirm
- Summarizes trip metadata (Name, Dates, Duration).
- Displays selected destinations grouped by State/UT with individual remove buttons.
- Submits `api.createTrip({ name, startDate, endDate, description })` followed by sequential `api.createTripStop(newTrip.id, { destinationId, startDate, endDate })` calls.
- On success, automatically redirects to `builder` view for the newly created trip.

---

## Technical Components & API Integration

1. **Component**: Replaced [`CreateTripPage.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/pages/CreateTripPage.tsx) with a multi-step wizard using local state (`step`, `selectedDestinationsMap`).
2. **API Methods ([`api.ts`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/services/api.ts))**:
   - `getRegions()`
   - `searchDestinations(query, country, region, regionId, curated=true)`
   - `createTrip(data)`
   - `createTripStop(tripId, data)`
3. **Image Handling ([`imageUtils.ts`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/utils/imageUtils.ts))**:
   - Uses `getDestinationImageUrl()` with fallback image handling and `onCityImageError`.

---

## State Management & Error Handling

- **Wizard State**: Maintained locally in `CreateTripPage.tsx` using `selectedDestinationsMap: Record<number, DestinationResponse>`. Unsubmitted wizard drafts do not create premature DB rows.
- **Error Handling**: Friendly inline error alerts for network failures, invalid date ranges, or partial stop creation errors.
- **Loading Indicators**: Button spinner states (`submitting`) and skeleton loader (`loadingData`) during catalog fetch.

---

## Verification & Results

### 1. Frontend Build & Lint Verification
- `npm run lint` (`tsc --noEmit`): **Passed with 0 errors**.
- `npm run build` (`vite build`): **Built successfully in 2.23s**.

### 2. Backend Regression Check
- `mvn test`: **107 tests run, 0 failures, 0 errors** (`BUILD SUCCESS`).

---

## Safety & Remote Verification
- Personal repository: `portfolio` $\rightarrow$ `https://github.com/Aditya240606/GlobeTrotter.git`
- Evaluation repository (`origin` $\rightarrow$ `https://github.com/Heet-2612/GlobeTrotter.git`): **UNTOUCHED**.
- No commit or push performed.
