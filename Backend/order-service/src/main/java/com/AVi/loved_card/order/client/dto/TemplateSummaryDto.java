package com.AVi.loved_card.order.client.dto;

import java.util.UUID;

public record TemplateSummaryDto(
        UUID id,
        String name,
        String slug,
        Long price,
        String thumbnailUrl
) {
}
