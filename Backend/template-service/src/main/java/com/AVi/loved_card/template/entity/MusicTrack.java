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
import java.util.Map;
import java.util.UUID;

/**
 * Entity JPA bảng {@code catalog.music_library}: track nhạc nền dùng khi tạo thiệp.
 */
@Entity
@Table(name = "music_library", schema = "catalog")
@Getter
@Setter
public class MusicTrack {

    @Id
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 50)
    private String genre;

    @Column(name = "duration_sec")
    private Integer durationSec;

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "is_active")
    private Boolean active;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> metadata;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;
}
