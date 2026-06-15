package com.AVi.loved_card.order.exception;

import com.AVi.loved_card.common.dto.AppResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.HttpStatus;

/**
 * Map exception order-service → {@link AppResponse} thống nhất (Q12).
 */
@RestControllerAdvice(basePackages = "com.AVi.loved_card.order")
@Slf4j
public class OrderExceptionHandler {

    /** Lỗi nghiệp vụ có mã {@code OrderErrorCode} và HTTP status tương ứng. */
    @ExceptionHandler(OrderApiException.class)
    public ResponseEntity<AppResponse<Void>> handleOrderApiException(OrderApiException ex) {
        log.warn("Order API error: code={}, message={}", ex.getCode(), ex.getMessage());
        return ResponseEntity.status(ex.getStatus())
                .body(AppResponse.error(ex.getCode(), ex.getMessage()));
    }

    /** Bean validation trên request DTO. */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AppResponse<Void> handleConstraintViolation(ConstraintViolationException ex) {
        return AppResponse.error("VALIDATION_FAILED", ex.getMessage());
    }
}
