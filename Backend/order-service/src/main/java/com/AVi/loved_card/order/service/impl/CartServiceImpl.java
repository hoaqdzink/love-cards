package com.AVi.loved_card.order.service.impl;

import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.dto.request.AddCartItemRequest;
import com.AVi.loved_card.order.dto.request.MergeCartRequest;
import com.AVi.loved_card.order.dto.response.CartItemResponse;
import com.AVi.loved_card.order.dto.response.CartResponse;
import com.AVi.loved_card.order.dto.response.MergeCartResponse;
import com.AVi.loved_card.order.entity.CartItem;
import com.AVi.loved_card.order.exception.OrderApiException;
import com.AVi.loved_card.order.repository.CartItemRepository;
import com.AVi.loved_card.order.service.CartService;
import com.AVi.loved_card.order.service.TemplateLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Triển khai {@link CartService} — giỏ DB per user, đồng bộ với Functional Design §3.
 */
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    /** Giới hạn số mẫu — khớp FE {@code useCartStore} và error {@code CART_MAX_ITEMS}. */
    public static final int MAX_CART_ITEMS = 20;

    private final CartItemRepository cartItemRepository;
    private final TemplateLookupService templateLookupService;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId) {
        return new CartResponse(loadCartItems(userId));
    }

    @Override
    @Transactional
    public CartResponse addItem(UUID userId, AddCartItemRequest request) {
        templateLookupService.requireActiveTemplate(request.templateId());

        if (cartItemRepository.findByUserIdAndTemplateId(userId, request.templateId()).isPresent()) {
            throw new OrderApiException(
                    OrderErrorCode.CART_DUPLICATE,
                    "Mẫu này đã có trong giỏ hàng",
                    HttpStatus.CONFLICT
            );
        }
        if (cartItemRepository.countByUserId(userId) >= MAX_CART_ITEMS) {
            throw new OrderApiException(
                    OrderErrorCode.CART_MAX_ITEMS,
                    "Giỏ hàng đã đầy (tối đa 20 mẫu)",
                    HttpStatus.BAD_REQUEST
            );
        }

        CartItem item = new CartItem();
        item.setUserId(userId);
        item.setTemplateId(request.templateId());
        item.setAddedAt(LocalDateTime.now());
        cartItemRepository.save(item);

        return new CartResponse(loadCartItems(userId));
    }

    @Override
    @Transactional
    public CartResponse removeItem(UUID userId, UUID templateId) {
        cartItemRepository.deleteByUserIdAndTemplateId(userId, templateId);
        return new CartResponse(loadCartItems(userId));
    }

    @Override
    @Transactional
    public MergeCartResponse mergeCart(UUID userId, MergeCartRequest request) {
        int merged = 0;
        for (UUID templateId : request.cookieItems()) {
            if (templateId == null) {
                continue;
            }
            // Bỏ qua mẫu đã có trong giỏ DB
            if (cartItemRepository.findByUserIdAndTemplateId(userId, templateId).isPresent()) {
                continue;
            }
            if (cartItemRepository.countByUserId(userId) >= MAX_CART_ITEMS) {
                break;
            }
            try {
                templateLookupService.requireActiveTemplate(templateId);
            } catch (OrderApiException ex) {
                // Cookie có id cũ/inactive — skip im lặng
                continue;
            }
            CartItem item = new CartItem();
            item.setUserId(userId);
            item.setTemplateId(templateId);
            item.setAddedAt(LocalDateTime.now());
            cartItemRepository.save(item);
            merged++;
        }
        CartResponse cart = new CartResponse(loadCartItems(userId));
        return new MergeCartResponse(merged, cart);
    }

    /** Load DB + gọi template-service để trả tên/giá/ảnh cho từng dòng. */
    private List<CartItemResponse> loadCartItems(UUID userId) {
        List<CartItem> entities = cartItemRepository.findByUserIdOrderByAddedAtDesc(userId);
        List<CartItemResponse> items = new ArrayList<>();
        for (CartItem entity : entities) {
            TemplateSummaryDto template = templateLookupService.requireActiveTemplate(entity.getTemplateId());
            items.add(new CartItemResponse(
                    entity.getTemplateId(),
                    entity.getAddedAt(),
                    templateLookupService.toLine(template)
            ));
        }
        return items;
    }
}
