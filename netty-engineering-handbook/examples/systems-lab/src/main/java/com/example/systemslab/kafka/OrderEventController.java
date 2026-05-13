package com.example.systemslab.kafka;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kafka")
class OrderEventController {

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
    private final OrderEventListener listener;

    OrderEventController(KafkaTemplate<String, OrderEvent> kafkaTemplate, OrderEventListener listener) {
        this.kafkaTemplate = kafkaTemplate;
        this.listener = listener;
    }

    @PostMapping("/orders/{orderId}")
    CompletableFuture<Map<String, Object>> send(@PathVariable String orderId) {
        String customerId = "customer-" + Math.abs(orderId.hashCode() % 3);
        OrderEvent event = new OrderEvent(orderId, customerId, 4999, Instant.now().toString());

        return kafkaTemplate.send(KafkaConfig.ORDER_TOPIC, customerId, event)
            .thenApply(result -> metadata(event, result));
    }

    @GetMapping("/received")
    List<OrderEvent> received() {
        return listener.received();
    }

    private Map<String, Object> metadata(OrderEvent event, SendResult<String, OrderEvent> result) {
        return Map.of(
            "event", event,
            "topic", result.getRecordMetadata().topic(),
            "partition", result.getRecordMetadata().partition(),
            "offset", result.getRecordMetadata().offset()
        );
    }
}
