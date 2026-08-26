package com.globetrotter.controller;

import com.globetrotter.dto.ExchangeRateResponse;
import com.globetrotter.dto.SupportedCurrencyResponse;
import com.globetrotter.service.CurrencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/currencies")
@CrossOrigin(origins = "*")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("/rates")
    public ResponseEntity<ExchangeRateResponse> getExchangeRates() {
        return ResponseEntity.ok(currencyService.getExchangeRateResponse());
    }

    @GetMapping("/supported")
    public ResponseEntity<List<SupportedCurrencyResponse>> getSupportedCurrencies() {
        return ResponseEntity.ok(currencyService.getSupportedCurrencies());
    }

    @GetMapping("/convert")
    public ResponseEntity<Map<String, Object>> convertCurrency(
            @RequestParam("amount") Double amount,
            @RequestParam("from") String fromCurrency,
            @RequestParam("to") String toCurrency
    ) {
        Double converted = currencyService.convert(amount, fromCurrency, toCurrency);
        Map<String, Object> result = new HashMap<>();
        result.put("originalAmount", amount);
        result.put("fromCurrency", fromCurrency);
        result.put("toCurrency", toCurrency);
        result.put("convertedAmount", converted);
        return ResponseEntity.ok(result);
    }
}
