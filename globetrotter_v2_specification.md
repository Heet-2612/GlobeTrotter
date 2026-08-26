# GlobeTrotter V2 â€” Product Vision, User Experience & Architecture Specification

> **Document Status:** Authoritative Master Specification (GlobeTrotter V2 Portfolio Edition)  
> **Supersedes:** Prototype-focused schema design documents.  
> **Product Philosophy:** Product User Journey First $\rightarrow$ Derived Domain Model Second.

---

## 1. Product Vision

GlobeTrotter is evolving from a hackathon prototype into a portfolio-grade, intelligent, and flexible travel planning platform. It empowers travelers to seamlessly discover destinations across global regions, curate personalized multi-stop itineraries, schedule activities, and share travel experiences effortlessly.

---

## 2. Problem GlobeTrotter Solves

Traditional travel tools force users into rigid database abstractionsâ€”treating mountain ranges, island archipelagos, national parks, and heritage circuits as simple "cities." Furthermore, travelers must juggle separate tools for destination discovery, activity scheduling, and itinerary organization.

GlobeTrotter unifies end-to-end trip planning around natural human travel thinking:
1. **Explore & Discover:** Browse by country or travel region (e.g. *Rajasthan*, *Kerala*, *Ladakh*) or search by any destination name or colloquial alias (e.g. *Bangalore*, *Alleppey*, *Vizag*).
2. **Flexible Trip Assembly:** Plan trips with 1 or many destinations without arbitrary constraints on "city limits."
3. **Unified Activity Discovery:** Blends official curated activities with dynamic Geoapify live POI discovery into one seamless experience.

---

## 3. V2 Primary User Journey

`	ext
Create Trip (Name & Travel Dates)
        â†“
"Where are you going?"
        â†“
Search Destination OR Explore by Region (e.g., Rajasthan, Kerala, Himalayas)
        â†“
Select Destination(s) (e.g., Jaipur, Munnar, Andaman Islands)
        â†“
Discover Activities (Curated Highlights + Geoapify Discovery)
        â†“
Add & Schedule Activities in Itinerary
        â†“
Review, Reorder & Share Itinerary
`

---

## 4. Trip Creation UX

The trip creation flow focuses entirely on the traveler's intent:
1. **Step 1: Core Trip Details**: User enters **Trip Name** (e.g. *"Rajasthan Heritage Tour"*) and **Travel Dates** (e.g. *Oct 10 â€“ Oct 20*).
2. **Step 2: Add Destinations**: User searches for any location or browses curated regional collections (*Kerala*, *Rajasthan*, *Western Ghats*).
3. **Step 3: Single vs. Multi-Destination Flexibility**: The UX does not ask *"Are you visiting one city or multiple cities?"*. Adding 1 destination creates a single-destination trip; adding multiple destinations seamlessly builds a multi-stop itinerary.
4. **Step 4: Activity Selection & Scheduling**: User browses curated highlights alongside live place search results, assigning activities to specific days.

---

## 5. Region Concept

A **Region** in the GlobeTrotter database schema primarily represents an **Indian State or Union Territory** (e.g. *Karnataka*, *Rajasthan*, *Kerala*, *Tamil Nadu*, *Maharashtra*, *Dadra and Nagar Haveli and Daman and Diu*).

- **Nature of a Region**: A Region entity represents an official administrative State or Union Territory. Broad travel regions (*South India*, *Himalayas*), geographical belts (*Western Ghats*), or tourist circuits (*Golden Triangle*) are NOT primary database Region entities, but exist as UX Discovery Collections.
- **Authoritative Catalog**: GlobeTrotter V2 defines **29 State / Union Territory Regions** containing **137 curated destinations** (refer to `state_region_destination_catalog.md`).
- **Examples**:
  - **Karnataka** $\rightarrow$ Bengaluru, Mysuru, Hampi, Gokarna, Chikkamagaluru, Badami-Pattadakal, Dandeli, Nagarhole, Bandipur, Murudeshwar, Shettihalli/Sakleshpur
  - **Rajasthan** $\rightarrow$ Jaipur, Udaipur, Jodhpur, Jaisalmer, Pushkar, Ajmer, Chittorgarh, Bikaner, Mount Abu, Bundi, Shekhawati, Ranakpur, Ranthambore
  - **Kerala** $\rightarrow$ Kochi, Alappuzha, Munnar, Wayanad, Varkala, Thekkady-Periyar, Kumarakom, Bekal, Vagamon, Kozhikode, Kerala (state container)
- **UX Role**: Users explore destinations by selecting one or more States/UTs during trip creation; selecting destinations across multiple states seamlessly builds a multi-state itinerary.

---

## 6. Destination Concept

A **Destination** is the core entity that a traveler adds to a trip as a stop.

- **Flexibility**: A Destination does NOT have to be a city. It can be a city, town, island, national park, hill station, pilgrimage site, or heritage circuit.
- **Supported Destination Types**:
  - CITY (e.g. Jaipur, Mumbai, Bengaluru)
  - TOWN (e.g. Pushkar, Orchha, Bundi)
  - ISLAND / ARCHIPELAGO (e.g. Andaman Islands, Lakshadweep)
  - NATIONAL_PARK (e.g. Jim Corbett, Kaziranga, Kanha, Ranthambore, Gir)
  - HILL_STATION (e.g. Munnar, Manali, Ooty, Shimla, Darjeeling)
  - PILGRIMAGE (e.g. Varanasi, Ayodhya, Ujjain, Kedarnath, Badrinath)
  - HERITAGE_SITE / CIRCUIT (e.g. Hampi, Mathura-Vrindavan, Badami-Pattadakal, Statue of Unity)
  - OTHER

---

## 7. Activity Concept

An **Activity** (or POI) is something a traveler visits, does, or experiences within a destination.

- **Curated Baseline**: Each of the 137 target curated destinations features approximately 4â€“5 curated, high-quality core activities (e.g., *Amber Fort* in Jaipur, *Cellular Jail* in Andaman Islands, *Valley of Flowers Kevadia* at Statue of Unity).
- **Unified Discovery**: Curated recommendations are seamlessly combined with live Geoapify Place Search results.

---

## 8. Curated + Geoapify Discovery

Travelers experience activity discovery as one unified, intelligent catalog:

`	ext
[ Activity Search Request ]
           â”‚
           â”œâ”€â”€> Search Curated Local Database (Source = CURATED)
           â”‚
           â””â”€â”€> Fetch Live External Places via Geoapify API (Source = GEOAPIFY)
           â”‚
           â–¼
[ Single Unified Activity List Presented to User ]
`

### Internal Source Attribution:
- CURATED: Officially verified and seeded POIs.
- GEOAPIFY: Dynamically discovered places fetched on-demand.
- USER_CREATED: Custom places created by users (future capability).

---

## 9. Trip Model

A **Trip** represents a complete travel plan owned by a user:
- id: Unique Identifier
- 
ame: Title of the trip (e.g., *"South India Temple & Backwaters"*).
- startDate & endDate: Calendar bounds.
- coverPhoto: Hero image URL.
- isPublic & shareToken: Public sharing credentials.
- createdAt & updatedAt: Audit timestamps.

---

## 10. TripStop Model

A **TripStop** represents a destination visit within a specific trip:
- id: Unique Identifier
- 	rip: Reference to parent Trip.
- destination: Reference to the Destination entity.
- stopOrder: Sequential order of the stop in the itinerary.
- startDate & endDate: Stay dates for this specific stop.
- 
otes: User notes for this stop.

---

## 11. Itinerary Model

The **Itinerary** provides interactive day-wise schedule visualization:
- Drag-and-drop / sequential reordering of stops and activities.
- Time assignment (startTime, estimatedDurationMinutes).
- Personal notes and custom cost overrides per activity.

---

## 12. PlannedActivity (Future Architectural Concept)

To cleanly decouple reusable global POIs from a user's specific planned schedule, the long-term domain model introduces **PlannedActivity**:

`	ext
Trip
 â””â”€â”€ TripStop
      â””â”€â”€ PlannedActivity  (instance: date, time, notes, custom cost)
           â””â”€â”€ Activity    (reusable definition: name, category, place ID)
`

> *Note:* PlannedActivity is an architectural target direction and will not be implemented until explicitly scheduled.

---

## 13. Search and Aliases

GlobeTrotter search recognizes regional queries, canonical destination names, and alternate/colloquial aliases:

| Searched Term | Resolved Canonical Destination | Display & Alias Handling |
| :--- | :--- | :--- |
| "Kerala" | Region Search | Displays all destinations under Kerala (Kochi, Munnar, Alappuzha, etc.) |
| "Bangalore" | **Bengaluru** | Alias match $\rightarrow$ resolves to Bengaluru |
| "Alleppey" | **Alappuzha** | Alias match $\rightarrow$ resolves to Alappuzha |
| "Pondicherry" | **Puducherry** | Alias match $\rightarrow$ resolves to Puducherry |
| "Vizag" | **Visakhapatnam** | Alias match $\rightarrow$ resolves to Visakhapatnam |
| "Aurangabad" | **Chhatrapati Sambhajinagar** | Alias match $\rightarrow$ resolves to Chhatrapati Sambhajinagar |

---

## 14. Image Strategy

- **Destination Hero Images**: Sourced from curated, high-quality, license-compliant Wikimedia Commons direct URLs.
- **Activity Images**: Sourced from curated local category mappings, activity-specific URLs, or Geoapify place image metadata.
- **Fallback System**: Automatic fallback to generic travel images (onCityImageError / onActivityImageError) ensuring zero broken image icons in the UI.

---

## 15. Budget â€” Future Phase Strategy

In V2, arbitrary autogenerated trip budget estimations are removed from core trip creation. Budget management will be re-introduced in a future phase using **real user-entered financial items**:
- Hotel/Accommodation bookings
- Transit/Flight/Train tickets
- Activity tickets & Restaurant expenses

---

## 16. Future Travel Management Capabilities (Postponed)

Documented for future platform expansion:
`	ext
Trip
 â”œâ”€â”€ Destinations & TripStops
 â”œâ”€â”€ Planned Activities
 â”œâ”€â”€ Hotel & Accommodation Bookings
 â”œâ”€â”€ Transit & Tickets (Flights, Trains)
 â”œâ”€â”€ Restaurant Reservations
 â”œâ”€â”€ Expense Tracking (Planned vs. Actual)
 â””â”€â”€ Trip Attachments & PDF Passes
`

---

## 17. User-Created Destinations (Postponed)

Future expansion will allow travelers to add custom destinations not present in the curated catalog (source = USER_CREATED).

---

## 18. Current V1 Architecture Overview

V1 operates on a flat structure (City $\rightarrow$ Activity):
- cities table (200 seed rows, plain text egion column).
- ctivities table (city_id FK).
- 	rip_stops table (city_id FK).
- Direct REST endpoints /api/cities, /api/activities, /api/trips.

---

## 19. V1 â†’ V2 Gap Analysis

| Feature Area | Current V1 System | Target V2 System |
| :--- | :--- | :--- |
| **Domain Model** | Flat City entity | Evolved Destination + Region + DestinationAlias |
| **Non-City Places** | Forced into "City" | Natural types (ISLAND, NATIONAL_PARK, HILL_STATION, etc.) |
| **Regional Search** | Plain text string matching | Structured Region entity browsing |
| **Search Aliases** | Not supported (Exact name match) | Multi-alias database matching table |
| **Source Tracking** | Implicit | Explicit (CURATED, GEOAPIFY, USER_CREATED) |

---

## 20. What We KEEP (Existing V1 Functionality Preserved)

- ðŸ” **Authentication & Security** (JWT tokens, user sessions, password reset).
- ðŸ‘¤ **User Profiles & Preferences** (Profile management, preferred currency).
- âœˆï¸ **Trip Core Management** (Trip creation, CRUD, sharing tokens, cloning).
- ðŸ“… **Timeline & Itinerary Builder** (Interactive scheduling, stop reordering).
- ðŸŒ **Geoapify Integration & Currency Conversion** (Live place search & exchange rates).
- ðŸ–¼ï¸ **Centralized Image Utilities** (Activity category mappings, fallback image handlers).

---

## 21. What We MODIFY

- **Database Table Rename & Evolution**: Evolve cities $\rightarrow$ destinations table with egion_id, destination_type, source, is_curated.
- **Backend Services**: Update CityService / CityRepository to DestinationService / DestinationRepository while preserving backward-compatible /api/cities endpoints.
- **Search Queries**: Extend search queries to match canonical names AND aliases.

---

## 22. What We ADD

- **egions Table & Entity**: Structured regional entity and seeding.
- **destination_aliases Table**: Alternate/colloquial name resolution.
- **destination_type & source Enums**: Classification and attribution.
- **35 New Curated Destinations & Seeding**: Complete the 137 target curated catalog.

---

## 23. What We POSTPONE (Explicitly Deferred)

- âŒ PlannedActivity separate table refactoring.
- âŒ Automatic budget estimation generators during trip creation.
- âŒ Hotel, flight, train ticket, and expense receipt tracking modules.
- âŒ User-created custom destination submission forms.

---

## 24. Migration Philosophy

1. **Product-First Evolution**: Technology changes are strictly driven by product user experience requirements.
2. **Zero-Downtime Data Safety**: All existing user trips, trip stops, and activity links are preserved without breaking foreign key constraints.
3. **Backward Compatibility**: Existing API routes (/api/cities) remain functional via delegation to the new Destination service layer.

---

## 25. Recommended Implementation Phases

`
[Phase 3: V2 Specification Approved] (Current)
                  â”‚
                  â–¼
[Phase 4: Flyway Schema Migrations (Regions, Destinations, Aliases)]
                  â”‚
                  â–¼
[Phase 5: Backend Entity, Service & Repository Evolution]
                  â”‚
                  â–¼
[Phase 6: Seeding 137 Curated Destinations & 4-5 Activities/Destination]
                  â”‚
                  â–¼
[Phase 7: Frontend Integration & Regional Exploration UX]
                  â”‚
                  â–¼
[Phase 8: End-to-End Build, Testing & Portfolio Finalization]
`

---

## 26. Final V2 Architecture Diagram

`
+-----------------------------------------------------------------------------------+
|                                 GLOBETROTTER V2                                   |
+-----------------------------------------------------------------------------------+
                                          â”‚
                                          â–¼
                         +---------------------------------+
                         |      User Trip Creation UX      |
                         |  (Name, Dates, Search/Explore)  |
                         +---------------------------------+
                                          â”‚
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â–¼                                               â–¼
   +------------------------------+                +------------------------------+
   |   Explore Region Discovery   |                |  Search Destination/Alias    |
   | (e.g. Rajasthan, Kerala, J&K)|                | (e.g. Bangalore -> Bengaluru)|
   +------------------------------+                +------------------------------+
                  â”‚                                               â”‚
                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                          â–¼
                         +---------------------------------+
                         |       Selected Destination      |
                         | (City, Park, Island, Hill Stn)  |
                         +---------------------------------+
                                          â”‚
                                          â–¼
                         +---------------------------------+
                         |   Unified Activity Discovery    |
                         | (Curated POIs + Geoapify Live)  |
                         +---------------------------------+
                                          â”‚
                                          â–¼
                         +---------------------------------+
                         |   Interactive Itinerary View    |
                         |   (Day-by-Day Schedule & Notes) |
                         +---------------------------------+
`

---

### Superseded Documentation Notice
This document (globetrotter_v2_specification.md) serves as the single authoritative product and technical specification for GlobeTrotter V2. Earlier hackathon prototype documents (implementation_plan.md, egion_destination_architecture.md, destination_migration_audit.md) remain as historical references for V1 seed data audits.
