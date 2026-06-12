package com.AVi.loved_card.order.controller;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.order.dto.request.CreateOrderRequest;
import com.AVi.loved_card.order.dto.response.OrderResponse;
import com.AVi.loved_card.order.security.UserContext;
import com.AVi.loved_card.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order APIs (Phase 2 — no payment)")
public class OrderController {

    private final OrderService orderService;
    private final UserContext userContext;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Tạo đơn hàng từ danh sách items")
    public AppResponse<OrderResponse> createOrder(
            HttpServletRequest request,
            @Valid @RequestBody CreateOrderRequest body
    ) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(orderService.createOrder(userId, body));
    }

    @GetMapping
    @Operation(summary = "Danh sách đơn hàng của user")
    public AppResponse<List<OrderResponse>> listOrders(HttpServletRequest request) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(orderService.listOrders(userId));
    }

    @GetMapping("/{orderCode}")
    @Operation(summary = "Chi tiết đơn hàng theo mã")
    public AppResponse<OrderResponse> getOrder(
            HttpServletRequest request,
            @PathVariable String orderCode
    ) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(orderService.getOrder(userId, orderCode));
    }
}
