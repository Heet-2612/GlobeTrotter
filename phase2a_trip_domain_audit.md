# Phase 2A — Trip Domain Audit & V2 Multi-Destination Flow Design

## Executive Summary

Phase 2A evaluates the GlobeTrotter V1 trip planning domain to transition into the **GlobeTrotter V2 Multi-Destination Itinerary Planner**. 

### Key Architectural Finding
**No database migration is required.** The underlying database schema—composed of `trips`, `trip_stops`, `trip_activities`, `destinations`, and `activities`—already natively supports multi-destination trips spanning across multiple States/UTs via 1:N `TripStop` relations per trip.

---

## 1. Current Trip Domain Architecture Audit

### 1.1 `Trip` Entity (`trips` table)
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `user_id` (`users.id`, non-null)
- **Attributes**: `name` (varchar 150), `description` (text), `start_date` (date, non-null), `end_date` (date, non-null), `cover_photo` (varchar 500), `budget` (numeric 12,2, nullable), `is_public` (boolean, default false), `share_token` (varchar 100, unique), `created_at`, `updated_at`.
- **Role**: Serves as the top-level container for a travel itinerary with an absolute start and end date boundary.

### 1.2 `TripStop` Entity (`trip_stops` table)
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `trip_id` (`trips.id`, non-null), `destination_id` (`destinations.id`, non-null)
- **Attributes**: `stop_order` (int, non-null), `start_date` (date, non-null), `end_date` (date, non-null), `notes` (text).
- **Compatibility Layer**: Contains `@Deprecated getCity()` / `setCity()` returning `Destination` entity for V1 backward compatibility.
- **Multi-Destination Capability**: **100% Native**. A `Trip` can have an arbitrary number of `TripStop` entries ordered by `stop_order`. Each `TripStop` references any valid `Destination` regardless of region/state.

### 1.3 `TripActivity` Entity (`trip_activities` table)
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `trip_stop_id` (`trip_stops.id`, non-null), `activity_id` (`activities.id`, non-null)
- **Attributes**: `scheduled_date` (date, non-null), `start_time` (time, nullable), `notes` (text), `custom_cost` (numeric 10,2, nullable), `activity_order` (int, non-null).
- **Validation Rules**:
  - `activity.destination_id` must match `trip_stop.destination_id`.
  - `scheduled_date` must fall within `[trip_stop.start_date, trip_stop.end_date]`.

### 1.4 Current Date & Itinerary Implementation
- **Trip Level**: Strict range `[startDate, endDate]`.
- **Stop Level**: Range `[startDate, endDate]` must fall within `[trip.startDate, trip.endDate]`.
- **Activity Level**: `scheduledDate` must fall within `[stop.startDate, stop.endDate]`.
- **Ordering**: Stops are ordered by `stopOrder`. Activities are ordered by `activityOrder` within each stop.

### 1.5 Current Budget Implementation
- `trip.budget`: Manual target budget set by user (optional/nullable).
- `trip_activity.customCost` / `activity.estimatedCost`: Itemized activity cost.
- `BudgetService`: Calculates total activity costs, category breakdown (`CULTURE`, `FOOD`, etc.), remaining budget, and percentage used.
- **V2 Change**: Target budget input is removed from the initial trip creation wizard. The `budget` database column remains nullable to maintain 100% backward compatibility.

---

## 2. Classification of Components

| Component | Status | Rationale |
| :--- | :--- | :--- |
| `Trip` Entity & Repo | **KEEP** | Core top-level trip model is sound and complete. |
| `TripStop` Entity & Repo | **KEEP** | Natively supports multi-destination ordering (`stopOrder`). |
| `TripActivity` Entity & Repo | **KEEP** | Natively supports activity scheduling per stop (`activityOrder`). |
| `TripSharingService` | **KEEP** | Public sharing via UUID tokens works seamlessly. |
| Authentication & Ownership | **KEEP** | Strict user ownership checks (`findByIdAndUserId`) are preserved. |
| Trip Creation Wizard | **MODIFY** | Simplify: require only Name, Start Date, End Date. Remove mandatory budget. |
| Destination Selection | **MODIFY** | Upgrade from single city pick to multi-destination picker grouped by State/UT. |
| Activity Selection | **MODIFY** | Support both `CURATED` activities and live `GEOAPIFY` place candidates. |
| Automatic Budget Prompt | **REMOVE FROM V2 CREATION** | Decouple budget prompting from initial trip setup. |
| Expenses & Tickets | **FUTURE** | Extensible via `TripActivity` and future expense tables. |

---

## 3. V2 Multi-Destination Architecture & Data Flow

```
1. User enters Trip Name, Start Date, End Date
   ↓
2. POST /api/trips (Creates Trip container)
   ↓
3. User selects State/UT (e.g. Karnataka) -> Filter Destinations
   ↓
4. User checks Destinations (e.g. Bengaluru, Mysuru, Hampi)
   ↓
5. For each selected Destination:
   POST /api/trips/{tripId}/stops (Creates ordered TripStops)
   ↓
6. User browses Destination Activities:
   ├── GET /api/destinations/{id}/activities/curated (Official Highlights)
   └── GET /api/destinations/{id}/discover (Live Geoapify Search)
   ↓
7. User selects Activity / Geoapify Place
   ↓
8. POST /api/trips/{tripId}/stops/{stopId}/activities (Adds itemized TripActivity)
   ↓
9. Day-by-Day Timeline View & Drag-and-Drop Reordering
```

---

## 4. V2 API Contract Mapping

| Purpose | Endpoint | Method | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Create Trip** | `/api/trips` | `POST` | **MODIFY** | Body: `name`, `startDate`, `endDate`, optional `description`. (`budget` optional). |
| **Get User Trips** | `/api/trips` | `GET` | **KEEP** | Returns list of user's trips. |
| **Get Trip Details** | `/api/trips/{id}` | `GET` | **KEEP** | Returns trip header details. |
| **Add Trip Stop** | `/api/trips/{tripId}/stops` | `POST` | **KEEP** | Body: `destinationId`, `startDate`, `endDate`, optional `notes`. |
| **Get Trip Stops** | `/api/trips/{tripId}/stops` | `GET` | **KEEP** | Returns stops ordered by `stopOrder`. |
| **Delete Trip Stop** | `/api/trips/{tripId}/stops/{stopId}` | `DELETE` | **KEEP** | Deletes stop and cascades activities. |
| **Reorder Stops** | `/api/trips/{tripId}/stops/reorder` | `PUT` | **KEEP** | Body: `stopIds` ordered list. |
| **Get Curated Activities** | `/api/destinations/{id}/activities/curated` | `GET` | **KEEP** | Returns official curated POIs (`source = CURATED`). |
| **Discover Live Places** | `/api/destinations/{id}/discover` | `GET` | **KEEP** | Returns Geoapify live search (`source = GEOAPIFY`). |
| **Add Activity to Stop** | `/api/trips/{tripId}/stops/{stopId}/activities` | `POST` | **MODIFY** | Supports curated `activityId` or Geoapify place payload. |
| **Reorder Activities** | `/api/trips/{tripId}/stops/{stopId}/activities/reorder` | `PUT` | **KEEP** | Body: `activityIds` ordered list. |
| **Share Trip** | `/api/trips/{tripId}/share` | `PUT` | **KEEP** | Updates public sharing status and token. |

---

## 5. Geoapify POI Persistence Strategy

To add a dynamic Geoapify result (`source = 'GEOAPIFY'`) to `TripActivity` without violating the non-null `activity_id` foreign key constraint:
1. When user selects a discovered Geoapify POI, the backend will check if an `Activity` entry already exists with `externalId = geoapify_place_id`.
2. If not present, the backend creates an on-the-fly `Activity` entity:
   - `name`: Geoapify place name
   - `category`: Mapped category (`CULTURE`, `FOOD`, `SIGHTSEEING`, etc.)
   - `destination`: Associated `Destination`
   - `source`: `"GEOAPIFY"`
   - `externalId`: Geoapify `place_id`
   - `latitude` / `longitude`: Coordinates
3. The newly persisted or retrieved `Activity` is linked to `TripActivity.activity_id`.

---

## 6. Frontend Flow & Screen Design

### Screen 1: Create Trip Modal / Page
- **Inputs**: Trip Name (e.g., "Grand Rajasthan & Karnataka Tour"), Start Date, End Date.
- **Action**: On submit, calls `POST /api/trips` and navigates to Multi-Destination Setup.

### Screen 2: State / UT Region Filter & Selector
- Grid of 29 States & Union Territories (e.g., Rajasthan, Karnataka, Tamil Nadu, Kerala, Goa).
- Shows destination count badge per State/UT (e.g. Karnataka: 5 destinations, Rajasthan: 6 destinations).

### Screen 3: Multi-Destination Picker
- Displays curated destination cards under chosen State/UT with checkboxes.
- Multi-select allowed across multiple States/UTs.
- Allows instant search across all 137 curated destinations.

### Screen 4: Date Range Assigner per Stop
- Renders selected destinations in stop order.
- Prompts user to assign `startDate` and `endDate` for each destination within overall trip dates.

### Screen 5: Itinerary Builder & Live Activity Discovery
- Displays stop tabs or accordion per destination.
- Tab 1: **Curated Highlights** (548 authentic POIs).
- Tab 2: **Discover More (Geoapify)** live place search with category filters (`Food`, `Culture`, `Parks`, `Shopping`).
- "Add to Itinerary" modal to pick date, time, and notes.

### Screen 6: Day-by-Day Timeline View
- Organizes scheduled activities by calendar day.
- Supports drag-and-drop or button reordering, custom notes, and cost customization.

---

## 7. Future Extension Points (Post Phase 2)
- **Accommodations / Hotel Bookings**: Can be attached to a `TripStop` with check-in/check-out dates.
- **Transit & Inter-City Travel**: Can link adjacent `TripStops` with train/flight/bus details.
- **Split Expense Tracking**: `TripActivity` custom cost can extend to store multi-user expense allocations.
- **Attachments & Vouchers**: PDFs/Images attached to specific `TripActivity` items.

---

## 8. Database Migration & Backward Compatibility Decision

- **Flyway Migration Required**: **NO**.
- **Backward Compatibility**: **100% Preserved**. Existing V1 single-city trips in the PostgreSQL database remain fully valid and load without errors. All V1 API endpoints (`/api/cities`, `/api/trips`, `/api/trip-stops`) remain operational.

---

## 9. Major Risks & Mitigation

1. **Date Out of Range**: Stop dates outside trip dates, or activity dates outside stop dates.
   - *Mitigation*: Strict date bounds checking in service layer and date picker max/min constraints in UI.
2. **Geoapify Entity Duplication**: Multiple users adding the same Geoapify POI creating duplicate `Activity` rows.
   - *Mitigation*: Lookup existing `Activity` by `externalId` before creating a new candidate row.
3. **Overlapping Stop Dates**: Users scheduling overlapping destination stays.
   - *Mitigation*: Provide visual date timeline overlap indicators in frontend UI.

---

## 10. Recommended Implementation Order (Phase 2B & Beyond)

1. **Phase 2B-1**: Update `TripService` creation contract (optional budget) and create `TripActivityService` Geoapify persistence helper.
2. **Phase 2B-2**: Build V2 Frontend Multi-Destination Wizard (State/UT selector $\rightarrow$ Destination multi-picker $\rightarrow$ Stop date assigner).
3. **Phase 2C**: Integrate Geoapify "Discover More" drawer directly into `ItineraryBuilderPage` with live itinerary insertion.
4. **Phase 2D**: Full end-to-end multi-destination trip creation and timeline verification.
