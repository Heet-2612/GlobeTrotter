package com.globetrotter.repository;

import com.globetrotter.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("SELECT a FROM Activity a WHERE " +
           "(:destinationId IS NULL OR a.destination.id = :destinationId) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(a.category) = LOWER(:category)) AND " +
           "(:source IS NULL OR :source = '' OR LOWER(a.source) = LOWER(:source)) " +
           "ORDER BY a.destination.isCurated DESC, a.subcategoryId DESC, a.name ASC")
    List<Activity> searchActivities(@Param("destinationId") Long destinationId,
                                    @Param("search") String search,
                                    @Param("category") String category,
                                    @Param("source") String source);

    List<Activity> findByDestinationId(Long destinationId);

    List<Activity> findByDestinationIdAndSourceIgnoreCaseOrderByNameAsc(Long destinationId, String source);

    Optional<Activity> findByDestinationIdAndSourceIgnoreCaseAndExternalId(Long destinationId, String source, String externalId);

    Optional<Activity> findByDestinationIdAndGooglePlaceId(Long destinationId, String googlePlaceId);

    @Deprecated
    default List<Activity> findByCityId(Long cityId) {
        return findByDestinationId(cityId);
    }

    @Deprecated
    default Optional<Activity> findByCityIdAndGooglePlaceId(Long cityId, String googlePlaceId) {
        return findByDestinationIdAndGooglePlaceId(cityId, googlePlaceId);
    }
}
