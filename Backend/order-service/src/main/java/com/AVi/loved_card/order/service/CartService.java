package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.dto.request.AddCartItemRequest;
import com.AVi.loved_card.order.dto.request.MergeCartRequest;
import com.AVi.loved_card.order.dto.response.CartResponse;
import com.AVi.loved_card.order.dto.response.MergeCartResponse;

import java.util.UUID;

/**
 * Nghiệp vụ giỏ hàng DB — CRUD {@code commerce.cart_items} và merge từ cookie.
 */
public interface CartService {

    /** Lấy toàn bộ dòng giỏ của user, enrich metadata mẫu qua template-service. */
    CartResponse getCart(UUID userId);

    /** Thêm mẫu; validate active template, giới hạn 20, không trùng templateId. */
    CartResponse addItem(UUID userId, AddCartItemRequest request);

    /** Xóa một mẫu khỏi giỏ DB. */
    CartResponse removeItem(UUID userId, UUID templateId);

    /** Gộp {@code cookieItems} vào DB; skip trùng/inactive; dừng khi đạt max 20. */
    MergeCartResponse mergeCart(UUID userId, MergeCartRequest request);
}
