# GlobeTrotter — Hackathon Implementation Plan

> **Document Status**: Execution Roadmap  
> **Source of Truth**: GlobeTrotter PRD & Problem Statement  

---

## 1. Feature Priority Matrix

To maximize efficiency during the hackathon, tasks are categorized by priority:

- **P0 (Critical for Demo)**: Core end-to-end user journey required for a working vertical slice.
- **P1 (High Value)**: Important visual features and enhancements (charts, alerts, profile settings).
- **P2 (Optional/Polish)**: Optional screens and bonus functionality (Admin Dashboard, image uploads).

---

## 2. Phase-by-Phase Implementation Roadmap

### Phase 0: Project Setup & Seed Database `[P0]`
- [ ] **Database**: Execute PostgreSQL DDL schema scripts (`users`, `trips`, `cities`, `trip_stops`, `activities`, `trip_activities`, `trip_budget_expenses`, `trip_shares`).
- [ ] **Database Seed Data**: Populate seed catalog for 10 popular global cities (e.g. Paris, Tokyo, New York, Mumbai, Rome) with cost index, popularity, and 3-5 activities per city.
- [ ] **Backend**: Initialize Spring Boot project structure (Controllers, Services, Repositories, Entities, DTOs, Security filters).
- [ ] **Frontend**: Initialize React SPA scaffold, setup TailwindCSS/Custom CSS styling system, install lucide-react icons and react-router-dom.

### Phase 1: Authentication & App Shell `[P0]`
- [ ] **Backend Tasks**:
  - Implement `User` entity, `UserRepository`, BCrypt encoder.
  - Implement `/auth/signup` and `/auth/login` REST endpoints issuing JWT tokens.
  - Implement `JwtAuthenticationFilter` for route protection.
- [ ] **Frontend Tasks**:
  - Build `LoginPage` / `SignupPage` with tab toggle and validation.
  - Setup `AuthContext` to persist JWT token in local storage.
  - Build App Navbar and Sidebar shell.
- [ ] **Integration**: Test user login flow and token storage.

### Phase 2: Trip Creation & Management `[P0]`
- [ ] **Backend Tasks**:
  - Implement `Trip` entity and `TripRepository`.
  - Build `POST /api/trips`, `GET /api/trips`, `GET /api/trips/{id}`, `DELETE /api/trips/{id}`.
- [ ] **Frontend Tasks**:
  - Build `DashboardPage` displaying recent trips, budget highlights, and "Plan New Trip" button.
  - Build `CreateTripPage` form with trip name, dates, description.
  - Build `MyTripsPage` displaying trip cards with edit/delete actions.
- [ ] **Integration**: Test trip creation from dashboard and display in list view.

### Phase 3: Multi-City Itinerary Builder & City Search `[P0]`
- [ ] **Backend Tasks**:
  - Build `GET /api/cities` with search, country, and region query parameters.
  - Build `POST /api/trips/{tripId}/stops` and `PUT /api/trips/{tripId}/stops/reorder`.
- [ ] **Frontend Tasks**:
  - Build `CitySearchPage` featuring search bar, cost index badges, popularity rating, and "Add to Trip" action.
  - Build `ItineraryBuilderPage` interface to manage stop sequence and dates.
- [ ] **Integration**: Select a city from search, append to trip as a stop, and verify sequence order.

### Phase 4: Activity Discovery & Day-Wise Itinerary `[P0]`
- [ ] **Backend Tasks**:
  - Build `GET /cities/{cityId}/activities` with category, cost, and duration filters.
  - Build `POST /trips/{tripId}/stops/{stopId}/activities` and `GET /trips/{tripId}/itinerary`.
- [ ] **Frontend Tasks**:
  - Build `ActivitySearchPage` displaying activity cards with duration/cost filters.
  - Build `ItineraryViewPage` displaying day-wise schedule blocks with city headers.
- [ ] **Integration**: Assign activities to specific stop dates and verify day-wise layout.

### Phase 5: Budget Engine & Public Sharing `[P0]`
- [ ] **Backend Tasks**:
  - Build `GET /trips/{tripId}/budget` returning total cost, category breakdown, daily average, and over-budget warnings.
  - Build `POST /trips/{tripId}/share`, `GET /public/trips/{shareToken}`, and `POST /public/trips/{shareToken}/copy`.
- [ ] **Frontend Tasks**:
  - Build `TripBudgetPage` showing expense breakdown per category and average cost per day.
  - Build `SharedItineraryPage` read-only view with shareable public link and "Copy Trip" button.
- [ ] **Integration**: Verify public URL resolution without login and test "Copy Trip" cloning.

### Phase 6: Visual Analytics & Timeline Enhancements `[P1]`
- [ ] **Frontend Tasks**:
  - Integrate pie/bar charts on `TripBudgetPage` for cost breakdown.
  - Add overbudget daily alert notifications.
  - Build `TripTimelinePage` / Calendar toggle view with drag-and-drop activity reordering.
  - Build `ProfilePage` displaying user profile fields, language preference, and saved destinations.

### Phase 7: Polish & Optional Features `[P2]`
- [ ] **Backend & Frontend Tasks**:
  - Implement `AdminDashboardPage` for user & trip platform metrics `[Optional in PDF]`.
  - Add cover photo URL upload support.
  - Polish UI micro-animations, loading spinners, and error toasts.

---

## 3. Integration & Testing Strategy

1. **API Endpoint Verification**: Postman collection tests verifying status codes, payload contracts, and error responses.
2. **User Flow Testing**: Manual end-to-end verification of complete planning flow without database resets.
3. **Responsive UI Verification**: Desktop and mobile view tests across chrome developer tools.

---

## 4. Definition of Done (MVP Complete)

The project is considered **MVP Complete & Demo Ready** when:
1. A new user can sign up and log in.
2. The user creates a new trip with name and dates.
3. The user searches for cities and adds at least 2 stops.
4. The user searches for activities and assigns them to stops/dates.
5. The day-wise Itinerary View accurately reflects scheduled activities.
6. The Budget View displays automated cost breakdown and daily average expense.
7. A public share URL is generated, opens in read-only mode, and allows cloning via "Copy Trip".
8. Zero console errors or database exceptions during the 5-minute live presentation.
