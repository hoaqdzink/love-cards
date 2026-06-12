package com.AVi.loved_card.order.controller;

import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.constant.OrderStatus;
import com.AVi.loved_card.order.dto.request.CreateOrderRequest;
import com.AVi.loved_card.order.dto.response.OrderItemResponse;
import com.AVi.loved_card.order.dto.response.OrderResponse;
import com.AVi.loved_card.order.exception.OrderApiException;
import com.AVi.loved_card.order.exception.OrderExceptionHandler;
import com.AVi.loved_card.order.security.UserContext;
import com.AVi.loved_card.order.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    private static final UUID USER_ID = UUID.fromString("10000000-0000-4000-8000-000000000001");
    private static final UUID TEMPLATE_ID = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID HOSTING_PLAN_ID = UUID.fromString("90000000-0000-4000-8000-000000000006");

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    private final UserContext userContext = new UserContext();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new OrderController(orderService, userContext))
                .setControllerAdvice(new OrderExceptionHandler())
                .build();
    }

    @Test
    void createOrderReturnsCreatedStatus() throws Exception {
        OrderResponse order = sampleOrder("LC-20260603-0001");
        when(orderService.createOrder(eq(USER_ID), any(CreateOrderRequest.class))).thenReturn(order);

        mockMvc.perform(post("/api/v1/orders")
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"items":[{"templateId":"%s","hostingPlanId":"%s"}]}
                                """.formatted(TEMPLATE_ID, HOSTING_PLAN_ID)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderCode").value("LC-20260603-0001"))
                .andExpect(jsonPath("$.data.status").value(OrderStatus.CREATED.value()));

        verify(orderService).createOrder(eq(USER_ID), any(CreateOrderRequest.class));
    }

    @Test
    void getOrderReturnsOrderForOwner() throws Exception {
        OrderResponse order = sampleOrder("LC-20260603-0042");
        when(orderService.getOrder(USER_ID, "LC-20260603-0042")).thenReturn(order);

        mockMvc.perform(get("/api/v1/orders/LC-20260603-0042")
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.orderCode").value("LC-20260603-0042"))
                .andExpect(jsonPath("$.data.status").value(OrderStatus.CREATED.value()));

        verify(orderService).getOrder(USER_ID, "LC-20260603-0042");
    }

    @Test
    void getOrderReturnsNotFoundForOtherUser() throws Exception {
        when(orderService.getOrder(USER_ID, "LC-20260603-9999"))
                .thenThrow(new OrderApiException(
                        OrderErrorCode.ORD_NOT_FOUND,
                        "Đơn hàng không tồn tại",
                        HttpStatus.NOT_FOUND
                ));

        mockMvc.perform(get("/api/v1/orders/LC-20260603-9999")
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(OrderErrorCode.ORD_NOT_FOUND));
    }

    @Test
    void missingUserHeaderReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/orders/LC-20260603-0001"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(OrderErrorCode.AUTH_USER_REQUIRED));
    }

    private OrderResponse sampleOrder(String orderCode) {
        return new OrderResponse(
                UUID.randomUUID(),
                orderCode,
                OrderStatus.CREATED.value(),
                198000L,
                LocalDateTime.of(2026, 6, 3, 10, 0),
                List.of(new OrderItemResponse(
                        UUID.randomUUID(),
                        TEMPLATE_ID,
                        HOSTING_PLAN_ID,
                        99000L,
                        99000L,
                        null,
                        null
                ))
        );
    }
}
