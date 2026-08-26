package com.globetrotter.client;

import java.util.Map;

public interface ExchangeRateClient {
    Map<String, Double> fetchLatestRates();
}
