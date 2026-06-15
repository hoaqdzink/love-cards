package com.AVi.loved_card.order.dto.response;

import java.util.UUID;

/** Thông tin mẫu thiệp rút gọn — embed trong cart/order line. */
public record TemplateLineResponse(
        UUID id,
        String name,
        String slug,
        Long price,
        String thumbnailUrl
) {
}
