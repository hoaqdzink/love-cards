package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/** Lưu lịch sử chuyển trạng thái đơn (Phase 2.5). */
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, UUID> {
}
