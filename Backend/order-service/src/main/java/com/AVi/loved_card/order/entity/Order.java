package com.AVi.loved_card.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/** Đơn hàng — snapshot tổng tiền và trạng thái thanh toán (Phase 2.5 mở rộng payment). */
@Entity
@Table(name = "orders", schema = "commerce")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Mã hiển thị cho user, ví dụ {@code LC-20250614-XXXX}. */
    @Column(name = "order_code", nullable = false, unique = true, length = 20)
    private String orderCode;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /** Tổng tiền VND (long, không dùng BigDecimal theo convention dự án). */
    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @Column(name = "payment_method", length = 30)
    private String paymentMethod;

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus;

    @Column(name = "payment_ref", length = 255)
    private String paymentRef;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payment_data", columnDefinition = "jsonb")
    private Map<String, Object> paymentData;

    /** Trạng thái nghiệp vụ — map {@link com.AVi.loved_card.order.constant.OrderStatus}. */
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    /** Soft delete — đơn ẩn khỏi list user nhưng giữ audit. */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
