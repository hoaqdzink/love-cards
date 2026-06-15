package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.dto.request.CreateOrderRequest;
import com.AVi.loved_card.order.dto.response.OrderResponse;

import java.util.List;
import java.util.UUID;

/**
 * Nghiệp vụ đơn hàng Phase 2 — tạo đơn {@code created}, tra cứu theo user.
 */
public interface OrderService {

    /**
     * Tạo đơn mới: snapshot giá mẫu + hosting, mã {@code LC-YYYYMMDD-XXXX}, ghi lịch sử trạng thái.
     *
     * @throws com.AVi.loved_card.order.exception.OrderApiException nếu giỏ rỗng, mẫu/plan invalid
     */
    OrderResponse createOrder(UUID userId, CreateOrderRequest request);

    /** Danh sách đơn chưa xóa mềm của user. */
    List<OrderResponse> listOrders(UUID userId);

    /** Chi tiết đơn theo mã — chỉ khi {@code order.userId} khớp. */
    OrderResponse getOrder(UUID userId, String orderCode);
}
