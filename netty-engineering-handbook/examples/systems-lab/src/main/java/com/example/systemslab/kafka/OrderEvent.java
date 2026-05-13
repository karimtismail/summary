package com.example.systemslab.kafka;

public record OrderEvent(String orderId, String customerId, int amountCents, String createdAt) {
}
