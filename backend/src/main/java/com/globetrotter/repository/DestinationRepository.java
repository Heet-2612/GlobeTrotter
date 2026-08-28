package com.globetrotter.repository;

import com.globetrotter.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    @Query("SELECT DISTINCT d FROM Destination d LEFT JOIN d.regionEntity r LEFT JOIN d.aliases a WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.canonicalName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.aliasName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:country IS NULL OR :country = '' OR LOWER(d.country) = LOWER(:country)) AND " +
           "(:region IS NULL OR :region = '' OR LOWER(d.legacyRegion) = LOWER(:region) OR LOWER(r.name) = LOWER(:region)) AND " +
           "(:regionId IS NULL OR r.id = :regionId) AND " +
           "(:curated IS NULL OR d.isCurated = :curated) " +
           "ORDER BY d.isCurated DESC, d.name ASC")
    List<Destination> searchDestinations(@Param("search") String search,
                                        @Param("country") String country,
                                        @Param("region") String region,
                                        @Param("regionId") Long regionId,
                                        @Param("curated") Boolean curated);

    Optional<Destination> findByCanonicalName(String canonicalName);
}
