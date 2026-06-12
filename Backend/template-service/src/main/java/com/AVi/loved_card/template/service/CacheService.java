package com.AVi.loved_card.template.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.function.Supplier;

/**
 * Wrapper Redis JSON: {@code getOrLoad} với TTL — dùng cho list/detail/featured/trending/categories.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CacheService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public <T> T getOrLoad(String key, TypeReference<T> type, Duration ttl, Supplier<T> supplier) {
        Optional<T> cached = get(key, type);
        if (cached.isPresent()) {
            return cached.get();
        }

        T value = supplier.get();
        put(key, value, ttl);
        return value;
    }

    public boolean setIfAbsent(String key, Duration ttl) {
        Boolean created = redisTemplate.opsForValue().setIfAbsent(key, "1", ttl);
        return Boolean.TRUE.equals(created);
    }

    private <T> Optional<T> get(String key, TypeReference<T> type) {
        try {
            String value = redisTemplate.opsForValue().get(key);
            if (value == null) {
                return Optional.empty();
            }
            return Optional.of(objectMapper.readValue(value, type));
        } catch (Exception ex) {
            log.warn("Ignoring cache read failure for key={}: {}", key, ex.getMessage());
            return Optional.empty();
        }
    }

    private void put(String key, Object value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(value), ttl);
        } catch (Exception ex) {
            log.warn("Ignoring cache write failure for key={}: {}", key, ex.getMessage());
        }
    }
}
