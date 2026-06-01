package com.AVi.loved_card.template.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Chi tiết một mẫu thiệp (preview page) — gồm fields và metadata đầy đủ. */
public record TemplateDetailResponse(
        UUID id,
        String name,
        String slug,
        String description,
        String eventType,
        List<String> colorTags,
        Long price,
        String status,
        String previewUrl,
        String thumbnailUrl,
        String assetsPath,
        Boolean hasMusic,
        Boolean featured,
        Boolean trending,
        Long viewCount,
        Long purchaseCount,
        Map<String, Object> metadata,
        List<TemplateFieldResponse> fields,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
