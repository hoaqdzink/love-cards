package com.AVi.loved_card.order.dto.response;

import java.util.List;

public record CartResponse(
        List<CartItemResponse> items
) {
}
