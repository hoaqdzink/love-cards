package com.AVi.loved_card.order.exception;

import org.springframework.http.HttpStatus;

public class OrderApiException extends RuntimeException {

    private final String code;
    private final HttpStatus status;

    public OrderApiException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
