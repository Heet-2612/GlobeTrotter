package com.globetrotter.dto;

public class SupportedCurrencyResponse {

    private String code;
    private String symbol;
    private String name;

    public SupportedCurrencyResponse() {
    }

    public SupportedCurrencyResponse(String code, String symbol, String name) {
        this.code = code;
        this.symbol = symbol;
        this.name = name;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
