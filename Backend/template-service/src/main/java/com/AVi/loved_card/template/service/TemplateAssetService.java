package com.AVi.loved_card.template.service;

import com.AVi.loved_card.template.dto.response.TemplateAssetResponse;

/** Đọc file asset template (preview, thumbnail, ...) theo slug và tên file. */
public interface TemplateAssetService {

    TemplateAssetResponse getAsset(String templateSlug, String assetName);
}
