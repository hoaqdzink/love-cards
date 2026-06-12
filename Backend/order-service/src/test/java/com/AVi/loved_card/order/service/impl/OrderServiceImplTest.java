package com.AVi.loved_card.order.service.impl;

import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.constant.OrderStatus;
import com.AVi.loved_card.order.dto.request.CreateOrderItemRequest;
import com.AVi.loved_card.order.dto.request.CreateOrderRequest;
import com.AVi.loved_card.order.dto.response.HostingPlanResponse;
import com.AVi.loved_card.order.dto.response.TemplateLineResponse;
import com.AVi.loved_card.order.entity.HostingPlan;
import com.AVi.loved_card.order.entity.Order;
import com.AVi.loved_card.order.entity.OrderItem;
import com.AVi.loved_card.order.exception.OrderApiException;
import com.AVi.loved_card.order.repository.HostingPlanRepository;
import com.AVi.loved_card.order.repository.OrderItemRepository;
import com.AVi.loved_card.order.repository.OrderRepository;
import com.AVi.loved_card.order.repository.OrderStatusHistoryRepository;
import com.AVi.loved_card.order.service.HostingPlanService;
import com.AVi.loved_card.order.service.OrderCodeGenerator;
import com.AVi.loved_card.order.service.TemplateLookupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    private static final UUID USER_ID = UUID.fromString("10000000-0000-4000-8000-000000000001");
    private static final UUID TEMPLATE_ID = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID HOSTING_PLAN_ID = UUID.fromString("90000000-0000-4000-8000-000000000006");

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderCodeGenerator orderCodeGenerator;

    @Mock
    private TemplateLookupService templateLookupService;

    @Mock
    private HostingPlanService hostingPlanService;

    @Mock
    private HostingPlanRepository hostingPlanRepository;

    @Mock
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderServiceImpl(
                orderRepository,
                orderItemRepository,
                orderCodeGenerator,
                templateLookupService,
                hostingPlanService,
                hostingPlanRepository,
                orderStatusHistoryRepository
        );
    }

    @Test
    void createOrder_setsCreatedStatusAndTotalFromTemplatePlusHosting() {
        TemplateSummaryDto template = new TemplateSummaryDto(
                TEMPLATE_ID, "Peony Dream", "peony-dream", 99000L, "/thumb.svg"
        );
        HostingPlan plan = activePlan(HOSTING_PLAN_ID, 99000L);

        when(templateLookupService.requireActiveTemplate(TEMPLATE_ID)).thenReturn(template);
        when(hostingPlanService.requireActivePlan(HOSTING_PLAN_ID)).thenReturn(plan);
        when(orderCodeGenerator.generate()).thenReturn("LC-20260612-TEST");
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(UUID.randomUUID());
            return order;
        });
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(invocation -> {
            OrderItem item = invocation.getArgument(0);
            item.setId(UUID.randomUUID());
            return item;
        });
        when(templateLookupService.toLine(template)).thenReturn(
                new TemplateLineResponse(TEMPLATE_ID, "Peony Dream", "peony-dream", 99000L, "/thumb.svg")
        );
        when(hostingPlanRepository.findById(HOSTING_PLAN_ID)).thenReturn(Optional.of(plan));
        when(hostingPlanService.toResponse(plan)).thenReturn(
                new HostingPlanResponse(HOSTING_PLAN_ID, "Gói 6 tháng", 6, 99000L, null, List.of(), false)
        );

        var response = orderService.createOrder(
                USER_ID,
                new CreateOrderRequest(List.of(new CreateOrderItemRequest(TEMPLATE_ID, HOSTING_PLAN_ID)))
        );

        assertThat(response.status()).isEqualTo(OrderStatus.CREATED.value());
        assertThat(response.orderCode()).isEqualTo("LC-20260612-TEST");
        assertThat(response.totalAmount()).isEqualTo(198000L);

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        assertThat(orderCaptor.getValue().getStatus()).isEqualTo(OrderStatus.CREATED.value());
        assertThat(orderCaptor.getValue().getTotalAmount()).isEqualTo(198000L);
        verify(orderStatusHistoryRepository).save(any());
    }

    @Test
    void createOrder_rejectsEmptyItems() {
        assertThatThrownBy(() -> orderService.createOrder(USER_ID, new CreateOrderRequest(List.of())))
                .isInstanceOf(OrderApiException.class)
                .satisfies(ex -> {
                    OrderApiException apiEx = (OrderApiException) ex;
                    assertThat(apiEx.getCode()).isEqualTo(OrderErrorCode.ORD_CART_EMPTY);
                    assertThat(apiEx.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST);
                });
    }

    @Test
    void getOrder_throwsNotFoundWhenOrderDoesNotBelongToUser() {
        when(orderRepository.findByOrderCodeAndUserIdAndDeletedAtIsNull("LC-20260612-9999", USER_ID))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrder(USER_ID, "LC-20260612-9999"))
                .isInstanceOf(OrderApiException.class)
                .satisfies(ex -> {
                    OrderApiException apiEx = (OrderApiException) ex;
                    assertThat(apiEx.getCode()).isEqualTo(OrderErrorCode.ORD_NOT_FOUND);
                    assertThat(apiEx.getStatus()).isEqualTo(HttpStatus.NOT_FOUND);
                });
    }

    private HostingPlan activePlan(UUID id, long price) {
        HostingPlan plan = new HostingPlan();
        plan.setId(id);
        plan.setName("Gói 6 tháng");
        plan.setDurationMonths(6);
        plan.setPrice(price);
        plan.setActive(true);
        return plan;
    }
}
