package com.globetrotter.service;

import com.globetrotter.dto.AuthResponse;
import com.globetrotter.dto.OAuth2ExchangeRequest;
import com.globetrotter.entity.User;
import com.globetrotter.exception.InvalidCredentialsException;
import com.globetrotter.repository.UserRepository;
import com.globetrotter.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceOAuth2Test {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private OAuth2ExchangeService exchangeService;

    @InjectMocks
    private AuthService authService;

    private OAuth2ExchangeRequest request;

    @BeforeEach
    void setUp() {
        request = new OAuth2ExchangeRequest();
        request.setCode("valid-code");
    }

    @Test
    void exchangeOAuth2Code_NewUser_CreatesAccount() {
        // Arrange
        Map<String, Object> attributes = Map.of(
                "sub", "google-123",
                "email", "newuser@example.com",
                "name", "New User",
                "picture", "http://example.com/pic.jpg"
        );
        when(exchangeService.exchangeCode("valid-code")).thenReturn(attributes);
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashed-random-password");
        
        User savedUser = User.builder()
                .id(1L)
                .email("newuser@example.com")
                .name("New User")
                .googleId("google-123")
                .authProvider("GOOGLE")
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateToken("newuser@example.com")).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.exchangeOAuth2Code(request);

        // Assert
        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("newuser@example.com", response.getUser().getEmail());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User capturedUser = userCaptor.getValue();
        assertEquals("GOOGLE", capturedUser.getAuthProvider());
        assertEquals("google-123", capturedUser.getGoogleId());
        assertEquals("http://example.com/pic.jpg", capturedUser.getProfilePhoto());
    }

    @Test
    void exchangeOAuth2Code_ExistingUserByEmail_LinksAccount() {
        // Arrange
        Map<String, Object> attributes = Map.of(
                "sub", "google-456",
                "email", "existing@example.com"
        );
        when(exchangeService.exchangeCode("valid-code")).thenReturn(attributes);
        when(userRepository.findByGoogleId("google-456")).thenReturn(Optional.empty());
        
        User existingUser = User.builder()
                .id(2L)
                .email("existing@example.com")
                .authProvider("LOCAL")
                .build();
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        when(tokenProvider.generateToken("existing@example.com")).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.exchangeOAuth2Code(request);

        // Assert
        assertNotNull(response);
        
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User capturedUser = userCaptor.getValue();
        assertEquals("google-456", capturedUser.getGoogleId());
        assertEquals("LOCAL", capturedUser.getAuthProvider()); // Preserves LOCAL if already set
    }

    @Test
    void exchangeOAuth2Code_ExistingGoogleUser_LogsInDirectly() {
        // Arrange
        Map<String, Object> attributes = Map.of(
                "sub", "google-789",
                "email", "googleuser@example.com"
        );
        when(exchangeService.exchangeCode("valid-code")).thenReturn(attributes);
        
        User existingUser = User.builder()
                .id(3L)
                .email("googleuser@example.com")
                .googleId("google-789")
                .authProvider("GOOGLE")
                .build();
        when(userRepository.findByGoogleId("google-789")).thenReturn(Optional.of(existingUser));
        when(tokenProvider.generateToken("googleuser@example.com")).thenReturn("jwt-token");

        // Act
        AuthResponse response = authService.exchangeOAuth2Code(request);

        // Assert
        assertNotNull(response);
        verify(userRepository, never()).save(any(User.class)); // Should not save anything
    }

    @Test
    void exchangeOAuth2Code_InvalidCode_ThrowsException() {
        // Arrange
        when(exchangeService.exchangeCode("valid-code")).thenReturn(null);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> authService.exchangeOAuth2Code(request));
    }
}
