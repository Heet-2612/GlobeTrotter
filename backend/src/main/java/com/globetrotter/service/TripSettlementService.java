package com.globetrotter.service;

import com.globetrotter.dto.CreateSettlementRequest;
import com.globetrotter.dto.MemberBalanceResponse;
import com.globetrotter.dto.SettlementResponse;
import com.globetrotter.entity.*;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripSettlementService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final TripSettlementRepository tripSettlementRepository;
    private final TripMemberService tripMemberService;
    private final TripBalanceCalculator tripBalanceCalculator;

    public TripSettlementService(TripRepository tripRepository,
                                 TripMemberRepository tripMemberRepository,
                                 TripExpenseRepository tripExpenseRepository,
                                 TripSettlementRepository tripSettlementRepository,
                                 TripMemberService tripMemberService,
                                 TripBalanceCalculator tripBalanceCalculator) {
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.tripSettlementRepository = tripSettlementRepository;
        this.tripMemberService = tripMemberService;
        this.tripBalanceCalculator = tripBalanceCalculator;
    }

    @Transactional
    public SettlementResponse createSettlement(Long tripId, CreateSettlementRequest request, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to record settlements for this trip.");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        List<TripMember> allMembers = tripMemberRepository.findByTripId(tripId);
        Optional<TripMember> currentMemberOpt = allMembers.stream()
                .filter(m -> m.getUser() != null && currentUser.getId().equals(m.getUser().getId()))
                .findFirst();

        if (currentMemberOpt.isEmpty()) {
            throw new AccessDeniedException("Active member profile not found for user.");
        }
        TripMember currentMember = currentMemberOpt.get();

        // Permission check: Owner can record for anyone; Members can only record where they are payer or receiver
        boolean isOwner = "OWNER".equalsIgnoreCase(currentMember.getRole()) || trip.getUser().getId().equals(currentUser.getId());
        boolean isPayerOrReceiver = request.getPayerMemberId().equals(currentMember.getId()) || request.getReceiverMemberId().equals(currentMember.getId());

        if (!isOwner && !isPayerOrReceiver) {
            throw new AccessDeniedException("Members can only record settlements where they are the payer or receiver.");
        }

        // Basic validations
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Settlement amount must be greater than 0.");
        }

        if (request.getPayerMemberId().equals(request.getReceiverMemberId())) {
            throw new IllegalArgumentException("Payer and receiver cannot be the same member.");
        }

        TripMember payer = tripMemberRepository.findById(request.getPayerMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Payer member not found with id: " + request.getPayerMemberId()));
        TripMember receiver = tripMemberRepository.findById(request.getReceiverMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver member not found with id: " + request.getReceiverMemberId()));

        if (!payer.getTrip().getId().equals(tripId) || !receiver.getTrip().getId().equals(tripId)) {
            throw new IllegalArgumentException("Payer and receiver must belong to the specified trip.");
        }

        // Overpayment Policy Validation
        List<TripExpense> allExpenses = tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);
        List<TripSettlement> currentSettlements = tripSettlementRepository.findByTripId(tripId);

        TripBalanceCalculator.CalculationResult currentResult = tripBalanceCalculator.calculateBalances(allMembers, allExpenses, currentSettlements);

        Optional<MemberBalanceResponse> payerBalOpt = currentResult.getMemberBalances().stream()
                .filter(mb -> mb.getMemberId().equals(payer.getId()))
                .findFirst();

        if (payerBalOpt.isEmpty() || payerBalOpt.get().getNetBalance().compareTo(BigDecimal.ZERO) >= 0) {
            throw new IllegalArgumentException("Cannot record settlement: Payer has no outstanding debt to settle.");
        }

        BigDecimal payerDebtMagnitude = payerBalOpt.get().getNetBalance().abs().setScale(2, RoundingMode.HALF_UP);
        BigDecimal settlementAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);

        if (settlementAmount.compareTo(payerDebtMagnitude) > 0) {
            throw new IllegalArgumentException("Settlement amount (₹" + settlementAmount + ") exceeds payer's total outstanding debt (₹" + payerDebtMagnitude + "). Overpayments are not permitted.");
        }

        String currency = request.getCurrency() != null ? request.getCurrency() : "INR";

        TripSettlement settlement = TripSettlement.builder()
                .trip(trip)
                .payerMember(payer)
                .receiverMember(receiver)
                .amount(settlementAmount)
                .currency(currency)
                .settlementDate(request.getSettlementDate())
                .notes(request.getNotes())
                .createdByUser(currentUser)
                .build();

        TripSettlement saved = tripSettlementRepository.save(settlement);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SettlementResponse> getTripSettlements(Long tripId, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view settlements for this trip.");
        }

        List<TripSettlement> settlements = tripSettlementRepository.findByTripIdOrderBySettlementDateDescCreatedAtDesc(tripId);
        return settlements.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SettlementResponse getSettlementById(Long tripId, Long settlementId, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view settlements for this trip.");
        }

        TripSettlement settlement = tripSettlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found with id: " + settlementId));

        if (!settlement.getTrip().getId().equals(tripId)) {
            throw new ResourceNotFoundException("Settlement not found with id: " + settlementId + " in trip: " + tripId);
        }

        return mapToResponse(settlement);
    }

    @Transactional
    public void deleteSettlement(Long tripId, Long settlementId, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to delete settlements for this trip.");
        }

        TripSettlement settlement = tripSettlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found with id: " + settlementId));

        if (!settlement.getTrip().getId().equals(tripId)) {
            throw new ResourceNotFoundException("Settlement not found with id: " + settlementId + " in trip: " + tripId);
        }

        boolean isTripOwner = settlement.getTrip().getUser().getId().equals(currentUser.getId());
        boolean isCreator = settlement.getCreatedByUser().getId().equals(currentUser.getId());

        if (!isTripOwner && !isCreator) {
            throw new AccessDeniedException("Only the trip owner or settlement creator can delete this settlement.");
        }

        tripSettlementRepository.delete(settlement);
    }

    private SettlementResponse mapToResponse(TripSettlement settlement) {
        return SettlementResponse.builder()
                .id(settlement.getId())
                .tripId(settlement.getTrip().getId())
                .payerMemberId(settlement.getPayerMember().getId())
                .payerMemberName(settlement.getPayerMember().getFullName())
                .receiverMemberId(settlement.getReceiverMember().getId())
                .receiverMemberName(settlement.getReceiverMember().getFullName())
                .amount(settlement.getAmount())
                .currency(settlement.getCurrency())
                .settlementDate(settlement.getSettlementDate())
                .notes(settlement.getNotes())
                .createdByUserId(settlement.getCreatedByUser().getId())
                .createdByName(settlement.getCreatedByUser().getName())
                .createdAt(settlement.getCreatedAt())
                .build();
    }
}
