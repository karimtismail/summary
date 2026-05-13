import type { ChapterCheatSheet } from "@/lib/handbook";

export type StoryPractice = {
  title: string;
  language: string;
  code: string;
  note: string;
};

export type ChapterStoryGuide = {
  arabic: string;
  beats: Array<{
    label: string;
    text: string;
  }>;
  practice: StoryPractice;
};

type GuideInput = {
  sectionSlug: string;
  chapterSlug: string;
  title: string;
  description: string;
  sheet: ChapterCheatSheet;
};

const practiceByChapter: Record<string, StoryPractice> = {
  "foundations/networking-fundamentals": {
    title: "Watch one HTTP conversation from the outside",
    language: "bash",
    code: "curl -v https://example.com\nnslookup example.com\nss -tan | head",
    note: "The goal is not memorizing flags. Notice DNS, TCP connection state, TLS, request, response, and open sockets."
  },
  "foundations/osi-model": {
    title: "Map one request to layers",
    language: "bash",
    code: "curl -v --http1.1 https://example.com\n# Then write beside the output:\n# L7 HTTP, L6 TLS, L4 TCP, L3 IP, L2 link",
    note: "Use the OSI model as a debugging map, not as exam vocabulary."
  },
  "foundations/tcp-vs-udp": {
    title: "Feel the difference between connect and datagram",
    language: "bash",
    code: "nc -vz example.com 443\nprintf 'hello\\n' | nc -u 127.0.0.1 9999",
    note: "TCP has connection state. UDP sends datagrams without a connection handshake."
  },
  "foundations/blocking-io": {
    title: "The smallest blocking server shape",
    language: "java",
    code: "try (ServerSocket server = new ServerSocket(8080)) {\n    while (true) {\n        Socket client = server.accept();\n        new Thread(() -> handle(client)).start();\n    }\n}",
    note: "This is readable, but every slow or silent client costs a thread."
  },
  "java-nio/buffers": {
    title: "Run the buffer state machine once",
    language: "java",
    code: "ByteBuffer buffer = ByteBuffer.allocate(8);\nbuffer.put((byte) 'O');\nbuffer.put((byte) 'K');\nbuffer.flip();\nwhile (buffer.hasRemaining()) {\n    System.out.print((char) buffer.get());\n}\nbuffer.clear();",
    note: "The important transition is `flip`: from filling the box to reading from the box."
  },
  "java-nio/channels": {
    title: "Compile the complete echo server in the chapter",
    language: "bash",
    code: "javac NioChannelEchoServer.java\njava NioChannelEchoServer 8080\nprintf 'hello channel\\n' | nc localhost 8080",
    note: "This proves that a channel is a progress attempt, not a promise that the whole message moved."
  },
  "java-nio/selectors": {
    title: "Trace selector interests",
    language: "java",
    code: "channel.configureBlocking(false);\nSelectionKey key = channel.register(selector, SelectionKey.OP_READ);\nkey.interestOps(SelectionKey.OP_READ | SelectionKey.OP_WRITE);\nkey.interestOps(SelectionKey.OP_READ);",
    note: "`interestOps` is how the loop says what it wants to hear about next."
  },
  "java-nio/scatter-gather": {
    title: "Read header and body without merging buffers",
    language: "java",
    code: "ByteBuffer header = ByteBuffer.allocate(8);\nByteBuffer body = ByteBuffer.allocate(1024);\nlong bytes = channel.read(new ByteBuffer[] { header, body });\nheader.flip();\nbody.flip();",
    note: "Scatter/gather helps when the protocol already has separate byte regions."
  },
  "java-nio/zero-copy": {
    title: "Move file bytes through the kernel path",
    language: "java",
    code: "try (FileChannel file = FileChannel.open(Path.of(\"video.mp4\"));\n     SocketChannel socket = SocketChannel.open(remote)) {\n    long position = 0;\n    while (position < file.size()) {\n        position += file.transferTo(position, file.size() - position, socket);\n    }\n}",
    note: "`transferTo` can avoid copying the file through your application heap."
  },
  "netty-core/eventloop": {
    title: "Check whether code is on the EventLoop",
    language: "java",
    code: "EventLoop loop = ctx.channel().eventLoop();\nif (loop.inEventLoop()) {\n    ctx.writeAndFlush(msg);\n} else {\n    loop.execute(() -> ctx.writeAndFlush(msg));\n}",
    note: "Touch channel state on its lane. Move slow work away from the lane."
  },
  "netty-core/futures": {
    title: "Use completion instead of waiting",
    language: "java",
    code: "ChannelFuture future = ctx.writeAndFlush(response);\nfuture.addListener(done -> {\n    if (!done.isSuccess()) {\n        ctx.close();\n    }\n});",
    note: "A future is a notification point. Blocking on it inside the EventLoop defeats the model."
  },
  "netty-core/pipeline": {
    title: "Build a small protocol pipeline",
    language: "java",
    code: "ch.pipeline()\n  .addLast(new LineBasedFrameDecoder(8192))\n  .addLast(new StringDecoder(StandardCharsets.UTF_8))\n  .addLast(new StringEncoder(StandardCharsets.UTF_8))\n  .addLast(new ChatHandler());",
    note: "The pipeline keeps framing, decoding, encoding, and business behavior separated."
  },
  "netty-core/handlers": {
    title: "Keep handler state per channel",
    language: "java",
    code: "final class EchoHandler extends SimpleChannelInboundHandler<String> {\n    @Override\n    protected void channelRead0(ChannelHandlerContext ctx, String msg) {\n        ctx.writeAndFlush(\"echo: \" + msg + \"\\n\");\n    }\n}",
    note: "Reusable handlers are good. Shared mutable handler state is usually the trap."
  },
  "netty-core/bytebuf": {
    title: "Notice separate reader and writer indexes",
    language: "java",
    code: "ByteBuf buf = Unpooled.buffer();\nbuf.writeInt(42);\nint value = buf.readInt();\nbuf.release();",
    note: "Unlike `ByteBuffer`, `ByteBuf` does not need `flip`, but pooled buffers need ownership discipline."
  },
  "netty-core/spring-boot": {
    title: "Customize Reactor Netty without leaving Spring Boot",
    language: "java",
    code: "@Bean\nWebServerFactoryCustomizer<NettyReactiveWebServerFactory> nettyTuning() {\n    return factory -> factory.addServerCustomizers(server -> server.compress(true));\n}",
    note: "Spring Boot WebFlux can run on Reactor Netty; the EventLoop rules still apply."
  },
  "kafka/distributed-log": {
    title: "Create a log and append events",
    language: "bash",
    code: "kafka-topics --bootstrap-server localhost:9092 --create --topic orders --partitions 3\nkafka-console-producer --bootstrap-server localhost:9092 --topic orders\nkafka-console-consumer --bootstrap-server localhost:9092 --topic orders --from-beginning",
    note: "Kafka feels different when you see that consumers read positions in an append-only log."
  },
  "kafka/brokers-topics-partitions": {
    title: "Inspect topic layout",
    language: "bash",
    code: "kafka-topics --bootstrap-server localhost:9092 --describe --topic orders",
    note: "Look for leaders, replicas, and partitions. That is where ordering and parallelism live."
  },
  "kafka/replication-isr": {
    title: "Read replication state",
    language: "bash",
    code: "kafka-topics --bootstrap-server localhost:9092 --describe --topic orders\n# Watch Leader, Replicas, and Isr for each partition.",
    note: "ISR is the set of replicas caught up enough to participate in durable writes."
  },
  "kafka/producers": {
    title: "A visible producer configuration",
    language: "java",
    code: "Properties props = new Properties();\nprops.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, \"localhost:9092\");\nprops.put(ProducerConfig.ACKS_CONFIG, \"all\");\nprops.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, \"true\");\nprops.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());\nprops.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());",
    note: "Producer config is part of the correctness story, not just performance tuning."
  },
  "kafka/consumers-offsets": {
    title: "Commit only after processing",
    language: "java",
    code: "props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, \"false\");\ntry (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {\n    consumer.subscribe(List.of(\"orders\"));\n    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));\n    process(records);\n    consumer.commitSync();\n}",
    note: "The committed offset is your promise about what the group can skip next time."
  },
  "kafka/delivery-semantics": {
    title: "Name the failure window",
    language: "text",
    code: "process then commit  -> possible duplicate after crash\ncommit then process  -> possible loss after crash\ntransactional write  -> tighter boundary, higher complexity",
    note: "Delivery semantics are not magic settings; they are choices about crash timing."
  },
  "kafka/transactions-idempotence": {
    title: "The transaction shape",
    language: "java",
    code: "producer.initTransactions();\nproducer.beginTransaction();\nproducer.send(new ProducerRecord<>(\"out\", key, value));\nproducer.sendOffsetsToTransaction(offsets, groupMetadata);\nproducer.commitTransaction();",
    note: "Transactions connect consumed offsets with produced records in one atomic boundary."
  },
  "kafka/schema-evolution": {
    title: "Compatibility thinking",
    language: "json",
    code: "{\n  \"type\": \"record\",\n  \"name\": \"OrderCreated\",\n  \"fields\": [\n    { \"name\": \"orderId\", \"type\": \"string\" },\n    { \"name\": \"coupon\", \"type\": [\"null\", \"string\"], \"default\": null }\n  ]\n}",
    note: "Add optional fields before forcing every consumer to know the new shape."
  },
  "kafka/stream-processing": {
    title: "Read, transform, write",
    language: "java",
    code: "StreamsBuilder builder = new StreamsBuilder();\nbuilder.stream(\"orders\")\n       .filter((key, value) -> value != null)\n       .to(\"valid-orders\");\nKafkaStreams streams = new KafkaStreams(builder.build(), props);\nstreams.start();",
    note: "A stream app is still a Kafka consumer and producer with state and restart rules."
  },
  "kafka/operations-performance": {
    title: "Start with lag and partition facts",
    language: "bash",
    code: "kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group billing\nkafka-topics --bootstrap-server localhost:9092 --describe --topic orders",
    note: "Most Kafka performance work starts by proving whether the bottleneck is producers, brokers, partitions, or consumers."
  },
  "mongodb/documents-collections": {
    title: "Insert a document that looks like the app",
    language: "javascript",
    code: "db.orders.insertOne({\n  _id: \"ord-1\",\n  customerId: \"cust-7\",\n  lines: [{ sku: \"book\", qty: 2 }],\n  status: \"PAID\"\n})",
    note: "MongoDB starts with documents. The hard part is choosing which document shape ages well."
  },
  "mongodb/schema-design": {
    title: "Compare embed and reference",
    language: "javascript",
    code: "db.orders.find({ customerId: \"cust-7\" })\ndb.customers.findOne({ _id: \"cust-7\" })",
    note: "Model around read and write patterns, not around class diagrams."
  },
  "mongodb/queries-indexes": {
    title: "Prove the index is used",
    language: "javascript",
    code: "db.orders.createIndex({ customerId: 1, createdAt: -1 })\ndb.orders.find({ customerId: \"cust-7\" }).sort({ createdAt: -1 }).explain(\"executionStats\")",
    note: "An index is useful only if it matches the query shape you actually run."
  },
  "mongodb/writes-transactions": {
    title: "Name the write boundary",
    language: "javascript",
    code: "session = db.getMongo().startSession()\nsession.startTransaction()\nsession.getDatabase(\"shop\").orders.insertOne({ _id: \"ord-2\", status: \"PAID\" })\nsession.commitTransaction()",
    note: "Transactions are for multi-document correctness, not a default modeling style."
  },
  "mongodb/replication-sharding": {
    title: "Inspect cluster state before guessing",
    language: "javascript",
    code: "rs.status()\nsh.status()",
    note: "Replication answers durability and failover. Sharding answers distribution and scale."
  },
  "mongodb/spring-boot-mongodb": {
    title: "Keep the repository small",
    language: "java",
    code: "interface OrderRepository extends MongoRepository<Order, String> {\n    List<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId);\n}",
    note: "Spring Data is helpful when the query shape is obvious. Use templates when the query needs to be explicit."
  },
  "redis/data-types": {
    title: "Use the type that matches the access",
    language: "bash",
    code: "redis-cli SET session:1 user-7\nredis-cli HSET cart:1 book 2 pen 3\nredis-cli ZADD leaderboard 42 user-7",
    note: "Redis data types are small purpose-built structures, not tables."
  },
  "redis/caching-patterns": {
    title: "Cache-aside in three moves",
    language: "text",
    code: "1. read cache\n2. if miss, read database\n3. store value with TTL before returning",
    note: "The hard part is not putting data in cache. It is invalidation, stampede control, and stale reads."
  },
  "redis/expiration-eviction": {
    title: "See TTL as a contract",
    language: "bash",
    code: "redis-cli SET otp:123456 user-7 EX 60\nredis-cli TTL otp:123456\nredis-cli CONFIG GET maxmemory-policy",
    note: "Expiration is per key. Eviction is Redis protecting memory under pressure."
  },
  "redis/persistence-replication": {
    title: "Ask how Redis survives restart",
    language: "bash",
    code: "redis-cli INFO persistence\nredis-cli INFO replication",
    note: "Redis can be fast and still durable enough for some jobs, but only if you know the persistence mode."
  },
  "redis/streams-pubsub": {
    title: "Compare fire-and-forget with a stream",
    language: "bash",
    code: "redis-cli PUBLISH alerts 'cpu high'\nredis-cli XADD orders * orderId 7 status paid\nredis-cli XREAD COUNT 1 STREAMS orders 0",
    note: "Pub/Sub is live broadcast. Streams keep entries so consumers can catch up."
  },
  "redis/spring-boot-redis": {
    title: "Make serialization visible",
    language: "java",
    code: "@Bean\nRedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {\n    return RedisCacheManager.builder(connectionFactory).build();\n}",
    note: "Most Spring Redis surprises come from keys, serializers, TTLs, and cache names."
  },
  "docker/containers-images": {
    title: "See image versus container",
    language: "bash",
    code: "docker image ls\ndocker run --name demo-nginx -p 8080:80 nginx:alpine\ndocker ps\ndocker rm -f demo-nginx",
    note: "The image is the recipe. The container is one running process from that recipe."
  },
  "docker/dockerfiles-layers": {
    title: "Build and inspect layers",
    language: "dockerfile",
    code: "FROM eclipse-temurin:21-jre\nWORKDIR /app\nCOPY target/app.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]",
    note: "Dockerfiles are read as build instructions and cached as layers."
  },
  "docker/compose-networking-volumes": {
    title: "Let services find each other by name",
    language: "yaml",
    code: "services:\n  app:\n    image: my-app\n    environment:\n      SPRING_DATA_REDIS_HOST: redis\n  redis:\n    image: redis:7-alpine",
    note: "`localhost` inside a container is the same container. Compose service names are the network addresses."
  },
  "docker/build-cache-multistage": {
    title: "Separate build image from runtime image",
    language: "dockerfile",
    code: "FROM maven:3.9-eclipse-temurin-21 AS build\nWORKDIR /src\nCOPY . .\nRUN mvn -q -DskipTests package\n\nFROM eclipse-temurin:21-jre\nCOPY --from=build /src/target/*.jar /app/app.jar\nENTRYPOINT [\"java\", \"-jar\", \"/app/app.jar\"]",
    note: "Multi-stage builds keep compilers and build caches out of the runtime image."
  },
  "docker/dockerizing-spring-boot": {
    title: "Run one image with external config",
    language: "bash",
    code: "docker build -t my-spring-app .\ndocker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod my-spring-app",
    note: "The same image should move between environments. Config changes outside the image."
  },
  "docker/production-debugging": {
    title: "Start from process, logs, network, mounts",
    language: "bash",
    code: "docker ps\ndocker logs app --tail 100\ndocker exec -it app sh\ndocker inspect app",
    note: "Good container debugging is evidence-first, not rebuild-first."
  },
  "protocol-engineering/framing": {
    title: "Length-prefix one message",
    language: "java",
    code: "byte[] payload = \"hello\".getBytes(StandardCharsets.UTF_8);\nByteBuffer frame = ByteBuffer.allocate(4 + payload.length);\nframe.putInt(payload.length);\nframe.put(payload);\nframe.flip();",
    note: "TCP gives bytes. Framing tells the receiver where one message ends."
  },
  "protocol-engineering/decoders": {
    title: "Decode only when the frame is complete",
    language: "java",
    code: "if (buffer.remaining() < 4) return;\nint length = buffer.getInt(buffer.position());\nif (buffer.remaining() < 4 + length) return;\nbuffer.getInt();\nbyte[] payload = new byte[length];\nbuffer.get(payload);",
    note: "A decoder must be comfortable waiting with half a message."
  },
  "protocol-engineering/encoders": {
    title: "Encode the boundary with the data",
    language: "java",
    code: "ByteBuf out = ctx.alloc().buffer();\nbyte[] payload = json.getBytes(StandardCharsets.UTF_8);\nout.writeInt(payload.length);\nout.writeBytes(payload);\nctx.writeAndFlush(out);",
    note: "Encoders make the receiver's decoder possible."
  },
  "protocol-engineering/http": {
    title: "See HTTP as framed semantics",
    language: "bash",
    code: "curl -v http://localhost:8080/orders/1",
    note: "HTTP adds method, path, headers, status, and body rules on top of a byte transport."
  },
  "protocol-engineering/websocket": {
    title: "Open a WebSocket from the browser console",
    language: "javascript",
    code: "const socket = new WebSocket('ws://localhost:8080/chat');\nsocket.onmessage = event => console.log(event.data);\nsocket.onopen = () => socket.send('hello');",
    note: "WebSocket starts as HTTP, then upgrades into framed full-duplex messages."
  },
  "websocket/handshake-upgrade": {
    title: "Inspect the upgrade request",
    language: "bash",
    code: "curl -i \\\n  -H 'Connection: Upgrade' \\\n  -H 'Upgrade: websocket' \\\n  -H 'Sec-WebSocket-Version: 13' \\\n  -H 'Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==' \\\n  http://localhost:8080/chat",
    note: "The handshake is HTTP. After the 101 response, the protocol changes."
  },
  "websocket/frames-lifecycle": {
    title: "Watch client lifecycle hooks",
    language: "javascript",
    code: "socket.onopen = () => socket.send('hello');\nsocket.onmessage = event => console.log(event.data);\nsocket.onerror = error => console.error(error);\nsocket.onclose = event => console.log(event.code, event.reason);",
    note: "Realtime work is mostly lifecycle handling under bad network conditions."
  },
  "websocket/server-design": {
    title: "Name the connection registry",
    language: "java",
    code: "Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();\nsessions.put(userId, session);\nsessions.get(userId).sendMessage(new TextMessage(payload));",
    note: "A WebSocket server owns connection state. That makes cleanup and backpressure first-class."
  },
  "websocket/spring-boot-websocket": {
    title: "Register a raw WebSocket handler",
    language: "java",
    code: "@Configuration\nclass WebSocketConfig implements WebSocketConfigurer {\n    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {\n        registry.addHandler(new ChatHandler(), \"/chat\").setAllowedOrigins(\"https://example.com\");\n    }\n}",
    note: "Spring makes registration easy. You still own session lifecycle and message pressure."
  },
  "websocket/scaling-security": {
    title: "Write down the edge policy",
    language: "text",
    code: "auth before upgrade\norigin allow-list\nmessage size limit\nidle timeout\nbroadcast fanout limit\nsticky session or shared broker",
    note: "Scaling WebSocket is mostly about state placement, authorization, and fanout pressure."
  }
};

const sectionFallbackPractice: Record<string, StoryPractice> = {
  performance: {
    title: "Start with a measurement, not a guess",
    language: "bash",
    code: "jcmd $PID Thread.print\njcmd $PID GC.heap_info\njfr start name=study settings=profile duration=60s filename=study.jfr",
    note: "Performance work gets safer when you capture evidence before changing knobs."
  },
  mastery: {
    title: "Use an incident notebook",
    language: "text",
    code: "symptom:\nblast radius:\nlast known good:\nrecent change:\nleading metric:\nrollback option:\nnext experiment:",
    note: "Senior debugging is structured curiosity under pressure."
  }
};

const genericPractice: StoryPractice = {
  title: "Turn the idea into one observable check",
  language: "text",
  code: "1. name the resource\n2. name the owner\n3. name the failure mode\n4. name the metric or log that would prove it",
  note: "If you can observe it, you can reason about it under production pressure."
};

function practiceFor(sectionSlug: string, chapterSlug: string) {
  return practiceByChapter[`${sectionSlug}/${chapterSlug}`] ?? sectionFallbackPractice[sectionSlug] ?? genericPractice;
}

export function getChapterStoryGuide({ sectionSlug, chapterSlug, title, description, sheet }: GuideInput): ChapterStoryGuide {
  const firstBug = sheet.commonBugs[0] ?? "The trap appears when ownership, ordering, or failure timing stays implicit.";

  return {
    arabic: `اقرأ ${title} كحكاية واحدة: المشكلة ظهرت، الفكرة حاولت تحلها، وبعدها ظهر تمن لازم تفهمه قبل ما تستخدمها في production.`,
    beats: [
      {
        label: "Why it had to exist",
        text: sheet.problem || description
      },
      {
        label: "The idea to hold",
        text: sheet.mentalModel
      },
      {
        label: "What moves at runtime",
        text: sheet.runtime
      },
      {
        label: "The price you pay",
        text: sheet.performance
      },
      {
        label: "The trap to notice",
        text: firstBug
      }
    ],
    practice: practiceFor(sectionSlug, chapterSlug)
  };
}
