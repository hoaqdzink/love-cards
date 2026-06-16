package com.AVi.loved_card.template.repository;

import com.AVi.loved_card.common.dto.PageResponse;
import com.AVi.loved_card.template.constant.TemplateSortOption;
import com.AVi.loved_card.template.dto.request.TemplateFilterRequest;
import com.AVi.loved_card.template.dto.response.TemplateCategoryResponse;
import com.AVi.loved_card.template.dto.response.TemplateListItemResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Truy vấn catalog bằng JDBC động: lọc event/color, full-text search, sort, phân trang, aggregate categories.
 */
@Repository
@RequiredArgsConstructor
public class TemplateJdbcRepository {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public PageResponse<TemplateListItemResponse> findActiveTemplates(TemplateFilterRequest filter) {
        var where = new StringBuilder(" WHERE status = 'active' AND deleted_at IS NULL");
        var params = new MapSqlParameterSource()
                .addValue("limit", filter.size())
                .addValue("offset", filter.page() * filter.size());

        appendEventFilter(filter.eventTypes(), where, params);
        appendColorFilter(filter.colors(), where, params);
        appendPriceFilter(filter.minPrice(), filter.maxPrice(), where, params);
        appendSearchFilter(filter.query(), where, params);

        String countSql = "SELECT COUNT(*) FROM catalog.templates" + where;
        long total = jdbcTemplate.queryForObject(countSql, params, Long.class);

        String sql = """
                SELECT id, name, slug, description, event_type, color_tags, price, preview_url,
                       thumbnail_url, has_music, is_featured, is_trending, view_count,
                       purchase_count, created_at
                FROM catalog.templates
                """ + where + " ORDER BY " + TemplateSortOption.from(filter.sort()).orderBy()
                + " LIMIT :limit OFFSET :offset";

        List<TemplateListItemResponse> content = jdbcTemplate.query(sql, params, templateListMapper());
        int totalPages = filter.size() == 0 ? 0 : (int) Math.ceil((double) total / filter.size());

        return PageResponse.<TemplateListItemResponse>builder()
                .content(content)
                .totalElements(total)
                .totalPages(totalPages)
                .currentPage(filter.page())
                .size(filter.size())
                .hasNext(filter.page() + 1 < totalPages)
                .hasPrevious(filter.page() > 0)
                .build();
    }

    public List<TemplateListItemResponse> findFeatured(int limit) {
        String sql = """
                SELECT id, name, slug, description, event_type, color_tags, price, preview_url,
                       thumbnail_url, has_music, is_featured, is_trending, view_count,
                       purchase_count, created_at
                FROM catalog.templates
                WHERE status = 'active' AND deleted_at IS NULL AND is_featured = TRUE
                ORDER BY purchase_count DESC, view_count DESC, created_at DESC
                LIMIT :limit
                """;
        return jdbcTemplate.query(sql, new MapSqlParameterSource("limit", limit), templateListMapper());
    }

    public List<TemplateListItemResponse> findTrending(int limit) {
        String sql = """
                SELECT id, name, slug, description, event_type, color_tags, price, preview_url,
                       thumbnail_url, has_music, is_featured, is_trending, view_count,
                       purchase_count, created_at
                FROM catalog.templates
                WHERE status = 'active' AND deleted_at IS NULL AND is_trending = TRUE
                ORDER BY purchase_count DESC, view_count DESC, created_at DESC
                LIMIT :limit
                """;
        return jdbcTemplate.query(sql, new MapSqlParameterSource("limit", limit), templateListMapper());
    }

    public List<TemplateCategoryResponse> findCategories() {
        String sql = """
                SELECT event_type, COUNT(*) AS count
                FROM catalog.templates
                WHERE status = 'active' AND deleted_at IS NULL
                GROUP BY event_type
                ORDER BY event_type
                """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> new TemplateCategoryResponse(
                rs.getString("event_type"),
                categoryLabel(rs.getString("event_type")),
                rs.getLong("count")
        ));
    }

    public void incrementViewCount(UUID templateId) {
        String sql = "UPDATE catalog.templates SET view_count = view_count + 1, updated_at = NOW() WHERE id = :id";
        jdbcTemplate.update(sql, new MapSqlParameterSource("id", templateId));
    }

    private void appendEventFilter(List<String> eventTypes, StringBuilder where, MapSqlParameterSource params) {
        if (eventTypes == null || eventTypes.isEmpty()) {
            return;
        }
        where.append(" AND event_type IN (:eventTypes)");
        params.addValue("eventTypes", eventTypes);
    }

    private void appendColorFilter(List<String> colors, StringBuilder where, MapSqlParameterSource params) {
        if (colors == null || colors.isEmpty()) {
            return;
        }
        var clauses = new ArrayList<String>();
        for (int i = 0; i < colors.size(); i++) {
            String paramName = "color" + i;
            clauses.add("jsonb_exists(color_tags, :" + paramName + ")");
            params.addValue(paramName, colors.get(i));
        }
        where.append(" AND (").append(String.join(" OR ", clauses)).append(")");
    }

    private void appendPriceFilter(Long minPrice, Long maxPrice, StringBuilder where, MapSqlParameterSource params) {
        if (minPrice != null) {
            where.append(" AND price >= :minPrice");
            params.addValue("minPrice", minPrice);
        }
        if (maxPrice != null) {
            where.append(" AND price <= :maxPrice");
            params.addValue("maxPrice", maxPrice);
        }
    }

    private void appendSearchFilter(String query, StringBuilder where, MapSqlParameterSource params) {
        if (query == null || query.isBlank()) {
            return;
        }
        where.append("""
                 AND to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, ''))
                     @@ plainto_tsquery('simple', :query)
                """);
        params.addValue("query", query.trim());
    }

    private RowMapper<TemplateListItemResponse> templateListMapper() {
        return (rs, rowNum) -> new TemplateListItemResponse(
                rs.getObject("id", UUID.class),
                rs.getString("name"),
                rs.getString("slug"),
                rs.getString("description"),
                rs.getString("event_type"),
                readStringList(rs.getString("color_tags")),
                rs.getLong("price"),
                rs.getString("preview_url"),
                rs.getString("thumbnail_url"),
                rs.getBoolean("has_music"),
                rs.getBoolean("is_featured"),
                rs.getBoolean("is_trending"),
                rs.getLong("view_count"),
                rs.getLong("purchase_count"),
                toLocalDateTime(rs, "created_at")
        );
    }

    private List<String> readStringList(String json) {
        try {
            return json == null ? List.of() : objectMapper.readValue(json, STRING_LIST);
        } catch (Exception ex) {
            return List.of();
        }
    }

    private LocalDateTime toLocalDateTime(ResultSet rs, String column) throws SQLException {
        Timestamp timestamp = rs.getTimestamp(column);
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private String categoryLabel(String eventType) {
        return switch (eventType) {
            case "wedding" -> "Đám cưới";
            case "birthday" -> "Sinh nhật";
            case "party" -> "Tiệc";
            default -> "Khác";
        };
    }
}
