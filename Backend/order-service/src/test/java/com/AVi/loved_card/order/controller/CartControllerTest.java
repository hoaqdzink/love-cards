package com.AVi.loved_card.order.controller;

import com.AVi.loved_card.order.constant.OrderErrorCode;
import com.AVi.loved_card.order.dto.request.AddCartItemRequest;
import com.AVi.loved_card.order.dto.request.MergeCartRequest;
import com.AVi.loved_card.order.dto.response.CartItemResponse;
import com.AVi.loved_card.order.dto.response.CartResponse;
import com.AVi.loved_card.order.dto.response.MergeCartResponse;
import com.AVi.loved_card.order.dto.response.TemplateLineResponse;
import com.AVi.loved_card.order.exception.OrderExceptionHandler;
import com.AVi.loved_card.order.security.UserContext;
import com.AVi.loved_card.order.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CartControllerTest {

    private static final UUID USER_ID = UUID.fromString("10000000-0000-4000-8000-000000000001");
    private static final UUID TEMPLATE_A = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID TEMPLATE_B = UUID.fromString("22222222-2222-4222-8222-222222222222");

    private MockMvc mockMvc;

    @Mock
    private CartService cartService;

    private final UserContext userContext = new UserContext();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new CartController(cartService, userContext))
                .setControllerAdvice(new OrderExceptionHandler())
                .build();
    }

    @Test
    void getCartRequiresUserHeader() throws Exception {
        mockMvc.perform(get("/api/v1/cart"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(OrderErrorCode.AUTH_USER_REQUIRED));
    }

    @Test
    void getCartReturnsItems() throws Exception {
        CartResponse cart = sampleCart(TEMPLATE_A);
        when(cartService.getCart(USER_ID)).thenReturn(cart);

        mockMvc.perform(get("/api/v1/cart")
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items[0].templateId").value(TEMPLATE_A.toString()))
                .andExpect(jsonPath("$.data.items[0].template.name").value("Peony Dream"));

        verify(cartService).getCart(USER_ID);
    }

    @Test
    void addItemReturnsUpdatedCart() throws Exception {
        CartResponse cart = sampleCart(TEMPLATE_A, TEMPLATE_B);
        when(cartService.addItem(eq(USER_ID), any(AddCartItemRequest.class))).thenReturn(cart);

        mockMvc.perform(post("/api/v1/cart/items")
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"templateId":"%s"}
                                """.formatted(TEMPLATE_B)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items.length()").value(2));

        verify(cartService).addItem(eq(USER_ID), any(AddCartItemRequest.class));
    }

    @Test
    void removeItemReturnsUpdatedCart() throws Exception {
        CartResponse empty = new CartResponse(List.of());
        when(cartService.removeItem(USER_ID, TEMPLATE_A)).thenReturn(empty);

        mockMvc.perform(delete("/api/v1/cart/items/{templateId}", TEMPLATE_A)
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items.length()").value(0));

        verify(cartService).removeItem(USER_ID, TEMPLATE_A);
    }

    @Test
    void mergeCartReturnsMergedCount() throws Exception {
        CartResponse cart = sampleCart(TEMPLATE_A, TEMPLATE_B);
        when(cartService.mergeCart(eq(USER_ID), any(MergeCartRequest.class)))
                .thenReturn(new MergeCartResponse(1, cart));

        mockMvc.perform(post("/api/v1/cart/merge")
                        .header(UserContext.USER_ID_HEADER, USER_ID.toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cookieItems":["%s","%s"]}
                                """.formatted(TEMPLATE_A, TEMPLATE_B)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.mergedCount").value(1))
                .andExpect(jsonPath("$.data.cart.items.length()").value(2));

        verify(cartService).mergeCart(eq(USER_ID), any(MergeCartRequest.class));
    }

    private CartResponse sampleCart(UUID... templateIds) {
        LocalDateTime addedAt = LocalDateTime.of(2026, 6, 3, 9, 0);
        List<CartItemResponse> items = new java.util.ArrayList<>();
        for (UUID templateId : templateIds) {
            items.add(new CartItemResponse(
                    templateId,
                    addedAt,
                    new TemplateLineResponse(
                            templateId,
                            templateId.equals(TEMPLATE_A) ? "Peony Dream" : "Rose Garden",
                            templateId.equals(TEMPLATE_A) ? "peony-dream" : "rose-garden",
                            99000L,
                            "/thumb.svg"
                    )
            ));
        }
        return new CartResponse(items);
    }
}
