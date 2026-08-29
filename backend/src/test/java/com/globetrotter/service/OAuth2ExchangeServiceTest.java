package com.globetrotter.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class OAuth2ExchangeServiceTest {

    private OAuth2ExchangeService exchangeService;

    @BeforeEach
    void setUp() {
        exchangeService = new OAuth2ExchangeService();
    }

    @Test
    void testGenerateAndExchangeCode_Success() {
        // Arrange
        Map<String, Object> attributes = Map.of("sub", "google-123", "email", "test@example.com");

        // Act
        String code = exchangeService.generateAndStoreCode(attributes);
        Map<String, Object> exchanged = exchangeService.exchangeCode(code);

        // Assert
        assertNotNull(code);
        assertEquals(32, java.util.Base64.getUrlDecoder().decode(code).length, "Should generate 32 bytes of secure random data");
        assertNotNull(exchanged);
        assertEquals("google-123", exchanged.get("sub"));
        assertEquals("test@example.com", exchanged.get("email"));
    }

    @Test
    void testExchangeCode_SingleUseEnforced() {
        // Arrange
        Map<String, Object> attributes = Map.of("sub", "google-123", "email", "test@example.com");
        String code = exchangeService.generateAndStoreCode(attributes);

        // Act
        Map<String, Object> firstExchange = exchangeService.exchangeCode(code);
        Map<String, Object> secondExchange = exchangeService.exchangeCode(code);

        // Assert
        assertNotNull(firstExchange, "First exchange should succeed");
        assertNull(secondExchange, "Second exchange should fail because the code was atomically removed");
    }

    @Test
    void testExchangeCode_InvalidCode() {
        // Act
        Map<String, Object> exchanged = exchangeService.exchangeCode("invalid-code");

        // Assert
        assertNull(exchanged);
    }
}
