package com.AVi.loved_card.order.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record MergeCartRequest(
        @NotNull List<UUID> cookieItems
) {
}
