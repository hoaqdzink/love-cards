package com.AVi.loved_card.order.security;

import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.exception.OrderApiException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Đọc user từ header {@code X-User-Id} (Phase 2 mock; Phase 5 gateway overwrite từ JWT).
 * Thiếu hoặc UUID invalid → {@code AUTH_USER_REQUIRED} / HTTP 401.
 */
@Component
public class UserContext {

    public static final String USER_ID_HEADER = "X-User-Id";

    /**
     * Bắt buộc có user hợp lệ trên mọi API cart/order.
     *
     * @throws OrderApiException 401 nếu thiếu header hoặc không parse được UUID
     */
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
