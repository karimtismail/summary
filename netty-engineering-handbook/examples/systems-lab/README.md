# Systems Lab

Runnable examples for the handbook study paths. The app is intentionally small: each endpoint exists to make one runtime behavior visible.

## What You Can Prove

| Track | Run this | Watch for |
| --- | --- | --- |
| Kafka | `POST /kafka/orders/{orderId}` | keyed partitioning, async send metadata, consumed events |
| Redis | `GET /redis/products/{id}` | cache miss, cache hit, TTL, source-call count |
| MongoDB | `POST /mongo/products/seed` then `GET /mongo/products/explain` | query shape, index shape, documents examined |
| WebSocket | STOMP `/app/notify` -> `/topic/notifications` | persistent connection routing |
| Docker | `docker compose up --build` | runtime config outside the image |

## Run With Docker Compose

```bash
docker compose up --build
```

The app listens on `http://localhost:8080`.

Useful checks:

```bash
curl -s http://localhost:8080/actuator/health
curl -s http://localhost:8080/redis/products/42
curl -s http://localhost:8080/redis/products/42
curl -s -X POST http://localhost:8080/kafka/orders/order-1
curl -s http://localhost:8080/kafka/received
curl -s -X POST http://localhost:8080/mongo/products/seed
curl -s "http://localhost:8080/mongo/products/explain?sellerId=seller-a&minPriceCents=1000"
```

## Run Locally Against Compose Dependencies

Start only the backing services:

```bash
docker compose up kafka redis mongo
```

Then run the app from this directory:

```bash
mvn -q -DskipTests package
SPRING_KAFKA_BOOTSTRAP_SERVERS=localhost:29092 \
SPRING_DATA_REDIS_HOST=localhost \
SPRING_MONGODB_URI=mongodb://localhost:27017/systems_lab \
mvn spring-boot:run
```

## Study Rule

For every run, capture one piece of evidence before changing code: a Kafka offset, Redis source-call count, Mongo explain output, WebSocket frame log, or container exit reason.
