package com.AVi.loved_card.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "order_items", schema = "commerce")
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Column(name = "template_id", nullable = false)
    private UUID templateId;

    @Column(name = "hosting_plan_id")
    private UUID hostingPlanId;

    @Column(name = "template_price", nullable = false)
    private Long templatePrice;

    @Column(name = "hosting_price", nullable = false)
    private Long hostingPrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
