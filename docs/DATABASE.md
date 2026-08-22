# GlobeTrotter — Database Design & Schema

> **Document Status**: Relational Schema Specification  
> **Source of Truth**: GlobeTrotter PRD & Problem Statement  

---

## 1. Relational ER Diagram

```mermaid
erDiagram
    users ||--o{ trips : "creates/owns"
    users ||--o{ user_saved_destinations : "saves"
    trips ||--o{ trip_stops : "contains ordered"
    trips ||--o{ trip_budget_expenses : "has breakdown"
    trips ||--o? trip_shares : "has share link"
    cities ||--o{ trip_stops : "located at"
    cities ||--o{ activities : "offers"
    cities ||--o{ user_saved_destinations : "saved in profile"
    trip_stops ||--o{ trip_activities : "includes scheduled"
    activities ||--o{ trip_activities : "instantiated as"

    users {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar name
        varchar profile_photo
        varchar language_preference
        timestamp created_at
    }

    trips {
        bigint id PK
        bigint user_id FK
        varchar name
        text description
        date start_date
        date end_date
        varchar cover_photo
        timestamp created_at
    }

    cities {
        bigint id PK
        varchar name
        varchar country
        varchar region
        decimal cost_index
        integer popularity
        varchar image_url
    }

    trip_stops {
        bigint id PK
        bigint trip_id FK
        bigint city_id FK
        integer stop_order
        date start_date
        date end_date
    }

    activities {
        bigint id PK
        bigint city_id FK
        varchar name
        text description
        varchar type
        decimal estimated_cost
        integer duration_min
        varchar image_url
    }

    trip_activities {
        bigint id PK
        bigint trip_stop_id FK
        bigint activity_id FK
        date activity_date
        time start_time
        decimal estimated_cost
        integer activity_order
    }

    trip_budget_expenses {
        bigint id PK
        bigint trip_id FK
        varchar category
        decimal estimated_amount
    }

    trip_shares {
        bigint id PK
        bigint trip_id FK
        varchar share_token UK
        boolean is_public
        integer views_count
    }

    user_saved_destinations {
        bigint id PK
        bigint user_id FK
        bigint city_id FK
    }
```

---

## 2. Entity Specifications & Field Dictionary

### 2.1 `users` Table
- **Purpose**: Stores user account identity, credentials, and settings.
- **Primary Key**: `id` (`BIGINT AUTO_INCREMENT` / `BIGSERIAL`)
- **Fields**:
  - `id`: Unique identifier
  - `email`: User email address (`VARCHAR(255)`, `UNIQUE`, `NOT NULL`)
  - `password_hash`: BCrypt encrypted password hash (`VARCHAR(255)`, `NOT NULL`)
  - `name`: Full display name (`VARCHAR(100)`, `NOT NULL`)
  - `profile_photo`: Profile photo URL (`VARCHAR(500)`, `NULL`)
  - `language_preference`: Preferred language code e.g., 'en', 'fr' (`VARCHAR(10)`, `DEFAULT 'en'`)
  - `created_at`: Account creation timestamp (`TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`)
  - `updated_at`: Modification timestamp (`TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`)

### 2.2 `trips` Table
- **Purpose**: Master table for travel itineraries created by users.
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `user_id` -> `users(id)` (`ON DELETE CASCADE`)
- **Fields**:
  - `id`: Unique trip identifier
  - `user_id`: Owner user ID (`BIGINT`, `NOT NULL`)
  - `name`: Title of the trip e.g., "Euro Summer 2026" (`VARCHAR(150)`, `NOT NULL`)
  - `description`: Overview text of the travel plan (`TEXT`, `NULL`)
  - `start_date`: Overall trip start date (`DATE`, `NOT NULL`)
  - `end_date`: Overall trip end date (`DATE`, `NOT NULL`)
  - `cover_photo`: Optional cover photo URL (`VARCHAR(500)`, `NULL`)
  - `created_at`: Record creation timestamp (`TIMESTAMP`)
  - `updated_at`: Record modification timestamp (`TIMESTAMP`)

### 2.3 `cities` Table
- **Purpose**: Catalog of global destinations searchable by travelers.
- **Primary Key**: `id` (`BIGINT`)
- **Fields**:
  - `id`: Unique city identifier
  - `name`: City name e.g., "Paris", "Tokyo" (`VARCHAR(100)`, `NOT NULL`)
  - `country`: Country name e.g., "France", "Japan" (`VARCHAR(100)`, `NOT NULL`)
  - `region`: Region / Continent e.g., "Europe", "Asia" (`VARCHAR(100)`, `NOT NULL`)
  - `cost_index`: Relative cost rating scale (e.g., 1.0 to 5.0) (`DECIMAL(3,2)`, `NOT NULL`)
  - `popularity`: Popularity score index (e.g., 1 to 100) (`INTEGER`, `NOT NULL`)
  - `image_url`: Representative thumbnail image URL (`VARCHAR(500)`, `NULL`)

### 2.4 `trip_stops` Table
- **Purpose**: Represents a multi-city leg/stop within a specific trip itinerary.
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**:
  - `trip_id` -> `trips(id)` (`ON DELETE CASCADE`)
  - `city_id` -> `cities(id)` (`ON DELETE RESTRICT`)
- **Fields**:
  - `id`: Unique stop identifier
  - `trip_id`: Associated trip (`BIGINT`, `NOT NULL`)
  - `city_id`: Selected city (`BIGINT`, `NOT NULL`)
  - `stop_order`: Sequential position order of the stop (1, 2, 3...) (`INTEGER`, `NOT NULL`)
  - `start_date`: Arrival date at city stop (`DATE`, `NOT NULL`)
  - `end_date`: Departure date from city stop (`DATE`, `NOT NULL`)
  - `notes`: Travel notes / stay details (`TEXT`, `NULL`)

### 2.5 `activities` Table
- **Purpose**: Master reference library of activities and attractions per city.
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `city_id` -> `cities(id)` (`ON DELETE CASCADE`)
- **Fields**:
  - `id`: Unique activity identifier
  - `city_id`: Associated city ID (`BIGINT`, `NOT NULL`)
  - `name`: Title of activity e.g., "Eiffel Tower Sunset Tour" (`VARCHAR(150)`, `NOT NULL`)
  - `description`: Detailed description (`TEXT`, `NULL`)
  - `type`: Category e.g., 'SIGHTSEEING', 'FOOD_TOUR', 'ADVENTURE', 'CULTURE' (`VARCHAR(50)`, `NOT NULL`)
  - `estimated_cost`: Baseline cost estimate (`DECIMAL(10,2)`, `NOT NULL`, `DEFAULT 0.00`)
  - `duration_min`: Expected duration in minutes (`INTEGER`, `NOT NULL`)
  - `image_url`: Activity image URL (`VARCHAR(500)`, `NULL`)

### 2.6 `trip_activities` Table
- **Purpose**: Specific activity scheduled within a trip stop on a given date/time.
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**:
  - `trip_stop_id` -> `trip_stops(id)` (`ON DELETE CASCADE`)
  - `activity_id` -> `activities(id)` (`ON DELETE RESTRICT`)
- **Fields**:
  - `id`: Unique scheduled activity instance ID
  - `trip_stop_id`: Parent trip stop (`BIGINT`, `NOT NULL`)
  - `activity_id`: Referenced activity (`BIGINT`, `NOT NULL`)
  - `activity_date`: Date scheduled (`DATE`, `NOT NULL`)
  - `start_time`: Scheduled time e.g., "14:30:00" (`TIME`, `NULL`)
  - `estimated_cost`: Cost override or confirmed cost (`DECIMAL(10,2)`, `NOT NULL`)
  - `notes`: User custom notes for activity (`TEXT`, `NULL`)
  - `activity_order`: Display sequence order for the day (`INTEGER`, `NOT NULL`)

### 2.7 `trip_budget_expenses` Table
- **Purpose**: Stores trip cost breakdown per category (Transport, Stay, Meals, Activities, Other).
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `trip_id` -> `trips(id)` (`ON DELETE CASCADE`)
- **Fields**:
  - `id`: Unique record ID
  - `trip_id`: Associated trip (`BIGINT`, `NOT NULL`)
  - `category`: Expense category (`VARCHAR(50)`, `NOT NULL`) — 'TRANSPORT', 'STAY', 'MEALS', 'ACTIVITIES', 'OTHER'
  - `estimated_amount`: Allocated or estimated amount (`DECIMAL(10,2)`, `NOT NULL`, `DEFAULT 0.00`)
  - `notes`: Notes regarding budget allocation (`TEXT`, `NULL`)

### 2.8 `trip_shares` Table
- **Purpose**: Manages public share tokens and read-only access URLs.
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**: `trip_id` -> `trips(id)` (`ON DELETE CASCADE`)
- **Fields**:
  - `id`: Unique share record ID
  - `trip_id`: Associated trip (`BIGINT`, `NOT NULL`)
  - `share_token`: Secure random unique token string (`VARCHAR(64)`, `UNIQUE`, `NOT NULL`)
  - `is_public`: Sharing toggle status (`BOOLEAN`, `NOT NULL`, `DEFAULT TRUE`)
  - `views_count`: Public view counter (`INTEGER`, `DEFAULT 0`)
  - `created_at`: Share link creation date (`TIMESTAMP`)

### 2.9 `user_saved_destinations` Table
- **Purpose**: Stores bookmarked/saved destinations displayed in user profile settings.
- **Primary Key**: `id` (`BIGINT`)
- **Foreign Keys**:
  - `user_id` -> `users(id)` (`ON DELETE CASCADE`)
  - `city_id` -> `cities(id)` (`ON DELETE CASCADE`)

---

## 3. Database Indexing & Performance Strategy `[Technical Recommendation]`

To optimize queries for the hackathon application:
- `idx_trips_user_id`: Index on `trips(user_id)` for quick retrieval of "My Trips".
- `idx_trip_stops_trip_id_order`: Composite index on `trip_stops(trip_id, stop_order)` for rapid itinerary rendering.
- `idx_cities_search`: Full-text or lowercase index on `cities(name, country, region)` for live search filtering.
- `idx_activities_city_type`: Index on `activities(city_id, type)` for activity browsing by city and filter.
- `idx_trip_shares_token`: Unique index on `trip_shares(share_token)` for fast resolution of public share URLs.

---

## 4. Calculated Financial Aggregations

Total Trip Cost is computed using SQL / Service logic:

$$\text{Total Cost} = \sum (\text{Category Expenses}) + \sum (\text{Trip Activity Costs})$$

$$\text{Average Daily Cost} = \frac{\text{Total Cost}}{\text{End Date} - \text{Start Date} + 1}$$

If $\text{Daily Expense} > \text{Daily Budget Threshold}$, an over-budget visual alert flag is raised.
