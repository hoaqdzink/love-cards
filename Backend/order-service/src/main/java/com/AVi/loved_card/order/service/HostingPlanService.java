package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.dto.response.HostingPlanResponse;
import com.AVi.loved_card.order.entity.HostingPlan;

import java.util.List;
import java.util.UUID;

public interface HostingPlanService {

    List<HostingPlanResponse> listActivePlans();

    HostingPlan requireActivePlan(UUID hostingPlanId);

    HostingPlanResponse toResponse(HostingPlan plan);
}
