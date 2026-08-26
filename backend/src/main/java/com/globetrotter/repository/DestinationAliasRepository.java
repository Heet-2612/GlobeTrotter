package com.globetrotter.repository;

import com.globetrotter.entity.DestinationAlias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationAliasRepository extends JpaRepository<DestinationAlias, Long> {
    List<DestinationAlias> findByDestinationId(Long destinationId);
}
