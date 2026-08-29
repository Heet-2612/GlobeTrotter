package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TripExpenseServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    @Autowired
    private TripStopRepository tripStopRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private TripActivityRepository tripActivityRepository;

    @Autowired
    private TripExpenseRepository tripExpenseRepository;

    @Autowired
    private TripExpenseService tripExpenseService;

    @Autowired
    private TripMemberService tripMemberService;

    private User owner;
    private User gtMemberUser;
    private User otherUser;
    private Trip trip;
    private Trip otherTrip;
    private TripMember ownerMember;
    private TripMember gtMember;
    private TripMember guestMember;
    private TripMember inactiveMember;
    private TripMember otherTripMember;
    private TripActivity tripActivity;
    private TripActivity otherTripActivity;

    @BeforeEach
    void setUp() {
        owner = userRepository.save(User.builder().name("Aditya Owner").email("owner_" + System.currentTimeMillis() + "@example.com").passwordHash("pwd").build());
        gtMemberUser = userRepository.save(User.builder().name("Rahul Member").email("rahul_" + System.currentTimeMillis() + "@example.com").passwordHash("pwd").build());
        otherUser = userRepository.save(User.builder().name("Other User").email("other_" + System.currentTimeMillis() + "@example.com").passwordHash("pwd").build());

        trip = tripRepository.save(Trip.builder().user(owner).name("Rajasthan Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());
        otherTrip = tripRepository.save(Trip.builder().user(otherUser).name("Kerala Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());

        ownerMember = tripMemberService.ensureOwnerIsMember(trip);
        gtMember = TripMember.builder().trip(trip).user(gtMemberUser).fullName("Rahul Member").role("MEMBER").status("ACTIVE").build();
        gtMember = tripMemberRepository.save(gtMember);

        guestMember = TripMember.builder().trip(trip).user(null).fullName("Priya Patel").role("MEMBER").status("ACTIVE").build();
        guestMember = tripMemberRepository.save(guestMember);

        inactiveMember = TripMember.builder().trip(trip).user(null).fullName("Inactive Guest").role("MEMBER").status("INACTIVE").build();
        inactiveMember = tripMemberRepository.save(inactiveMember);

        otherTripMember = tripMemberService.ensureOwnerIsMember(otherTrip);

        Destination dest = destinationRepository.save(Destination.builder().name("Jaipur_" + System.currentTimeMillis()).build());
        TripStop stop = tripStopRepository.save(TripStop.builder().trip(trip).destination(dest).stopOrder(1).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(2)).build());
        Activity act = activityRepository.save(Activity.builder().destination(dest).name("Amber Fort").category("HISTORIC").estimatedDurationMinutes(60).estimatedCost(100.0).currency("INR").build());
        tripActivity = tripActivityRepository.save(TripActivity.builder().tripStop(stop).activity(act).activityOrder(1).scheduledDate(LocalDate.now()).build());

        Destination otherDest = destinationRepository.save(Destination.builder().name("Munnar_" + System.currentTimeMillis()).build());
        TripStop otherStop = tripStopRepository.save(TripStop.builder().trip(otherTrip).destination(otherDest).stopOrder(1).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(2)).build());
        Activity otherAct = activityRepository.save(Activity.builder().destination(otherDest).name("Tea Gardens").category("SIGHTSEEING").estimatedDurationMinutes(60).estimatedCost(100.0).currency("INR").build());
        otherTripActivity = tripActivityRepository.save(TripActivity.builder().tripStop(otherStop).activity(otherAct).activityOrder(1).scheduledDate(LocalDate.now()).build());
    }

    @Test
    void test1_CreateActivityLinkedExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Entry Tickets", new BigDecimal("800.00"), "INR", ExpenseCategory.TICKETS,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), tripActivity.getId(), "Amber Fort tickets",
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null), new ExpenseParticipantRequest(gtMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);

        assertNotNull(res);
        assertTrue(res.isActivityLinked());
        assertEquals(tripActivity.getId(), res.getTripActivityId());
        assertEquals("Amber Fort", res.getActivityName());
        assertEquals(new BigDecimal("800.00"), res.getAmount());
    }

    @Test
    void test2_CreateCustomExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Airport Taxi", new BigDecimal("1200.00"), "INR", ExpenseCategory.TRANSPORT,
                LocalDate.now(), SplitType.EQUAL, gtMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null), new ExpenseParticipantRequest(gtMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, gtMemberUser);

        assertNotNull(res);
        assertFalse(res.isActivityLinked());
        assertNull(res.getTripActivityId());
        assertEquals("Airport Taxi", res.getTitle());
    }

    @Test
    void test3_RetrieveExpensesList() {
        CreateExpenseRequest req = new CreateExpenseRequest("Dinner", new BigDecimal("1000.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        tripExpenseService.createExpense(trip.getId(), req, owner);

        List<ExpenseResponse> list = tripExpenseService.getTripExpenses(trip.getId(), owner);
        assertEquals(1, list.size());
        assertEquals("Dinner", list.get(0).getTitle());
    }

    @Test
    void test4_RetrieveSingleExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Dinner", new BigDecimal("1000.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, owner);

        ExpenseResponse res = tripExpenseService.getExpenseById(trip.getId(), created.getId(), owner);
        assertEquals("Dinner", res.getTitle());
    }

    @Test
    void test5_UpdateExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Old Title", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, owner);

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest(
                "New Title", new BigDecimal("200.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, "Updated notes",
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.updateExpense(trip.getId(), created.getId(), updateReq, owner);
        assertEquals("New Title", res.getTitle());
        assertEquals(new BigDecimal("200.00"), res.getAmount());
    }

    @Test
    void test6_DeleteExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Dinner", new BigDecimal("1000.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, owner);

        tripExpenseService.deleteExpense(trip.getId(), created.getId(), owner);
        assertThrows(ResourceNotFoundException.class, () -> tripExpenseService.getExpenseById(trip.getId(), created.getId(), owner));
    }

    @Test
    void test7_GtMemberCreatesExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Tea & Snacks", new BigDecimal("150.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, gtMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(gtMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, gtMemberUser);
        assertEquals(gtMemberUser.getId(), res.getCreatedByUserId());
    }

    @Test
    void test8_OwnerCreatesExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Hotel Stay", new BigDecimal("5000.00"), "INR", ExpenseCategory.ACCOMMODATION,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals(owner.getId(), res.getCreatedByUserId());
    }

    @Test
    void test9_GuestContributorCanParticipateInExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Lunch", new BigDecimal("900.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null), new ExpenseParticipantRequest(guestMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals(2, res.getParticipants().size());
        assertTrue(res.getParticipants().stream().anyMatch(p -> p.getMemberId().equals(guestMember.getId())));
    }

    @Test
    void test10_GuestContributorCannotCreateExpense() {
        assertThrows(AccessDeniedException.class, () -> {
            User guestUser = User.builder().id(9999L).name("Guest").build();
            tripExpenseService.getTripExpenses(trip.getId(), guestUser);
        });
    }

    @Test
    void test11_InvalidPayerRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Invalid Payer", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, 999L, null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        assertThrows(ResourceNotFoundException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test12_PayerFromAnotherTripRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Wrong Payer", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, otherTripMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test13_ParticipantFromAnotherTripRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Wrong Participant", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(otherTripMember.getId(), null, null))
        );

        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test14_InactiveMemberRejectedForNewExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Inactive Member Test", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(inactiveMember.getId(), null, null))
        );

        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test15_ActivityFromAnotherTripRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Wrong Activity", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), otherTripActivity.getId(), null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test16_DuplicateParticipantRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Dup Participant", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null), new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test17_EmptyParticipantsRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Empty Participants", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of()
        );

        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), req, owner));
    }

    @Test
    void test18_EqualSplitCalculation() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Lunch 300", new BigDecimal("300.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null), new ExpenseParticipantRequest(gtMember.getId(), null, null), new ExpenseParticipantRequest(guestMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals(3, res.getParticipants().size());
        assertEquals(new BigDecimal("100.00"), res.getParticipants().get(0).getShareAmount());
        assertEquals(new BigDecimal("100.00"), res.getParticipants().get(1).getShareAmount());
        assertEquals(new BigDecimal("100.00"), res.getParticipants().get(2).getShareAmount());
    }

    @Test
    void test19_EqualSplitRoundingRemainderAssignedToFirstParticipant() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Dinner 100", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null), new ExpenseParticipantRequest(gtMember.getId(), null, null), new ExpenseParticipantRequest(guestMember.getId(), null, null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals(3, res.getParticipants().size());
        assertEquals(new BigDecimal("33.34"), res.getParticipants().get(0).getShareAmount());
        assertEquals(new BigDecimal("33.33"), res.getParticipants().get(1).getShareAmount());
        assertEquals(new BigDecimal("33.33"), res.getParticipants().get(2).getShareAmount());

        BigDecimal sum = res.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(new BigDecimal("100.00"), sum);
    }

    @Test
    void test20_ExactSplitValidation() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Exact Split", new BigDecimal("500.00"), "INR", ExpenseCategory.SHOPPING,
                LocalDate.now(), SplitType.EXACT, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), new BigDecimal("300.00"), null), new ExpenseParticipantRequest(gtMember.getId(), new BigDecimal("200.00"), null))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals(new BigDecimal("300.00"), res.getParticipants().get(0).getShareAmount());
        assertEquals(new BigDecimal("200.00"), res.getParticipants().get(1).getShareAmount());

        // Mismatched sum fails
        CreateExpenseRequest badReq = new CreateExpenseRequest(
                "Bad Exact", new BigDecimal("500.00"), "INR", ExpenseCategory.SHOPPING,
                LocalDate.now(), SplitType.EXACT, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), new BigDecimal("300.00"), null), new ExpenseParticipantRequest(gtMember.getId(), new BigDecimal("100.00"), null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), badReq, owner));
    }

    @Test
    void test21_PercentageSplitValidation() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Percentage Split", new BigDecimal("1000.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.PERCENTAGE, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, new BigDecimal("60.00")), new ExpenseParticipantRequest(gtMember.getId(), null, new BigDecimal("40.00")))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals(new BigDecimal("600.00"), res.getParticipants().get(0).getShareAmount());
        assertEquals(new BigDecimal("400.00"), res.getParticipants().get(1).getShareAmount());

        // Sum != 100% fails
        CreateExpenseRequest badReq = new CreateExpenseRequest(
                "Bad Pct", new BigDecimal("1000.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.PERCENTAGE, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, new BigDecimal("50.00")), new ExpenseParticipantRequest(gtMember.getId(), null, new BigDecimal("40.00")))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), badReq, owner));
    }

    @Test
    void test22_PercentageRounding() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Pct Rounding", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.PERCENTAGE, ownerMember.getId(), null, null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, new BigDecimal("33.33")), new ExpenseParticipantRequest(gtMember.getId(), null, new BigDecimal("33.33")), new ExpenseParticipantRequest(guestMember.getId(), null, new BigDecimal("33.34")))
        );

        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        BigDecimal sum = res.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(new BigDecimal("100.00"), sum);
    }

    @Test
    void test23_ExpenseAmountValidation() {
        CreateExpenseRequest zeroReq = new CreateExpenseRequest("Zero", BigDecimal.ZERO, "INR", ExpenseCategory.OTHER, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(trip.getId(), zeroReq, owner));
    }

    @Test
    void test24_CurrencyValidation() {
        CreateExpenseRequest req = new CreateExpenseRequest("Currency Test", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse res = tripExpenseService.createExpense(trip.getId(), req, owner);
        assertEquals("INR", res.getCurrency());
    }

    @Test
    void test25_MemberCanEditOwnExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Member Expense", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, gtMember.getId(), null, null, List.of(new ExpenseParticipantRequest(gtMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, gtMemberUser);

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest("Edited Title", new BigDecimal("200.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, gtMember.getId(), null, null, List.of(new ExpenseParticipantRequest(gtMember.getId(), null, null)));
        ExpenseResponse res = tripExpenseService.updateExpense(trip.getId(), created.getId(), updateReq, gtMemberUser);
        assertEquals("Edited Title", res.getTitle());
    }

    @Test
    void test26_MemberCannotEditAnotherMembersExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Owner Expense", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, owner);

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest("Attempted Edit", new BigDecimal("200.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        assertThrows(AccessDeniedException.class, () -> tripExpenseService.updateExpense(trip.getId(), created.getId(), updateReq, gtMemberUser));
    }

    @Test
    void test27_MemberCannotDeleteAnotherMembersExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Owner Expense", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, owner);

        assertThrows(AccessDeniedException.class, () -> tripExpenseService.deleteExpense(trip.getId(), created.getId(), gtMemberUser));
    }

    @Test
    void test28_OwnerCanEditAndDeleteAnyExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Member Expense", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, gtMember.getId(), null, null, List.of(new ExpenseParticipantRequest(gtMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, gtMemberUser);

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest("Owner Overridden Title", new BigDecimal("200.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse res = tripExpenseService.updateExpense(trip.getId(), created.getId(), updateReq, owner);
        assertEquals("Owner Overridden Title", res.getTitle());

        tripExpenseService.deleteExpense(trip.getId(), created.getId(), owner);
        assertThrows(ResourceNotFoundException.class, () -> tripExpenseService.getExpenseById(trip.getId(), created.getId(), owner));
    }

    @Test
    void test29_HistoricalInactiveMemberRemainsValidInExistingExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest("Historical Expense", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(trip.getId(), req, owner);

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest("Historical Update", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, ownerMember.getId(), null, null, List.of(new ExpenseParticipantRequest(inactiveMember.getId(), null, null)));
        ExpenseResponse res = tripExpenseService.updateExpense(trip.getId(), created.getId(), updateReq, owner);
        assertEquals("Historical Update", res.getTitle());
    }
}
