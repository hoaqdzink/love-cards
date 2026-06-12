package com.AVi.loved_card.order.dto.response;

import java.util.UUID;

public record OrderItemResponse(
        UUID id,
        UUID templateId,
        UUID hostingPlanId,
        long templatePrice,
        long hostingPrice,
        TemplateLineResponse template,
        HostingPlanResponse hostingPlan
) {
}
