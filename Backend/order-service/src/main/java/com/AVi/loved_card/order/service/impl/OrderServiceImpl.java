package com.AVi.loved_card.order.service.impl;

import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.constant.OrderStatus;
import com.AVi.loved_card.order.dto.request.CreateOrderItemRequest;
import com.AVi.loved_card.order.dto.request.CreateOrderRequest;
import com.AVi.loved_card.order.dto.response.OrderItemResponse;
import com.AVi.loved_card.order.dto.response.OrderResponse;
import com.AVi.loved_card.order.entity.HostingPlan;
import com.AVi.loved_card.order.entity.Order;
import com.AVi.loved_card.order.entity.OrderItem;
import com.AVi.loved_card.order.entity.OrderStatusHistory;
import com.AVi.loved_card.order.exception.OrderApiException;
import com.AVi.loved_card.order.dto.response.HostingPlanResponse;
import com.AVi.loved_card.order.dto.response.TemplateLineResponse;
import com.AVi.loved_card.order.repository.HostingPlanRepository;
import com.AVi.loved_card.order.repository.OrderItemRepository;
import com.AVi.loved_card.order.repository.OrderRepository;
import com.AVi.loved_card.order.repository.OrderStatusHistoryRepository;
import com.AVi.loved_card.order.service.HostingPlanService;
import com.AVi.loved_card.order.service.OrderCodeGenerator;
import com.AVi.loved_card.order.service.OrderService;
import com.AVi.loved_card.order.service.TemplateLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderCodeGenerator orderCodeGenerator;
    private final TemplateLookupService templateLookupService;
    private final HostingPlanService hostingPlanService;
    private final HostingPlanRepository hostingPlanRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(UUID userId, CreateOrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new OrderApiException(
                    OrderErrorCode.ORD_CART_EMPTY,
                    "Giỏ hàng trống",
                    HttpStatus.BAD_REQUEST
            );
        }

        long total = 0;
        List<PreparedLine> lines = new ArrayList<>();
        for (CreateOrderItemRequest item : request.items()) {
            TemplateSummaryDto template = templateLookupService.requireActiveTemplate(item.templateId());
            HostingPlan plan = hostingPlanService.requireActivePlan(item.hostingPlanId());
            long lineTotal = template.price() + plan.getPrice();
            total += lineTotal;
            lines.add(new PreparedLine(template, plan, lineTotal));
        }

        LocalDateTime now = LocalDateTime.now();
        Order order = new Order();
        order.setOrderCode(orderCodeGenerator.generate());
        order.setUserId(userId);
        order.setTotalAmount(total);
        order.setPaymentStatus("pending");
        order.setPaymentData(new HashMap<>());
        order.setStatus(OrderStatus.CREATED.value());
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        order = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(order.getId());
        history.setFromStatus(null);
        history.setToStatus(OrderStatus.CREATED.value());
        history.setReason("Order created");
        history.setChangedAt(now);
        history.setChangedBy(userId);
        orderStatusHistoryRepository.save(history);

        List<OrderItem> savedItems = new ArrayList<>();
        for (PreparedLine line : lines) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setTemplateId(line.template().id());
            orderItem.setHostingPlanId(line.plan().getId());
            orderItem.setTemplatePrice(line.template().price());
            orderItem.setHostingPrice(line.plan().getPrice());
            orderItem.setCreatedAt(now);
            savedItems.add(orderItemRepository.save(orderItem));
        }

        return toResponse(order, savedItems);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> listOrders(UUID userId) {
        return orderRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId).stream()
                .map(order -> toResponse(order, orderItemRepository.findByOrderIdOrderByCreatedAtAsc(order.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID userId, String orderCode) {
        Order order = orderRepository.findByOrderCodeAndUserIdAndDeletedAtIsNull(orderCode, userId)
                .orElseThrow(() -> new OrderApiException(
                        OrderErrorCode.ORD_NOT_FOUND,
                        "Đơn hàng không tồn tại",
                        HttpStatus.NOT_FOUND
                ));
        return toResponse(order, orderItemRepository.findByOrderIdOrderByCreatedAtAsc(order.getId()));
    }

    private OrderResponse toResponse(Order order, List<OrderItem> items) {
        List<OrderItemResponse> itemResponses = items.stream()
                .map(this::toOrderItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                itemResponses
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getTemplateId(),
                item.getHostingPlanId(),
                item.getTemplatePrice(),
                item.getHostingPrice(),
                resolveTemplateLine(item),
                resolveHostingPlan(item)
        );
    }

    private TemplateLineResponse resolveTemplateLine(OrderItem item) {
        try {
            return templateLookupService.toLine(
                    templateLookupService.requireActiveTemplate(item.getTemplateId())
            );
        } catch (OrderApiException ex) {
            return new TemplateLineResponse(
                    item.getTemplateId(),
                    "Mẫu thiệp",
                    "",
                    item.getTemplatePrice(),
                    null
            );
        }
    }

    private HostingPlanResponse resolveHostingPlan(OrderItem item) {
        return hostingPlanRepository.findById(item.getHostingPlanId())
                .map(hostingPlanService::toResponse)
                .orElseGet(() -> new HostingPlanResponse(
                        item.getHostingPlanId(),
                        "Gói hosting",
                        0,
                        item.getHostingPrice(),
                        null,
                        List.of(),
                        false
                ));
    }

    private record PreparedLine(TemplateSummaryDto template, HostingPlan plan, long lineTotal) {
    }
}
