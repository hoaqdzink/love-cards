package com.AVi.loved_card.order.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/** Body POST thêm mẫu vào giỏ server-side. */
public record AddCartItemRequest(
        @NotNull UUID templateId
) {
}
