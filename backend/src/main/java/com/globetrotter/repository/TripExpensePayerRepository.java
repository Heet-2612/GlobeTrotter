package com.globetrotter.repository;

import com.globetrotter.entity.TripExpensePayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripExpensePayerRepository extends JpaRepository<TripExpensePayer, Long> {

    List<TripExpensePayer> findByExpenseId(Long expenseId);

    void deleteByExpenseId(Long expenseId);
}
