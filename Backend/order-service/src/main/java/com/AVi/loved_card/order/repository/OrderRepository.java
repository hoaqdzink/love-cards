package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Truy vấn đơn hàng — lọc soft-delete và theo user. */
public interface OrderRepository extends JpaRepository<Order, UUID> {

    /** Danh sách đơn của user, mới nhất trước. */
    List<Order> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID userId);

    /** Tra cứu đơn theo mã hiển thị (public detail page). */
    Optional<Order> findByOrderCodeAndDeletedAtIsNull(String orderCode);

    /** Tra cứu đơn thuộc user cụ thể — tránh lộ đơn người khác. */
    Optional<Order> findByOrderCodeAndUserIdAndDeletedAtIsNull(String orderCode, UUID userId);

    /** Kiểm tra trùng mã khi generate {@code orderCode}. */
    boolean existsByOrderCode(String orderCode);
}
