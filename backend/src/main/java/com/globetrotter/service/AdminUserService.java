package com.globetrotter.service;

import com.globetrotter.dto.AdminUserDetailResponse;
import com.globetrotter.dto.AdminUserListItemResponse;
import com.globetrotter.dto.AdminUserListPageResponse;
import com.globetrotter.entity.User;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.TripMemberRepository;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.UserRepository;
import com.globetrotter.security.AdminSecurityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final AdminSecurityService adminSecurityService;

    public AdminUserService(
            UserRepository userRepository,
            TripRepository tripRepository,
            TripMemberRepository tripMemberRepository,
            AdminSecurityService adminSecurityService
    ) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.tripMemberRepository = tripMemberRepository;
        this.adminSecurityService = adminSecurityService;
    }

    @Transactional(readOnly = true)
    public AdminUserListPageResponse getUsers(int page, int size, String search, String authProvider) {
        int sanitizedPage = Math.max(0, page);
        int sanitizedSize = Math.min(Math.max(1, size), 100);

        Pageable pageable = PageRequest.of(sanitizedPage, sanitizedSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        String sanitizedSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String sanitizedAuthProvider = (authProvider != null && !authProvider.trim().isEmpty() && !authProvider.equalsIgnoreCase("ALL"))
                ? authProvider.trim().toUpperCase()
                : null;

        Page<User> userPage;
        if (sanitizedSearch != null && sanitizedAuthProvider != null) {
            userPage = userRepository.searchByNameOrEmailAndAuthProvider(sanitizedSearch, sanitizedAuthProvider, pageable);
        } else if (sanitizedSearch != null) {
            userPage = userRepository.searchByNameOrEmail(sanitizedSearch, pageable);
        } else if (sanitizedAuthProvider != null) {
            userPage = userRepository.findByAuthProviderIgnoreCase(sanitizedAuthProvider, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<AdminUserListItemResponse> content = userPage.getContent().stream()
                .map(user -> new AdminUserListItemResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getAuthProvider(),
                        user.getProfilePhoto(),
                        user.getPreferredCurrency() != null ? user.getPreferredCurrency() : "INR",
                        user.getCreatedAt(),
                        adminSecurityService.isAdminEmail(user.getEmail())
                ))
                .toList();

        return new AdminUserListPageResponse(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.hasNext(),
                userPage.hasPrevious()
        );
    }

    @Transactional(readOnly = true)
    public AdminUserDetailResponse getUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        long tripsCreated = tripRepository.countByUserId(userId);
        long tripMemberships = tripMemberRepository.countByUserId(userId);

        return new AdminUserDetailResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAuthProvider(),
                user.getProfilePhoto(),
                user.getLanguagePreference(),
                user.getPreferredCurrency() != null ? user.getPreferredCurrency() : "INR",
                user.getCreatedAt(),
                user.getUpdatedAt(),
                adminSecurityService.isAdminEmail(user.getEmail()),
                tripsCreated,
                tripMemberships
        );
    }
}
