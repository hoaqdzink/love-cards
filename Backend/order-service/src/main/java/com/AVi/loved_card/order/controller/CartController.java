package com.AVi.loved_card.order.controller;

import com.AVi.loved_card.common.dto.AppResponse;
import com.AVi.loved_card.order.dto.request.AddCartItemRequest;
import com.AVi.loved_card.order.dto.request.MergeCartRequest;
import com.AVi.loved_card.order.dto.response.CartResponse;
import com.AVi.loved_card.order.dto.response.MergeCartResponse;
import com.AVi.loved_card.order.security.UserContext;
import com.AVi.loved_card.order.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart APIs")
public class CartController {

    private final CartService cartService;
    private final UserContext userContext;

    @GetMapping
    @Operation(summary = "Lấy giỏ hàng DB của user")
    public AppResponse<CartResponse> getCart(HttpServletRequest request) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(cartService.getCart(userId));
    }

    @PostMapping("/items")
    @Operation(summary = "Thêm mẫu vào giỏ DB")
    public AppResponse<CartResponse> addItem(
            HttpServletRequest request,
            @Valid @RequestBody AddCartItemRequest body
    ) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(cartService.addItem(userId, body));
    }

    @DeleteMapping("/items/{templateId}")
    @Operation(summary = "Xóa mẫu khỏi giỏ DB")
    public AppResponse<CartResponse> removeItem(
            HttpServletRequest request,
            @PathVariable UUID templateId
    ) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(cartService.removeItem(userId, templateId));
    }

    @PostMapping("/merge")
    @Operation(summary = "Gộp cookie cart vào DB (FE gọi từ Phase 5)")
    public AppResponse<MergeCartResponse> mergeCart(
            HttpServletRequest request,
            @Valid @RequestBody MergeCartRequest body
    ) {
        UUID userId = userContext.requireUserId(request);
        return AppResponse.success(cartService.mergeCart(userId, body));
    }
}
