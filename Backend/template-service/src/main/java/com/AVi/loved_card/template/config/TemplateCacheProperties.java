package com.AVi.loved_card.template.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * TTL Redis cho cache catalog (list, detail, featured, trending, categories, chống đếm view trùng).
 */
@ConfigurationProperties(prefix = "template.cache")
public record TemplateCacheProperties(
        Duration listTtl,
        Duration detailTtl,
        Duration featuredTtl,
        Duration trendingTtl,
        Duration categoriesTtl,
        Duration viewDedupeTtl
) {
}
