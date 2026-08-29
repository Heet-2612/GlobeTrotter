package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.BalanceStatus;
import com.globetrotter.entity.Trip;
import com.globetrotter.entity.TripExpense;
import com.globetrotter.entity.TripMember;
import com.globetrotter.entity.TripSettlement;
import com.globetrotter.entity.User;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.TripExpenseRepository;
import com.globetrotter.repository.TripMemberRepository;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.TripSettlementRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TripBalanceService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final TripSettlementRepository tripSettlementRepository;
    private final TripMemberService tripMemberService;
    private final TripBalanceCalculator tripBalanceCalculator;
    private final DebtSimplifier debtSimplifier;

    public TripBalanceService(TripRepository tripRepository,
                              TripMemberRepository tripMemberRepository,
                              TripExpenseRepository tripExpenseRepository,
                              TripSettlementRepository tripSettlementRepository,
                              TripMemberService tripMemberService,
                              TripBalanceCalculator tripBalanceCalculator,
                              DebtSimplifier debtSimplifier) {
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.tripSettlementRepository = tripSettlementRepository;
        this.tripMemberService = tripMemberService;
        this.tripBalanceCalculator = tripBalanceCalculator;
        this.debtSimplifier = debtSimplifier;
    }

    @Transactional(readOnly = true)
    public TripBalanceResponse getTripBalances(Long tripId, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view balances for this trip.");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        List<TripMember> allMembers = tripMemberRepository.findByTripId(tripId);
        List<TripExpense> allExpenses = tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);
        List<TripSettlement> allSettlements = tripSettlementRepository.findByTripId(tripId);

        TripBalanceCalculator.CalculationResult result = tripBalanceCalculator.calculateBalances(allMembers, allExpenses, allSettlements);
        List<DebtTransferResponse> transfers = debtSimplifier.simplifyDebts(result.getMemberBalances());

        MyBalanceSummaryResponse mySummary = null;
        Optional<MemberBalanceResponse> myBalOpt = result.getMemberBalances().stream()
                .filter(mb -> mb.isGtUser() && currentUser.getId().equals(mb.getGtUserId()))
                .findFirst();

        if (myBalOpt.isPresent()) {
            MemberBalanceResponse myBal = myBalOpt.get();
            String msg;
            if (myBal.getBalanceStatus() == BalanceStatus.GETS_BACK) {
                msg = "You are owed ₹" + myBal.getNetBalance().abs() + " in total";
            } else if (myBal.getBalanceStatus() == BalanceStatus.OWES) {
                msg = "You owe ₹" + myBal.getNetBalance().abs() + " in total";
            } else {
                msg = "You are all settled up!";
            }

            mySummary = new MyBalanceSummaryResponse(
                    myBal.getMemberId(),
                    myBal.getNetBalance(),
                    myBal.getBalanceStatus(),
                    msg
            );
        }

        String currency = "INR"; // Base calculation currency

        return new TripBalanceResponse(
                trip.getId(),
                currency,
                result.getTotalTripExpenses(),
                result.getMemberBalances(),
                transfers,
                mySummary
        );
    }
}
