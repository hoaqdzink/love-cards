package com.AVi.loved_card.template.service;

import com.AVi.loved_card.template.config.StorageProperties;
import com.AVi.loved_card.template.config.TemplateAssetProperties;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

/**
 * Khi start (nếu {@code template.assets.seed-enabled}): upload asset demo từ classpath lên bucket MinIO.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TemplateAssetSeeder implements ApplicationRunner {

    private static final List<String> DEMO_TEMPLATE_SLUGS = List.of(
            "peony-dream",
            "rose-garden",
            "minimal-blush"
    );
    private static final List<String> ASSET_FILES = List.of("preview.html", "thumbnail.svg");

    private final MinioClient minioClient;
    private final StorageProperties storageProperties;
    private final TemplateAssetProperties assetProperties;

    @Override
    public void run(ApplicationArguments args) {
        if (!assetProperties.seedEnabled()) {
            return;
        }

        try {
            ensureBucket();
            for (String slug : DEMO_TEMPLATE_SLUGS) {
                for (String assetFile : ASSET_FILES) {
                    uploadIfPresent(slug, assetFile);
                }
            }
        } catch (Exception ex) {
            log.warn("Template asset seed skipped: {}", ex.getMessage());
        }
    }

    private void ensureBucket() throws Exception {
        boolean exists = minioClient.bucketExists(BucketExistsArgs.builder()
                .bucket(storageProperties.bucket())
                .build());
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder()
                    .bucket(storageProperties.bucket())
                    .build());
        }
    }

    private void uploadIfPresent(String slug, String assetFile) throws Exception {
        String resourcePath = assetProperties.classpathRoot() + "/" + slug + "/" + assetFile;
        ClassPathResource resource = new ClassPathResource(resourcePath);
        if (!resource.exists()) {
            log.debug("Template asset resource not found: {}", resourcePath);
            return;
        }

        String objectName = "public/templates/" + slug + "/" + assetFile;
        try (InputStream inputStream = resource.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(storageProperties.bucket())
                    .object(objectName)
                    .stream(inputStream, resource.contentLength(), -1L)
                    .contentType(contentType(assetFile))
                    .build());
        }
        log.info("Seeded template asset: {}", objectName);
    }

    private String contentType(String fileName) {
        if (fileName.endsWith(".html")) {
            return "text/html; charset=UTF-8";
        }
        if (fileName.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "application/octet-stream";
    }
}
