package com.globetrotter;

import com.globetrotter.client.ExchangeRateClient;
import com.globetrotter.dto.ExchangeRateResponse;
import com.globetrotter.dto.SupportedCurrencyResponse;
import com.globetrotter.service.CurrencyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CurrencyServiceTest {

    private ExchangeRateClient exchangeRateClient;
    private CurrencyService currencyService;

    @BeforeEach
    void setUp() {
        exchangeRateClient = mock(ExchangeRateClient.class);
        Map<String, Double> rates = new HashMap<>();
        rates.put("USD", 1.0);
        rates.put("INR", 86.50);
        rates.put("EUR", 0.92);
        rates.put("GBP", 0.78);
        rates.put("JPY", 152.30);

        when(exchangeRateClient.fetchLatestRates()).thenReturn(rates);
        currencyService = new CurrencyService(exchangeRateClient);
    }

    @Test
    void testSupportedCurrencies() {
        List<SupportedCurrencyResponse> supported = currencyService.getSupportedCurrencies();
        assertEquals(5, supported.size());
        assertTrue(supported.stream().anyMatch(c -> "INR".equals(c.getCode()) && "₹".equals(c.getSymbol())));
        assertTrue(supported.stream().anyMatch(c -> "USD".equals(c.getCode()) && "$".equals(c.getSymbol())));
        assertTrue(supported.stream().anyMatch(c -> "EUR".equals(c.getCode()) && "€".equals(c.getSymbol())));
        assertTrue(supported.stream().anyMatch(c -> "GBP".equals(c.getCode()) && "£".equals(c.getSymbol())));
        assertTrue(supported.stream().anyMatch(c -> "JPY".equals(c.getCode()) && "¥".equals(c.getSymbol())));
    }

    @Test
    void testConversionMathematics() {
        // 865 INR -> USD at 86.5 INR/USD should be 10.0 USD
        Double usd = currencyService.convert(865.0, "INR", "USD");
        assertEquals(10.0, usd);

        // 100 USD -> EUR at 0.92 EUR/USD should be 92.0 EUR
        Double eur = currencyService.convert(100.0, "USD", "EUR");
        assertEquals(92.0, eur);

        // Same currency conversion returns rounded original amount
        Double same = currencyService.convert(250.555, "INR", "INR");
        assertEquals(250.56, same);
    }

    @Test
    void testJPYRoundingPrecision() {
        // JPY must round to 0 decimal places
        Double jpy = currencyService.convert(10.0, "USD", "JPY");
        assertEquals(1523.0, jpy);
        assertEquals(1523.0, currencyService.roundCurrency(1523.4, "JPY"));
        assertEquals(1524.0, currencyService.roundCurrency(1523.8, "JPY"));
    }

    @Test
    void testMissingRatesAndUnsupportedCurrencies() {
        // Unsupported currency falls back gracefully without crashing
        Double result = currencyService.convert(100.0, "XYZ", "USD");
        assertNotNull(result);
    }

    @Test
    void testNullAmountAndCurrencyDefaults() {
        assertEquals(0.0, currencyService.convert(null, "INR", "USD"));
        Double res = currencyService.convert(100.0, null, null);
        assertEquals(100.0, res);
    }

    @Test
    void testRateCaching() {
        currencyService.getRates();
        currencyService.getRates();
        // Client should be invoked only once due to caching
        verify(exchangeRateClient, times(1)).fetchLatestRates();
    }
}
