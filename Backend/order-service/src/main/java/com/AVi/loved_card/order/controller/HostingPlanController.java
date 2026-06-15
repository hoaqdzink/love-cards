package com.AVi.loved_card.order.controller;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.order.dto.response.HostingPlanResponse;
import com.AVi.loved_card.order.service.HostingPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API danh mục gói hosting — public, không cần {@code X-User-Id}.
 * Dùng trên trang checkout để chọn plan theo từng mẫu.
 */
@RestController
@RequestMapping("/api/v1/hosting-plans")
@RequiredArgsConstructor
@Tag(name = "Hosting Plans", description = "Hosting plan catalog")
public class HostingPlanController {

    private final HostingPlanService hostingPlanService;

    /** Trả về gói {@code is_active=true}, gói recommended lên trước. */
    @GetMapping
    @Operation(summary = "Danh sách gói hosting active")
    public AppResponse<List<HostingPlanResponse>> listHostingPlans() {
        return AppResponse.success(hostingPlanService.listActivePlans());
    }
}
