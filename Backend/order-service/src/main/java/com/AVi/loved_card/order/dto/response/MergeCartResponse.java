package com.AVi.loved_card.order.dto.response;

/** Kết quả merge giỏ cookie — số item mới gộp + giỏ sau merge. */
public record MergeCartResponse(
        int mergedCount,
        CartResponse cart
) {
}
