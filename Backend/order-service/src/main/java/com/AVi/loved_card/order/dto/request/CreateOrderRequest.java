package com.AVi.loved_card.order.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** Body POST tạo đơn — mỗi dòng giỏ kèm gói hosting đã chọn. */
public record CreateOrderRequest(
        @NotEmpty @Valid List<CreateOrderItemRequest> items
) {
}
