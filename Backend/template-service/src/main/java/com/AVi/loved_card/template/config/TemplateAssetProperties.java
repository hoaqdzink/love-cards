package com.AVi.loved_card.template.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Cấu hình seed asset demo từ classpath lên MinIO khi khởi động ({@code seed-enabled}, {@code classpath-root}).
 */
@ConfigurationProperties(prefix = "template.assets")
public record TemplateAssetProperties(
        boolean seedEnabled,
        String classpathRoot
) {
}
