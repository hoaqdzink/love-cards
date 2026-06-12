package com.AVi.loved_card.order.service.impl;

import com.AVi.loved_card.order.client.dto.TemplateSummaryDto;
import com.AVi.loved_card.order.dto.request.MergeCartRequest;
import com.AVi.loved_card.order.dto.response.TemplateLineResponse;
import com.AVi.loved_card.order.entity.CartItem;
import com.AVi.loved_card.order.repository.CartItemRepository;
import com.AVi.loved_card.order.service.TemplateLookupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    private static final UUID USER_ID = UUID.fromString("10000000-0000-4000-8000-000000000001");
    private static final UUID TEMPLATE_A = UUID.fromString("11111111-1111-4111-8111-111111111111");
    private static final UUID TEMPLATE_B = UUID.fromString("22222222-2222-4222-8222-222222222222");
    private static final UUID TEMPLATE_C = UUID.fromString("33333333-3333-4333-8333-333333333333");

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private TemplateLookupService templateLookupService;

    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        cartService = new CartServiceImpl(cartItemRepository, templateLookupService);
    }

    @Test
    void mergeCart_skipsDuplicatesAndReturnsMergedCount() {
        CartItem existing = cartItem(TEMPLATE_A);

        when(cartItemRepository.findByUserIdAndTemplateId(USER_ID, TEMPLATE_A))
                .thenReturn(Optional.of(existing));
        when(cartItemRepository.findByUserIdAndTemplateId(USER_ID, TEMPLATE_B))
                .thenReturn(Optional.empty());
        when(cartItemRepository.findByUserIdAndTemplateId(USER_ID, TEMPLATE_C))
                .thenReturn(Optional.empty());
        when(cartItemRepository.countByUserId(USER_ID)).thenReturn(1L, 2L);
        stubActiveTemplate(TEMPLATE_B);
        stubActiveTemplate(TEMPLATE_C);
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartItemRepository.findByUserIdOrderByAddedAtDesc(USER_ID)).thenReturn(List.of(existing));
        stubLine(stubActiveTemplate(TEMPLATE_A));

        var response = cartService.mergeCart(
                USER_ID,
                new MergeCartRequest(List.of(TEMPLATE_A, TEMPLATE_B, TEMPLATE_C))
        );

        assertThat(response.mergedCount()).isEqualTo(2);
        verify(cartItemRepository, times(2)).save(any(CartItem.class));
    }

    @Test
    void mergeCart_stopsWhenCartIsFull() {
        when(cartItemRepository.findByUserIdAndTemplateId(any(), any())).thenReturn(Optional.empty());
        when(cartItemRepository.countByUserId(USER_ID)).thenReturn((long) CartServiceImpl.MAX_CART_ITEMS);
        when(cartItemRepository.findByUserIdOrderByAddedAtDesc(USER_ID)).thenReturn(List.of());

        var response = cartService.mergeCart(
                USER_ID,
                new MergeCartRequest(List.of(TEMPLATE_A, TEMPLATE_B))
        );

        assertThat(response.mergedCount()).isEqualTo(0);
        verify(cartItemRepository, never()).save(any(CartItem.class));
        verify(templateLookupService, never()).requireActiveTemplate(any());
    }

    private CartItem cartItem(UUID templateId) {
        CartItem item = new CartItem();
        item.setUserId(USER_ID);
        item.setTemplateId(templateId);
        return item;
    }

    private TemplateSummaryDto stubActiveTemplate(UUID templateId) {
        TemplateSummaryDto summary = new TemplateSummaryDto(templateId, "Template", "slug", 99000L, "/thumb.svg");
        when(templateLookupService.requireActiveTemplate(templateId)).thenReturn(summary);
        return summary;
    }

    private void stubLine(TemplateSummaryDto summary) {
        when(templateLookupService.toLine(summary)).thenReturn(
                new TemplateLineResponse(
                        summary.id(),
                        summary.name(),
                        summary.slug(),
                        summary.price(),
                        summary.thumbnailUrl()
                )
        );
    }
}
