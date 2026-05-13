export type PracticeLabDifficulty = "Foundation" | "Core" | "Production";

export type PracticeLab = {
  id: string;
  phase: string;
  timing: string;
  afterStepId: string;
  coveredStepIds: string[];
  estimatedMinutes: number;
  difficulty: PracticeLabDifficulty;
  title: string;
  goal: string;
  build: string[];
  breakIt: string[];
  observe: string[];
  explain: string;
  check: string;
  deliverable: string;
  evidence: string;
  after?: string;
};

const practiceLabsByTrack: Record<string, PracticeLab[]> = {
  netty: [
    {
      id: "netty-echo-boundary",
      phase: "Protocol practice",
      timing: "After Framing, Decoders, and Pipeline",
      afterStepId: "protocol-engineering/decoders",
      coveredStepIds: ["netty-core/pipeline", "protocol-engineering/framing", "protocol-engineering/decoders"],
      estimatedMinutes: 45,
      difficulty: "Core",
      title: "Echo server with a boundary",
      goal: "Build one Netty server that proves you understand channels, handlers, and framing.",
      build: ["Start with a simple echo handler.", "Add a length-field frame decoder.", "Reject frames above a safe size."],
      breakIt: ["Send two messages in one TCP write.", "Split one message across two writes.", "Send one frame above the configured limit."],
      observe: ["How many application messages reach the handler.", "Whether partial input waits instead of failing.", "The log or close reason for the oversized frame."],
      explain: "TCP is only a byte stream. The decoder turns bytes into application messages before your business handler sees them.",
      check: "Prove the server reads two complete application messages even when TCP delivers them together.",
      deliverable: "A small Netty server plus one client script that sends sticky, split, and oversized frames.",
      evidence: "Keep the log showing exactly two valid application messages and one rejected oversized frame.",
      after: "Then open the framing and pipeline chapters and connect each handler to the byte movement you saw."
    },
    {
      id: "netty-eventloop-pressure",
      phase: "Production",
      timing: "After EventLoop, ByteBuf, and Backpressure",
      afterStepId: "performance/backpressure",
      coveredStepIds: ["netty-core/eventloop", "netty-core/bytebuf", "performance/backpressure"],
      estimatedMinutes: 50,
      difficulty: "Production",
      title: "EventLoop pressure drill",
      goal: "See what blocking work does before it reaches production.",
      build: ["Add an intentionally slow handler.", "Move the slow work to a separate executor.", "Return to the EventLoop only to write the response."],
      breakIt: ["Call sleep or a blocking client inside the handler.", "Run several clients at the same time.", "Mix fast and slow requests on the same server."],
      observe: ["p95 and p99 latency before and after offloading.", "The EventLoop thread name in logs.", "Whether fast requests slow down behind unrelated slow work."],
      explain: "The EventLoop is a shared execution lane. Blocking one handler delays every channel assigned to that lane.",
      check: "Compare latency before and after moving slow work away from the EventLoop.",
      deliverable: "One before/after run with the slow work on the EventLoop and then on a separate executor.",
      evidence: "Save latency numbers and thread-name logs that prove the EventLoop stopped doing blocking work."
    },
    {
      id: "netty-webflux-audit",
      phase: "Spring Boot bridge",
      timing: "After Spring Boot and Reactor Netty",
      afterStepId: "netty-core/spring-boot",
      coveredStepIds: ["netty-core/spring-boot"],
      estimatedMinutes: 40,
      difficulty: "Production",
      title: "Spring Boot WebFlux audit",
      goal: "Connect raw Netty rules to a real Spring Boot path.",
      build: ["Create one WebFlux endpoint.", "Call one blocking dependency safely.", "Add a log marker for reactor-http-nio threads."],
      breakIt: ["Call the blocking dependency directly from the request path.", "Hit the endpoint concurrently.", "Add another cheap endpoint and watch whether it also slows down."],
      observe: ["reactor-http-nio thread names.", "Latency for the cheap endpoint while the blocking call runs.", "Where the blocking work moves after you isolate it."],
      explain: "WebFlux is non-blocking only if your code keeps the contract. A reactive-looking method can still harm the Netty path if it hides blocking work.",
      check: "Explain which code runs on the event-loop path and which code must not.",
      deliverable: "A WebFlux endpoint pair: one intentionally broken path and one isolated blocking path.",
      evidence: "Keep logs proving the cheap endpoint stays responsive after the blocking work is isolated."
    }
  ],
  kafka: [
    {
      id: "kafka-replayable-orders",
      phase: "Kafka core",
      timing: "After Topics, Partitions, and Replication",
      afterStepId: "kafka/replication-isr",
      coveredStepIds: ["kafka/distributed-log", "kafka/brokers-topics-partitions", "kafka/replication-isr"],
      estimatedMinutes: 45,
      difficulty: "Core",
      title: "Replayable order events",
      goal: "Make Kafka feel like an ordered log, not a magic queue.",
      build: ["Produce order events with a customer key.", "Consume from a group.", "Reset offsets and replay a small range."],
      breakIt: ["Produce events for two customers quickly.", "Reset only one partition offset.", "Add a second consumer to the same group."],
      observe: ["Ordering inside one customer key.", "What replay changes and what it does not delete.", "Which partitions each consumer receives."],
      explain: "Kafka preserves order inside a partition. Replay is reading history again, not asking the broker to recreate a queue state.",
      check: "Show which ordering is preserved and which ordering is not.",
      deliverable: "A producer, a consumer group, and one replay command or script.",
      evidence: "Capture output that shows per-key ordering and replay from an older offset."
    },
    {
      id: "kafka-lag-investigation",
      phase: "Client behavior",
      timing: "After Producers, Consumers, and Offsets",
      afterStepId: "kafka/consumers-offsets",
      coveredStepIds: ["kafka/producers", "kafka/consumers-offsets"],
      estimatedMinutes: 40,
      difficulty: "Production",
      title: "Lag investigation",
      goal: "Practice reading lag as evidence, not panic.",
      build: ["Slow one consumer intentionally.", "Observe group lag.", "Add another consumer and watch partition assignment."],
      breakIt: ["Make processing slower than production.", "Add more consumers than partitions.", "Restart one consumer during the test."],
      observe: ["Consumer lag per partition.", "Rebalance events.", "Idle consumers when the group has too many members."],
      explain: "Lag means records are waiting behind committed progress. More consumers help only while there are partitions available to assign.",
      check: "Explain why consumers cannot scale beyond partition count inside one group.",
      deliverable: "A lag drill with one slow consumer, then a scaled consumer group.",
      evidence: "Keep lag-per-partition output and rebalance logs before and after scaling."
    },
    {
      id: "kafka-schema-rehearsal",
      phase: "Data contracts",
      timing: "After Schema Evolution",
      afterStepId: "kafka/schema-evolution",
      coveredStepIds: ["kafka/schema-evolution", "kafka/delivery-semantics"],
      estimatedMinutes: 35,
      difficulty: "Core",
      title: "Schema change rehearsal",
      goal: "Practice evolving events without breaking readers.",
      build: ["Create v1 and v2 payloads.", "Add one optional field.", "Write a consumer that tolerates both shapes."],
      breakIt: ["Rename a required field without a fallback.", "Remove a field a reader still uses.", "Deploy the reader before and after the producer change."],
      observe: ["Which reader version survives both payloads.", "The exact error when compatibility is broken.", "Whether old events can still be replayed."],
      explain: "A topic is a long-lived data contract. Compatibility must protect both future writes and old records already stored in the log.",
      check: "Name the compatibility rule that made the rollout safe.",
      deliverable: "Two event versions and a reader that tolerates both old and new records.",
      evidence: "Capture the successful mixed-version replay and the intentional incompatible-change failure."
    }
  ],
  mongodb: [
    {
      id: "mongodb-access-pattern-model",
      phase: "MongoDB core",
      timing: "After Documents, Collections, and Schema Design",
      afterStepId: "mongodb/schema-design",
      coveredStepIds: ["mongodb/documents-collections", "mongodb/schema-design"],
      estimatedMinutes: 40,
      difficulty: "Core",
      title: "Model by access pattern",
      goal: "Choose documents by workflow, not by habit.",
      build: ["Model products with seller summaries.", "Model reviews separately.", "Write the two main read queries."],
      breakIt: ["Put every review inside the product document.", "Update seller information across many products.", "Load a product page with only the fields the UI needs."],
      observe: ["Document growth risk.", "Update fan-out.", "Whether the query shape matches the screen shape."],
      explain: "MongoDB modeling starts from access patterns. Embed what is read together and bounded; reference what grows or changes independently.",
      check: "Explain why one relationship is embedded and the other is referenced.",
      deliverable: "Two document models for the same product page and a short decision note.",
      evidence: "Keep the query shapes and the reason each relationship is embedded or referenced."
    },
    {
      id: "mongodb-index-proof",
      phase: "Query performance",
      timing: "After Queries and Indexes",
      afterStepId: "mongodb/queries-indexes",
      coveredStepIds: ["mongodb/queries-indexes"],
      estimatedMinutes: 35,
      difficulty: "Core",
      title: "Index proof",
      goal: "Turn slow-query guessing into evidence.",
      build: ["Create a query with filter and sort.", "Run explain before indexing.", "Add the index that matches the query shape."],
      breakIt: ["Sort on a field not supported by the index.", "Reverse the field order.", "Add a low-selectivity field first."],
      observe: ["Winning plan.", "Documents examined vs returned.", "Whether the sort happens in memory."],
      explain: "An index is useful only when its shape matches how the query filters and sorts. Explain output is the evidence.",
      check: "Show that the winning plan uses the index you expected.",
      deliverable: "An explain-before/explain-after comparison for one query.",
      evidence: "Keep the winning plan plus documents-examined and documents-returned numbers."
    },
    {
      id: "mongodb-transaction-boundary",
      phase: "Correctness",
      timing: "After Writes and Transactions",
      afterStepId: "mongodb/writes-transactions",
      coveredStepIds: ["mongodb/writes-transactions"],
      estimatedMinutes: 45,
      difficulty: "Production",
      title: "Transaction boundary",
      goal: "Know when one-document atomicity is enough.",
      build: ["Implement one single-document update.", "Implement one multi-document workflow.", "Decide whether a transaction is required."],
      breakIt: ["Fail halfway through a two-document workflow.", "Retry the operation.", "Try to redesign the workflow into one bounded document."],
      observe: ["Which state can be left inconsistent.", "Whether retry creates duplicates.", "Which invariant must never be visible broken."],
      explain: "Single-document writes are atomic. Transactions are for invariants that cross document boundaries and cannot be repaired later.",
      check: "Explain the failure case that forces or avoids a transaction.",
      deliverable: "One workflow implemented both as a bounded document update and as a multi-document transaction.",
      evidence: "Record the failure state that proves whether the transaction boundary is justified."
    }
  ],
  redis: [
    {
      id: "redis-cache-aside-ttl",
      phase: "Caching",
      timing: "After Caching Patterns",
      afterStepId: "redis/caching-patterns",
      coveredStepIds: ["redis/caching-patterns"],
      estimatedMinutes: 35,
      difficulty: "Core",
      title: "Cache-aside with TTL",
      goal: "Build the hit, miss, fill, and expiry path explicitly.",
      build: ["Read from Redis first.", "Load the source on miss.", "Set a TTL with a little jitter."],
      breakIt: ["Expire one hot key while traffic is running.", "Deploy without jitter.", "Return stale data intentionally for a short grace period."],
      observe: ["Cache hit rate.", "Database calls during expiry.", "Latency while the key is being refilled."],
      explain: "Cache-aside moves freshness responsibility into the application. TTL is simple, but expiry under traffic is a production event.",
      check: "Explain what happens when the cached value expires under traffic.",
      deliverable: "A cache-aside read path with TTL jitter and a controlled stale-read option.",
      evidence: "Capture hit rate, database calls, and latency during a hot-key expiry."
    },
    {
      id: "redis-stampede-guard",
      phase: "Caching",
      timing: "After Expiration and Eviction",
      afterStepId: "redis/expiration-eviction",
      coveredStepIds: ["redis/caching-patterns", "redis/expiration-eviction"],
      estimatedMinutes: 45,
      difficulty: "Production",
      title: "Stampede guard",
      goal: "Protect the database when one hot key expires.",
      build: ["Simulate many requests for one missing key.", "Add request coalescing or a lock.", "Keep one request responsible for refill."],
      breakIt: ["Remove the guard.", "Make the source slow.", "Let the lock timeout be shorter than the source call."],
      observe: ["Number of source calls.", "Wait time for callers.", "What happens when the refill owner fails."],
      explain: "A cache miss can become a burst amplifier. The guard makes refill a coordinated operation instead of a crowd.",
      check: "Show that most callers wait or receive stale data instead of hammering the source.",
      deliverable: "A hot-key load test with and without request coalescing or locking.",
      evidence: "Keep source-call counts that prove the guard prevents the stampede."
    },
    {
      id: "redis-streams-group",
      phase: "Messaging",
      timing: "After Streams and Pub/Sub",
      afterStepId: "redis/streams-pubsub",
      coveredStepIds: ["redis/streams-pubsub"],
      estimatedMinutes: 45,
      difficulty: "Production",
      title: "Streams consumer group",
      goal: "See replayable Redis messaging clearly.",
      build: ["Write events to a stream.", "Read with a consumer group.", "Acknowledge processed messages."],
      breakIt: ["Stop a consumer after reading but before ack.", "Start another consumer.", "Claim or inspect the pending entry."],
      observe: ["Pending entries list.", "Which consumer owns the unacked message.", "Whether the message is delivered again after recovery."],
      explain: "Streams remember unacknowledged work. That makes recovery possible, but your handler still needs idempotence.",
      check: "Explain what happens to pending messages when a consumer dies.",
      deliverable: "A stream producer, consumer group, and failed-consumer recovery drill.",
      evidence: "Capture pending entries before recovery and the final acknowledgement after recovery."
    }
  ],
  docker: [
    {
      id: "docker-spring-boot-image",
      phase: "Spring Boot bridge",
      timing: "After Dockerizing Spring Boot",
      afterStepId: "docker/dockerizing-spring-boot",
      coveredStepIds: ["docker/dockerfiles-layers", "docker/build-cache-multistage", "docker/dockerizing-spring-boot"],
      estimatedMinutes: 40,
      difficulty: "Core",
      title: "Dockerize a Spring Boot service",
      goal: "Separate build-time image from runtime configuration.",
      build: ["Create a multi-stage Dockerfile.", "Expose the app port.", "Pass profile and database config as env vars."],
      breakIt: ["Bake a secret into an ENV instruction.", "Run with a missing runtime variable.", "Change only source code and watch which layers rebuild."],
      observe: ["Image history.", "Container logs at startup.", "Build cache reuse between runs."],
      explain: "An image is an artifact; configuration belongs at runtime. Layer history and rebuild behavior reveal whether the boundary is clean.",
      check: "Rebuild the image and prove secrets are not baked into any layer.",
      deliverable: "A multi-stage Dockerfile plus one runtime command that passes config through env vars.",
      evidence: "Keep image history and startup logs proving config is runtime-only."
    },
    {
      id: "docker-compose-stack",
      phase: "Local systems",
      timing: "After Compose, Networking, and Volumes",
      afterStepId: "docker/compose-networking-volumes",
      coveredStepIds: ["docker/containers-images", "docker/compose-networking-volumes"],
      estimatedMinutes: 35,
      difficulty: "Foundation",
      title: "Compose a local stack",
      goal: "Run app, database, and Redis as one local system.",
      build: ["Define services in Compose.", "Use service names for networking.", "Persist database data with a volume."],
      breakIt: ["Use localhost from inside a container.", "Remove containers without deleting the volume.", "Restart only the database service."],
      observe: ["DNS name resolution between services.", "Volume state after recreation.", "Startup order vs real readiness."],
      explain: "Compose gives services a shared network and named storage. Containers are disposable; volumes and external services carry state.",
      check: "Remove and recreate containers without losing database state.",
      deliverable: "A Compose file with app, database, Redis, service-name networking, and a persistent volume.",
      evidence: "Capture the data still present after container recreation."
    },
    {
      id: "docker-container-exit-drill",
      phase: "Production",
      timing: "After Production Debugging",
      afterStepId: "docker/production-debugging",
      coveredStepIds: ["docker/production-debugging"],
      estimatedMinutes: 30,
      difficulty: "Production",
      title: "Container exit drill",
      goal: "Debug runtime failures methodically.",
      build: ["Start a container that exits immediately.", "Inspect logs and exit code.", "Override the command to inspect files and env."],
      breakIt: ["Use a wrong command.", "Remove a required env var.", "Point the app at an unavailable dependency."],
      observe: ["Exit code.", "Last log lines.", "Files and environment visible inside the container."],
      explain: "A container is just a process with boundaries. Debug from process evidence: command, config, filesystem, network, then dependency.",
      check: "Identify whether the failure is image, config, command, or dependency.",
      deliverable: "A short incident note that classifies one failing container by root cause.",
      evidence: "Keep the exit code, last logs, and one inspection command that prove the diagnosis."
    }
  ],
  websocket: [
    {
      id: "websocket-raw-chat",
      phase: "WebSocket core",
      timing: "After Handshake, Upgrade, and Frame Lifecycle",
      afterStepId: "websocket/frames-lifecycle",
      coveredStepIds: ["websocket/handshake-upgrade", "websocket/frames-lifecycle"],
      estimatedMinutes: 40,
      difficulty: "Core",
      title: "Raw chat connection",
      goal: "Understand the upgrade and frame lifecycle directly.",
      build: ["Open a WebSocket from the browser.", "Send JSON messages.", "Handle close and reconnect policy."],
      breakIt: ["Reject the upgrade with missing auth.", "Kill the server while the client is connected.", "Send malformed JSON."],
      observe: ["HTTP 101 vs failed handshake.", "Close code and reconnect timing.", "Server behavior for invalid messages."],
      explain: "WebSocket begins as HTTP, then becomes a persistent frame stream. Connection lifecycle is part of the protocol, not an edge detail.",
      check: "Explain what happens before and after status 101.",
      deliverable: "A browser client and server path that connects, sends JSON, closes, and reconnects intentionally.",
      evidence: "Capture the 101 handshake, one close code, and the malformed-message handling."
    },
    {
      id: "websocket-spring-stomp",
      phase: "Spring Boot bridge",
      timing: "After Spring Boot WebSocket",
      afterStepId: "websocket/spring-boot-websocket",
      coveredStepIds: ["websocket/spring-boot-websocket", "websocket/server-design"],
      estimatedMinutes: 45,
      difficulty: "Core",
      title: "Spring Boot STOMP notifications",
      goal: "Use the Spring abstraction without losing protocol boundaries.",
      build: ["Create a STOMP endpoint.", "Subscribe to a destination.", "Send one server-side notification."],
      breakIt: ["Subscribe to the wrong destination.", "Disconnect before ack when a broker is involved.", "Send a message shape the subscriber does not expect."],
      observe: ["CONNECT, SUBSCRIBE, MESSAGE, and DISCONNECT frames.", "Which destination receives the notification.", "Client-side parsing failures."],
      explain: "STOMP adds a messaging contract over WebSocket. Destinations are message routes, not REST endpoints.",
      check: "Explain why STOMP destinations are not the same as REST routes.",
      deliverable: "A STOMP endpoint, one subscription, and one server-side notification path.",
      evidence: "Keep frame logs showing CONNECT, SUBSCRIBE, MESSAGE, and DISCONNECT."
    },
    {
      id: "websocket-scale-out",
      phase: "Production",
      timing: "After Scaling and Security",
      afterStepId: "websocket/scaling-security",
      coveredStepIds: ["websocket/server-design", "websocket/scaling-security"],
      estimatedMinutes: 55,
      difficulty: "Production",
      title: "Scale-out rehearsal",
      goal: "Find the moment one server is no longer enough.",
      build: ["Run two app instances.", "Route clients through a load balancer.", "Add shared pub/sub or broker fanout."],
      breakIt: ["Connect two users to different app instances.", "Broadcast from only one instance.", "Turn off sticky sessions and reconnect clients."],
      observe: ["Which clients receive the message.", "Connection ownership per instance.", "Whether shared fanout reaches every server."],
      explain: "A WebSocket connection lives on one server. Scale-out needs shared routing state or fanout so messages can find connections on other instances.",
      check: "Explain what breaks if each server only knows its own connections.",
      deliverable: "Two app instances behind a load balancer with shared fanout or documented sticky-session behavior.",
      evidence: "Capture before/after delivery results for users connected to different instances."
    }
  ]
};

export function getPracticeLabs(trackSlug: string) {
  return practiceLabsByTrack[trackSlug] ?? [];
}
