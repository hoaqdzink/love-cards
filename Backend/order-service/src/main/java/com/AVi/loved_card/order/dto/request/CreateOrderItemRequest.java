package com.AVi.loved_card.order.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateOrderItemRequest(
        @NotNull UUID templateId,
        @NotNull UUID hostingPlanId
) {
}
