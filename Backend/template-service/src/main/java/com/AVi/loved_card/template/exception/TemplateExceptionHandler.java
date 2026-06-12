package com.AVi.loved_card.template.exception;

import com.AVi.loved_card.common.dto.AppResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Bắt lỗi trong package template và trả {@link com.AVi.loved_card.common.dto.AppResponse} chuẩn.
 */
@RestControllerAdvice(basePackages = "com.AVi.loved_card.template")
@Slf4j
public class TemplateExceptionHandler {

    @ExceptionHandler(TemplateApiException.class)
    public ResponseEntity<AppResponse<Void>> handleTemplateException(TemplateApiException ex) {
        log.warn("Template API error: code={}, message={}", ex.getCode(), ex.getMessage());
        return ResponseEntity.status(ex.getStatus())
                .body(AppResponse.error(ex.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppResponse<Void> handleConstraintViolation(ConstraintViolationException ex) {
        log.warn("Template request validation failed: {}", ex.getMessage());
        return AppResponse.error("VALIDATION_FAILED", ex.getMessage());
    }
}
