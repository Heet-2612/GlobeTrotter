package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TripAnalyticsService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final TripSettlementRepository tripSettlementRepository;
    private final TripStopRepository tripStopRepository;
    private final TripActivityRepository tripActivityRepository;
    private final TripMemberService tripMemberService;
    private final TripBalanceCalculator tripBalanceCalculator;
    private final TripInsightEngine tripInsightEngine;

    public TripAnalyticsService(TripRepository tripRepository,
                                TripMemberRepository tripMemberRepository,
                                TripExpenseRepository tripExpenseRepository,
                                TripSettlementRepository tripSettlementRepository,
                                TripStopRepository tripStopRepository,
                                TripActivityRepository tripActivityRepository,
                                TripMemberService tripMemberService,
                                TripBalanceCalculator tripBalanceCalculator,
                                TripInsightEngine tripInsightEngine) {
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.tripSettlementRepository = tripSettlementRepository;
        this.tripStopRepository = tripStopRepository;
        this.tripActivityRepository = tripActivityRepository;
        this.tripMemberService = tripMemberService;
        this.tripBalanceCalculator = tripBalanceCalculator;
        this.tripInsightEngine = tripInsightEngine;
    }

    @Transactional(readOnly = true)
    public TripAnalyticsResponse getTripAnalytics(Long tripId,
                                                  LocalDate from,
                                                  LocalDate to,
                                                  ExpenseCategory category,
                                                  Long memberId,
                                                  String source,
                                                  User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view analytics for this trip.");
        }

        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        List<TripMember> allMembers = tripMemberRepository.findByTripId(tripId);
        if (memberId != null) {
            boolean memberExists = allMembers.stream().anyMatch(m -> m.getId().equals(memberId));
            if (!memberExists) {
                throw new ResourceNotFoundException("Trip member not found with id: " + memberId);
            }
        }

        List<TripExpense> allExpenses = tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);
        List<TripSettlement> allSettlements = tripSettlementRepository.findByTripId(tripId);
        List<TripStop> allStops = tripStopRepository.findByTripIdOrderByStopOrderAsc(tripId);

        // Reuse Phase 3/4 authoritative Balance Engine for trip-wide balance state
        TripBalanceCalculator.CalculationResult balanceResult = tripBalanceCalculator.calculateBalances(allMembers, allExpenses, allSettlements);

        // Filter expenses based on parameters
        List<TripExpense> filteredExpenses = allExpenses.stream().filter(e -> {
            if (from != null && e.getExpenseDate().isBefore(from)) {
                return false;
            }
            if (to != null && e.getExpenseDate().isAfter(to)) {
                return false;
            }
            if (category != null && e.getCategory() != category) {
                return false;
            }
            if (memberId != null) {
                boolean isPayer = e.getPayerMember() != null && e.getPayerMember().getId().equals(memberId);
                boolean isParticipant = e.getParticipants() != null && e.getParticipants().stream()
                        .anyMatch(p -> p.getMember() != null && p.getMember().getId().equals(memberId));
                if (!isPayer && !isParticipant) {
                    return false;
                }
            }
            if (source != null && !source.trim().isEmpty() && !source.equalsIgnoreCase("ALL")) {
                if (source.equalsIgnoreCase("ACTIVITY_LINKED") || source.equalsIgnoreCase("ACTIVITY")) {
                    if (e.getTripActivity() == null) return false;
                } else if (source.equalsIgnoreCase("CUSTOM")) {
                    if (e.getTripActivity() != null) return false;
                }
            }
            return true;
        }).collect(Collectors.toList());

        BigDecimal totalTripExpenses = filteredExpenses.stream()
                .map(e -> e.getAmount().setScale(2, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP), BigDecimal::add);
        int expenseCount = filteredExpenses.size();

        BigDecimal averageExpenseAmount = expenseCount > 0
                ? totalTripExpenses.divide(BigDecimal.valueOf(expenseCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalSettlementVolume = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        for (TripSettlement s : allSettlements) {
            totalSettlementVolume = totalSettlementVolume.add(s.getAmount().setScale(2, RoundingMode.HALF_UP));
        }
        int settlementCount = allSettlements.size();

        BigDecimal totalOutstandingBalance = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        for (MemberBalanceResponse mb : balanceResult.getMemberBalances()) {
            if (mb.getNetBalance().compareTo(BigDecimal.ZERO) > 0) {
                totalOutstandingBalance = totalOutstandingBalance.add(mb.getNetBalance());
            }
        }

        OverviewAnalytics overview = new OverviewAnalytics(
                totalTripExpenses,
                expenseCount,
                averageExpenseAmount,
                totalSettlementVolume,
                settlementCount,
                totalOutstandingBalance
        );

        // Member Analytics on filteredExpenses
        Map<Long, BigDecimal> memberPaidMap = new HashMap<>();
        Map<Long, BigDecimal> memberOwedMap = new HashMap<>();
        for (TripExpense e : filteredExpenses) {
            if (e.getPayerMember() != null) {
                Long pId = e.getPayerMember().getId();
                memberPaidMap.put(pId, memberPaidMap.getOrDefault(pId, BigDecimal.ZERO).add(e.getAmount()));
            }
            if (e.getParticipants() != null) {
                for (ExpenseParticipant ep : e.getParticipants()) {
                    if (ep.getMember() != null) {
                        Long mId = ep.getMember().getId();
                        memberOwedMap.put(mId, memberOwedMap.getOrDefault(mId, BigDecimal.ZERO).add(ep.getShareAmount()));
                    }
                }
            }
        }

        List<MemberAnalytics> memberBreakdown = new ArrayList<>();
        for (MemberBalanceResponse mb : balanceResult.getMemberBalances()) {
            BigDecimal paid = memberPaidMap.getOrDefault(mb.getMemberId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal owed = memberOwedMap.getOrDefault(mb.getMemberId(), BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
            BigDecimal expenseNet = paid.subtract(owed).setScale(2, RoundingMode.HALF_UP);
            BigDecimal finalNet = mb.getNetBalance().setScale(2, RoundingMode.HALF_UP);

            BigDecimal fundingPercentage = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            if (totalTripExpenses.compareTo(BigDecimal.ZERO) > 0) {
                fundingPercentage = paid.multiply(BigDecimal.valueOf(100))
                        .divide(totalTripExpenses, 2, RoundingMode.HALF_UP);
            }

            memberBreakdown.add(new MemberAnalytics(
                    mb.getMemberId(),
                    mb.getFullName(),
                    mb.isGtUser(),
                    mb.getGtUserId(),
                    mb.getMemberStatus(),
                    paid,
                    owed,
                    expenseNet,
                    finalNet,
                    fundingPercentage
            ));
        }

        // Category Analytics on filteredExpenses
        List<CategoryAnalytics> categoryBreakdown = new ArrayList<>();
        if (!filteredExpenses.isEmpty()) {
            Map<ExpenseCategory, BigDecimal> catTotalMap = new EnumMap<>(ExpenseCategory.class);
            Map<ExpenseCategory, Integer> catCountMap = new EnumMap<>(ExpenseCategory.class);

            for (TripExpense e : filteredExpenses) {
                ExpenseCategory cat = e.getCategory();
                BigDecimal amt = e.getAmount().setScale(2, RoundingMode.HALF_UP);

                catTotalMap.put(cat, catTotalMap.getOrDefault(cat, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)).add(amt));
                catCountMap.put(cat, catCountMap.getOrDefault(cat, 0) + 1);
            }

            for (Map.Entry<ExpenseCategory, BigDecimal> entry : catTotalMap.entrySet()) {
                ExpenseCategory cat = entry.getKey();
                BigDecimal catAmt = entry.getValue().setScale(2, RoundingMode.HALF_UP);
                int count = catCountMap.get(cat);

                BigDecimal pct = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
                if (totalTripExpenses.compareTo(BigDecimal.ZERO) > 0) {
                    pct = catAmt.multiply(BigDecimal.valueOf(100)).divide(totalTripExpenses, 2, RoundingMode.HALF_UP);
                }

                categoryBreakdown.add(new CategoryAnalytics(cat, catAmt, count, pct));
            }

            categoryBreakdown.sort((c1, c2) -> c2.getTotalAmount().compareTo(c1.getTotalAmount()));
        }

        // Budget Comparison Analytics
        BigDecimal targetBudget = trip.getBudget() != null ? trip.getBudget().setScale(2, RoundingMode.HALF_UP) : null;
        BigDecimal plannedItineraryCost = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (TripStop stop : allStops) {
            List<TripActivity> activities = tripActivityRepository.findByTripStopIdOrderByActivityOrderAsc(stop.getId());
            for (TripActivity ta : activities) {
                Double costVal = ta.getCustomCost() != null ? ta.getCustomCost() : (ta.getActivity() != null ? ta.getActivity().getEstimatedCost() : 0.0);
                if (costVal != null) {
                    plannedItineraryCost = plannedItineraryCost.add(BigDecimal.valueOf(costVal).setScale(2, RoundingMode.HALF_UP));
                }
            }
        }
        plannedItineraryCost = plannedItineraryCost.setScale(2, RoundingMode.HALF_UP);

        BigDecimal actualSpent = totalTripExpenses;
        BigDecimal variance = actualSpent.subtract(plannedItineraryCost).setScale(2, RoundingMode.HALF_UP);

        BudgetComparisonAnalytics budgetComparison = new BudgetComparisonAnalytics(
                targetBudget,
                plannedItineraryCost,
                actualSpent,
                variance
        );

        // Timeline Analytics on filteredExpenses
        List<TimelineAnalytics> timeline = new ArrayList<>();
        if (!filteredExpenses.isEmpty()) {
            Map<LocalDate, BigDecimal> dateTotalMap = new TreeMap<>();
            Map<LocalDate, Integer> dateCountMap = new TreeMap<>();

            for (TripExpense e : filteredExpenses) {
                LocalDate date = e.getExpenseDate();
                BigDecimal amt = e.getAmount().setScale(2, RoundingMode.HALF_UP);

                dateTotalMap.put(date, dateTotalMap.getOrDefault(date, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)).add(amt));
                dateCountMap.put(date, dateCountMap.getOrDefault(date, 0) + 1);
            }

            for (Map.Entry<LocalDate, BigDecimal> entry : dateTotalMap.entrySet()) {
                timeline.add(new TimelineAnalytics(
                        entry.getKey(),
                        entry.getValue().setScale(2, RoundingMode.HALF_UP),
                        dateCountMap.get(entry.getKey())
                ));
            }
        }

        // Top 5 Largest Expenses on filteredExpenses
        List<TopExpenseAnalytics> topExpenses = filteredExpenses.stream()
                .sorted((e1, e2) -> {
                    int cmp = e2.getAmount().compareTo(e1.getAmount());
                    if (cmp != 0) return cmp;
                    return e1.getId().compareTo(e2.getId());
                })
                .limit(5)
                .map(e -> new TopExpenseAnalytics(
                        e.getId(),
                        e.getTitle(),
                        e.getCategory(),
                        e.getPayerMember().getFullName(),
                        e.getAmount().setScale(2, RoundingMode.HALF_UP),
                        e.getExpenseDate(),
                        e.getTripActivity() != null && e.getTripActivity().getActivity() != null ? e.getTripActivity().getActivity().getName() : null
                ))
                .collect(Collectors.toList());

        // Expense Source Breakdown on filteredExpenses
        BigDecimal activityTotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        int activityCount = 0;
        BigDecimal customTotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        int customCount = 0;

        for (TripExpense e : filteredExpenses) {
            BigDecimal amt = e.getAmount().setScale(2, RoundingMode.HALF_UP);
            if (e.getTripActivity() != null) {
                activityTotal = activityTotal.add(amt);
                activityCount++;
            } else {
                customTotal = customTotal.add(amt);
                customCount++;
            }
        }

        BigDecimal activityPct = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal customPct = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (totalTripExpenses.compareTo(BigDecimal.ZERO) > 0) {
            activityPct = activityTotal.multiply(BigDecimal.valueOf(100)).divide(totalTripExpenses, 2, RoundingMode.HALF_UP);
            customPct = customTotal.multiply(BigDecimal.valueOf(100)).divide(totalTripExpenses, 2, RoundingMode.HALF_UP);
        }

        List<ExpenseSourceAnalytics> expenseSourceBreakdown = List.of(
                new ExpenseSourceAnalytics("ACTIVITY", activityTotal, activityCount, activityPct),
                new ExpenseSourceAnalytics("CUSTOM", customTotal, customCount, customPct)
        );

        // Activity-Level Spending Analysis on filteredExpenses
        Map<Long, List<TripExpense>> activityExpenseMap = filteredExpenses.stream()
                .filter(e -> e.getTripActivity() != null)
                .collect(Collectors.groupingBy(e -> e.getTripActivity().getId()));

        List<ActivitySpendingAnalytics> activitySpending = new ArrayList<>();
        for (Map.Entry<Long, List<TripExpense>> entry : activityExpenseMap.entrySet()) {
            List<TripExpense> expList = entry.getValue();
            TripActivity ta = expList.get(0).getTripActivity();

            BigDecimal actActualSpent = expList.stream()
                    .map(e -> e.getAmount().setScale(2, RoundingMode.HALF_UP))
                    .reduce(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP), BigDecimal::add);

            Double costVal = ta.getCustomCost() != null ? ta.getCustomCost() : (ta.getActivity() != null ? ta.getActivity().getEstimatedCost() : 0.0);
            BigDecimal actPlannedCost = costVal != null ? BigDecimal.valueOf(costVal).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            BigDecimal actVariance = actActualSpent.subtract(actPlannedCost).setScale(2, RoundingMode.HALF_UP);

            String actName = ta.getActivity() != null ? ta.getActivity().getName() : "Activity";
            String catName = (ta.getActivity() != null && ta.getActivity().getCategory() != null) ? ta.getActivity().getCategory() : "ACTIVITY";

            activitySpending.add(new ActivitySpendingAnalytics(
                    ta.getId(),
                    actName,
                    catName,
                    actPlannedCost,
                    actActualSpent,
                    expList.size(),
                    actVariance
            ));
        }

        activitySpending.sort((a1, a2) -> a2.getActualSpent().compareTo(a1.getActualSpent()));

        // Deterministic Trip Insights (Phase 5D)
        List<String> insights = tripInsightEngine.generateInsights(
                overview,
                categoryBreakdown,
                memberBreakdown,
                budgetComparison,
                timeline,
                topExpenses,
                expenseSourceBreakdown,
                activitySpending
        );

        String currency = "INR"; // Base calculation currency

        return new TripAnalyticsResponse(
                trip.getId(),
                currency,
                overview,
                categoryBreakdown,
                memberBreakdown,
                budgetComparison,
                timeline,
                topExpenses,
                expenseSourceBreakdown,
                activitySpending,
                insights
        );
    }

    @Transactional(readOnly = true)
    public TripAnalyticsResponse getTripAnalytics(Long tripId, User currentUser) {
        return getTripAnalytics(tripId, null, null, null, null, null, currentUser);
    }
}
