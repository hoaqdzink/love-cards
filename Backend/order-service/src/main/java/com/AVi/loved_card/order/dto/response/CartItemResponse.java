package com.AVi.loved_card.order.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

/** Một dòng giỏ — templateId + thông tin hiển thị enrich từ catalog. */
public record CartItemResponse(
        UUID templateId,
        LocalDateTime addedAt,
        TemplateLineResponse template
) {
}
