package com.AVi.loved_card.order.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddCartItemRequest(
        @NotNull UUID templateId
) {
}
