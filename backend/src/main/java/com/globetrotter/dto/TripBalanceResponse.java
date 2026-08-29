package com.globetrotter.dto;

import java.math.BigDecimal;
import java.util.List;

public class TripBalanceResponse {

    private Long tripId;
    private String currency;
    private BigDecimal totalTripExpenses;
    private List<MemberBalanceResponse> memberBalances;
    private List<DebtTransferResponse> simplifiedTransfers;
    private MyBalanceSummaryResponse myBalanceSummary;

    public TripBalanceResponse() {
    }

    public TripBalanceResponse(Long tripId, String currency, BigDecimal totalTripExpenses, List<MemberBalanceResponse> memberBalances, List<DebtTransferResponse> simplifiedTransfers, MyBalanceSummaryResponse myBalanceSummary) {
        this.tripId = tripId;
        this.currency = currency;
        this.totalTripExpenses = totalTripExpenses;
        this.memberBalances = memberBalances;
        this.simplifiedTransfers = simplifiedTransfers;
        this.myBalanceSummary = myBalanceSummary;
    }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getTotalTripExpenses() { return totalTripExpenses; }
    public void setTotalTripExpenses(BigDecimal totalTripExpenses) { this.totalTripExpenses = totalTripExpenses; }

    public List<MemberBalanceResponse> getMemberBalances() { return memberBalances; }
    public void setMemberBalances(List<MemberBalanceResponse> memberBalances) { this.memberBalances = memberBalances; }

    public List<DebtTransferResponse> getSimplifiedTransfers() { return simplifiedTransfers; }
    public void setSimplifiedTransfers(List<DebtTransferResponse> simplifiedTransfers) { this.simplifiedTransfers = simplifiedTransfers; }

    public MyBalanceSummaryResponse getMyBalanceSummary() { return myBalanceSummary; }
    public void setMyBalanceSummary(MyBalanceSummaryResponse myBalanceSummary) { this.myBalanceSummary = myBalanceSummary; }
}
