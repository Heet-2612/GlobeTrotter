package com.globetrotter.repository;

import com.globetrotter.entity.TripExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripExpenseRepository extends JpaRepository<TripExpense, Long> {

    List<TripExpense> findByTripIdOrderByExpenseDateDescCreatedAtDesc(Long tripId);

    Optional<TripExpense> findByIdAndTripId(Long id, Long tripId);

    List<TripExpense> findByTripActivityId(Long tripActivityId);

    long countByTripActivityId(Long tripActivityId);
}
