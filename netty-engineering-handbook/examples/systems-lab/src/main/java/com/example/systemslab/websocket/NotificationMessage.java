package com.example.systemslab.websocket;

import java.time.Instant;

public record NotificationMessage(String from, String body, Instant sentAt) {
}
