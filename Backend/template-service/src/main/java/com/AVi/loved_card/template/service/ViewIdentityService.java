package com.AVi.loved_card.template.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * Tạo khóa debounce view count: ưu tiên header {@code X-LC-Session-Id}, fallback hash IP + User-Agent.
 */
@Service
public class ViewIdentityService {

    private static final String SESSION_HEADER = "X-LC-Session-Id";

    public String resolveViewKey(HttpServletRequest request) {
        String sessionId = request.getHeader(SESSION_HEADER);
        if (sessionId != null && !sessionId.isBlank()) {
            return "session:" + sha256(sessionId.trim());
        }

        String ip = clientIp(request);
        String userAgent = request.getHeader("User-Agent");
        return "fingerprint:" + sha256(ip + "|" + (userAgent == null ? "" : userAgent));
    }

    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is not available", ex);
        }
    }
}
