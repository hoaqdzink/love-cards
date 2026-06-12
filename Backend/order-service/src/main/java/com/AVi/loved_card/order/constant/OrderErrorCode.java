package com.AVi.loved_card.order.constant;

public final class OrderErrorCode {

    public static final String AUTH_USER_REQUIRED = "AUTH_USER_REQUIRED";
    public static final String CART_TEMPLATE_NOT_FOUND = "CART_TEMPLATE_NOT_FOUND";
    public static final String CART_TEMPLATE_INACTIVE = "CART_TEMPLATE_INACTIVE";
    public static final String CART_DUPLICATE = "CART_DUPLICATE";
    public static final String CART_MAX_ITEMS = "CART_MAX_ITEMS";
    public static final String ORD_CART_EMPTY = "ORD_CART_EMPTY";
    public static final String ORD_TEMPLATE_UNAVAILABLE = "ORD_TEMPLATE_UNAVAILABLE";
    public static final String ORD_HOSTING_PLAN_INVALID = "ORD_HOSTING_PLAN_INVALID";
    public static final String ORD_NOT_FOUND = "ORD_NOT_FOUND";

    private OrderErrorCode() {
    }
}
