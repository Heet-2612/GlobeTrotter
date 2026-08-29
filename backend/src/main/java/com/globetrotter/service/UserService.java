package com.globetrotter.service;

import com.globetrotter.dto.UserResponse;
import com.globetrotter.entity.User;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.UserRepository;
import com.globetrotter.security.AdminSecurityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AdminSecurityService adminSecurityService;

    public UserService(UserRepository userRepository, AdminSecurityService adminSecurityService) {
        this.userRepository = userRepository;
        this.adminSecurityService = adminSecurityService;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserResponseByEmail(String email) {
        User user = getUserByEmail(email);
        boolean isAdmin = adminSecurityService.isAdminEmail(user.getEmail());
        return UserResponse.fromEntity(user, isAdmin);
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}

