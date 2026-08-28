package com.globetrotter.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OAuth2ExchangeService {

    private final ConcurrentHashMap<String, OAuth2ExchangeRecord> codeMap = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public record OAuth2ExchangeRecord(Map<String, Object> attributes, long expiresAtMillis) {}

    // 2 minutes expiration
    private static final long EXPIRATION_MILLIS = 2 * 60 * 1000;

    /**
     * Stores OAuth2 user attributes and generates a cryptographically secure exchange code.
     */
    public String generateAndStoreCode(Map<String, Object> attributes) {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String code = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        long expiresAt = System.currentTimeMillis() + EXPIRATION_MILLIS;
        codeMap.put(code, new OAuth2ExchangeRecord(attributes, expiresAt));

        // Schedule cleanup to prevent memory leaks
        scheduler.schedule(() -> codeMap.remove(code), EXPIRATION_MILLIS, TimeUnit.MILLISECONDS);

        return code;
    }

    /**
     * Atomically retrieves and removes the OAuth2 attributes associated with the code.
     * Guaranteed single-use.
     */
    public Map<String, Object> exchangeCode(String code) {
        OAuth2ExchangeRecord record = codeMap.remove(code);
        
        if (record == null) {
            return null;
        }
        
        if (System.currentTimeMillis() > record.expiresAtMillis()) {
            return null; // Expired, though scheduler should have removed it
        }
        
        return record.attributes();
    }
}
