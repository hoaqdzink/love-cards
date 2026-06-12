package com.AVi.loved_card.template.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CacheServiceTest {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private CacheService cacheService;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        cacheService = new CacheService(redisTemplate, new ObjectMapper());
    }

    @Test
    void getOrLoadReturnsCachedValueWithoutCallingSupplier() {
        when(valueOperations.get("template:featured")).thenReturn("[\"rose\",\"peony\"]");
        AtomicBoolean supplierCalled = new AtomicBoolean(false);

        List<String> value = cacheService.getOrLoad(
                "template:featured",
                STRING_LIST,
                Duration.ofMinutes(15),
                () -> {
                    supplierCalled.set(true);
                    return List.of("fallback");
                }
        );

        assertThat(value).containsExactly("rose", "peony");
        assertThat(supplierCalled).isFalse();
        verify(valueOperations, never()).set(eq("template:featured"), anyString(), eq(Duration.ofMinutes(15)));
    }

    @Test
    void getOrLoadStoresLoadedValueWithTtlOnMiss() {
        when(valueOperations.get("template:list:test")).thenReturn(null);

        List<String> value = cacheService.getOrLoad(
                "template:list:test",
                STRING_LIST,
                Duration.ofMinutes(5),
                () -> List.of("minimal-blush")
        );

        assertThat(value).containsExactly("minimal-blush");
        verify(valueOperations).set("template:list:test", "[\"minimal-blush\"]", Duration.ofMinutes(5));
    }

    @Test
    void getOrLoadFallsBackToSupplierWhenCachedValueCannotBeRead() {
        when(valueOperations.get("template:categories")).thenReturn("not-json");

        List<String> value = cacheService.getOrLoad(
                "template:categories",
                STRING_LIST,
                Duration.ofMinutes(30),
                () -> List.of("wedding")
        );

        assertThat(value).containsExactly("wedding");
        verify(valueOperations).set("template:categories", "[\"wedding\"]", Duration.ofMinutes(30));
    }

    @Test
    void setIfAbsentReturnsTrueOnlyWhenRedisCreatesTheKey() {
        when(valueOperations.setIfAbsent("template:view:1:session", "1", Duration.ofHours(1))).thenReturn(true);
        when(valueOperations.setIfAbsent("template:view:1:fingerprint", "1", Duration.ofHours(1))).thenReturn(false);

        assertThat(cacheService.setIfAbsent("template:view:1:session", Duration.ofHours(1))).isTrue();
        assertThat(cacheService.setIfAbsent("template:view:1:fingerprint", Duration.ofHours(1))).isFalse();
    }
}
