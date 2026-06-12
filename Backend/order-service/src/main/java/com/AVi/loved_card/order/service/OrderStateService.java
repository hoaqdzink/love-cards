package com.AVi.loved_card.order.service;

import com.AVi.loved_card.order.constant.OrderStatus;
import com.AVi.loved_card.order.entity.Order;
import com.AVi.loved_card.order.entity.OrderStatusHistory;
import com.AVi.loved_card.order.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderStateService {

    private final OrderStatusHistoryRepository historyRepository;

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
