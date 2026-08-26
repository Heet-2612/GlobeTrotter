package com.globetrotter.dto;

import java.util.Map;

public class ExchangeRateResponse {

    private String baseCode;
    private Map<String, Double> rates;
    private String lastUpdated;
    private boolean live;
    private String source;

    public ExchangeRateResponse() {
    }

    public ExchangeRateResponse(String baseCode, Map<String, Double> rates, String lastUpdated, boolean live, String source) {
        this.baseCode = baseCode;
        this.rates = rates;
        this.lastUpdated = lastUpdated;
        this.live = live;
        this.source = source;
    }

    public String getBaseCode() { return baseCode; }
    public void setBaseCode(String baseCode) { this.baseCode = baseCode; }

    public Map<String, Double> getRates() { return rates; }
    public void setRates(Map<String, Double> rates) { this.rates = rates; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }

    public boolean isLive() { return live; }
    public void setLive(boolean live) { this.live = live; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
