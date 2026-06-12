package com.AVi.loved_card.template.exception;

import org.springframework.http.HttpStatus;

/** Ngoại lệ nghiệp vụ template — mang {@code code} (TPL_*) và HTTP status cho {@link TemplateExceptionHandler}. */
public class TemplateApiException extends RuntimeException {

    private final String code;
    private final HttpStatus status;

    public TemplateApiException(String code, String message, HttpStatus status) {
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
