package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/** Truy vấn chi tiết dòng đơn hàng. */
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    /** Các dòng thuộc một đơn, thứ tự tạo ổn định. */
    List<OrderItem> findByOrderIdOrderByCreatedAtAsc(UUID orderId);
}
