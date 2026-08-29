package com.globetrotter.controller;

import com.globetrotter.dto.CreateExpenseRequest;
import com.globetrotter.dto.ExpenseResponse;
import com.globetrotter.dto.UpdateExpenseRequest;
import com.globetrotter.entity.User;
import com.globetrotter.service.TripExpenseService;
import com.globetrotter.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/expenses")
public class TripExpenseController {

    private final TripExpenseService tripExpenseService;
    private final UserService userService;

    public TripExpenseController(TripExpenseService tripExpenseService, UserService userService) {
        this.tripExpenseService = tripExpenseService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        List<ExpenseResponse> expenses = tripExpenseService.getTripExpenses(tripId, currentUser);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpenseById(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        ExpenseResponse expense = tripExpenseService.getExpenseById(tripId, expenseId, currentUser);
        return ResponseEntity.ok(expense);
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @PathVariable Long tripId,
            @RequestBody CreateExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        ExpenseResponse created = tripExpenseService.createExpense(tripId, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @RequestBody UpdateExpenseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        ExpenseResponse updated = tripExpenseService.updateExpense(tripId, expenseId, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long tripId,
            @PathVariable Long expenseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        tripExpenseService.deleteExpense(tripId, expenseId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
