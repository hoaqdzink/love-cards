package com.AVi.loved_card.order.dto.response;

import java.util.List;
import java.util.UUID;

public record HostingPlanResponse(
        UUID id,
        String name,
        int durationMonths,
        long price,
        String description,
        List<String> features,
        boolean recommended
) {
}
