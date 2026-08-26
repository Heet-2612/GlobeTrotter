# Phase 2E Implementation Notes — V2 Itinerary Builder & Destination Scheduling

## Overview & Goal

Phase 2E upgrades the **Itinerary Builder** ([`ItineraryBuilderPage.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/pages/ItineraryBuilderPage.tsx)) into a travel-oriented multi-destination trip planner.

Travelers can organize itineraries using dual mental models:
1. **By Destination View**: Destination-oriented planning (organizes stops & activities by destination: Bengaluru, Mysuru, Ooty).
2. **Chronological Timeline View**: Day-by-day travel calendar (organizes activities chronologically across days with exact start times).

---

## Architecture & Visual Views

```
+--------------------------------------------------------------------+
|  [Trip Banner] South India Adventure (10 Sep - 17 Sep)            |
|  View Switcher: [By Destination]  [Chronological Timeline]        |
+--------------------------------------------------------------------+

VIEW 1: BY DESTINATION
  BENGALURU, Karnataka (10 Sep - 12 Sep) [Edit Dates] [+ Explore] [x]
    ├── Bangalore Palace (10 Sep at 10:00 AM) [Schedule]
    └── Cubbon Park (10 Sep at 03:00 PM) [Schedule]

  MYSURU, Karnataka (12 Sep - 14 Sep) [Edit Dates] [+ Explore] [x]
    └── Mysore Palace (12 Sep at 11:00 AM) [Schedule]

VIEW 2: CHRONOLOGICAL TIMELINE
  10 SEP 2026 (Wednesday)
    ├── 10:00 AM - Bangalore Palace (Bengaluru)
    └── 03:00 PM - Cubbon Park (Bengaluru)

  11 SEP 2026 (Thursday)
    └── (No activities scheduled for this day)
```

---

## Core Features & Functionality

### 1. Dual Perspective Mental Model
- **By Destination View**: Displays destination cards showing cover photo, destination name, State/UT region name, stop date range, and attached activities.
- **Chronological Timeline View**: Generates a daily calendar for each date in `[trip.startDate, trip.endDate]`, listing activities ordered by `startTime`.

### 2. Stop Date Editing
- **Action**: Clicking `"Edit Dates"` on a destination stop opens an inline date editor modal.
- **Validation**: Enforces `stop.startDate >= trip.startDate`, `stop.endDate <= trip.endDate`, and `stop.startDate <= stop.endDate`.
- **API**: Calls `api.updateTripStop(tripId, stopId, { startDate, endDate })`.

### 3. Activity Scheduling & Time Slots
- **Action**: Clicking `"Schedule"` on an activity card opens a scheduling modal.
- **Fields**: Scheduled Date (validated to fall in `[stop.startDate, stop.endDate]`), Start Time, Custom Cost, and Notes.
- **API**: Calls `api.updateTripActivity(tripId, stopId, tripActivityId, { scheduledDate, startTime, notes, customCost })`.

### 4. Phase 2D Exploration Modal Integration
- Clicking `"+ Explore Destination"` opens [`DestinationExplorationModal.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/components/destination/DestinationExplorationModal.tsx) to browse Curated Highlights and Discover More.
- Newly added activities immediately refresh both Destination and Timeline views.

### 5. Safe Removal Handling
- **Remove Activity**: Calls `api.deleteTripActivity(tripId, stopId, tripActivityId)`. Deletes only the `TripActivity` association; preserves underlying `Activity` entity.
- **Remove Destination Stop**: Asks confirmation and calls `api.deleteTripStop(tripId, stopId)`. Deletes only the `TripStop`; preserves underlying `Destination` entity.

---

## Technical Files Updated & Created

1. **API Client ([`api.ts`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/services/api.ts))**: Added `updateTripActivity`.
2. **Page Component ([`ItineraryBuilderPage.tsx`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/pages/ItineraryBuilderPage.tsx))**: Replaced legacy single-city layout with dual-mode Destination & Timeline builder.

---

## Verification & Test Results

### 1. Frontend Build & Lint Verification
- `npm run lint` (`tsc --noEmit`): **Passed with 0 errors**.
- `npm run build` (`vite build`): **Built successfully in 2.24s**.

### 2. Backend Integration Suite
- `mvn test`: **107 tests run, 0 failures, 0 errors** (`BUILD SUCCESS`).

---

## Safety & Remote Verification
- Personal repository: `portfolio` $\rightarrow$ `https://github.com/Aditya240606/GlobeTrotter.git`
- Evaluation repository (`origin` $\rightarrow$ `https://github.com/Heet-2612/GlobeTrotter.git`): **UNTOUCHED**.
- No commit or push performed.
