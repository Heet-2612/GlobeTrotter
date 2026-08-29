package com.globetrotter.service;

import com.globetrotter.dto.AddTripMemberRequest;
import com.globetrotter.dto.MemberBalanceResponse;
import com.globetrotter.dto.TripMemberResponse;
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
import com.globetrotter.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripMemberService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final UserRepository userRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final TripSettlementRepository tripSettlementRepository;
    private final TripBalanceCalculator tripBalanceCalculator;

    public TripMemberService(TripRepository tripRepository,
                             TripMemberRepository tripMemberRepository,
                             UserRepository userRepository,
                             TripExpenseRepository tripExpenseRepository,
                             TripSettlementRepository tripSettlementRepository,
                             TripBalanceCalculator tripBalanceCalculator) {
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.userRepository = userRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.tripSettlementRepository = tripSettlementRepository;
        this.tripBalanceCalculator = tripBalanceCalculator;
    }

    @Transactional
    public TripMember ensureOwnerIsMember(Trip trip) {
        if (trip == null || trip.getUser() == null) {
            return null;
        }

        User owner = trip.getUser();
        Optional<TripMember> existing = tripMemberRepository.findByTripIdAndUserId(trip.getId(), owner.getId());
        if (existing.isPresent()) {
            TripMember member = existing.get();
            if (!"OWNER".equals(member.getRole()) || !"ACTIVE".equals(member.getStatus())) {
                member.setRole("OWNER");
                member.setStatus("ACTIVE");
                return tripMemberRepository.save(member);
            }
            return member;
        }

        TripMember ownerMember = TripMember.builder()
                .trip(trip)
                .user(owner)
                .fullName(owner.getName() != null ? owner.getName() : "Trip Owner")
                .role("OWNER")
                .status("ACTIVE")
                .build();

        return tripMemberRepository.save(ownerMember);
    }

    @Transactional(readOnly = true)
    public List<TripMemberResponse> getTripMembers(Long tripId, Long currentUserId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        if (!isActiveTripMember(tripId, currentUserId)) {
            throw new AccessDeniedException("You do not have access to view members of this trip.");
        }

        List<TripMember> members = tripMemberRepository.findByTripIdAndStatus(tripId, "ACTIVE");
        return members.stream()
                .map(TripMemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TripMemberResponse> getTripMembers(Long tripId, User currentUser) {
        if (currentUser == null) {
            throw new AccessDeniedException("User must be authenticated.");
        }
        return getTripMembers(tripId, currentUser.getId());
    }

    @Transactional
    public TripMemberResponse addTripMember(Long tripId, AddTripMemberRequest request, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        if (!isTripOwner(tripId, currentUser.getId())) {
            throw new AccessDeniedException("Only the trip owner can add contributors.");
        }

        ensureOwnerIsMember(trip);

        if (request.getGtUserId() != null) {
            Long gtUserId = request.getGtUserId();
            User targetUser = userRepository.findById(gtUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("GlobeTrotter user not found with ID: " + gtUserId));

            if (targetUser.getId().equals(trip.getUser().getId())) {
                throw new IllegalArgumentException("User is already the trip owner.");
            }

            Optional<TripMember> existingOpt = tripMemberRepository.findByTripIdAndUserId(tripId, gtUserId);
            if (existingOpt.isPresent()) {
                TripMember existing = existingOpt.get();
                if ("ACTIVE".equals(existing.getStatus())) {
                    throw new IllegalArgumentException("GlobeTrotter user is already an active member of this trip.");
                }
                existing.setStatus("ACTIVE");
                existing.setFullName(targetUser.getName());
                TripMember updated = tripMemberRepository.save(existing);
                return TripMemberResponse.fromEntity(updated);
            }

            TripMember newMember = TripMember.builder()
                    .trip(trip)
                    .user(targetUser)
                    .fullName(targetUser.getName())
                    .role("MEMBER")
                    .status("ACTIVE")
                    .build();

            TripMember saved = tripMemberRepository.save(newMember);
            return TripMemberResponse.fromEntity(saved);
        } else if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            String name = request.getFullName().trim();

            TripMember manualMember = TripMember.builder()
                    .trip(trip)
                    .user(null)
                    .fullName(name)
                    .role("MEMBER")
                    .status("ACTIVE")
                    .build();

            TripMember saved = tripMemberRepository.save(manualMember);
            return TripMemberResponse.fromEntity(saved);
        } else {
            throw new IllegalArgumentException("Either GT User ID or full name must be provided.");
        }
    }

    @Transactional
    public void deactivateMember(Long tripId, Long memberId, User currentUser) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        if (!isTripOwner(tripId, currentUser.getId())) {
            throw new AccessDeniedException("Only the trip owner can manage contributors.");
        }

        TripMember member = tripMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip member not found with id: " + memberId));

        if (!member.getTrip().getId().equals(tripId)) {
            throw new IllegalArgumentException("Member does not belong to this trip.");
        }

        if ("OWNER".equals(member.getRole())) {
            throw new IllegalArgumentException("Cannot deactivate the trip owner.");
        }

        if ("INACTIVE".equals(member.getStatus())) {
            return;
        }

        // Authoritative balance check using multi-payer aware TripBalanceCalculator
        List<TripMember> allMembers = tripMemberRepository.findByTripId(tripId);
        List<TripExpense> allExpenses = tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);
        List<TripSettlement> allSettlements = tripSettlementRepository.findByTripIdOrderBySettlementDateDescCreatedAtDesc(tripId);

        TripBalanceCalculator.CalculationResult result = tripBalanceCalculator.calculateBalances(allMembers, allExpenses, allSettlements);

        Optional<MemberBalanceResponse> memberBalOpt = result.getMemberBalances().stream()
                .filter(mb -> mb.getMemberId().equals(memberId))
                .findFirst();

        if (memberBalOpt.isPresent()) {
            BigDecimal netBalance = memberBalOpt.get().getNetBalance();
            if (netBalance.compareTo(BigDecimal.ZERO) != 0) {
                String formattedAmt = "₹" + netBalance.abs().setScale(2, RoundingMode.HALF_UP);
                if (netBalance.compareTo(BigDecimal.ZERO) > 0) {
                    throw new IllegalArgumentException(
                            "Cannot remove " + member.getFullName() + " because they are owed " + formattedAmt + ". Please settle the balance first."
                    );
                } else {
                    throw new IllegalArgumentException(
                            "Cannot remove " + member.getFullName() + " because they have an unsettled balance of " + formattedAmt + ". Please settle the balance first."
                    );
                }
            }
        }

        member.setStatus("INACTIVE");
        tripMemberRepository.save(member);
    }

    public boolean isTripOwner(Long tripId, Long userId) {
        return tripRepository.findByIdAndUserId(tripId, userId).isPresent();
    }

    public boolean isActiveTripMember(Long tripId, Long userId) {
        if (isTripOwner(tripId, userId)) {
            return true;
        }
        return tripMemberRepository.existsByTripIdAndUserIdAndStatus(tripId, userId, "ACTIVE");
    }
}
