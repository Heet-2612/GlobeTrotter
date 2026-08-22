# GlobeTrotter — Empowering Personalized Travel Planning

> **Odoo Hackathon Project** | Comprehensive Documentation & Architectural Specification

---

## 📌 Project Overview

**GlobeTrotter** is a personalized, intelligent, and collaborative travel planning platform designed to simplify multi-city trip creation. It allows travelers to discover global destinations, build day-wise structured itineraries, track expense budgets automatically, visualize timelines, and share travel plans with the community.

### Problem Solved
Planning multi-city travel often involves juggling disparate tools for destinations, schedules, activities, and budget calculations. GlobeTrotter unifies the end-to-end planning journey into a single interactive application backed by a relational database.

---

## ✨ Main Features

- 🔐 **Authentication**: User signup, login, and JWT-backed session security.
- 📊 **Dashboard Hub**: Personalized welcome, recent trip overview, budget highlights, and "Plan New Trip" quick action.
- ✈️ **Multi-City Itinerary Builder**: Add stops, set travel dates, reorder city sequences, and assign daily activities.
- 🔍 **City & Activity Discovery**: Search destinations with cost index ratings and filter activities by category, cost, and duration.
- 💰 **Automated Budget & Cost Breakdown**: Real-time financial summary categorized by Transport, Stay, Activities, and Meals with daily averages and over-budget warnings.
- 📅 **Interactive Timeline & Calendar View**: Visual day-by-day itinerary display with drag-to-reorder scheduling.
- 🔗 **Public Sharing & Trip Cloning**: Shareable read-only itinerary links and one-click "Copy Trip" functionality.
- 👤 **User Profile & Preferences**: Profile settings, language preferences, and bookmarked destinations list.
- 📈 **Admin Analytics Dashboard `[Optional]`**: Platform usage metrics, top visited cities, and user management tools.

---

## 🛠 Recommended Tech Stack `[Technical Recommendation]`

- **Frontend**: React (Vite SPA), React Router, TailwindCSS / Custom CSS
- **Backend**: Java Spring Boot (REST API), Spring Security (JWT), Spring Data JPA
- **Database**: PostgreSQL Relational Database
- **API Protocol**: RESTful JSON over HTTP

---

## 📂 Repository Structure

```text
GlobeTrotter_Hackathon/
├── README.md                   # Project overview & documentation index
├── docs/                       # Official project documentation
│   ├── PRD.md                  # Product Requirements Document
│   ├── ARCHITECTURE.md         # System & software architecture
│   ├── DATABASE.md             # Relational schema & ER diagram
│   ├── API.md                  # REST API contract specifications
│   ├── IMPLEMENTATION_PLAN.md  # Hackathon P0/P1/P2 execution plan
│   └── DEMO.md                 # Live demonstration script & user story
├── backend/                    # Spring Boot application source code
├── frontend/                   # React frontend application source code
└── database/                  # SQL schema & seed scripts
```

---

## 📖 Documentation Index

For detailed specifications, refer to the documentation files:
- [Product Requirements Document (PRD)](file:///c:/VScode/GlobeTrotter_Hackathon/docs/PRD.md)
- [Technical Architecture](file:///c:/VScode/GlobeTrotter_Hackathon/docs/ARCHITECTURE.md)
- [Database Schema & ER Diagram](file:///c:/VScode/GlobeTrotter_Hackathon/docs/DATABASE.md)
- [REST API Specifications](file:///c:/VScode/GlobeTrotter_Hackathon/docs/API.md)
- [Hackathon Implementation Plan](file:///c:/VScode/GlobeTrotter_Hackathon/docs/IMPLEMENTATION_PLAN.md)
- [Live Demo Script](file:///c:/VScode/GlobeTrotter_Hackathon/docs/DEMO.md)

---

## 🚀 Core MVP Flow

```text
Login / Signup 
  ➔ Dashboard 
  ➔ Create Trip (Name, Dates, Description) 
  ➔ Add City Stops 
  ➔ Assign Activities & Times 
  ➔ Review Itinerary View 
  ➔ Inspect Budget Breakdown & Daily Average 
  ➔ Share Public URL 
  ➔ Clone Trip ("Copy Trip")
```
