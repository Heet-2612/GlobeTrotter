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
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TripExpenseService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TripActivityRepository tripActivityRepository;
    private final TripExpenseRepository tripExpenseRepository;
    private final ExpenseParticipantRepository expenseParticipantRepository;
    private final TripMemberService tripMemberService;

    public TripExpenseService(TripRepository tripRepository,
                              TripMemberRepository tripMemberRepository,
                              TripActivityRepository tripActivityRepository,
                              TripExpenseRepository tripExpenseRepository,
                              ExpenseParticipantRepository expenseParticipantRepository,
                              TripMemberService tripMemberService) {
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.tripActivityRepository = tripActivityRepository;
        this.tripExpenseRepository = tripExpenseRepository;
        this.expenseParticipantRepository = expenseParticipantRepository;
        this.tripMemberService = tripMemberService;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getTripExpenses(Long tripId, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have access to view expenses for this trip.");
        }

        List<TripExpense> expenses = tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripId);
        return expenses.stream()
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long tripId, Long expenseId, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have access to view expenses for this trip.");
        }

        TripExpense expense = tripExpenseRepository.findByIdAndTripId(expenseId, tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        return ExpenseResponse.fromEntity(expense);
    }

    @Transactional
    public ExpenseResponse createExpense(Long tripId, CreateExpenseRequest request, User currentUser) {
        if (!tripMemberService.isActiveTripMember(tripId, currentUser.getId())) {
            throw new AccessDeniedException("You do not have access to add expenses to this trip.");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        validateExpenseRequest(trip, request, false);

        TripActivity activity = null;
        if (request.getTripActivityId() != null) {
            activity = tripActivityRepository.findById(request.getTripActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip activity not found with id: " + request.getTripActivityId()));
        }

        TripExpense expense = TripExpense.builder()
                .trip(trip)
                .createdByUser(currentUser)
                .tripActivity(activity)
                .title(request.getTitle().trim())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .category(request.getCategory() != null ? request.getCategory() : ExpenseCategory.OTHER)
                .expenseDate(request.getExpenseDate())
                .splitType(request.getSplitType() != null ? request.getSplitType() : SplitType.EQUAL)
                .notes(request.getNotes())
                .build();

        List<TripExpensePayer> payerEntities = calculateAndBuildPayers(expense, request, false);
        expense.setPayers(payerEntities);
        if (!payerEntities.isEmpty()) {
            expense.setPayerMember(payerEntities.get(0).getMember());
        }

        List<ExpenseParticipant> participantEntities = calculateAndBuildParticipants(expense, request.getParticipants(), request.getSplitType(), request.getAmount(), false);
        expense.setParticipants(participantEntities);

        TripExpense savedExpense = tripExpenseRepository.save(expense);
        return ExpenseResponse.fromEntity(savedExpense);
    }

    @Transactional
    public ExpenseResponse updateExpense(Long tripId, Long expenseId, UpdateExpenseRequest request, User currentUser) {
        TripExpense expense = tripExpenseRepository.findByIdAndTripId(expenseId, tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        boolean isOwner = tripMemberService.isTripOwner(tripId, currentUser.getId());
        boolean isCreator = expense.getCreatedByUser() != null && expense.getCreatedByUser().getId().equals(currentUser.getId());

        if (!isOwner && !isCreator) {
            throw new AccessDeniedException("Only the trip owner or the expense creator can edit this expense.");
        }

        Trip trip = expense.getTrip();
        CreateExpenseRequest validationAdapter = new CreateExpenseRequest(
                request.getTitle(), request.getAmount(), request.getCurrency(),
                request.getCategory(), request.getExpenseDate(), request.getSplitType(),
                request.getPayerMemberId(), request.getPayers(), request.getTripActivityId(), request.getNotes(),
                request.getParticipants()
        );
        validateExpenseRequest(trip, validationAdapter, true);

        TripActivity activity = null;
        if (request.getTripActivityId() != null) {
            activity = tripActivityRepository.findById(request.getTripActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip activity not found with id: " + request.getTripActivityId()));
        }

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        expense.setCategory(request.getCategory() != null ? request.getCategory() : ExpenseCategory.OTHER);
        expense.setExpenseDate(request.getExpenseDate());
        expense.setSplitType(request.getSplitType() != null ? request.getSplitType() : SplitType.EQUAL);
        expense.setTripActivity(activity);
        expense.setNotes(request.getNotes());

        expense.getPayers().clear();
        List<TripExpensePayer> newPayers = calculateAndBuildPayers(expense, validationAdapter, true);
        expense.getPayers().addAll(newPayers);
        if (!newPayers.isEmpty()) {
            expense.setPayerMember(newPayers.get(0).getMember());
        }

        expense.getParticipants().clear();
        List<ExpenseParticipant> newParticipants = calculateAndBuildParticipants(expense, request.getParticipants(), request.getSplitType(), request.getAmount(), true);
        expense.getParticipants().addAll(newParticipants);

        TripExpense updated = tripExpenseRepository.save(expense);
        return ExpenseResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteExpense(Long tripId, Long expenseId, User currentUser) {
        TripExpense expense = tripExpenseRepository.findByIdAndTripId(expenseId, tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));

        boolean isOwner = tripMemberService.isTripOwner(tripId, currentUser.getId());
        boolean isCreator = expense.getCreatedByUser() != null && expense.getCreatedByUser().getId().equals(currentUser.getId());

        if (!isOwner && !isCreator) {
            throw new AccessDeniedException("Only the trip owner or the expense creator can delete this expense.");
        }

        tripExpenseRepository.delete(expense);
    }

    private void validateExpenseRequest(Trip trip, CreateExpenseRequest request, boolean allowExistingInactiveParticipant) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Expense title is required.");
        }
        if (request.getTitle().trim().length() > 150) {
            throw new IllegalArgumentException("Expense title cannot exceed 150 characters.");
        }
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Expense amount must be greater than zero.");
        }
        if (request.getExpenseDate() == null) {
            throw new IllegalArgumentException("Expense date is required.");
        }

        if (request.getPayers() != null && !request.getPayers().isEmpty()) {
            Set<Long> payerMemberIds = new HashSet<>();
            BigDecimal totalPaid = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

            for (ExpensePayerRequest pReq : request.getPayers()) {
                if (pReq.getMemberId() == null) {
                    throw new IllegalArgumentException("Payer member ID is required.");
                }
                if (!payerMemberIds.add(pReq.getMemberId())) {
                    throw new IllegalArgumentException("Duplicate payer member ID: " + pReq.getMemberId());
                }
                if (pReq.getPaidAmount() == null || pReq.getPaidAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Paid amount for each payer must be greater than zero.");
                }

                TripMember payer = tripMemberRepository.findById(pReq.getMemberId())
                        .orElseThrow(() -> new ResourceNotFoundException("Payer member not found with id: " + pReq.getMemberId()));

                if (!payer.getTrip().getId().equals(trip.getId())) {
                    throw new IllegalArgumentException("Payer does not belong to this trip.");
                }
                if (!allowExistingInactiveParticipant && !"ACTIVE".equals(payer.getStatus())) {
                    throw new IllegalArgumentException("Payer member is inactive and cannot be selected.");
                }

                totalPaid = totalPaid.add(pReq.getPaidAmount().setScale(2, RoundingMode.HALF_UP));
            }

            BigDecimal expectedAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
            if (totalPaid.compareTo(expectedAmount) != 0) {
                throw new IllegalArgumentException("Sum of payer amounts (" + totalPaid + ") must exactly match expense total (" + expectedAmount + ").");
            }
        } else if (request.getPayerMemberId() != null) {
            TripMember payer = tripMemberRepository.findById(request.getPayerMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payer member not found with id: " + request.getPayerMemberId()));

            if (!payer.getTrip().getId().equals(trip.getId())) {
                throw new IllegalArgumentException("Payer does not belong to this trip.");
            }
            if (!allowExistingInactiveParticipant && !"ACTIVE".equals(payer.getStatus())) {
                throw new IllegalArgumentException("Payer member is inactive and cannot be selected.");
            }
        } else {
            throw new IllegalArgumentException("Payer member is required.");
        }

        if (request.getTripActivityId() != null) {
            TripActivity activity = tripActivityRepository.findById(request.getTripActivityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip activity not found with id: " + request.getTripActivityId()));
            if (!activity.getTripStop().getTrip().getId().equals(trip.getId())) {
                throw new IllegalArgumentException("Activity does not belong to this trip.");
            }
        }

        if (request.getParticipants() == null || request.getParticipants().isEmpty()) {
            throw new IllegalArgumentException("At least one participant is required for an expense.");
        }

        Set<Long> memberIds = new HashSet<>();
        for (ExpenseParticipantRequest pReq : request.getParticipants()) {
            if (pReq.getMemberId() == null) {
                throw new IllegalArgumentException("Participant member ID is required.");
            }
            if (!memberIds.add(pReq.getMemberId())) {
                throw new IllegalArgumentException("Duplicate participant member ID: " + pReq.getMemberId());
            }

            TripMember member = tripMemberRepository.findById(pReq.getMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Participant member not found with id: " + pReq.getMemberId()));

            if (!member.getTrip().getId().equals(trip.getId())) {
                throw new IllegalArgumentException("Participant member does not belong to this trip.");
            }
            if (!allowExistingInactiveParticipant && !"ACTIVE".equals(member.getStatus())) {
                throw new IllegalArgumentException("Inactive member (" + member.getFullName() + ") cannot be selected for a new expense.");
            }
        }
    }

    private List<TripExpensePayer> calculateAndBuildPayers(TripExpense expense, CreateExpenseRequest request, boolean isUpdate) {
        List<TripExpensePayer> result = new ArrayList<>();
        if (request.getPayers() != null && !request.getPayers().isEmpty()) {
            for (ExpensePayerRequest pReq : request.getPayers()) {
                TripMember member = tripMemberRepository.findById(pReq.getMemberId()).orElseThrow();
                result.add(TripExpensePayer.builder()
                        .expense(expense)
                        .member(member)
                        .paidAmount(pReq.getPaidAmount().setScale(2, RoundingMode.HALF_UP))
                        .build());
            }
        } else if (request.getPayerMemberId() != null) {
            TripMember member = tripMemberRepository.findById(request.getPayerMemberId()).orElseThrow();
            result.add(TripExpensePayer.builder()
                    .expense(expense)
                    .member(member)
                    .paidAmount(request.getAmount().setScale(2, RoundingMode.HALF_UP))
                    .build());
        }
        return result;
    }

    private List<ExpenseParticipant> calculateAndBuildParticipants(TripExpense expense, List<ExpenseParticipantRequest> pRequests, SplitType splitType, BigDecimal totalAmount, boolean isUpdate) {
        List<ExpenseParticipant> result = new ArrayList<>();
        int count = pRequests.size();

        if (splitType == SplitType.EQUAL) {
            BigDecimal countBd = BigDecimal.valueOf(count);
            BigDecimal baseShare = totalAmount.divide(countBd, 2, RoundingMode.FLOOR);
            BigDecimal totalAssigned = baseShare.multiply(countBd);
            BigDecimal remainder = totalAmount.subtract(totalAssigned);

            for (int i = 0; i < count; i++) {
                ExpenseParticipantRequest pReq = pRequests.get(i);
                TripMember member = tripMemberRepository.findById(pReq.getMemberId()).orElseThrow();
                BigDecimal share = (i == 0) ? baseShare.add(remainder) : baseShare;

                result.add(ExpenseParticipant.builder()
                        .expense(expense)
                        .member(member)
                        .shareAmount(share)
                        .build());
            }
        } else if (splitType == SplitType.EXACT) {
            BigDecimal sumExact = BigDecimal.ZERO;
            for (ExpenseParticipantRequest pReq : pRequests) {
                if (pReq.getShareAmount() == null || pReq.getShareAmount().compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Exact share amount cannot be negative or null.");
                }
                sumExact = sumExact.add(pReq.getShareAmount());
            }

            if (sumExact.setScale(2, RoundingMode.HALF_UP).compareTo(totalAmount.setScale(2, RoundingMode.HALF_UP)) != 0) {
                throw new IllegalArgumentException("Sum of exact shares (" + sumExact + ") must equal the total expense amount (" + totalAmount + ").");
            }

            for (ExpenseParticipantRequest pReq : pRequests) {
                TripMember member = tripMemberRepository.findById(pReq.getMemberId()).orElseThrow();
                result.add(ExpenseParticipant.builder()
                        .expense(expense)
                        .member(member)
                        .shareAmount(pReq.getShareAmount().setScale(2, RoundingMode.HALF_UP))
                        .build());
            }
        } else if (splitType == SplitType.PERCENTAGE) {
            BigDecimal sumPct = BigDecimal.ZERO;
            for (ExpenseParticipantRequest pReq : pRequests) {
                if (pReq.getPercentage() == null || pReq.getPercentage().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Percentage share must be greater than zero.");
                }
                sumPct = sumPct.add(pReq.getPercentage());
            }

            if (sumPct.setScale(2, RoundingMode.HALF_UP).compareTo(BigDecimal.valueOf(100.00).setScale(2, RoundingMode.HALF_UP)) != 0) {
                throw new IllegalArgumentException("Sum of percentage shares (" + sumPct + "%) must equal 100%.");
            }

            BigDecimal sumCalculatedShares = BigDecimal.ZERO;
            for (int i = 0; i < count; i++) {
                ExpenseParticipantRequest pReq = pRequests.get(i);
                TripMember member = tripMemberRepository.findById(pReq.getMemberId()).orElseThrow();

                BigDecimal share = totalAmount.multiply(pReq.getPercentage())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                if (i < count - 1) {
                    sumCalculatedShares = sumCalculatedShares.add(share);
                } else {
                    // Last participant gets remainder delta to ensure sum == totalAmount
                    share = totalAmount.subtract(sumCalculatedShares);
                }

                result.add(ExpenseParticipant.builder()
                        .expense(expense)
                        .member(member)
                        .shareAmount(share)
                        .build());
            }
        }

        return result;
    }
}
