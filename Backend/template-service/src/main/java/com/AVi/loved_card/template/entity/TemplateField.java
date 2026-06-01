package com.AVi.loved_card.template.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Entity JPA bảng {@code catalog.template_fields}: ô nhập tùy chỉnh gắn với một template (label, type, validation).
 */
@Entity
@Table(name = "template_fields", schema = "catalog")
@Getter
@Setter
public class TemplateField {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @Column(name = "field_key", nullable = false, length = 100)
    private String fieldKey;

    @Column(name = "field_label", nullable = false, length = 200)
    private String fieldLabel;

    @Column(name = "field_type", nullable = false, length = 30)
    private String fieldType;

    @Column(length = 200)
    private String placeholder;

    @Column(name = "is_required")
    private Boolean required;

    @Column(name = "max_length")
    private Integer maxLength;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> validation;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;
}
