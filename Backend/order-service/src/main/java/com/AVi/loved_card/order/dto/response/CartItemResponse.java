package com.AVi.loved_card.order.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record CartItemResponse(
        UUID templateId,
        LocalDateTime addedAt,
        TemplateLineResponse template
) {
}
