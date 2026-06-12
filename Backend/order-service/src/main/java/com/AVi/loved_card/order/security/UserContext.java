package com.AVi.loved_card.order.security;

import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.exception.OrderApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserContext {

    public static final String USER_ID_HEADER = "X-User-Id";

    public UUID requireUserId(HttpServletRequest request) {
        String raw = request.getHeader(USER_ID_HEADER);
        if (raw == null || raw.isBlank()) {
            throw new OrderApiException(
                    OrderErrorCode.AUTH_USER_REQUIRED,
                    "Yêu cầu header X-User-Id",
                    HttpStatus.UNAUTHORIZED
            );
        }
        try {
            return UUID.fromString(raw.trim());
        } catch (IllegalArgumentException ex) {
            throw new OrderApiException(
                    OrderErrorCode.AUTH_USER_REQUIRED,
                    "X-User-Id không hợp lệ",
                    HttpStatus.UNAUTHORIZED
            );
        }
    }
}
