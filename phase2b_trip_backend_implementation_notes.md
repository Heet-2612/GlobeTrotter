# Phase 2B Implementation Notes — V2 Trip Backend Implementation

## Overview & Goal

Phase 2B implements the backend capabilities required to support the **GlobeTrotter V2 Multi-Destination Trip Planner**:
1. **Unconstrained Trip Creation**: Creating trips without mandating target budget inputs.
2. **Multi-Destination Stops**: Associating multiple destination stops per trip across different State/UT regions.
3. **Geoapify POI Persistence to Itinerary**: Explicitly adding dynamic Geoapify places to trip stops via `POST /api/trips/{tripId}/stops/{stopId}/activities/discovered` by saving an on-the-fly `Activity` record (`source = GEOAPIFY`) with duplicate prevention.

---

## Technical Changes Implemented

### 1. Trip Creation Contract
- **DTO**: [`CreateTripRequest.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/dto/CreateTripRequest.java) enforces `@NotBlank name`, `@NotNull startDate`, `@NotNull endDate`. The `budget` field remains optional/nullable with `@DecimalMin("0.0")`.
- **Service**: [`TripService.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/service/TripService.java) validates `startDate <= endDate`. If `budget` is omitted, the `Trip` entity is saved with `budget = null`. Existing budget endpoints (`BudgetService`, `BudgetController`) remain 100% operational for legacy/future use.

### 2. Multi-Destination Stops Support
- **Endpoint**: `POST /api/trips/{tripId}/stops`
- **Validation**:
  - Trip exists and belongs to authenticated user.
  - Destination exists.
  - `startDate <= endDate`.
  - `stop.startDate >= trip.startDate` and `stop.endDate <= trip.endDate`.
  - Stops are ordered sequentially (`stopOrder = countByTripId + 1`).
- **Cross-Region Support**: Destinations can belong to any State/UT region (e.g., Stop 1: Bengaluru/Karnataka, Stop 2: Ooty/Tamil Nadu, Stop 3: Jaipur/Rajasthan).

### 3. Geoapify POI Itinerary Persistence
- **DTO ([`AddDiscoveredActivityRequest.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/dto/AddDiscoveredActivityRequest.java))**:
  Exposes `externalId`, `name`, `description`, `category`, `latitude`, `longitude`, `address`, `imageUrl`, `scheduledDate`, `startTime`, `notes`, `customCost`.
- **Endpoint ([`TripActivityController.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/controller/TripActivityController.java))**:
  `POST /api/trips/{tripId}/stops/{stopId}/activities/discovered`
- **Service Logic ([`TripActivityService.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/service/TripActivityService.java))**:
  1. Validates trip ownership and stop belonging.
  2. Validates `scheduledDate` falls within `[stop.startDate, stop.endDate]`.
  3. Deduplication Check: Queries `ActivityRepository.findByDestinationIdAndSourceIgnoreCaseAndExternalId(destinationId, "GEOAPIFY", externalId)`.
  4. If existing `Activity` is found, reuses it.
  5. If not found, creates and saves new `Activity` entity:
     - `source` = `"GEOAPIFY"`
     - `externalId` = `request.getExternalId()`
     - `destination` = `stop.getDestination()`
     - `estimatedDurationMinutes` = `60`
     - `currency` = `"INR"`
  6. Creates and saves `TripActivity` linking the stop and activity with `activityOrder`.

---

## Error & Validation Mapping

- **Cross-Destination Activity Rejection**: Adding an activity/POI belonging to Jaipur to a Bengaluru stop throws `IllegalArgumentException`.
- **Date Range Violation**: Adding an activity scheduled outside `[stop.startDate, stop.endDate]` throws `IllegalArgumentException`.
- **Unauthorized Modification**: Attempting to alter stops/activities of a trip owned by another user throws `ResourceNotFoundException` (404/403).

---

## Database Migration Decision

- **Flyway Migration Required**: **NO**.
- All necessary columns (`source`, `external_id`, `latitude`, `longitude`, `destination_id`, `image_url`) already exist in the `activities` table.

---

## Test Suite & Verification Results

### 1. Automated Integration Tests ([`TripV2BackendIntegrationTest.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/test/java/com/globetrotter/TripV2BackendIntegrationTest.java))
- Total tests run (`mvn clean test`): **107 tests run, 0 failures, 0 errors** (`BUILD SUCCESS`).
- `TripV2BackendIntegrationTest` passed all 11 core V2 test scenarios:
  1. `test1_CreateTripWithoutBudget`
  2. `test2_3_CreateTripWithMultipleDestinationsAcrossStates`
  3. `test4_RejectStopOutsideTripDates`
  4. `test5_RejectInvalidDestination`
  5. `test6_AddCuratedActivityToMatchingDestination`
  6. `test7_RejectActivityBelongingToAnotherDestination`
  7. `test8_9_AddGeoapifyPoiToTrip`
  8. `test10_ReaddingSameExternalIdReusesActivity`
  9. `test11_GeoapifyActivityNotInCuratedEndpoint`
  10. `test12_RejectUnauthorizedTripModification`
  11. `test13_RejectGeoapifyActivityAdditionToCrossTripStop`

### 2. Frontend Verification
- `npm run lint` (`tsc --noEmit`): **Passed with 0 errors**.
- `npm run build` (`vite build`): **Built successfully in 2.21s**.

---

## Safety & Remote Verification
- Personal repository: `portfolio` $\rightarrow$ `https://github.com/Aditya240606/GlobeTrotter.git`
- Evaluation repository (`origin` $\rightarrow$ `https://github.com/Heet-2612/GlobeTrotter.git`): **UNTOUCHED**.
- No commit or push performed.
