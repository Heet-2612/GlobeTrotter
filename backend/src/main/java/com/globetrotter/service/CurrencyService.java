package com.globetrotter.service;

import com.globetrotter.client.ExchangeRateClient;
import com.globetrotter.dto.ExchangeRateResponse;
import com.globetrotter.dto.SupportedCurrencyResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CurrencyService {

    private static final Logger logger = LoggerFactory.getLogger(CurrencyService.class);
    private static final long CACHE_TTL_MINUTES = 60;

    private final ExchangeRateClient exchangeRateClient;

    private Map<String, Double> cachedRates = new HashMap<>();
    private LocalDateTime lastFetchTime = null;
    private boolean isLiveRates = false;
    private String rateSource = "STATIC_FALLBACK";

    public CurrencyService(ExchangeRateClient exchangeRateClient) {
        this.exchangeRateClient = exchangeRateClient;
    }

    public synchronized Map<String, Double> getRates() {
        if (cachedRates.isEmpty() || lastFetchTime == null || lastFetchTime.plusMinutes(CACHE_TTL_MINUTES).isBefore(LocalDateTime.now())) {
            logger.info("Exchange rates cache expired or empty. Refreshing from ExchangeRateClient...");
            Map<String, Double> newRates = exchangeRateClient.fetchLatestRates();
            if (newRates != null && !newRates.isEmpty()) {
                this.cachedRates = new HashMap<>(newRates);
                ensureDefaultRates(this.cachedRates);
                this.lastFetchTime = LocalDateTime.now();
                // Check if fetched rates returned more than static fallback
                this.isLiveRates = newRates.size() > 5 || (newRates.containsKey("INR") && newRates.get("INR") != 86.50);
                this.rateSource = this.isLiveRates ? "LIVE_API" : "STATIC_FALLBACK";
            }
        }
        return new HashMap<>(cachedRates);
    }

    public ExchangeRateResponse getExchangeRateResponse() {
        Map<String, Double> ratesMap = getRates();
        String timeStr = lastFetchTime != null ? lastFetchTime.toString() : LocalDateTime.now().toString();
        return new ExchangeRateResponse("USD", ratesMap, timeStr, isLiveRates, rateSource);
    }

    public List<SupportedCurrencyResponse> getSupportedCurrencies() {
        List<SupportedCurrencyResponse> list = new ArrayList<>();
        list.add(new SupportedCurrencyResponse("INR", "₹", "Indian Rupee"));
        list.add(new SupportedCurrencyResponse("USD", "$", "US Dollar"));
        list.add(new SupportedCurrencyResponse("EUR", "€", "Euro"));
        list.add(new SupportedCurrencyResponse("GBP", "£", "British Pound"));
        list.add(new SupportedCurrencyResponse("JPY", "¥", "Japanese Yen"));
        return list;
    }

    public Double convert(Double amount, String fromCode, String toCode) {
        if (amount == null) return 0.0;
        if (fromCode == null || fromCode.isBlank()) fromCode = "INR";
        if (toCode == null || toCode.isBlank()) toCode = "INR";

        String from = fromCode.trim().toUpperCase();
        String to = toCode.trim().toUpperCase();

        if (from.equals(to)) {
            return roundCurrency(amount, to);
        }

        Map<String, Double> rates = getRates();
        Double fromRate = rates.getOrDefault(from, getFallbackRateForCurrency(from));
        Double toRate = rates.getOrDefault(to, getFallbackRateForCurrency(to));

        if (fromRate == null || fromRate <= 0.0 || toRate == null || toRate <= 0.0) {
            logger.warn("Invalid conversion rate for {} or {}. Returning original amount.", from, to);
            return roundCurrency(amount, to);
        }

        // Base rate is USD
        double usdAmount = amount / fromRate;
        double converted = usdAmount * toRate;

        return roundCurrency(converted, to);
    }

    public Double roundCurrency(Double amount, String currencyCode) {
        if (amount == null) return 0.0;
        String code = currencyCode != null ? currencyCode.trim().toUpperCase() : "INR";
        if ("JPY".equals(code)) {
            return (double) Math.round(amount);
        }
        return Math.round(amount * 100.0) / 100.0;
    }

    private void ensureDefaultRates(Map<String, Double> ratesMap) {
        ratesMap.putIfAbsent("USD", 1.0);
        ratesMap.putIfAbsent("INR", 86.50);
        ratesMap.putIfAbsent("EUR", 0.92);
        ratesMap.putIfAbsent("GBP", 0.78);
        ratesMap.putIfAbsent("JPY", 152.30);
    }

    private Double getFallbackRateForCurrency(String code) {
        switch (code) {
            case "USD": return 1.0;
            case "INR": return 86.50;
            case "EUR": return 0.92;
            case "GBP": return 0.78;
            case "JPY": return 152.30;
            default: return 1.0;
        }
    }
}
