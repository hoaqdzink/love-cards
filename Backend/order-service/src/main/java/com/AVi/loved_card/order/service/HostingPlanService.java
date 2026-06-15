package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.dto.response.HostingPlanResponse;
import com.AVi.loved_card.order.entity.HostingPlan;

import java.util.List;
import java.util.UUID;

/** Catalog gói hosting và validate plan khi tạo đơn. */
public interface HostingPlanService {

    /** Gói active cho trang checkout / GET public API. */
    List<HostingPlanResponse> listActivePlans();

    /**
     * Load plan active hoặc ném {@code ORD_HOSTING_PLAN_INVALID}.
     */
    HostingPlan requireActivePlan(UUID hostingPlanId);

    /** Map entity → DTO response. */
    HostingPlanResponse toResponse(HostingPlan plan);
}
