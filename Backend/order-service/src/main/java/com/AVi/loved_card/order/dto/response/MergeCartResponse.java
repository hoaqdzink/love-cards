package com.AVi.loved_card.order.dto.response;

public record MergeCartResponse(
        int mergedCount,
        CartResponse cart
) {
}
