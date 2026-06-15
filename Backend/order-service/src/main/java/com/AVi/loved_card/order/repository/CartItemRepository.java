package com.AVi.loved_card.order.repository;

import com.AVi.loved_card.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Truy vấn giỏ hàng server-side theo user. */
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    /** Toàn bộ mẫu trong giỏ, mới thêm trước. */
    List<CartItem> findByUserIdOrderByAddedAtDesc(UUID userId);

    /** Đếm để enforce {@code CART_MAX_ITEMS}. */
    long countByUserId(UUID userId);

    /** Kiểm tra trùng mẫu trước khi add. */
    Optional<CartItem> findByUserIdAndTemplateId(UUID userId, UUID templateId);

    /** Xóa một mẫu khỏi giỏ. */
    void deleteByUserIdAndTemplateId(UUID userId, UUID templateId);
}
