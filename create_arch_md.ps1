$md = @"
# GlobeTrotter Region → Destination → Activity Architecture & Implementation Plan (Phase 3)

> **Document Status:** Portfolio-Grade Architectural Specification & Implementation Plan  
> **Scope:** Transitioning GlobeTrotter from a flat prototype "City $\rightarrow$ Activity" schema into a rich, scalable domain model supporting **Region $\rightarrow$ Destination $\rightarrow$ Activity / POI**, source attribution, canonical name aliases, and multi-tier curated catalogs.  
> **Safety Guarantee:** Zero database changes executed, zero code modifications made, zero migrations applied, zero frontend files changed.

---

## 1. Current Architecture Overview

In the existing implementation (v1.0 / Flyway `V8`), the system operates on a flat two-tier model:

```
[City Table] (200 records)
     │
     └── 1:N ──> [Activities Table] (~796 records)
                     │
                     └── 1:N ──> [Trip Activities Table]
```

### Key Entities & Database Schema:
- `cities`: Stores basic location properties (`id`, `name`, `country`, `region`, `cost_index`, `popularity`, `image_url`, `currency_code`, `currency_symbol`). Note that `region` is currently stored as a plain text `VARCHAR(100)` column.
- `activities`: Foreign key `city_id` references `cities.id`.
- `trip_stops`: Foreign key `city_id` references `cities.id`.
- `trip_activities`: Foreign key `activity_id` references `activities.id`.

---

## 2. Problems with the Current "City → Activity" Model

1. **Category Confusion (City vs Non-City Destinations)**:
   - Major travel destinations like **Ladakh**, **Andaman Islands**, **Spiti Valley**, **Rann of Kutch**, **Jim Corbett**, and **Valley of Flowers** are NOT cities. Forcing them into a "City" schema causes semantic mismatches in UI display, search, and maps.
2. **Lack of First-Class Region Concept**:
   - `region` is just a string literal (`'North India'`, `'South India'`, `'West India'`). The system cannot support regional landing pages or regional trip planning (e.g., "Explore Kerala", "Explore Rajasthan").
3. **Duplicate & Fragmented Locations**:
   - Multi-island or multi-town locations (e.g. `Port Blair`, `Havelock Island`, `Neil Island`) are stored as separate city rows, fragmenting itineraries instead of grouping them under a unified `Andaman Islands` destination.
4. **No Alias / Alternate Name Handling**:
   - `Bangalore` vs `Bengaluru`, `Alleppey` vs `Alappuzha`, `Pondicherry` vs `Puducherry` require either duplicating database rows or risking search failures when users search for legacy or colloquial names.
5. **No Source Attribution**:
   - System cannot distinguish between curated catalog items, user-created custom spots, and dynamically fetched Geoapify POIs.

---

## 3. Proposed Target Architecture

The new architecture introduces a domain model:

```
[Countries] (Optional / System Constant)
    │
    └── 1:N ──> [Regions] (e.g., Kerala, Rajasthan, Ladakh, Western Ghats)
                    │
                    └── 1:N ──> [Destinations] (e.g., Jaipur, Munnar, Andaman Islands)
                                    ├── 1:N ──> [Destination Aliases] (e.g., Alleppey, Bangalore)
                                    │
                                    └── 1:N ──> [Activities / POIs] (e.g., Hawa Mahal, Tea Museum)
```

---

## 4. Text-Based ER Relationship Diagram

```
+--------------------------------+       +-----------------------------------+
|            regions             |       |           destinations            |
+--------------------------------+       +-----------------------------------+
| id (PK, BIGSERIAL)             |1     *| id (PK, BIGSERIAL)                |
| name (VARCHAR(100))            |<------| region_id (FK -> regions.id)      |
| canonical_name (VARCHAR(100))  |       | name (VARCHAR(100))               |
| country (VARCHAR(100))         |       | canonical_name (VARCHAR(100))     |
| description (TEXT)             |       | country (VARCHAR(100))            |
| image_url (VARCHAR(500))       |       | destination_type (VARCHAR(50))    |
| created_at (TIMESTAMP)         |       | source (VARCHAR(30))              |
+--------------------------------+       | is_curated (BOOLEAN)              |
                                         | popularity (INT)                  |
                                         | cost_index (NUMERIC(5,2))         |
                                         | currency_code (VARCHAR(10))       |
                                         | currency_symbol (VARCHAR(10))     |
                                         | image_url (VARCHAR(500))          |
                                         | latitude (NUMERIC(10,7))          |
                                         | longitude (NUMERIC(10,7))         |
                                         +-----------------------------------+
                                           │               │
                                          1│              1│
                                           │*              │*
             +-----------------------------+               +----------------------------+
             |     destination_aliases     |               |         activities         |
             +-----------------------------+               +----------------------------+
             | id (PK, BIGSERIAL)          |               | id (PK, BIGSERIAL)         |
             | destination_id (FK)         |               | destination_id (FK)        |
             | alias_name (VARCHAR(100))   |               | name (VARCHAR(150))        |
             +-----------------------------+               | description (TEXT)         |
                                                           | category (VARCHAR(50))     |
                                                           | duration_minutes (INT)     |
                                                           | estimated_cost (NUMERIC)   |
                                                           | google_place_id (VARCHAR)  |
                                                           | source (VARCHAR(30))       |
                                                           +----------------------------+
                                                                          │
                                                                         1│
                                                                          │*
                                                           +----------------------------+
                                                           |      trip_activities       |
                                                           +----------------------------+
```

---

## 5. Entity Designs

### A. Region Entity (`regions` table)
```java
@Entity
@Table(name = "regions")
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;               // e.g. "Kerala", "Rajasthan", "Himalayas"

    @Column(name = "canonical_name", nullable = false, length = 100, unique = true)
    private String canonicalName;      // e.g. "kerala", "rajasthan"

    @Column(nullable = false, length = 100)
    private String country = "India";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}
```

### B. Destination Entity (`destinations` table — Evolved from `cities`)
```java
@Entity
@Table(name = "destinations")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @Column(nullable = false, length = 100)
    private String name;               // e.g. "Bengaluru", "Andaman Islands"

    @Column(name = "canonical_name", nullable = false, length = 100)
    private String canonicalName;      // e.g. "bengaluru", "andaman_islands"

    @Column(nullable = false, length = 100)
    private String country = "India";

    @Enumerated(EnumType.STRING)
    @Column(name = "destination_type", nullable = false, length = 50)
    private DestinationType destinationType = DestinationType.CITY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DestinationSource source = DestinationSource.CURATED;

    @Column(name = "is_curated", nullable = false)
    private Boolean isCurated = true;

    @Column(nullable = false)
    private Integer popularity = 50;

    @Column(name = "cost_index", nullable = false, columnDefinition = "numeric(5,2)")
    private Double costIndex = 1.0;

    @Column(name = "currency_code", nullable = false, length = 10)
    private String currencyCode = "INR";

    @Column(name = "currency_symbol", nullable = false, length = 10)
    private String currencySymbol = "₹";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(columnDefinition = "numeric(10,7)")
    private Double latitude;

    @Column(columnDefinition = "numeric(10,7)")
    private Double longitude;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DestinationAlias> aliases = new ArrayList<>();
}
```

### C. Destination Type & Source Enums
```java
public enum DestinationType {
    CITY, TOWN, REGION_CLUSTER, ISLAND_ARCHIPELAGO, 
    NATIONAL_PARK, HERITAGE_SITE, PILGRIMAGE, HILL_STATION, 
    BEACH, CIRCUIT, OTHER
}

public enum DestinationSource {
    CURATED, GEOAPIFY, USER_CREATED
}
```

### D. Destination Alias Entity (`destination_aliases` table)
```java
@Entity
@Table(name = "destination_aliases")
public class DestinationAlias {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "alias_name", nullable = false, length = 100)
    private String aliasName;          // e.g. "Bangalore", "Alleppey", "Vizag"
}
```

---

## 6. Evaluation: Option A vs Option B for City → Destination Evolution

| Criteria | Option A: Evolve `City` $\rightarrow$ `Destination` (Recommended) | Option B: Keep `City` & Add Separate `Destination` Table |
| :--- | :--- | :--- |
| **Domain Cleanliness** | Single unified entity for all places. | High redundancy (Jaipur as City AND Jaipur as Destination). |
| **DB Foreign Keys** | Table rename (`cities` $\rightarrow$ `destinations`). FKs point to 1 place. | Dual FKs on `trip_stops` (`city_id` vs `destination_id`). Complex `OR` queries. |
| **Backward Compatibility** | Views & JPA `@Table(name="destinations")` handle aliasing seamlessly. | High risk of data desynchronization between `cities` and `destinations`. |
| **API Cleanliness** | `/api/destinations` becomes primary; `/api/cities` acts as deprecated proxy. | Divergent API endpoints returning conflicting IDs for the same location. |
| **Recommendation** | **RECOMMENDED (OPTION A)** | NOT RECOMMENDED |

---

## 7. Backward Compatibility & API Strategy

To prevent breaking existing frontend code or external API consumers during transition:
1. **Database Backward Compatibility**:
   - Create a PostgreSQL database view `CREATE VIEW cities AS SELECT id, name, country, region_id AS region, cost_index, popularity, image_url, currency_code, currency_symbol FROM destinations;` if needed.
2. **Spring Boot Controller Compatibility**:
   - Preserve `CityController` `@RequestMapping("/api/cities")` as a thin wrapper delegate that forwards calls to `DestinationService`.
   - `CityResponse` DTO remains identical in fields (`id`, `name`, `country`, `region`, `imageUrl`, etc.) so frontend TypeScript interfaces require zero immediate changes.

---

## 8. Flyway Migration Strategy (Phase 4 Planning)

A non-destructive 3-step migration plan:
1. **Migration 1 (`V12__create_regions_and_aliases_tables.sql`)**:
   - Create `regions` table and seed 12 primary Indian travel regions (*Rajasthan, Kerala, Himalayas, Western Ghats, South India Temples, North India Circuit, East & Northeast, Central India, Goa & West Coast, Andaman & Nicobar, Lakshadweep, Islands*).
   - Create `destination_aliases` table.
2. **Migration 2 (`V13__evolve_cities_to_destinations.sql`)**:
   - Rename table `cities` $\rightarrow$ `destinations`.
   - Add columns `region_id`, `canonical_name`, `destination_type`, `source`, `is_curated`, `latitude`, `longitude`.
   - Rename column `activities.city_id` $\rightarrow$ `destination_id` (or add alias column).
   - Rename column `trip_stops.city_id` $\rightarrow$ `destination_id`.
3. **Migration 3 (`V14__seed_137_curated_destinations_and_activities.sql`)**:
   - Populate 137 target curated destinations, assign `region_id`s, seed 9 key aliases (`Bangalore`, `Alleppey`, `Pondicherry`, `Mysore`, `Vizag`, `Rameshwaram`, `Aurangabad`, `Kohlapur`, `Karjad`).

---

## 9. Architectural Risk Analysis & Mitigations

| Identified Risk | Severity | Mitigation Strategy |
| :--- | :---: | :--- |
| **Trip Stop FK Breakage** | HIGH | Update `trip_stops` FK constraints within the same Flyway transaction; preserve all existing destination IDs. |
| **Frontend API Contract Breakage** | MEDIUM | Keep `/api/cities` endpoints active as proxy aliases returning `CityResponse` format alongside new `/api/destinations` endpoints. |
| **Activity Search Indexing Drift** | MEDIUM | Update `ActivityRepository` queries to join on `destination_id` and search across `destination.name`, `destination.canonicalName`, and `destination_aliases.alias_name`. |

---

## 10. Recommended Implementation Order

```
[Phase 3: Architecture Plan Approved] (Current)
                 │
                 ▼
[Phase 4: Flyway DB Migrations & Schema Evolution]
                 │
                 ▼
[Phase 5: Java Entity, DTO & Repository Layer Updates]
                 │
                 ▼
[Phase 6: Activity Refinement & 137 Curated Seeding]
                 │
                 ▼
[Phase 7: Frontend Integration & Image Mapping Alignment]
                 │
                 ▼
[Phase 8: Build, Integration Test & Final Verification]
```

---

### Confirmation & Safety Status
- ✅ **Zero database mutations executed.**
- ✅ **Zero Flyway migration files created.**
- ✅ **Zero Java entity or repository changes made.**
- ✅ **Zero frontend code modified.**
- ✅ **Standing by for your review and approval.**
"@

Set-Content -Path "region_destination_architecture.md" -Value $md -Encoding utf8
Write-Host "Created region_destination_architecture.md successfully."
