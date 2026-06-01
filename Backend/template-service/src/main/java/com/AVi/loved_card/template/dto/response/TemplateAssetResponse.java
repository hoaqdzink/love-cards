package com.AVi.loved_card.template.dto.response;

/** Nội dung file asset (bytes + Content-Type) trước khi controller set header HTTP. */
public record TemplateAssetResponse(
        byte[] bytes,
        String contentType
) {
}
