package com.example.systemslab.websocket;

import java.time.Instant;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
class NotificationController {

    @MessageMapping("/notify")
    @SendTo("/topic/notifications")
    NotificationMessage notify(NotificationMessage message) {
        return new NotificationMessage(message.from(), message.body(), Instant.now());
    }
}
