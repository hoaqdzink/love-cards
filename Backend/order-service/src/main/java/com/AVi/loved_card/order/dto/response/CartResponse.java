package com.AVi.loved_card.order.dto.response;

import java.util.List;

/** Giỏ hàng đầy đủ — mỗi item kèm metadata mẫu từ template-service. */
public record CartResponse(
        List<CartItemResponse> items
) {
}
