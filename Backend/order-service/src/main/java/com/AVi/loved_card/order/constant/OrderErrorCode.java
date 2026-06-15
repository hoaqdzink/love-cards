package com.AVi.loved_card.order.constant;

/**
 * Mã lỗi API order-service — dùng trong {@link com.AVi.loved_card.order.exception.OrderApiException}.
 */
public final class OrderErrorCode {

    /** Thiếu hoặc không hợp lệ header {@code X-User-Id}. */
    public static final String AUTH_USER_REQUIRED = "AUTH_USER_REQUIRED";

    /** Mẫu thiệp không tồn tại khi thêm giỏ. */
    public static final String CART_TEMPLATE_NOT_FOUND = "CART_TEMPLATE_NOT_FOUND";
    /** Mẫu đã bị vô hiệu hóa. */
    public static final String CART_TEMPLATE_INACTIVE = "CART_TEMPLATE_INACTIVE";
    /** Mẫu đã có trong giỏ. */
    public static final String CART_DUPLICATE = "CART_DUPLICATE";
    /** Vượt giới hạn số mẫu trong giỏ. */
    public static final String CART_MAX_ITEMS = "CART_MAX_ITEMS";

    /** Giỏ trống khi tạo đơn. */
    public static final String ORD_CART_EMPTY = "ORD_CART_EMPTY";
    /** Mẫu không khả dụng lúc checkout. */
    public static final String ORD_TEMPLATE_UNAVAILABLE = "ORD_TEMPLATE_UNAVAILABLE";
    /** Gói hosting không hợp lệ hoặc inactive. */
    public static final String ORD_HOSTING_PLAN_INVALID = "ORD_HOSTING_PLAN_INVALID";
    /** Không tìm thấy đơn theo mã hoặc không thuộc user. */
    public static final String ORD_NOT_FOUND = "ORD_NOT_FOUND";

    private OrderErrorCode() {
    }
}
