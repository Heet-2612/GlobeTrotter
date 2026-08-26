package com.globetrotter.exception;

public class GooglePlacesApiException extends RuntimeException {

    private final int statusCode;

    public GooglePlacesApiException(int statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
