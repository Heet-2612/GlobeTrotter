package com.globetrotter.service;

import com.globetrotter.dto.DebtTransferResponse;
import com.globetrotter.dto.MemberBalanceResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Component
public class DebtSimplifier {

    private static class MemberNode {
        final Long memberId;
        final String fullName;
        BigDecimal amount; // positive value representing remaining credit or debt

        MemberNode(Long memberId, String fullName, BigDecimal amount) {
            this.memberId = memberId;
            this.fullName = fullName;
            this.amount = amount.setScale(2, RoundingMode.HALF_UP);
        }
    }

    public List<DebtTransferResponse> simplifyDebts(List<MemberBalanceResponse> memberBalances) {
        Comparator<MemberNode> heapComparator = (n1, n2) -> {
            int cmp = n2.amount.compareTo(n1.amount); // largest magnitude first
            if (cmp != 0) return cmp;
            return n1.memberId.compareTo(n2.memberId); // tie-breaker: memberId ascending
        };

        PriorityQueue<MemberNode> creditorHeap = new PriorityQueue<>(heapComparator);
        PriorityQueue<MemberNode> debtorHeap = new PriorityQueue<>(heapComparator);

        BigDecimal totalCreditorSum = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalDebtorSum = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (MemberBalanceResponse mb : memberBalances) {
            BigDecimal net = mb.getNetBalance().setScale(2, RoundingMode.HALF_UP);
            if (net.compareTo(BigDecimal.ZERO) > 0) {
                creditorHeap.add(new MemberNode(mb.getMemberId(), mb.getFullName(), net));
                totalCreditorSum = totalCreditorSum.add(net);
            } else if (net.compareTo(BigDecimal.ZERO) < 0) {
                BigDecimal debt = net.abs();
                debtorHeap.add(new MemberNode(mb.getMemberId(), mb.getFullName(), debt));
                totalDebtorSum = totalDebtorSum.add(debt);
            }
        }

        List<DebtTransferResponse> transfers = new ArrayList<>();
        BigDecimal totalTransferred = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        while (!creditorHeap.isEmpty() && !debtorHeap.isEmpty()) {
            MemberNode creditor = creditorHeap.poll();
            MemberNode debtor = debtorHeap.poll();

            BigDecimal transferAmount = creditor.amount.min(debtor.amount).setScale(2, RoundingMode.HALF_UP);

            if (transferAmount.compareTo(BigDecimal.ZERO) > 0 && !creditor.memberId.equals(debtor.memberId)) {
                transfers.add(new DebtTransferResponse(
                        debtor.memberId,
                        debtor.fullName,
                        creditor.memberId,
                        creditor.fullName,
                        transferAmount
                ));

                totalTransferred = totalTransferred.add(transferAmount);

                creditor.amount = creditor.amount.subtract(transferAmount).setScale(2, RoundingMode.HALF_UP);
                debtor.amount = debtor.amount.subtract(transferAmount).setScale(2, RoundingMode.HALF_UP);

                if (creditor.amount.compareTo(BigDecimal.ZERO) > 0) {
                    creditorHeap.add(creditor);
                }
                if (debtor.amount.compareTo(BigDecimal.ZERO) > 0) {
                    debtorHeap.add(debtor);
                }
            }
        }

        return transfers;
    }
}
