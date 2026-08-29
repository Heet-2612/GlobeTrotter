package com.globetrotter.repository;

import com.globetrotter.entity.TripMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, Long> {

    List<TripMember> findByTripId(Long tripId);

    List<TripMember> findByTripIdAndStatus(Long tripId, String status);

    Optional<TripMember> findByTripIdAndUserId(Long tripId, Long userId);

    Optional<TripMember> findByTripIdAndUserIdAndStatus(Long tripId, Long userId, String status);

    boolean existsByTripIdAndUserIdAndStatus(Long tripId, Long userId, String status);

    List<TripMember> findByUserIdAndStatus(Long userId, String status);
}
