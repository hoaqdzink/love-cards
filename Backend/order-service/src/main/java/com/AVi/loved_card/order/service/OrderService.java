package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.dto.request.CreateOrderRequest;
import com.AVi.loved_card.order.dto.response.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse createOrder(UUID userId, CreateOrderRequest request);

    List<OrderResponse> listOrders(UUID userId);

    OrderResponse getOrder(UUID userId, String orderCode);
}
