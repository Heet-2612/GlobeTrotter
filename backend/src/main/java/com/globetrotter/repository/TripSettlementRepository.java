package com.globetrotter.repository;

import com.globetrotter.entity.TripSettlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripSettlementRepository extends JpaRepository<TripSettlement, Long> {

    List<TripSettlement> findByTripIdOrderBySettlementDateDescCreatedAtDesc(Long tripId);

    List<TripSettlement> findByTripId(Long tripId);
}
