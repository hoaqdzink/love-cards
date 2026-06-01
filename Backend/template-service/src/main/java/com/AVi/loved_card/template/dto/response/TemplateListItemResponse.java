package com.AVi.loved_card.template.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/** Một dòng trong grid catalog / homepage — không kèm danh sách field chi tiết. */
public record TemplateListItemResponse(
        UUID id,
        String name,
        String slug,
        String description,
        String eventType,
        List<String> colorTags,
        Long price,
        String previewUrl,
        String thumbnailUrl,
        Boolean hasMusic,
        Boolean featured,
        Boolean trending,
        Long viewCount,
        Long purchaseCount,
        LocalDateTime createdAt
) {
}
