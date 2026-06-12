package com.AVi.loved_card.order.constant;

public enum OrderStatus {
    CREATED("created"),
    PENDING_QR("pending_qr"),
    PENDING_EWALLET("pending_ewallet"),
    PENDING_CARD("pending_card"),
    VERIFYING("verifying"),
    PAID("paid"),
    COMPLETED("completed"),
    FAILED("failed"),
    EXPIRED("expired"),
    CANCELLED("cancelled");

    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

    public static OrderStatus fromValue(String value) {
        for (OrderStatus status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown order status: " + value);
    }
}
