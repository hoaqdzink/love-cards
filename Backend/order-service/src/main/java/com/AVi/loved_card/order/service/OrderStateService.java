package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.constant.OrderStatus;
import com.AVi.loved_card.order.entity.Order;
import com.AVi.loved_card.order.entity.OrderStatusHistory;
import com.AVi.loved_card.order.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Ghi nhận chuyển trạng thái đơn vào {@code order_status_history}.
 * Phase 2: chỉ dùng gián tiếp khi tạo CREATED; Phase 2.5 mở rộng payment transitions.
 */
@Service
@RequiredArgsConstructor
public class OrderStateService {

    private final OrderStatusHistoryRepository historyRepository;

    /**
     * Cập nhật {@code order.status} và append một bản ghi lịch sử.
     *
     * @param order     entity đơn (mutated in-memory)
     * @param toStatus  trạng thái đích
     * @param reason    mô tả ngắn (audit)
     * @param changedBy user thực hiện (hoặc system UUID)
     */
    public void recordTransition(Order order, OrderStatus toStatus, String reason, UUID changedBy) {
        String from = order.getStatus();
        order.setStatus(toStatus.value());
        order.setUpdatedAt(LocalDateTime.now());

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrderId(order.getId());
        history.setFromStatus(from);
        history.setToStatus(toStatus.value());
        history.setReason(reason);
        history.setChangedAt(LocalDateTime.now());
        history.setChangedBy(changedBy);
        historyRepository.save(history);
    }
}
