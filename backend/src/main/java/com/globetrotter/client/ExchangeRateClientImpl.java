package com.globetrotter.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Component
public class ExchangeRateClientImpl implements ExchangeRateClient {

    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateClientImpl.class);
    private static final String EXCHANGE_RATE_API_URL = "https://open.er-api.com/v6/latest/USD";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public ExchangeRateClientImpl(ObjectMapper objectMapper) {
        this.restClient = RestClient.builder().build();
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, Double> fetchLatestRates() {
        try {
            String responseStr = restClient.get()
                    .uri(EXCHANGE_RATE_API_URL)
                    .retrieve()
                    .body(String.class);

            if (responseStr != null && !responseStr.isBlank()) {
                JsonNode root = objectMapper.readTree(responseStr);
                JsonNode ratesNode = root.get("rates");
                if (ratesNode != null && ratesNode.isObject()) {
                    Map<String, Double> ratesMap = new HashMap<>();
                    ratesNode.fields().forEachRemaining(entry -> {
                        if (entry.getValue().isNumber()) {
                            ratesMap.put(entry.getKey().toUpperCase(), entry.getValue().asDouble());
                        }
                    });
                    logger.info("Successfully fetched {} live exchange rates from open.er-api.com", ratesMap.size());
                    return ratesMap;
                }
            }
        } catch (Exception e) {
            logger.warn("Failed to fetch live exchange rates from external API. Falling back to default static rates. Error: {}", e.getMessage());
        }

        return getFallbackRates();
    }

    private Map<String, Double> getFallbackRates() {
        Map<String, Double> fallback = new HashMap<>();
        fallback.put("USD", 1.0);
        fallback.put("INR", 86.50);
        fallback.put("EUR", 0.92);
        fallback.put("GBP", 0.78);
        fallback.put("JPY", 152.30);
        return fallback;
    }
}
