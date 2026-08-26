# Phase 1C Implementation Notes — Activity / POI API Cleanup & Source Separation

## Overview & Goal

Phase 1C cleans up the Activity / POI API for GlobeTrotter V2, establishing strict source separation between **CURATED** activities, **LEGACY** activities, and future **GEOAPIFY** discovery results while preserving 100% backward compatibility for pre-existing V1 endpoints, user itineraries, and trip stops.

---

## Architectural Source Model

Activities are classified into three distinct source categories:
1. **`CURATED`**: High-quality, authentic hand-curated activities/POIs seeded directly from [`curated_destination_catalog.md`](file:///c:/VScode/GlobeTrotter_Hackathon/curated_destination_catalog.md).
2. **`LEGACY`**: Pre-existing V1 activities (803 total) retained to maintain backward compatibility for historical user trips and itinerary stops.
3. **`GEOAPIFY`**: Dynamic external POI discovery candidates (strictly out of scope for Phase 1C; reserved for Phase 1D).

---

## API Design & Endpoints

### 1. New V2 Curated Activity Endpoint
- **HTTP Method**: `GET`
- **Path**: `/api/destinations/{destinationId}/activities/curated`
- **Description**: Returns ONLY authentic curated activities (`source = 'CURATED'`) for the specified destination, ordered alphabetically by name.
- **Response**: `200 OK` with JSON array of `ActivityResponse` objects.
- **Error Behavior**:
  - Valid destination ID with 0 curated activities $\rightarrow$ Returns `200 OK` with empty array `[]`.
  - Invalid destination ID $\rightarrow$ Throws `ResourceNotFoundException` (`404 Not Found`).

### 2. Query Parameter Source Filtering
- **HTTP Method**: `GET`
- **Path**: `/api/activities?destinationId={id}&source=CURATED` (or `/api/activities?cityId={id}&source=CURATED`)
- **Description**: Supports filtering by `source` at the repository query level.

### 3. Preserved Backward-Compatible Endpoints
- **Path**: `GET /api/destinations/{destinationId}/activities` $\rightarrow$ Returns all activities (both CURATED and LEGACY) for maximum backward compatibility.
- **Path**: `GET /api/activities/{activityId}` $\rightarrow$ Preserved.
- **Path**: `GET /api/trips/{tripId}/stops/{stopId}/activities` $\rightarrow$ Preserved.

---

## Technical Changes Made

### 1. Repository Layer ([`ActivityRepository.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/repository/ActivityRepository.java))
- Updated `@Query` in `searchActivities(...)` to include repository-level filtering on `(:source IS NULL OR :source = '' OR LOWER(a.source) = LOWER(:source))`.
- Added repository method: `findByDestinationIdAndSourceIgnoreCaseOrderByNameAsc(Long destinationId, String source)`.

### 2. Service Layer ([`ActivityService.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/service/ActivityService.java))
- Injected `DestinationRepository` for destination validation.
- Added `getCuratedActivitiesForDestination(Long destinationId)` method. Validates destination existence before fetching curated activities.
- Updated `searchActivities(...)` to accept optional `source` parameter.

### 3. Controller Layer ([`DestinationController.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/controller/DestinationController.java) & [`ActivityController.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/controller/ActivityController.java))
- Added `@GetMapping("/{destinationId}/activities/curated")` to `DestinationController`.
- Added `source` and `destinationId` query parameter support to `ActivityController.searchActivities(...)`.

### 4. DTO & Frontend Types ([`ActivityResponse.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/main/java/com/globetrotter/dto/ActivityResponse.java), [`types.ts`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/types.ts), [`api.ts`](file:///c:/VScode/GlobeTrotter_Hackathon/frontend/src/services/api.ts))
- Exposed `source`, `externalId`, `latitude`, `longitude` in `ActivityResponse`.
- Added TypeScript types and helper functions (`getCuratedActivitiesByDestination`, `getActivitiesByDestination`) in frontend API service.

---

## Verification & Test Results

### 1. Automated Test Suite Execution
- Executed `mvn clean test`: **90 tests run, 0 failures, 0 errors** (`BUILD SUCCESS`).
- 4 new integration test cases added to [`ActivityAndTripActivityIntegrationTest.java`](file:///c:/VScode/GlobeTrotter_Hackathon/backend/src/test/java/com/globetrotter/ActivityAndTripActivityIntegrationTest.java):
  - `test18_GetCuratedActivitiesForDestinationReturnsOnlyCurated`: Verifies curated endpoint returns ONLY `CURATED` activities, while backward-compatible endpoint returns all.
  - `test19_GetCuratedActivitiesForDestinationWithNoCuratedReturnsEmptyList`: Verifies `200 OK` with `[]` for valid destination without curated activities.
  - `test20_GetCuratedActivitiesForInvalidDestinationReturns404`: Verifies `404 Not Found` for invalid destination ID.
  - `test21_SearchActivitiesBySourceParameter`: Verifies `GET /api/activities?destinationId={id}&source=CURATED`.

### 2. Frontend Verification
- `npm run lint` (`tsc --noEmit`): **Passed with 0 errors**.
- `npm run build` (`vite build`): **Built successfully in 7.07s**.

### 3. Live REST API Smoke Test (PostgreSQL 18.4 + Spring Boot)
- `GET /api/destinations/1/activities/curated` $\rightarrow$ Returns 4 curated Jaipur activities with `source: CURATED`.
- `GET /api/destinations/1/activities` $\rightarrow$ Returns 10 Jaipur activities (4 CURATED + 6 LEGACY).
- `GET /api/activities?destinationId=1&source=CURATED` $\rightarrow$ Returns 4 curated Jaipur activities.
- `GET /api/destinations/200/activities/curated` $\rightarrow$ Returns `[]` (`200 OK`).
- `GET /api/destinations/999999/activities/curated` $\rightarrow$ Returns `404 Not Found`.

---

## Database Migration Status
- **Flyway Migration Required**: **NO**.
- The existing V16 schema already contains `source`, `external_id`, `latitude`, and `longitude`.

---

## Safety & Remote Verification
- Personal repository: `portfolio` $\rightarrow$ `https://github.com/Aditya240606/GlobeTrotter.git`
- Evaluation repository (`origin` $\rightarrow$ `https://github.com/Heet-2612/GlobeTrotter.git`): **UNTOUCHED**.
- No commit or push performed.
