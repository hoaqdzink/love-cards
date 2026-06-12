package com.AVi.loved_card.template.service.impl;

import com.AVi.loved_card.template.config.StorageProperties;
import com.AVi.loved_card.template.constant.TemplateErrorCode;
import com.AVi.loved_card.template.dto.response.TemplateAssetResponse;
import com.AVi.loved_card.template.exception.TemplateApiException;
import com.AVi.loved_card.template.service.TemplateAssetService;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Triển khai {@link TemplateAssetService} qua MinIO — map extension sang Content-Type, ném {@code TPL_ASSET_NOT_FOUND}.
 */
@Service
@RequiredArgsConstructor
public class MinioTemplateAssetService implements TemplateAssetService {

    private static final Map<String, String> CONTENT_TYPES = Map.of(
            "html", "text/html; charset=UTF-8",
            "svg", "image/svg+xml",
            "css", "text/css; charset=UTF-8",
            "js", "application/javascript; charset=UTF-8",
            "png", "image/png",
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "webp", "image/webp"
    );

    private final MinioClient minioClient;
    private final StorageProperties storageProperties;

    @Override
    public TemplateAssetResponse getAsset(String templateSlug, String assetName) {
        String objectName = "public/templates/" + sanitize(templateSlug) + "/" + sanitize(assetName);
        try {
            minioClient.statObject(StatObjectArgs.builder()
                    .bucket(storageProperties.bucket())
                    .object(objectName)
                    .build());

            try (var stream = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(storageProperties.bucket())
                    .object(objectName)
                    .build())) {
                return new TemplateAssetResponse(stream.readAllBytes(), contentType(assetName));
            }
        } catch (Exception ex) {
            throw new TemplateApiException(
                    TemplateErrorCode.TPL_ASSET_NOT_FOUND,
                    "Asset mẫu thiệp không tồn tại",
                    HttpStatus.NOT_FOUND
            );
        }
    }

    private String sanitize(String value) {
        if (value == null || value.contains("..") || value.contains("/") || value.contains("\\")) {
            throw new TemplateApiException(
                    TemplateErrorCode.TPL_INVALID_FILTER,
                    "Đường dẫn asset không hợp lệ",
                    HttpStatus.BAD_REQUEST
            );
        }
        return value;
    }

    private String contentType(String assetName) {
        int dotIndex = assetName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == assetName.length() - 1) {
            return "application/octet-stream";
        }
        return CONTENT_TYPES.getOrDefault(assetName.substring(dotIndex + 1).toLowerCase(), "application/octet-stream");
    }
}
