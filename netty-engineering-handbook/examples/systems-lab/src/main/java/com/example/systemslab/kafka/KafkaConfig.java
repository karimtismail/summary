package com.example.systemslab.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
class KafkaConfig {

    static final String ORDER_TOPIC = "orders.events";

    @Bean
    NewTopic orderEventsTopic() {
        return TopicBuilder.name(ORDER_TOPIC)
            .partitions(3)
            .replicas(1)
            .build();
    }
}
