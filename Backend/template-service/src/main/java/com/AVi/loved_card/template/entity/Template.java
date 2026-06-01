package com.AVi.loved_card.template.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Entity JPA bảng {@code catalog.templates}: metadata mẫu thiệp (slug, giá, tag, featured/trending, view count).
 */
@Entity
@Table(name = "templates", schema = "catalog")
@Getter
@Setter
public class Template {

    @Id
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "color_tags", columnDefinition = "jsonb")
    private List<String> colorTags;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "preview_url", nullable = false, columnDefinition = "TEXT")
    private String previewUrl;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "assets_path", columnDefinition = "TEXT")
    private String assetsPath;

    @Column(name = "has_music")
    private Boolean hasMusic;

    @Column(name = "is_featured")
    private Boolean featured;

    @Column(name = "is_trending")
    private Boolean trending;

    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "purchase_count")
    private Long purchaseCount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;
}
