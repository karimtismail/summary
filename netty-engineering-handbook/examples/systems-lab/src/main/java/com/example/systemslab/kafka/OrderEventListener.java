package com.example.systemslab.kafka;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
class OrderEventListener {

    private final CopyOnWriteArrayList<OrderEvent> received = new CopyOnWriteArrayList<>();

    @KafkaListener(topics = KafkaConfig.ORDER_TOPIC, groupId = "systems-lab")
    void onOrderEvent(OrderEvent event) {
        received.add(event);
    }

    List<OrderEvent> received() {
        return List.copyOf(received);
    }
}
