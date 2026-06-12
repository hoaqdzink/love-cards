package com.AVi.loved_card.order.dto.response;

import java.util.UUID;

public record TemplateLineResponse(
        UUID id,
        String name,
        String slug,
        Long price,
        String thumbnailUrl
) {
}
