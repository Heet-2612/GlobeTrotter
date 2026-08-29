package com.globetrotter.service;

import com.globetrotter.dto.DebtTransferResponse;
import com.globetrotter.dto.MemberBalanceResponse;
import com.globetrotter.entity.BalanceStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DebtSimplifierTest {

    private DebtSimplifier debtSimplifier;

    @BeforeEach
    void setUp() {
        debtSimplifier = new DebtSimplifier();
    }

    @Test
    void testNoExpensesZeroTransfers() {
        MemberBalanceResponse m1 = new MemberBalanceResponse(1L, "Aditya", true, 1L, "OWNER", "ACTIVE", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BalanceStatus.SETTLED);
        MemberBalanceResponse m2 = new MemberBalanceResponse(2L, "Rahul", true, 2L, "MEMBER", "ACTIVE", BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BalanceStatus.SETTLED);

        List<DebtTransferResponse> transfers = debtSimplifier.simplifyDebts(List.of(m1, m2));
        assertTrue(transfers.isEmpty());
    }

    @Test
    void testEqualThreeWayExpense() {
        // A: +3000, B: -2000, C: -1000
        MemberBalanceResponse mA = new MemberBalanceResponse(10L, "Aditya", true, 1L, "OWNER", "ACTIVE", new BigDecimal("8000.00"), new BigDecimal("5000.00"), new BigDecimal("3000.00"), BalanceStatus.GETS_BACK);
        MemberBalanceResponse mB = new MemberBalanceResponse(11L, "Rahul", true, 2L, "MEMBER", "ACTIVE", new BigDecimal("2000.00"), new BigDecimal("4000.00"), new BigDecimal("-2000.00"), BalanceStatus.OWES);
        MemberBalanceResponse mC = new MemberBalanceResponse(12L, "Priya", false, null, "MEMBER", "ACTIVE", new BigDecimal("1000.00"), new BigDecimal("2000.00"), new BigDecimal("-1000.00"), BalanceStatus.OWES);

        List<DebtTransferResponse> transfers = debtSimplifier.simplifyDebts(List.of(mA, mB, mC));

        assertEquals(2, transfers.size());
        assertEquals(11L, transfers.get(0).getFromMemberId());
        assertEquals(10L, transfers.get(0).getToMemberId());
        assertEquals(new BigDecimal("2000.00"), transfers.get(0).getAmount());

        assertEquals(12L, transfers.get(1).getFromMemberId());
        assertEquals(10L, transfers.get(1).getToMemberId());
        assertEquals(new BigDecimal("1000.00"), transfers.get(1).getAmount());
    }

    @Test
    void testComplexManyToManyGraph() {
        // A: +5000, B: +2000, C: -4000, D: -3000
        MemberBalanceResponse mA = new MemberBalanceResponse(1L, "A", true, 1L, "OWNER", "ACTIVE", new BigDecimal("10000.00"), new BigDecimal("5000.00"), new BigDecimal("5000.00"), BalanceStatus.GETS_BACK);
        MemberBalanceResponse mB = new MemberBalanceResponse(2L, "B", true, 2L, "MEMBER", "ACTIVE", new BigDecimal("7000.00"), new BigDecimal("5000.00"), new BigDecimal("2000.00"), BalanceStatus.GETS_BACK);
        MemberBalanceResponse mC = new MemberBalanceResponse(3L, "C", false, null, "MEMBER", "ACTIVE", new BigDecimal("1000.00"), new BigDecimal("5000.00"), new BigDecimal("-4000.00"), BalanceStatus.OWES);
        MemberBalanceResponse mD = new MemberBalanceResponse(4L, "D", false, null, "MEMBER", "ACTIVE", new BigDecimal("2000.00"), new BigDecimal("5000.00"), new BigDecimal("-3000.00"), BalanceStatus.OWES);

        List<DebtTransferResponse> transfers = debtSimplifier.simplifyDebts(List.of(mA, mB, mC, mD));

        assertEquals(3, transfers.size());

        BigDecimal sumTransferred = transfers.stream().map(DebtTransferResponse::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(new BigDecimal("7000.00"), sumTransferred);
    }

    @Test
    void testDeterministicTieBreakingOrder() {
        // Two debtors with identical debt magnitude (-1000): Member 10 & Member 5. Member 5 should come first due to tie-breaker memberId ascending.
        MemberBalanceResponse mA = new MemberBalanceResponse(1L, "Creditor", true, 1L, "OWNER", "ACTIVE", new BigDecimal("2000.00"), BigDecimal.ZERO, new BigDecimal("2000.00"), BalanceStatus.GETS_BACK);
        MemberBalanceResponse mB = new MemberBalanceResponse(10L, "Debtor 10", true, 2L, "MEMBER", "ACTIVE", BigDecimal.ZERO, new BigDecimal("1000.00"), new BigDecimal("-1000.00"), BalanceStatus.OWES);
        MemberBalanceResponse mC = new MemberBalanceResponse(5L, "Debtor 5", true, 3L, "MEMBER", "ACTIVE", BigDecimal.ZERO, new BigDecimal("1000.00"), new BigDecimal("-1000.00"), BalanceStatus.OWES);

        List<DebtTransferResponse> transfers = debtSimplifier.simplifyDebts(List.of(mA, mB, mC));

        assertEquals(2, transfers.size());
        assertEquals(5L, transfers.get(0).getFromMemberId());
        assertEquals(10L, transfers.get(1).getFromMemberId());
    }

    @Test
    void testOneCentAndLargeValues() {
        MemberBalanceResponse mA = new MemberBalanceResponse(1L, "A", true, 1L, "OWNER", "ACTIVE", new BigDecimal("1000000.01"), BigDecimal.ZERO, new BigDecimal("1000000.01"), BalanceStatus.GETS_BACK);
        MemberBalanceResponse mB = new MemberBalanceResponse(2L, "B", true, 2L, "MEMBER", "ACTIVE", BigDecimal.ZERO, new BigDecimal("1000000.01"), new BigDecimal("-1000000.01"), BalanceStatus.OWES);

        List<DebtTransferResponse> transfers = debtSimplifier.simplifyDebts(List.of(mA, mB));
        assertEquals(1, transfers.size());
        assertEquals(new BigDecimal("1000000.01"), transfers.get(0).getAmount());
    }
}
