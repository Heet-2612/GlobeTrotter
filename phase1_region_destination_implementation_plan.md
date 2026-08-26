# Phase 1: Region + Destination Domain Foundation â€” Technical Implementation Plan

> **Document Status:** Authoritative Implementation Plan (Planning Phase Only)  
> **Repository Scope:** Aditya240606/GlobeTrotter (Personal Portfolio Repository)  
> **Safety Guarantee:** Zero database changes executed, zero code modifications made, zero migrations applied, zero frontend files changed.

---

## 1. Current V1 Architecture Overview

The V1 system operates on a flat two-tier entity model:

`
[City Entity] (200 rows)
     â”‚
     â””â”€â”€ 1:N â”€â”€> [Activity Entity] (~796 rows)
                     â”‚
                     â””â”€â”€ 1:N â”€â”€> [TripActivity Entity]
`

- cities: Stores basic city data (id, 
ame, country, egion, cost_index, popularity, image_url, currency_code, currency_symbol). Note: egion is stored as a plain text string literal (VARCHAR(100)).
- ctivities: Stores POI definitions (id, city_id FK, 
ame, description, category, estimated_duration_minutes, estimated_cost, currency, image_url, google_place_id).
- 	rip_stops: Links trips to cities (id, 	rip_id FK, city_id FK, stop_order, start_date, end_date, 
otes).

---

## 2. Target V2 Architecture Overview

The Phase 1 foundation evolves the core domain model into a structured 3-tier hierarchy:

```
[Region Entity] (e.g. Karnataka, Rajasthan, Kerala, Maharashtra - 29 State/UT Regions)
    │
    └── 1:N ──> [Destination Entity] (137 Curated Destinations: Jaipur, Munnar, Andaman Islands)
                    ├── 1:N ──> [DestinationAlias Entity] (e.g. Bangalore -> Bengaluru)
                    │
                    └── 1:N ──> [Activity Entity] (Curated POIs + Geoapify Discovery)
```

- TripStop connects directly to Destination (destination_id FK).
- Region acts as an administrative State / Union Territory organizational container (29 State/UT Regions).
- DestinationAlias enables canonical name resolution without duplicating destination records.

---

## 3. V1 â†’ V2 Gap Analysis

| Feature Domain | Current V1 System | Target V2 Phase 1 Foundation |
| :--- | :--- | :--- |
| **Location Entity** | City entity | Evolved Destination entity |
| **Non-City Locations** | Forced into "City" schema | Native DestinationType enum (CITY, ISLAND, NATIONAL_PARK, HILL_STATION, HERITAGE_SITE, etc.) |
| **Region Concept** | Plain text String literal | First-class Region entity (egions table) |
| **Alternate Names** | Not supported (Exact string match) | Dedicated destination_aliases table (DestinationAlias entity) |
| **Source Tracking** | Implicit | Explicit DestinationSource enum (CURATED, GEOAPIFY, USER_CREATED) |
| **Trip Stop Link** | 	rip_stops.city_id FK | 	rip_stops.destination_id FK (Renamed/Aliased column) |

---

## 4. Current Database Schema Relevant to Phase 1

### Current cities Table Schema (V1, V3, V8, V9):
`sql
CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    cost_index NUMERIC(5,2) NOT NULL,
    popularity INT NOT NULL,
    image_url VARCHAR(500),
    currency_code VARCHAR(10) NOT NULL DEFAULT 'INR',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT 'â‚¹'
);
`

### Current ctivities Table Foreign Key:
`sql
ALTER TABLE activities ADD CONSTRAINT fk_activities_city FOREIGN KEY (city_id) REFERENCES cities(id);
`

### Current 	rip_stops Table Foreign Key:
`sql
ALTER TABLE trip_stops ADD CONSTRAINT fk_trip_stops_city FOREIGN KEY (city_id) REFERENCES cities(id);
`

---

## 5. Proposed Region Schema (egions Table)

`sql
CREATE TABLE regions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    canonical_name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_canonical_name ON regions(canonical_name);
`

---

## 6. Proposed Destination Schema (destinations Table)

Evolving cities table into destinations via Flyway migration:

`sql
ALTER TABLE cities RENAME TO destinations;

ALTER TABLE destinations 
    ADD COLUMN region_id BIGINT REFERENCES regions(id),
    ADD COLUMN canonical_name VARCHAR(100),
    ADD COLUMN destination_type VARCHAR(50) NOT NULL DEFAULT 'CITY',
    ADD COLUMN source VARCHAR(30) NOT NULL DEFAULT 'CURATED',
    ADD COLUMN is_curated BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN latitude NUMERIC(10,7),
    ADD COLUMN longitude NUMERIC(10,7);

CREATE INDEX idx_destinations_canonical_name ON destinations(canonical_name);
CREATE INDEX idx_destinations_region_id ON destinations(region_id);
CREATE INDEX idx_destinations_type ON destinations(destination_type);
`

---

## 7. Destination Types (DestinationType Enum)

`java
public enum DestinationType {
    CITY,
    TOWN,
    REGION_CLUSTER,
    ISLAND_ARCHIPELAGO,
    NATIONAL_PARK,
    HERITAGE_SITE,
    PILGRIMAGE,
    HILL_STATION,
    BEACH,
    CIRCUIT,
    OTHER
}
`

---

## 8. Destination Source Model (DestinationSource Enum)

`java
public enum DestinationSource {
    CURATED,
    GEOAPIFY,
    USER_CREATED
}
`

---

## 9. Destination Alias Model (destination_aliases Table)

`sql
CREATE TABLE destination_aliases (
    id BIGSERIAL PRIMARY KEY,
    destination_id BIGINT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    alias_name VARCHAR(100) NOT NULL,
    canonical_alias VARCHAR(100) NOT NULL
);

CREATE INDEX idx_destination_aliases_name ON destination_aliases(LOWER(alias_name));
CREATE INDEX idx_destination_aliases_dest_id ON destination_aliases(destination_id);
`

---

## 10. Activity â†’ Destination Relationship

`sql
ALTER TABLE activities RENAME COLUMN city_id TO destination_id;
-- FK constraint fk_activities_city is preserved or updated to fk_activities_destination
`

`java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "destination_id", nullable = false)
private Destination destination;
`

---

## 11. TripStop â†’ Destination Relationship

`sql
ALTER TABLE trip_stops RENAME COLUMN city_id TO destination_id;
-- FK constraint fk_trip_stops_city is preserved or updated to fk_trip_stops_destination
`

`java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "destination_id", nullable = false)
private Destination destination;
`

---

## 12. Existing City Migration Strategy (Option A: Evolve Table)

Option A is selected based on codebase analysis:
1. ALTER TABLE cities RENAME TO destinations; preserves all existing BIGSERIAL ids (1 to 200).
2. Existing primary keys remain unchanged, meaning zero foreign key corruption in 	rip_stops or ctivities.
3. Create a backward-compatible database view cities for legacy SQL queries if needed:
   `sql
   CREATE VIEW cities AS 
   SELECT id, name, country, canonical_name, cost_index, popularity, image_url, currency_code, currency_symbol 
   FROM destinations;
   `

---

## 13. Data Preservation Strategy

- **User Trips & TripStops**: All 100% preserved. 	rip_stops.destination_id retains the exact integer IDs matching former city_ids.
- **Existing Activities**: All ~796 activities retain their existing integer IDs and link to destination_id.
- **Existing Seed Data**: V8 seed data remains intact in destinations with legacy region names converted to egion_id foreign keys.

---

## 14. Existing Data Migration Strategy

SQL migration logic inside Flyway migration:
1. Seed 12 primary regions into egions (*Rajasthan, Kerala, Himalayas, Western Ghats, South India Temples, North India Circuit, East & Northeast, Central India, Goa & West Coast, Andaman & Nicobar, Lakshadweep, Islands*).
2. Populates destinations.region_id by matching existing cities.region string text to egions.id.
3. Populates destinations.canonical_name via LOWER(TRIM(name)).
4. Seeds 9 initial canonical name aliases into destination_aliases:
   - Bangalore $\rightarrow$ Bengaluru
   - Mysore $\rightarrow$ Mysuru
   - Alleppey $\rightarrow$ Alappuzha
   - Pondicherry $\rightarrow$ Puducherry
   - Trivandrum $\rightarrow$ Thiruvananthapuram
   - Vizag $\rightarrow$ Visakhapatnam
   - Rameshwaram $\rightarrow$ Rameswaram
   - Kohlapur $\rightarrow$ Kolhapur
   - Karjad $\rightarrow$ Karjat

---

## 15. Flyway Migration Sequence (Phase 1)

- **V12__create_regions_and_aliases.sql**:
  - CREATE TABLE regions ...
  - CREATE TABLE destination_aliases ...
  - INSERT INTO regions ... (Seed 12 core regions)
- **V13__evolve_cities_to_destinations.sql**:
  - ALTER TABLE cities RENAME TO destinations;
  - ALTER TABLE activities RENAME COLUMN city_id TO destination_id;
  - ALTER TABLE trip_stops RENAME COLUMN city_id TO destination_id;
  - ALTER TABLE destinations ADD COLUMN ...
  - Update egion_id references and canonical_name values.

---

## 16. Backend Entity Changes

| Entity File | Proposed Modifications |
| :--- | :--- |
| **Region.java** *(NEW)* | @Entity @Table(name="regions") with fields id, 
ame, canonicalName, country, description, imageUrl. |
| **Destination.java** *(Evolved)* | Rename class City $\rightarrow$ Destination @Table(name="destinations"). Add egion, canonicalName, destinationType, source, isCurated, latitude, longitude, liases. |
| **DestinationAlias.java** *(NEW)*| @Entity @Table(name="destination_aliases") with id, destination, liasName, canonicalAlias. |
| **City.java** *(Deprecated)* | Keep @Deprecated class City extending Destination or aliasing it for backward-compatibility during phase transition. |
| **Activity.java** | Change private City city $\rightarrow$ private Destination destination. Update getter/setter names. |
| **TripStop.java** | Change private City city $\rightarrow$ private Destination destination. Update getter/setter names. |

---

## 17. Repository Changes

- **RegionRepository.java** *(NEW)*: JpaRepository<Region, Long>, indByCanonicalName(String name).
- **DestinationRepository.java** *(Evolved from CityRepository)*:
  - Add query to search across d.name, d.canonicalName, and joined destination_aliases.aliasName:
  `java
  @Query("SELECT DISTINCT d FROM Destination d LEFT JOIN d.aliases a WHERE " +
         "(:search IS NULL OR :search = '' OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.aliasName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
         "(:regionId IS NULL OR d.region.id = :regionId) " +
         "ORDER BY d.popularity DESC, d.name ASC")
  List<Destination> searchDestinations(@Param("search") String search, @Param("regionId") Long regionId);
  `
- **DestinationAliasRepository.java** *(NEW)*: JpaRepository<DestinationAlias, Long>.

---

## 18. Service Changes

- **RegionService.java** *(NEW)*: Methods getAllRegions(), getRegionByCanonicalName(String name).
- **DestinationService.java** *(Evolved from CityService)*:
  - Methods searchDestinations(String search, Long regionId, String country), getDestinationById(Long id).
- **CityService.java** *(Deprecated Wrapper)*: Delegates calls to DestinationService to maintain 100% backward compatibility for legacy callers.
- **TripStopService.java**: Updated to resolve destinationRepository.findById(request.getDestinationId()) instead of cityRepository.

---

## 19. Controller / API Changes

| Endpoint | Method | Status | Notes |
| :--- | :---: | :---: | :--- |
| /api/regions | GET | **NEW** | List all regions / get region details |
| /api/destinations | GET | **NEW** | Primary destination search endpoint (supports search, egionId, country) |
| /api/destinations/{id} | GET | **NEW** | Get destination details by ID |
| /api/cities | GET | **DEPRECATED ALIAS** | Delegates to DestinationService.searchDestinations() (zero frontend break) |
| /api/cities/{id} | GET | **DEPRECATED ALIAS** | Delegates to DestinationService.getDestinationById() |
| /api/trips/{id}/stops | POST | **UPDATED** | Accepts destinationId (or backward-compatible cityId) |

---

## 20. DTO Changes

- **RegionResponse.java** *(NEW)*: id, 
ame, canonicalName, country, description, imageUrl.
- **DestinationResponse.java** *(NEW / Evolved)*: id, 
ame, canonicalName, country, egionId, egionName, destinationType, source, isCurated, costIndex, popularity, imageUrl, currencyCode, currencySymbol, liases.
- **CityResponse.java** *(Deprecated Alias)*: Maps directly from DestinationResponse for zero-break JSON compatibility (id, 
ame, country, egion, imageUrl, etc.).
- **CreateTripStopRequest.java**: Adds destinationId field while keeping getCityId() getter fallback.

---

## 21. Validation Changes

- Destination creation/update validation: canonicalName must be sanitized lowercase with hyphens.
- CreateTripStopRequest: Ensures either destinationId or cityId is non-null.

---

## 22. Frontend TypeScript Changes (	ypes.ts)

`	ypescript
export type DestinationType = 
  | 'CITY' | 'TOWN' | 'REGION_CLUSTER' | 'ISLAND_ARCHIPELAGO' 
  | 'NATIONAL_PARK' | 'HERITAGE_SITE' | 'PILGRIMAGE' | 'HILL_STATION' 
  | 'BEACH' | 'CIRCUIT' | 'OTHER';

export type DestinationSource = 'CURATED' | 'GEOAPIFY' | 'USER_CREATED';

export interface RegionResponse {
  id: number;
  name: string;
  canonicalName: string;
  country: string;
  description?: string;
  imageUrl?: string;
}

export interface DestinationResponse {
  id: number;
  name: string;
  canonicalName: string;
  country: string;
  regionId?: number;
  regionName?: string;
  destinationType: DestinationType;
  source: DestinationSource;
  isCurated: boolean;
  costIndex?: number;
  popularity?: number;
  imageUrl?: string;
  currencyCode?: string;
  currencySymbol?: string;
  aliases?: string[];
}

// Alias for backward compatibility
export type CityResponse = DestinationResponse;
`

---

## 23. Frontend Component Changes (Phase 1 Compatibility)

- pi.ts: Add getRegions(), getDestinations(), getDestinationById(). Keep getCities() as alias.
- CitySearchPage.tsx: Internal updates to use DestinationResponse while maintaining UX.
- CreateTripPage.tsx: Destination selector binds to destinationId.
- imageUtils.ts: Rename/alias getCityImageUrl $\rightarrow$ getDestinationImageUrl.

---

## 24. Trip Creation Changes Required Later (Phase 4 UX)

*Explicitly boundary-scoped for Phase 4:*
- Introduce "Explore by Region" cards in trip creation modal.
- Multi-destination selector drawer.

---

## 25. Search Changes Required Later (Phase 3 & 4)

*Explicitly boundary-scoped for Phase 3 & 4:*
- Unified search dropdown combining Curated Destinations, Regions, and Geoapify Places.

---

## 26. Geoapify Integration Impact

- Zero disruption to GooglePlacesService / PlaceController.
- PlaceResponse remains independent and can link to Destination in Phase 3.

---

## 27. Image System Impact

- cityImages.ts mapped keys update to canonical destination names (engaluru, lappuzha, puducherry).
- Fallback handlers (onCityImageError) updated to handle destination images.

---

## 28. API Compatibility Strategy

1. Maintain /api/cities routes in CityController forwarding to DestinationService.
2. JSON field outputs for /api/cities preserve egion as string (egionName) so older frontend components render seamlessly without refactoring.

---

## 29. Risks and Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :---: | :--- |
| **TripStop FK Constraint Failure** | HIGH | Perform table rename and column update inside a single Flyway transaction. |
| **Frontend Breakage on /api/cities** | MEDIUM | Retain CityController as an API proxy delegate during Phase 1 transition. |
| **Search Alias Performance** | LOW | Add database index idx_destination_aliases_name on LOWER(alias_name). |

---

## 30. Testing Strategy

1. **Flyway Migration Unit Test**: Verify clean application of V12 and V13 against test PostgreSQL instance.
2. **API Backward Compatibility Test**: Verify /api/cities returns valid JSON matching legacy CityResponse format.
3. **Trip Creation Integration Test**: Create a multi-stop trip using destinationId and verify stops load in ItineraryViewPage.

---

## 31. Rollback Strategy

Flyway undo migration U13__revert_destinations_to_cities.sql:
`sql
ALTER TABLE destinations RENAME TO cities;
ALTER TABLE activities RENAME COLUMN destination_id TO city_id;
ALTER TABLE trip_stops RENAME COLUMN destination_id TO city_id;
`

---

## 32. Exact Implementation Order

1. **Step 1**: Create Flyway migrations V12__create_regions_and_aliases.sql and V13__evolve_cities_to_destinations.sql.
2. **Step 2**: Add Java entities Region, DestinationAlias, and update Destination, Activity, TripStop.
3. **Step 3**: Add Repositories RegionRepository, DestinationAliasRepository, update DestinationRepository.
4. **Step 4**: Update Service layer (RegionService, DestinationService, TripStopService).
5. **Step 5**: Update Controller layer (RegionController, DestinationController, CityController proxy).
6. **Step 6**: Update Frontend TypeScript definitions (	ypes.ts) and API service (pi.ts).
7. **Step 7**: Verify build (mvn clean compile, 
pm run build) and integration flow.

---

### Phase Boundary Confirmation
- **Phase 1 (This Plan)**: Region + Destination domain foundation, table rename, alias support, API compatibility.
- **Phase 2 (Next)**: Seeding 137 target curated destinations and 4-5 activities per destination.
- **Phase 3**: Geoapify unified discovery integration.
- **Phase 4**: Trip creation UX redesign ("Explore by Region").
- **Phase 5**: Itinerary & timeline drag-and-drop improvements.
- **Phase 6**: Future travel management (Hotels, tickets, expenses).

---

### Confirmation & Safety Status
- âœ… **Zero database mutations executed.**
- âœ… **Zero Flyway migration files created.**
- âœ… **Zero Java entity or repository changes made.**
- âœ… **Zero frontend code modified.**
- âœ… **Standing by for your review and approval.**
