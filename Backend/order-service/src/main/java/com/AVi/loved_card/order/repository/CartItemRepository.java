package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findByUserIdOrderByAddedAtDesc(UUID userId);

    long countByUserId(UUID userId);

    Optional<CartItem> findByUserIdAndTemplateId(UUID userId, UUID templateId);

    void deleteByUserIdAndTemplateId(UUID userId, UUID templateId);
}
