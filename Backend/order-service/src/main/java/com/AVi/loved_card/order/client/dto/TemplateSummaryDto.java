package com.AVi.loved_card.order.client.dto;

import java.util.UUID;

/** Payload từ template-service — map sang {@link com.AVi.loved_card.order.dto.response.TemplateLineResponse}. */
public record TemplateSummaryDto(
        UUID id,
        String name,
        String slug,
        Long price,
        String thumbnailUrl
) {
}
