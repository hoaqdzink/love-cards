package com.AVi.loved_card.template.mapper;

import com.AVi.loved_card.template.dto.response.MusicTrackResponse;
import com.AVi.loved_card.template.dto.response.TemplateDetailResponse;
import com.AVi.loved_card.template.dto.response.TemplateFieldResponse;
import com.AVi.loved_card.template.dto.response.TemplateListItemResponse;
import com.AVi.loved_card.template.entity.MusicTrack;
import com.AVi.loved_card.template.entity.Template;
import com.AVi.loved_card.template.entity.TemplateField;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Chuyển entity {@link Template}, {@link TemplateField}, {@link MusicTrack} sang DTO response API.
 */
@Component
public class TemplateMapper {

    public TemplateListItemResponse toListItem(Template template) {
        return new TemplateListItemResponse(
                template.getId(),
                template.getName(),
                template.getSlug(),
                template.getDescription(),
                template.getEventType(),
                template.getColorTags(),
                template.getPrice(),
                template.getPreviewUrl(),
                template.getThumbnailUrl(),
                Boolean.TRUE.equals(template.getHasMusic()),
                Boolean.TRUE.equals(template.getFeatured()),
                Boolean.TRUE.equals(template.getTrending()),
                template.getViewCount(),
                template.getPurchaseCount(),
                template.getCreatedAt()
        );
    }

    public TemplateDetailResponse toDetail(Template template, List<TemplateField> fields) {
        return new TemplateDetailResponse(
                template.getId(),
                template.getName(),
                template.getSlug(),
                template.getDescription(),
                template.getEventType(),
                template.getColorTags(),
                template.getPrice(),
                template.getStatus(),
                template.getPreviewUrl(),
                template.getThumbnailUrl(),
                template.getAssetsPath(),
                Boolean.TRUE.equals(template.getHasMusic()),
                Boolean.TRUE.equals(template.getFeatured()),
                Boolean.TRUE.equals(template.getTrending()),
                template.getViewCount(),
                template.getPurchaseCount(),
                template.getMetadata(),
                fields.stream().map(this::toField).toList(),
                template.getCreatedAt(),
                template.getUpdatedAt()
        );
    }

    public TemplateFieldResponse toField(TemplateField field) {
        return new TemplateFieldResponse(
                field.getId(),
                field.getFieldKey(),
                field.getFieldLabel(),
                field.getFieldType(),
                field.getPlaceholder(),
                Boolean.TRUE.equals(field.getRequired()),
                field.getMaxLength(),
                field.getDisplayOrder(),
                field.getValidation()
        );
    }

    public MusicTrackResponse toMusic(MusicTrack track) {
        return new MusicTrackResponse(
                track.getId(),
                track.getTitle(),
                track.getGenre(),
                track.getDurationSec(),
                track.getFileUrl(),
                track.getMetadata()
        );
    }
}
