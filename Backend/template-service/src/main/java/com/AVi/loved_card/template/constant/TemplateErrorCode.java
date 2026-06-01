package com.AVi.loved_card.template.constant;

/** Mã lỗi nghiệp vụ module template (tiền tố {@code TPL_}) — trả trong {@code AppResponse.code}. */
public final class TemplateErrorCode {

    public static final String TPL_NOT_FOUND = "TPL_NOT_FOUND";
    public static final String TPL_INACTIVE = "TPL_INACTIVE";
    public static final String TPL_INVALID_FILTER = "TPL_INVALID_FILTER";
    public static final String TPL_ASSET_NOT_FOUND = "TPL_ASSET_NOT_FOUND";

    private TemplateErrorCode() {
    }
}
