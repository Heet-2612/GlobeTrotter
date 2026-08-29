package com.globetrotter.repository;

import com.globetrotter.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    Page<User> findByAuthProviderIgnoreCase(String authProvider, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<User> searchByNameOrEmail(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE (LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND UPPER(u.authProvider) = UPPER(:authProvider)")
    Page<User> searchByNameOrEmailAndAuthProvider(@Param("search") String search, @Param("authProvider") String authProvider, Pageable pageable);
}
