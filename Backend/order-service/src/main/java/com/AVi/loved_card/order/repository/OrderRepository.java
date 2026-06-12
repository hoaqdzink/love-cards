package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID userId);

    Optional<Order> findByOrderCodeAndDeletedAtIsNull(String orderCode);

    Optional<Order> findByOrderCodeAndUserIdAndDeletedAtIsNull(String orderCode, UUID userId);

    boolean existsByOrderCode(String orderCode);
}
