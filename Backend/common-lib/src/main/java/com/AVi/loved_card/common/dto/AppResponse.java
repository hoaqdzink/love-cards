package com.AVi.loved_card.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppResponse<T> {

    private boolean success;
    private String code;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public static <T> AppResponse<T> success(T data) {
        return AppResponse.<T>builder()
                .success(true)
                .code("SUCCESS")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> AppResponse<T> success(T data, String message) {
        return AppResponse.<T>builder()
                .success(true)
                .code("SUCCESS")
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> AppResponse<T> error(String code, String message) {
        return AppResponse.<T>builder()
                .success(false)
                .code(code)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> AppResponse<T> error(String code, String message, T data) {
        return AppResponse.<T>builder()
                .success(false)
                .code(code)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
