package com.globetrotter.service;

import com.globetrotter.dto.MemberBalanceResponse;
import com.globetrotter.entity.BalanceStatus;
import com.globetrotter.entity.ExpenseParticipant;
import com.globetrotter.entity.TripExpense;
import com.globetrotter.entity.TripMember;
import com.globetrotter.entity.TripSettlement;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Component
public class TripBalanceCalculator {

    public static class CalculationResult {
        private final BigDecimal totalTripExpenses;
        private final List<MemberBalanceResponse> memberBalances;

        public CalculationResult(BigDecimal totalTripExpenses, List<MemberBalanceResponse> memberBalances) {
            this.totalTripExpenses = totalTripExpenses;
            this.memberBalances = memberBalances;
        }

        public BigDecimal getTotalTripExpenses() { return totalTripExpenses; }
        public List<MemberBalanceResponse> getMemberBalances() { return memberBalances; }
    }

    public CalculationResult calculateBalances(List<TripMember> allMembers, List<TripExpense> allExpenses) {
        return calculateBalances(allMembers, allExpenses, Collections.emptyList());
    }

    public CalculationResult calculateBalances(List<TripMember> allMembers, List<TripExpense> allExpenses, List<TripSettlement> allSettlements) {
        Map<Long, BigDecimal> paidMap = new HashMap<>();
        Map<Long, BigDecimal> owedMap = new HashMap<>();
        Map<Long, BigDecimal> settlementsPaidMap = new HashMap<>();
        Map<Long, BigDecimal> settlementsReceivedMap = new HashMap<>();

        for (TripMember member : allMembers) {
            paidMap.put(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            owedMap.put(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            settlementsPaidMap.put(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            settlementsReceivedMap.put(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        }

        BigDecimal totalTripExpenses = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (TripExpense expense : allExpenses) {
            BigDecimal amount = expense.getAmount().setScale(2, RoundingMode.HALF_UP);
            totalTripExpenses = totalTripExpenses.add(amount);

            Long payerId = expense.getPayerMember().getId();
            paidMap.put(payerId, paidMap.getOrDefault(payerId, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)).add(amount));

            if (expense.getParticipants() != null) {
                for (ExpenseParticipant participant : expense.getParticipants()) {
                    Long partMemberId = participant.getMember().getId();
                    BigDecimal share = participant.getShareAmount().setScale(2, RoundingMode.HALF_UP);
                    owedMap.put(partMemberId, owedMap.getOrDefault(partMemberId, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)).add(share));
                }
            }
        }

        if (allSettlements != null) {
            for (TripSettlement settlement : allSettlements) {
                BigDecimal amt = settlement.getAmount().setScale(2, RoundingMode.HALF_UP);
                Long payerId = settlement.getPayerMember().getId();
                Long receiverId = settlement.getReceiverMember().getId();

                settlementsPaidMap.put(payerId, settlementsPaidMap.getOrDefault(payerId, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)).add(amt));
                settlementsReceivedMap.put(receiverId, settlementsReceivedMap.getOrDefault(receiverId, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)).add(amt));
            }
        }

        List<MemberBalanceResponse> memberBalances = new ArrayList<>();
        BigDecimal sumNetBalances = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (TripMember member : allMembers) {
            BigDecimal paid = paidMap.getOrDefault(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            BigDecimal owed = owedMap.getOrDefault(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            BigDecimal expenseNet = paid.subtract(owed).setScale(2, RoundingMode.HALF_UP);

            BigDecimal stPaid = settlementsPaidMap.getOrDefault(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            BigDecimal stReceived = settlementsReceivedMap.getOrDefault(member.getId(), BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));

            // FinalNetBalance = ExpenseNetBalance + SettlementsPaid - SettlementsReceived
            BigDecimal finalNet = expenseNet.add(stPaid).subtract(stReceived).setScale(2, RoundingMode.HALF_UP);

            // Skip inactive members who have zero historical financial activity (paid=0, owed=0, settlementsPaid=0, settlementsReceived=0)
            if ("INACTIVE".equalsIgnoreCase(member.getStatus())
                    && paid.compareTo(BigDecimal.ZERO) == 0
                    && owed.compareTo(BigDecimal.ZERO) == 0
                    && stPaid.compareTo(BigDecimal.ZERO) == 0
                    && stReceived.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            sumNetBalances = sumNetBalances.add(finalNet);

            BalanceStatus status;
            if (finalNet.compareTo(BigDecimal.ZERO) > 0) {
                status = BalanceStatus.GETS_BACK;
            } else if (finalNet.compareTo(BigDecimal.ZERO) < 0) {
                status = BalanceStatus.OWES;
            } else {
                status = BalanceStatus.SETTLED;
            }

            boolean isGt = member.getUser() != null;
            Long gtId = isGt ? member.getUser().getId() : null;

            memberBalances.add(new MemberBalanceResponse(
                    member.getId(),
                    member.getFullName(),
                    isGt,
                    gtId,
                    member.getRole(),
                    member.getStatus(),
                    paid,
                    owed,
                    finalNet,
                    status
            ));
        }

        // Exact Zero-Sum Invariant Validation
        if (sumNetBalances.setScale(2, RoundingMode.HALF_UP).compareTo(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP)) != 0) {
            throw new IllegalStateException("Financial dataset integrity error: Sum of net balances is non-zero (" + sumNetBalances + ")");
        }

        return new CalculationResult(totalTripExpenses, memberBalances);
    }
}
