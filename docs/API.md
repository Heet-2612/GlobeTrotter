# GlobeTrotter — REST API Specifications

> **Document Status**: API Contract Specification  
> **Source of Truth**: GlobeTrotter PRD & Problem Statement  
> **Base URL**: `/api`  

---

## 1. Authentication Endpoints

### 1.1 `POST /auth/signup`
- **Purpose**: Register a new traveler account. `[Explicitly Required by PDF]`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "profilePhoto": null,
      "languagePreference": "en"
    }
  }
  ```

### 1.2 `POST /auth/login`
- **Purpose**: Authenticate existing user and issue stateless JWT token. `[Explicitly Required by PDF]`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "profilePhoto": "https://example.com/avatar.jpg",
      "languagePreference": "en"
    }
  }
  ```

---

## 2. User Profile & Settings Endpoints

### 2.1 `GET /users/me`
- **Purpose**: Retrieve current logged-in user profile and settings. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "profilePhoto": "https://example.com/photo.jpg",
    "languagePreference": "en",
    "savedDestinationsCount": 3
  }
  ```

### 2.2 `PUT /users/me`
- **Purpose**: Update editable profile information (name, photo, email, language). `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "profilePhoto": "https://example.com/newphoto.jpg",
    "languagePreference": "fr"
  }
  ```
- **Response**: `200 OK`

### 2.3 `DELETE /users/me`
- **Purpose**: Delete current user account and associated personal data. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `204 No Content`

### 2.4 `GET /users/saved-destinations`
- **Purpose**: Fetch user's saved/bookmarked destinations list. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK` (Array of city objects)

---

## 3. Trip Management Endpoints

### 3.1 `GET /trips`
- **Purpose**: Retrieve list of all trips created by the logged-in user for Dashboard & My Trips. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 101,
      "name": "European Tour 2026",
      "description": "Multi-city tour across France and Italy.",
      "startDate": "2026-10-10",
      "endDate": "2026-10-20",
      "coverPhoto": "https://example.com/paris.jpg",
      "destinationCount": 2,
      "estimatedTotalCost": 2450.00
    }
  ]
  ```

### 3.2 `POST /trips`
- **Purpose**: Initiate creation of a new travel plan. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Request Body**:
  ```json
  {
    "name": "European Tour 2026",
    "description": "Multi-city tour across France and Italy.",
    "startDate": "2026-10-10",
    "endDate": "2026-10-20",
    "coverPhoto": "https://example.com/paris.jpg"
  }
  ```
- **Response**: `201 Created` with created Trip object.

### 3.3 `GET /trips/{tripId}`
- **Purpose**: Get metadata details of a specific trip. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`

### 3.4 `PUT /trips/{tripId}`
- **Purpose**: Edit trip name, dates, description, or cover photo. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`

### 3.5 `DELETE /trips/{tripId}`
- **Purpose**: Delete a trip and its associated stops/activities. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `204 No Content`

---

## 4. City Search & Discovery Endpoints

### 4.1 `GET /cities`
- **Purpose**: Search cities by name with meta info (country, cost index, popularity) and filters. `[Explicitly Required by PDF]`
- **Auth**: Public / Authenticated
- **Query Parameters**:
  - `search`: String (e.g. `Paris`)
  - `country`: String (e.g. `France`)
  - `region`: String (e.g. `Europe`)
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 12,
      "name": "Paris",
      "country": "France",
      "region": "Europe",
      "costIndex": 4.2,
      "popularity": 95,
      "imageUrl": "https://images.example.com/paris.jpg"
    }
  ]
  ```

### 4.2 `GET /cities/{cityId}`
- **Purpose**: Fetch single city details and metadata. `[Explicitly Required by PDF]`
- **Auth**: Public / Authenticated
- **Response**: `200 OK`

---

## 5. Itinerary Builder & Stop Endpoints

### 5.1 `POST /trips/{tripId}/stops`
- **Purpose**: Add a city stop to an itinerary with travel dates. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Request Body**:
  ```json
  {
    "cityId": 12,
    "startDate": "2026-10-10",
    "endDate": "2026-10-15",
    "stopOrder": 1
  }
  ```
- **Response**: `201 Created`

### 5.2 `PUT /trips/{tripId}/stops/{stopId}`
- **Purpose**: Update dates or notes for a city stop. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`

### 5.3 `DELETE /trips/{tripId}/stops/{stopId}`
- **Purpose**: Remove a city stop from the trip. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `204 No Content`

### 5.4 `PUT /trips/{tripId}/stops/reorder`
- **Purpose**: Reorder sequence of cities in a multi-city itinerary. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Request Body**:
  ```json
  {
    "orderedStopIds": [202, 201, 203]
  }
  ```
- **Response**: `200 OK`

---

## 6. Activity Search & Assignment Endpoints

### 6.1 `GET /cities/{cityId}/activities`
- **Purpose**: Browse available activities in a city filtered by type, cost, duration. `[Explicitly Required by PDF]`
- **Auth**: Public / Authenticated
- **Query Parameters**: `type`, `maxCost`, `maxDuration`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": 501,
      "cityId": 12,
      "name": "Eiffel Tower Guided Tour",
      "type": "SIGHTSEEING",
      "estimatedCost": 45.00,
      "durationMin": 120,
      "imageUrl": "https://images.example.com/eiffel.jpg"
    }
  ]
  ```

### 6.2 `POST /trips/{tripId}/stops/{stopId}/activities`
- **Purpose**: Assign an activity to a trip stop on a specific date/time. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Request Body**:
  ```json
  {
    "activityId": 501,
    "activityDate": "2026-10-11",
    "startTime": "10:00:00",
    "estimatedCost": 45.00,
    "notes": "Booked tickets online"
  }
  ```
- **Response**: `201 Created`

### 6.3 `PUT /trips/{tripId}/activities/{tripActivityId}`
- **Purpose**: Edit scheduled activity time, date, or cost. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`

### 6.4 `DELETE /trips/{tripId}/activities/{tripActivityId}`
- **Purpose**: Remove assigned activity from a trip stop. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `204 No Content`

---

## 7. Itinerary View & Calendar Endpoints

### 7.1 `GET /trips/{tripId}/itinerary`
- **Purpose**: Get structured day-wise itinerary, timeline, and schedule blocks. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`
  ```json
  {
    "tripId": 101,
    "tripName": "European Tour 2026",
    "days": [
      {
        "date": "2026-10-10",
        "city": "Paris",
        "activities": [
          {
            "tripActivityId": 901,
            "name": "Eiffel Tower Tour",
            "time": "10:00:00",
            "durationMin": 120,
            "cost": 45.00
          }
        ]
      }
    ]
  }
  ```

---

## 8. Trip Budget & Financial Endpoints

### 8.1 `GET /trips/{tripId}/budget`
- **Purpose**: Get total financial breakdown (Transport, Stay, Activities, Meals), daily averages, and overbudget flags. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`
  ```json
  {
    "tripId": 101,
    "totalEstimatedCost": 2450.00,
    "averageCostPerDay": 245.00,
    "categoryBreakdown": {
      "TRANSPORT": 600.00,
      "STAY": 1000.00,
      "ACTIVITIES": 450.00,
      "MEALS": 400.00
    },
    "overbudgetDays": [
      {
        "date": "2026-10-12",
        "dayCost": 420.00,
        "alertMessage": "Exceeds average daily budget threshold"
      }
    ]
  }
  ```

---

## 9. Sharing & Public Itinerary Endpoints

### 9.1 `POST /trips/{tripId}/share`
- **Purpose**: Generate or fetch unique public share URL token for an itinerary. `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `200 OK`
  ```json
  {
    "shareToken": "a1b2c3d4-trip-public-token",
    "publicUrl": "/shared/a1b2c3d4-trip-public-token",
    "isPublic": true
  }
  ```

### 9.2 `GET /public/trips/{shareToken}`
- **Purpose**: Retrieve read-only trip itinerary payload for public view page. `[Explicitly Required by PDF]`
- **Auth**: Public
- **Response**: `200 OK` (Full read-only trip, stops, and activities data)

### 9.3 `POST /public/trips/{shareToken}/copy`
- **Purpose**: Clone a public shared itinerary into the logged-in user's account ("Copy Trip"). `[Explicitly Required by PDF]`
- **Auth**: Bearer JWT Token
- **Response**: `201 Created` returning cloned Trip ID.

---

## 10. Admin & Analytics Endpoints `[Optional in PDF]`

### 10.1 `GET /admin/analytics`
- **Purpose**: Admin dashboard tracking platform usage, top cities, top activities, user counts. `[Optional in PDF]`
- **Auth**: Admin Bearer JWT Token
- **Response**: `200 OK`
