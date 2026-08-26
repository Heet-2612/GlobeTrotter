# GlobeTrotter V2 — State & Union Territory Region Architecture Notes

> **Document Status:** Authoritative Architectural Architecture Note  
> **Scope:** Final State & Union Territory Region Model for GlobeTrotter V2  
> **Safety Guarantee:** Zero database changes executed, zero code modifications made, zero migrations applied, zero git commits.

---

## 1. Final Domain Hierarchy

GlobeTrotter V2 adopts a clear 4-tier domain hierarchy anchored by official Indian States and Union Territories as primary `Region` entities:

```
Country (e.g. India)
   ↓
State / Union Territory (Region) (e.g. Karnataka, Rajasthan, Kerala, Tamil Nadu)
   ↓
Destination (137 Curated Destinations: Bengaluru, Jaipur, Munnar, Andaman Islands)
   ↓
Activity / POI (548 Curated POIs + Dynamic Geoapify Discovery)
```

### Decoupling Guarantee
- `Region` represents the administrative State or Union Territory.
- `Destination` represents the actual travel stop (City, Town, Hill Station, National Park, Heritage Site, Pilgrimage, Archipelago).
- `TripStop` links a user's `Trip` directly to a `Destination` (`destination_id` FK).
- `Activity` links directly to a `Destination` (`destination_id` FK).

---

## 2. Summary of 29 State / Union Territory Regions

The authoritative region dataset consists of **29 State / Union Territory Regions** containing at least one curated destination:

| Region Name | Administrative Status | Total Destinations | MAJOR | SECONDARY | NICHE | Primary Travel Theme |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Andaman & Nicobar Islands** | Union Territory | **1** | 1 | 0 | 0 | Beach & Tropical Archipelago |
| **Andhra Pradesh** | State | **3** | 1 | 2 | 0 | Pilgrimage, Coastal Port & Valley |
| **Arunachal Pradesh** | State | **2** | 0 | 0 | 2 | Himalayan Monasteries & Eco-Valleys |
| **Assam** | State | **3** | 1 | 0 | 2 | Wildlife Sanctuary & River Island |
| **Bihar** | State | **1** | 1 | 0 | 0 | Buddhist Pilgrimage |
| **Dadra and Nagar Haveli and Daman and Diu** | Union Territory | **1** | 0 | 1 | 0 | Island Fort & Coastal Heritage |
| **Delhi** | Union Territory | **1** | 1 | 0 | 0 | National Capital Territory & Heritage |
| **Goa** | State | **1** | 1 | 0 | 0 | Coastal Beaches & Latin Heritage |
| **Gujarat** | State | **10** | 2 | 5 | 3 | Heritage, Desert Salt Marsh & Lions |
| **Himachal Pradesh** | State | **6** | 3 | 3 | 0 | Himalayan Hill Stations & Spiti Valley |
| **Jammu & Kashmir** | Union Territory | **4** | 3 | 1 | 0 | Alpine Lakes, Snow Resorts & Pilgrimage |
| **Karnataka** | State | **11** | 3 | 5 | 3 | Tech Hub, Royal Heritage, Ghats & Parks |
| **Kerala** | State | **11** | 4 | 4 | 3 | Backwaters, Tea Gardens & Ayurveda |
| **Ladakh** | Union Territory | **1** | 1 | 0 | 0 | High-Altitude Desert & Monasteries |
| **Lakshadweep** | Union Territory | **1** | 0 | 1 | 0 | Coral Atolls & Scuba Diving |
| **Madhya Pradesh** | State | **11** | 1 | 10 | 0 | Wildlife Reserves, UNESCO Shrines & Forts |
| **Maharashtra** | State | **13** | 1 | 8 | 4 | Metropolis, Rock Caves, Forts & Wine |
| **Meghalaya** | State | **3** | 1 | 0 | 2 | Waterfalls, Living Root Bridges & Rivers |
| **Mizoram** | State | **1** | 0 | 0 | 1 | Mizo Hills & Scenic Valleys |
| **Odisha** | State | **3** | 1 | 0 | 2 | Temple Coast & Saltwater Lagoon |
| **Puducherry** | Union Territory | **1** | 1 | 0 | 0 | French Colonial Quarter & Spiritual |
| **Punjab** | State | **1** | 1 | 0 | 0 | Sikh Pilgrimage & Frontier Heritage |
| **Rajasthan** | State | **13** | 4 | 6 | 3 | Royal Palaces, Forts & Thar Desert |
| **Sikkim** | State | **1** | 1 | 0 | 0 | Himalayan Peaks & Alpine Lakes |
| **Tamil Nadu** | State | **12** | 4 | 5 | 3 | Dravidian Temples, Hill Stations & Heritage |
| **Telangana** | State | **1** | 1 | 0 | 0 | Historic Deccan Citadel & IT Hub |
| **Uttar Pradesh** | State | **7** | 2 | 5 | 0 | Sacred Ganges Pilgrimage & Taj Mahal |
| **Uttarakhand** | State | **9** | 4 | 5 | 0 | Himalayan Pilgrimage, Parks & Lakes |
| **West Bengal** | State | **4** | 2 | 0 | 2 | Cultural Metropolis, Tea Hills & Mangroves |
| **TOTAL (29 Regions)** | **—** | **137** | **46** | **61** | **30** | **100% Reconciled Catalog** |

---

## 3. Summary of 137 Curated Destinations

- **Total Curated Destinations**: **137**
- **Priority Breakdown**:
  - **MAJOR**: **46** (Tier 1 primary travel destinations)
  - **SECONDARY**: **61** (Tier 2 heritage, hill station, pilgrimage, and wildlife destinations)
  - **NICHE**: **30** (Specialized eco, culture, and adventure destinations)
- **Curated POIs / Activities**: **548** (4–5 high-quality, authentic POIs per destination)

---

## 4. Multi-State Trip Workflow

How GlobeTrotter handles multi-state travel seamlessly:

1. **User Trip Creation**: User creates a trip (e.g. *"South India Grand Tour"*).
2. **State/UT Selection**:
   - User selects **Karnataka** $\rightarrow$ adds *Bengaluru*, *Mysuru*, *Coorg*.
   - User adds another state **Tamil Nadu** $\rightarrow$ adds *Ooty*, *Chennai*.
   - User adds another state **Kerala** $\rightarrow$ adds *Munnar*, *Alappuzha*.
3. **Decoupled Data Storage**:
   - Each `TripStop` references its `Destination` directly via `destination_id`.
   - Each `Destination` references its `Region` via `region_id`.
   - The `Trip` model itself requires zero multi-state schema hacks; multi-state trips are naturally supported by selecting destinations from different state regions.

---

## 5. Future Discovery Collections vs. State Region Entities

GlobeTrotter distinguishes between **Database Region Entities** and **UX Discovery Collections**:

| Concept | Entity Level | Purpose & Storage | Example |
| :--- | :--- | :--- | :--- |
| **State / UT Region** | **Primary Database Entity** (`regions` table) | Canonical region structure, filtering, and destination mapping. | *Karnataka*, *Tamil Nadu*, *Rajasthan* |
| **Discovery Collection** | **UX Layer / Search Tag Filter** (Non-Entity) | Thematic travel collections for landing page inspiration or search filters. | *Golden Triangle*, *South India*, *Western Ghats*, *Himalayas* |

### Example UX Collections:
- **Golden Triangle**: Delhi $\rightarrow$ Agra $\rightarrow$ Jaipur
- **South India Temple Trail**: Madurai $\rightarrow$ Rameswaram $\rightarrow$ Thanjavur $\rightarrow$ Kanchipuram
- **Western Ghats Escapes**: Chikkamagaluru $\rightarrow$ Wayanad $\rightarrow$ Ooty $\rightarrow$ Munnar
- **Himalayan Ski & Snow Trail**: Gulmarg $\rightarrow$ Manali $\rightarrow$ Auli $\rightarrow$ Spiti

---

## 6. Implications for Upcoming Flyway Migration V15

When V15 is scheduled:

1. **`regions` Table Population**:
   - Insert the **29 official State / Union Territory Regions** into `regions` table with `canonical_name` and `country = 'India'`.
2. **`destinations` Table Foreign Key Mapping**:
   - Update `destinations.region_id` FK references to map each of the **137 curated destinations** to its exact State/UT region ID.
3. **Data Integrity & Legacy Compatibility**:
   - Preserves all 200 existing destination rows (IDs 1–200) without deleting any user trip stops or activities.
   - Retains existing destination types (`CITY`, `HERITAGE_SITE`, `NATIONAL_PARK`, `HILL_STATION`, `PILGRIMAGE`, `BEACH`, `CIRCUIT`, `ARCHIPELAGO`).

---

### Confirmation & Safety Status
- ✅ **Zero database mutations executed.**
- ✅ **Zero Flyway migration files created.**
- ✅ **Zero Java entity or repository changes made.**
- ✅ **Zero frontend code modified.**
- ✅ **Zero Git commits or pushes executed.**
