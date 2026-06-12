package com.AVi.loved_card.template.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Thông tin kết nối MinIO/S3 (endpoint, bucket, credentials) — dùng đọc/ghi file template.
 */
@ConfigurationProperties(prefix = "storage")
public record StorageProperties(
        String endpoint,
        String accessKey,
        String secretKey,
        String bucket,
        String region,
        String publicUrl
) {
}
