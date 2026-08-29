# GlobeTrotter Bill-Splitting Architecture

This document serves as the authoritative architectural specification for the GlobeTrotter Splitwise-style bill splitting, trip membership, balance simplification, settlement tracking, and financial analytics system.

---

## 1. Overview & Phased Roadmap

- **Phase 1 (Complete + Audited)**: Trip Contributors & Membership (`TripMember` entity, GT User & Non-GT contributor management, owner access control, shared trip dashboard visibility).
- **Phase 2 (Complete + Audited)**: Expense Foundation (`TripExpense` & `ExpenseParticipant` entities, activity-linked vs custom expenses, EQUAL / EXACT / PERCENTAGE splits, exact paisa rounding, expense permissions & UI).
- **Phase 3 (Complete + Audited)**: Balance Engine & Debt Simplification (`TripBalanceService`, exact zero-sum invariant verification, greedy minimum-flow debt graph solver, `GET /api/trips/{tripId}/balances`, `TripBalanceSection` UI).
- **Phase 4 (Complete + Audited)**: Settlement Tracking & Historical Log (`TripSettlement` entity, `V35__create_trip_settlements.sql`, `TripSettlementService`, `TripSettlementController`, `SettleUpModal.tsx`, `SettlementHistoryList.tsx`, overpayment policy enforcement).
- **Phase 5A (Complete + Audited)**: Analytics Backend Foundation (`TripAnalyticsService`, `TripAnalyticsController`, `GET /api/trips/{tripId}/analytics`, `OverviewAnalytics`, `CategoryAnalytics`, `MemberAnalytics`, `BudgetComparisonAnalytics`, `TimelineAnalytics`, `TopExpenseAnalytics`).
- **Phase 5B (Complete + Audited)**: Analytics Overview, Category Spending & Member Contribution Dashboard (`TripAnalyticsSection.tsx`, `AnalyticsOverviewCards.tsx`, `CategorySpendingBar.tsx`, `MemberSpendingTable.tsx`, `BudgetComparisonCard.tsx`, `ItineraryBuilderPage.tsx` tab integration).
- **Phase 5C (Complete + Audited)**: Spending Timeline, Top Expenses, Activity vs Custom Source Analysis & Activity Cost Tracking (`SpendingTimelineChart.tsx`, `TopExpensesList.tsx`, `ExpenseSourceBreakdown.tsx`, `ActivitySpendingList.tsx`, `ExpenseSourceAnalytics.java`, `ActivitySpendingAnalytics.java`).
- **Phase 5D (Complete)**: Deterministic Trip Insights Engine (`TripInsightEngine.java`, `TripInsightsList.tsx`, automated rule prioritization, deterministic takeaway feed).
- **Phase 5E (Upcoming)**: Final Bill-Splitting System Verification & Production Readiness Review.

---

## 2. Phase 5D — Deterministic Trip Insights Engine

### 2.1 Core Architectural Principles
1. **Deterministic & Explainable**: Insights are generated purely from existing financial analytics objects. Zero AI/LLM hallucinations, zero external API dependencies, 100% reproducible for identical financial inputs.
2. **Prioritization & Limit (Target 3–6 Insights)**:
   - **Rule 1 — Largest Category**: Identifies top spending category and its percentage of total expenses.
   - **Rule 2 — Largest Single Expense**: Highlights the largest receipt by amount.
   - **Rule 3 — Activity Cost Overrun**: Flags the activity with the highest positive cost variance over estimated plan.
   - **Rule 4 — Planned vs Actual Variance**: Reports whether overall trip spending is under or over scheduled itinerary costs.
   - **Rule 5 — Highest-Spending Day**: Identifies the peak expense date in the timeline.
   - **Rule 6 — Highest Upfront Contributor**: Highlights the primary funder and their percentage contribution.
   - **Rule 7 — Outstanding Debt / Settled Balance**: Reports remaining unsettled group balance or confirms that all balances are settled.
   - **Rule 8 — Settlement Activity**: Summarizes recorded settlement volume and transaction count.
   - **Rule 9 — Activity vs Custom Dominance (>= 60%)**: Observes if either activity bills or custom expenses clearly dominate spending.

### 2.2 Frontend Insights Feed (`TripInsightsList.tsx`)
- Displays concise takeaway cards with semantic icons (`Sparkles`, `AlertCircle`, `CheckCircle2`, `Calendar`, `TrendingUp`, `Compass`).
- Adapts subtly based on status (e.g. amber for overruns/outstanding debt, emerald for settled/under budget).
