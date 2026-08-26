package com.globetrotter.repository;

import com.globetrotter.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Deprecated
@Repository
public interface CityRepository extends JpaRepository<Destination, Long> {

    @Query("SELECT d FROM Destination d LEFT JOIN d.regionEntity r WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.canonicalName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:country IS NULL OR :country = '' OR LOWER(d.country) = LOWER(:country)) AND " +
           "(:region IS NULL OR :region = '' OR LOWER(d.legacyRegion) = LOWER(:region) OR LOWER(r.name) = LOWER(:region)) " +
           "ORDER BY d.name ASC")
    List<Destination> searchCities(@Param("search") String search,
                                   @Param("country") String country,
                                   @Param("region") String region);
}
