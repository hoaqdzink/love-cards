package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.dto.request.AddCartItemRequest;
import com.AVi.loved_card.order.dto.request.MergeCartRequest;
import com.AVi.loved_card.order.dto.response.CartResponse;
import com.AVi.loved_card.order.dto.response.MergeCartResponse;

import java.util.UUID;

public interface CartService {

    CartResponse getCart(UUID userId);

    CartResponse addItem(UUID userId, AddCartItemRequest request);

    CartResponse removeItem(UUID userId, UUID templateId);

    MergeCartResponse mergeCart(UUID userId, MergeCartRequest request);
}
