package com.AVi.loved_card.order.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/** Chi tiết đơn hàng trả về API — không expose payment internals Phase 2. */
public record OrderResponse(
        UUID id,
        String orderCode,
        String status,
        long totalAmount,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {
}
