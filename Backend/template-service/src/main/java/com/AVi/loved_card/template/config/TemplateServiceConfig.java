package com.AVi.loved_card.template.config;

import io.minio.MinioClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Bean cấu hình chung: {@link MinioClient} và bind các {@code @ConfigurationProperties} của module.
 */
@Configuration
@EnableConfigurationProperties({
        TemplateCacheProperties.class,
        TemplateAssetProperties.class,
        StorageProperties.class
})
public class TemplateServiceConfig {

    @Bean
    public MinioClient minioClient(StorageProperties properties) {
        return MinioClient.builder()
                .endpoint(properties.endpoint())
                .credentials(properties.accessKey(), properties.secretKey())
                .build();
    }
}
