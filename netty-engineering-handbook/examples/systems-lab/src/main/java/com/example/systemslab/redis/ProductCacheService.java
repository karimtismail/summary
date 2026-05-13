package com.example.systemslab.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
class ProductCacheService {

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AtomicInteger sourceCalls = new AtomicInteger();

    ProductCacheService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    ProductRead readProduct(String id) {
        String key = key(id);
        String cached = redis.opsForValue().get(key);
        if (cached != null) {
            return new ProductRead(readJson(cached), "hit", sourceCalls.get(), redis.getExpire(key));
        }

        ProductPayload payload = loadFromSource(id);
        redis.opsForValue().set(key, writeJson(payload), ttlWithJitter());
        return new ProductRead(payload, "miss-filled", sourceCalls.get(), redis.getExpire(key));
    }

    CacheEviction evictProduct(String id) {
        Boolean removed = redis.delete(key(id));
        return new CacheEviction(id, Boolean.TRUE.equals(removed), sourceCalls.get());
    }

    private ProductPayload loadFromSource(String id) {
        sourceCalls.incrementAndGet();
        return new ProductPayload(id, "product-" + id, 1999 + id.length(), Instant.now().toString());
    }

    private Duration ttlWithJitter() {
        return Duration.ofSeconds(90 + ThreadLocalRandom.current().nextInt(31));
    }

    private String key(String id) {
        return "product:%s".formatted(id);
    }

    private String writeJson(ProductPayload payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Could not serialize product payload", exception);
        }
    }

    private ProductPayload readJson(String json) {
        try {
            return objectMapper.readValue(json, ProductPayload.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Could not read cached product payload", exception);
        }
    }
}

record ProductPayload(String id, String name, int priceCents, String loadedAt) {
}

record ProductRead(ProductPayload product, String cacheState, int sourceCalls, Long ttlSeconds) {
}

record CacheEviction(String id, boolean removed, int sourceCalls) {
}
