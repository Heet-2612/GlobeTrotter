package com.globetrotter.repository;

import com.globetrotter.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserIdOrderByStartDateAsc(Long userId);

    Optional<Trip> findByIdAndUserId(Long id, Long userId);

    Optional<Trip> findByShareToken(String shareToken);

    Optional<Trip> findByShareTokenAndIsPublicTrue(String shareToken);

    @Query("SELECT DISTINCT t FROM Trip t LEFT JOIN TripMember tm ON t.id = tm.trip.id WHERE t.user.id = :userId OR (tm.user.id = :userId AND tm.status = 'ACTIVE') ORDER BY t.startDate ASC")
    List<Trip> findAccessibleTripsForUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT t FROM Trip t LEFT JOIN TripMember tm ON t.id = tm.trip.id WHERE t.id = :id AND (t.user.id = :userId OR (tm.user.id = :userId AND tm.status = 'ACTIVE'))")
    Optional<Trip> findAccessibleTripById(@Param("id") Long id, @Param("userId") Long userId);
}
