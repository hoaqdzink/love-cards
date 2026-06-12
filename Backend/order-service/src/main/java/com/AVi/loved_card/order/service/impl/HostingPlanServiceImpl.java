package com.AVi.loved_card.order.service.impl;

import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.dto.response.HostingPlanResponse;
import com.AVi.loved_card.order.entity.HostingPlan;
import com.AVi.loved_card.order.exception.OrderApiException;
import com.AVi.loved_card.order.repository.HostingPlanRepository;
import com.AVi.loved_card.order.service.HostingPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HostingPlanServiceImpl implements HostingPlanService {

    private final HostingPlanRepository hostingPlanRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HostingPlanResponse> listActivePlans() {
        return hostingPlanRepository.findByActiveTrueOrderByRecommendedDescNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HostingPlan requireActivePlan(UUID hostingPlanId) {
        return hostingPlanRepository.findByIdAndActiveTrue(hostingPlanId)
                .orElseThrow(() -> new OrderApiException(
                        OrderErrorCode.ORD_HOSTING_PLAN_INVALID,
                        "Gói hosting không hợp lệ",
                        HttpStatus.BAD_REQUEST
                ));
    }

    @Override
    public HostingPlanResponse toResponse(HostingPlan plan) {
        return new HostingPlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getDurationMonths(),
                plan.getPrice(),
                plan.getDescription(),
                plan.getFeatures() == null ? List.of() : plan.getFeatures(),
                Boolean.TRUE.equals(plan.getRecommended())
        );
    }
}
