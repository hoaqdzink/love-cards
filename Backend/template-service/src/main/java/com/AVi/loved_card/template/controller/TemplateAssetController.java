package com.AVi.loved_card.template.controller;

import com.AVi.loved_card.template.service.TemplateAssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

/**
 * Phục vụ file asset template (preview HTML, thumbnail) từ MinIO qua gateway — có cache HTTP.
 */
@RestController
@RequestMapping("/api/v1/template-assets")
@RequiredArgsConstructor
@Tag(name = "Template Assets", description = "Public template preview assets")
public class TemplateAssetController {

    private final TemplateAssetService templateAssetService;

    @GetMapping("/{templateSlug}/{assetName:.+}")
    @Operation(summary = "Stream asset demo của mẫu thiệp từ MinIO")
    public ResponseEntity<byte[]> getTemplateAsset(
            @PathVariable String templateSlug,
            @PathVariable String assetName
    ) {
        var asset = templateAssetService.getAsset(templateSlug, assetName);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(asset.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(15)).cachePublic())
                .body(asset.bytes());
    }
}
