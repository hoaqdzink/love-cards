package com.AVi.loved_card.template.dto.response;

import java.util.Map;
import java.util.UUID;

/** Track nhạc trả về API public — URL file phục vụ client/editor. */
public record MusicTrackResponse(
        UUID id,
        String title,
        String genre,
        Integer durationSec,
        String fileUrl,
        Map<String, Object> metadata
) {
}
