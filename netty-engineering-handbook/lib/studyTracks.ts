export type Prerequisite = {
  key: string;
  term: string;
  explanation: string;
  why: string;
  href?: string;
};

export type StudyStep = {
  section: string;
  slug: string;
  phase: string;
  reason: string;
  checkpoint: string;
  optional?: boolean;
};

export type StudyTrack = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  promise: string;
  startHref: string;
  prerequisites: Prerequisite[];
  steps: StudyStep[];
};

const termCatalog = {
  tcp: {
    key: "tcp",
    term: "TCP",
    explanation: "TCP is a reliable, ordered byte stream between two programs. It does not preserve your application message boundaries.",
    why: "Netty code often exists because TCP gives you bytes, while your app needs frames, commands, requests, or events.",
    href: "/handbook/foundations/tcp-vs-udp"
  },
  udp: {
    key: "udp",
    term: "UDP",
    explanation: "UDP sends independent datagrams without TCP-style ordering, retry, or delivery guarantees.",
    why: "Comparing UDP with TCP helps you understand which reliability work the transport does and which work the application must do.",
    href: "/handbook/foundations/tcp-vs-udp"
  },
  socket: {
    key: "socket",
    term: "Socket",
    explanation: "A socket is one endpoint of a network conversation: local address, remote address, and transport state.",
    why: "Channels, EventLoops, and pipelines all exist to move socket IO without turning every connection into a dedicated blocking thread.",
    href: "/handbook/foundations/networking-fundamentals"
  },
  "blocking-io": {
    key: "blocking-io",
    term: "Blocking IO",
    explanation: "Blocking IO means a thread waits while the kernel or remote system finishes an operation.",
    why: "Netty and WebFlux are built around avoiding that wait on IO threads.",
    href: "/handbook/foundations/blocking-io"
  },
  thread: {
    key: "thread",
    term: "Thread",
    explanation: "A thread is an execution lane. If that lane waits, every task behind it waits too.",
    why: "EventLoop rules make more sense when you think in lanes and queues instead of only methods and classes."
  },
  channel: {
    key: "channel",
    term: "Channel",
    explanation: "A channel is the Java NIO abstraction for an IO endpoint that can read, write, connect, or accept.",
    why: "Netty wraps this idea with its own Channel model and pipeline.",
    href: "/handbook/java-nio/channels"
  },
  buffer: {
    key: "buffer",
    term: "Buffer",
    explanation: "A buffer is memory used as a staging area while bytes move between the kernel, runtime, and application.",
    why: "ByteBuf is easier when you already see memory as part of the protocol.",
    href: "/handbook/java-nio/buffers"
  },
  selector: {
    key: "selector",
    term: "Selector",
    explanation: "A selector lets one thread watch many channels and react only when a channel is ready.",
    why: "The EventLoop is easier to understand after the selector idea is clear.",
    href: "/handbook/java-nio/selectors"
  },
  "event-loop": {
    key: "event-loop",
    term: "EventLoop",
    explanation: "An EventLoop is a single ordered execution lane for channel IO, callbacks, and scheduled tasks.",
    why: "Most Netty and Reactor Netty production bugs come back to protecting this lane.",
    href: "/handbook/netty-core/eventloop"
  },
  future: {
    key: "future",
    term: "Future",
    explanation: "A future represents an operation that will complete later with success or failure.",
    why: "Netty wants you to continue with listeners instead of blocking the EventLoop.",
    href: "/handbook/netty-core/futures"
  },
  pipeline: {
    key: "pipeline",
    term: "Pipeline",
    explanation: "A pipeline is an ordered chain of handlers where inbound and outbound events travel in opposite directions.",
    why: "Handler order is protocol behavior, not decoration.",
    href: "/handbook/netty-core/pipeline"
  },
  bytebuf: {
    key: "bytebuf",
    term: "ByteBuf",
    explanation: "ByteBuf is Netty's byte container with reader and writer indexes, pooling, slicing, and reference counting.",
    why: "High-throughput Netty work is also memory-ownership work.",
    href: "/handbook/netty-core/bytebuf"
  },
  framing: {
    key: "framing",
    term: "Framing",
    explanation: "Framing is the rule that tells a receiver where one application message ends and the next begins.",
    why: "TCP gives you a stream, so your protocol needs a boundary rule.",
    href: "/handbook/protocol-engineering/framing"
  },
  backpressure: {
    key: "backpressure",
    term: "Backpressure",
    explanation: "Backpressure is how a system tells upstream producers to slow down when downstream cannot keep up.",
    why: "Netty, WebFlux, and Kafka all need a way to avoid unbounded queues.",
    href: "/handbook/performance/backpressure"
  },
  http: {
    key: "http",
    term: "HTTP",
    explanation: "HTTP is a request-response protocol built on top of a transport such as TCP.",
    why: "Spring WebFlux and Reactor Netty turn HTTP bytes into request and response objects.",
    href: "/handbook/protocol-engineering/http"
  },
  webflux: {
    key: "webflux",
    term: "Spring WebFlux",
    explanation: "WebFlux is Spring's non-blocking web stack using reactive publishers such as Mono and Flux.",
    why: "It changes the request path contract: do not hide blocking work inside a reactive-looking method.",
    href: "/handbook/netty-core/spring-boot"
  },
  "distributed-log": {
    key: "distributed-log",
    term: "Distributed log",
    explanation: "A distributed log is an append-only history of records spread across machines for scale and durability.",
    why: "Kafka is easiest when you stop thinking of it as only a queue.",
    href: "/handbook/kafka/distributed-log"
  },
  broker: {
    key: "broker",
    term: "Broker",
    explanation: "A broker is a Kafka server that stores partitions and serves producers and consumers.",
    why: "Most Kafka behavior is a conversation between clients, brokers, and partition leaders.",
    href: "/handbook/kafka/brokers-topics-partitions"
  },
  topic: {
    key: "topic",
    term: "Topic",
    explanation: "A topic is the named stream of records that producers write to and consumers read from.",
    why: "Topics are the product-facing contract; partitions are the scaling mechanism behind them.",
    href: "/handbook/kafka/brokers-topics-partitions"
  },
  partition: {
    key: "partition",
    term: "Partition",
    explanation: "A partition is an ordered shard of a topic. Ordering is guaranteed inside one partition, not across the whole topic.",
    why: "Partitioning explains ordering, throughput, consumer parallelism, and many production surprises.",
    href: "/handbook/kafka/brokers-topics-partitions"
  },
  offset: {
    key: "offset",
    term: "Offset",
    explanation: "An offset is a record position inside a partition.",
    why: "Consumers use offsets to track progress, replay data, and recover after failures.",
    href: "/handbook/kafka/consumers-offsets"
  },
  "consumer-group": {
    key: "consumer-group",
    term: "Consumer group",
    explanation: "A consumer group lets multiple consumers share partitions from the same topic.",
    why: "Groups explain scaling reads, rebalancing, and why one partition is read by only one consumer in a group at a time.",
    href: "/handbook/kafka/consumers-offsets"
  },
  replication: {
    key: "replication",
    term: "Replication",
    explanation: "Replication means multiple brokers keep copies of the same partition data.",
    why: "Kafka durability and failover depend on leader and follower replicas.",
    href: "/handbook/kafka/replication-isr"
  },
  schema: {
    key: "schema",
    term: "Schema",
    explanation: "A schema describes the shape and meaning of records that move through a topic.",
    why: "Without schema rules, Kafka topics become hard to evolve safely.",
    href: "/handbook/kafka/schema-evolution"
  },
  transaction: {
    key: "transaction",
    term: "Transaction",
    explanation: "A transaction groups work so Kafka can make stronger guarantees about what becomes visible.",
    why: "Exactly-once discussions are mostly about idempotence, transactions, and boundaries.",
    href: "/handbook/kafka/transactions-idempotence"
  },
  "delivery-semantics": {
    key: "delivery-semantics",
    term: "Delivery semantics",
    explanation: "Delivery semantics describe what can happen when producing, consuming, retrying, committing, and failing.",
    why: "Kafka guarantee choices only make sense when you know which duplicates or losses the workflow can tolerate.",
    href: "/handbook/kafka/delivery-semantics"
  },
  document: {
    key: "document",
    term: "Document",
    explanation: "A document is a JSON-like BSON record that stores related fields together.",
    why: "MongoDB modeling starts by deciding what data belongs together in one document.",
    href: "/handbook/mongodb/documents-collections"
  },
  collection: {
    key: "collection",
    term: "Collection",
    explanation: "A collection is a group of MongoDB documents, roughly the place where one model or workflow is stored.",
    why: "Collections define query, index, and lifecycle boundaries.",
    href: "/handbook/mongodb/documents-collections"
  },
  index: {
    key: "index",
    term: "Index",
    explanation: "An index is an extra data structure that lets the database find matching documents without scanning everything.",
    why: "Most MongoDB performance work is query shape plus index shape.",
    href: "/handbook/mongodb/queries-indexes"
  },
  "write-concern": {
    key: "write-concern",
    term: "Write concern",
    explanation: "Write concern controls how much acknowledgement MongoDB requires before a write is considered successful.",
    why: "It is the line between fast writes and durability expectations.",
    href: "/handbook/mongodb/writes-transactions"
  },
  "shard-key": {
    key: "shard-key",
    term: "Shard key",
    explanation: "A shard key decides how documents in a sharded MongoDB collection are distributed.",
    why: "A bad shard key can create hot shards and make scale-out disappointing.",
    href: "/handbook/mongodb/replication-sharding"
  },
  cache: {
    key: "cache",
    term: "Cache",
    explanation: "A cache stores data close to the app so repeated reads avoid slower systems.",
    why: "Redis is fast, but cache correctness depends on invalidation and expiration rules.",
    href: "/handbook/redis/caching-patterns"
  },
  ttl: {
    key: "ttl",
    term: "TTL",
    explanation: "TTL means time to live: the amount of time a key should remain valid before expiring.",
    why: "TTL is the simplest cache invalidation tool and one of the easiest to misuse.",
    href: "/handbook/redis/expiration-eviction"
  },
  eviction: {
    key: "eviction",
    term: "Eviction",
    explanation: "Eviction is Redis removing keys under memory pressure according to a configured policy.",
    why: "When Redis is used as a cache, memory policy is production behavior.",
    href: "/handbook/redis/expiration-eviction"
  },
  stream: {
    key: "stream",
    term: "Stream",
    explanation: "A Redis stream is an append-only data structure for event-like messages.",
    why: "Streams give you replay and consumer groups where pub/sub only broadcasts live messages.",
    href: "/handbook/redis/streams-pubsub"
  },
  image: {
    key: "image",
    term: "Image",
    explanation: "A Docker image is the packaged filesystem and metadata used to start containers.",
    why: "Images are build artifacts. Containers are running processes created from them.",
    href: "/handbook/docker/containers-images"
  },
  container: {
    key: "container",
    term: "Container",
    explanation: "A container is an isolated process with its own filesystem view, networking, and runtime settings.",
    why: "Docker becomes much less magical when you see the process boundary.",
    href: "/handbook/docker/containers-images"
  },
  layer: {
    key: "layer",
    term: "Layer",
    explanation: "A layer records filesystem changes from a Dockerfile instruction.",
    why: "Layer order controls cache reuse, rebuild speed, and image hygiene.",
    href: "/handbook/docker/dockerfiles-layers"
  },
  volume: {
    key: "volume",
    term: "Volume",
    explanation: "A volume is Docker-managed persistent storage mounted into a container.",
    why: "State disappears with containers unless it lives in a volume or external service.",
    href: "/handbook/docker/compose-networking-volumes"
  },
  compose: {
    key: "compose",
    term: "Docker Compose",
    explanation: "Compose describes and runs a multi-container application with services, networks, volumes, and configuration.",
    why: "Most real local systems need more than one container.",
    href: "/handbook/docker/compose-networking-volumes"
  },
  "websocket-handshake": {
    key: "websocket-handshake",
    term: "WebSocket handshake",
    explanation: "The handshake is an HTTP upgrade request and response that switches the connection to WebSocket.",
    why: "Realtime bugs often start before messages flow: auth, origin, proxy, and upgrade handling.",
    href: "/handbook/websocket/handshake-upgrade"
  },
  "websocket-frame": {
    key: "websocket-frame",
    term: "WebSocket frame",
    explanation: "A frame is the protocol unit WebSocket uses to carry text, binary, ping, pong, and close messages.",
    why: "The connection is persistent, so lifecycle frames matter as much as data messages.",
    href: "/handbook/websocket/frames-lifecycle"
  },
  stomp: {
    key: "stomp",
    term: "STOMP",
    explanation: "STOMP is a simple messaging protocol that can run over WebSocket and defines destinations, subscriptions, and message frames.",
    why: "Spring's WebSocket support often uses STOMP when the app needs broker-style messaging.",
    href: "/handbook/websocket/spring-boot-websocket"
  }
} satisfies Record<string, Prerequisite>;

type TermKey = keyof typeof termCatalog;

function terms(keys: TermKey[]) {
  return keys.map((key) => termCatalog[key]);
}

export const studyTracks: StudyTrack[] = [
  {
    slug: "netty",
    title: "Study Netty",
    shortTitle: "Netty",
    description: "A single route from networking basics to Java NIO, Netty internals, protocol design, Spring Boot WebFlux, and production tuning.",
    promise: "By the end, you should be able to explain why Netty exists, how bytes move through it, how to avoid blocking the EventLoop, and how it appears inside Spring Boot.",
    startHref: "/handbook/foundations/networking-fundamentals",
    prerequisites: terms(["tcp", "socket", "blocking-io", "channel", "buffer", "selector"]),
    steps: [
      { section: "foundations", slug: "networking-fundamentals", phase: "Foundation", reason: "Build the vocabulary for packets, sockets, latency, and throughput.", checkpoint: "You can explain what a socket is." },
      { section: "foundations", slug: "tcp-vs-udp", phase: "Foundation", reason: "See why TCP is a stream and why protocols need message boundaries.", checkpoint: "You know why TCP does not preserve application messages." },
      { section: "foundations", slug: "blocking-io", phase: "Foundation", reason: "Feel the pain that event-driven IO is trying to solve.", checkpoint: "You can explain why one thread per connection stops scaling." },
      { section: "java-nio", slug: "channels", phase: "Java NIO bridge", reason: "Meet the lower-level IO endpoint abstraction Netty builds on.", checkpoint: "You know what a channel represents." },
      { section: "java-nio", slug: "buffers", phase: "Java NIO bridge", reason: "Understand byte staging before ByteBuf adds ownership rules.", checkpoint: "You can explain reader/writer memory flow." },
      { section: "java-nio", slug: "selectors", phase: "Java NIO bridge", reason: "Learn how one thread watches many sockets.", checkpoint: "You can explain readiness without blocking." },
      { section: "netty-core", slug: "eventloop", phase: "Netty core", reason: "This is the main runtime rule behind Netty performance.", checkpoint: "You know why blocking the EventLoop hurts unrelated channels." },
      { section: "netty-core", slug: "futures", phase: "Netty core", reason: "Learn completion without blocking.", checkpoint: "You can close after a write future completes." },
      { section: "netty-core", slug: "pipeline", phase: "Netty core", reason: "See protocol work as inbound and outbound movement.", checkpoint: "You can place decoders and encoders in the right direction." },
      { section: "netty-core", slug: "handlers", phase: "Netty core", reason: "Turn protocol behavior into small runtime contracts.", checkpoint: "You can name what a handler consumes and emits." },
      { section: "netty-core", slug: "bytebuf", phase: "Netty core", reason: "Understand memory ownership in high-throughput servers.", checkpoint: "You can choose between slice, retainedSlice, and copy." },
      { section: "protocol-engineering", slug: "framing", phase: "Protocol practice", reason: "Apply Netty thinking to a real TCP message boundary.", checkpoint: "You can design one framing rule." },
      { section: "protocol-engineering", slug: "decoders", phase: "Protocol practice", reason: "Parse partial input without corrupting state.", checkpoint: "You know how to wait for a complete frame." },
      { section: "protocol-engineering", slug: "encoders", phase: "Protocol practice", reason: "Write compatible outbound messages.", checkpoint: "You can map a domain response to bytes." },
      { section: "netty-core", slug: "spring-boot", phase: "Spring Boot bridge", reason: "Connect raw Netty ideas to WebFlux and Reactor Netty.", checkpoint: "You can spot blocking work on a WebFlux event-loop path." },
      { section: "performance", slug: "backpressure", phase: "Production", reason: "Protect the system when consumers slow down.", checkpoint: "You can explain why queues need limits." },
      { section: "performance", slug: "tuning", phase: "Production", reason: "Learn what to measure before changing knobs.", checkpoint: "You can name the bottleneck before tuning." }
    ]
  },
  {
    slug: "kafka",
    title: "Study Kafka",
    shortTitle: "Kafka",
    description: "A focused path through distributed logs, brokers, partitions, replication, producers, consumers, delivery guarantees, schemas, streams, and operations.",
    promise: "By the end, you should be able to explain Kafka as a distributed log, reason about ordering and replay, and operate producers and consumers with confidence.",
    startHref: "/handbook/kafka/distributed-log",
    prerequisites: terms(["distributed-log", "broker", "topic", "partition", "offset", "replication", "schema"]),
    steps: [
      { section: "foundations", slug: "networking-fundamentals", phase: "Light foundation", reason: "Kafka is a networked system, so latency and failure vocabulary helps.", checkpoint: "You can explain client-server communication." },
      { section: "performance", slug: "backpressure", phase: "Light foundation", reason: "Kafka protects systems by making producers and consumers respect capacity.", checkpoint: "You know why unbounded queues are dangerous." },
      { section: "kafka", slug: "distributed-log", phase: "Kafka core", reason: "Start with the idea that makes Kafka different from a normal queue.", checkpoint: "You can describe append, read, and replay." },
      { section: "kafka", slug: "brokers-topics-partitions", phase: "Kafka core", reason: "Learn the storage and scaling shape.", checkpoint: "You can explain topic vs partition." },
      { section: "kafka", slug: "replication-isr", phase: "Kafka core", reason: "Understand durability and failover.", checkpoint: "You know leader, follower, and ISR." },
      { section: "kafka", slug: "producers", phase: "Client behavior", reason: "See batching, keys, acknowledgements, and retry behavior.", checkpoint: "You can choose a key and ack strategy." },
      { section: "kafka", slug: "consumers-offsets", phase: "Client behavior", reason: "Understand consumer groups, progress, replay, and rebalancing.", checkpoint: "You can explain offset commits." },
      { section: "kafka", slug: "delivery-semantics", phase: "Guarantees", reason: "Make sense of at-most-once, at-least-once, and exactly-once tradeoffs.", checkpoint: "You can choose the right guarantee for a workflow." },
      { section: "kafka", slug: "transactions-idempotence", phase: "Guarantees", reason: "Learn how Kafka reduces duplicates in stronger workflows.", checkpoint: "You know where idempotence helps and where it does not." },
      { section: "kafka", slug: "schema-evolution", phase: "Data contracts", reason: "Keep events evolvable instead of breaking consumers.", checkpoint: "You can describe a compatible schema change." },
      { section: "kafka", slug: "stream-processing", phase: "Processing", reason: "Use Kafka as a platform for stateful event processing.", checkpoint: "You can explain windows, joins, and state stores at a high level." },
      { section: "kafka", slug: "operations-performance", phase: "Production", reason: "Operate lag, retention, compaction, partitions, and tuning.", checkpoint: "You can read lag without panicking." },
      { section: "mastery", slug: "production-debugging", phase: "Production", reason: "Practice evidence-first debugging for live systems.", checkpoint: "You can form a debugging story before changing config." }
    ]
  },
  {
    slug: "mongodb",
    title: "Study MongoDB",
    shortTitle: "MongoDB",
    description: "A focused path through documents, schema design, queries, indexes, write guarantees, transactions, replication, sharding, and Spring Boot integration.",
    promise: "By the end, you should be able to model documents around access patterns, explain index choices, reason about write guarantees, and connect MongoDB cleanly from Spring Boot.",
    startHref: "/handbook/mongodb/documents-collections",
    prerequisites: terms(["document", "collection", "index", "write-concern", "replication", "shard-key"]),
    steps: [
      { section: "mongodb", slug: "documents-collections", phase: "MongoDB core", reason: "Start with the unit MongoDB actually stores and returns.", checkpoint: "You can explain document vs collection." },
      { section: "mongodb", slug: "schema-design", phase: "MongoDB core", reason: "Learn how access patterns shape embedding and references.", checkpoint: "You can choose embed or reference for a simple relationship." },
      { section: "mongodb", slug: "queries-indexes", phase: "Query performance", reason: "Understand why query shape and index shape must match.", checkpoint: "You can name which fields a query needs indexed." },
      { section: "mongodb", slug: "writes-transactions", phase: "Correctness", reason: "Connect atomicity, write concern, and transactions to real workflows.", checkpoint: "You can tell when one-document atomicity is enough." },
      { section: "mongodb", slug: "replication-sharding", phase: "Scale and durability", reason: "See how MongoDB handles failover and horizontal scale.", checkpoint: "You can explain why shard-key choice is dangerous." },
      { section: "mongodb", slug: "spring-boot-mongodb", phase: "Spring Boot bridge", reason: "Use repositories and templates without hiding database boundaries.", checkpoint: "You can configure a connection and avoid repository-shaped surprises." },
      { section: "mastery", slug: "production-debugging", phase: "Production", reason: "Practice diagnosing slow queries, bad indexes, and rollout risk.", checkpoint: "You can debug with evidence before changing indexes." }
    ]
  },
  {
    slug: "redis",
    title: "Study Redis",
    shortTitle: "Redis",
    description: "A focused path through Redis data types, caching, TTLs, eviction, persistence, replication, streams, pub/sub, and Spring Boot integration.",
    promise: "By the end, you should be able to choose the right Redis data type, design cache invalidation, understand memory pressure, and use Redis safely from Spring Boot.",
    startHref: "/handbook/redis/data-types",
    prerequisites: terms(["cache", "ttl", "eviction", "stream", "replication", "backpressure"]),
    steps: [
      { section: "redis", slug: "data-types", phase: "Redis core", reason: "Redis is not just key-value strings; the data type is the design.", checkpoint: "You can choose a string, hash, set, sorted set, or stream." },
      { section: "redis", slug: "caching-patterns", phase: "Caching", reason: "Learn the app-side contract behind cache-aside and invalidation.", checkpoint: "You can describe cache miss, fill, invalidate, and stampede." },
      { section: "redis", slug: "expiration-eviction", phase: "Caching", reason: "Understand what happens when keys expire or memory runs out.", checkpoint: "You know the difference between TTL and eviction." },
      { section: "redis", slug: "persistence-replication", phase: "Reliability", reason: "See what Redis can and cannot promise after restart or failover.", checkpoint: "You can explain RDB, AOF, and replica lag at a high level." },
      { section: "redis", slug: "streams-pubsub", phase: "Messaging", reason: "Choose between live broadcast and replayable event streams.", checkpoint: "You can explain why streams are not the same as pub/sub." },
      { section: "redis", slug: "spring-boot-redis", phase: "Spring Boot bridge", reason: "Use caching and templates without serializer surprises.", checkpoint: "You can pick a cache key and serializer intentionally." }
    ]
  },
  {
    slug: "docker",
    title: "Study Docker",
    shortTitle: "Docker",
    description: "A focused path through containers, images, Dockerfiles, layers, Compose, networks, volumes, build cache, multi-stage builds, Spring Boot packaging, and debugging.",
    promise: "By the end, you should be able to build a small image, run a multi-service local stack, preserve data with volumes, and debug container failures without guessing.",
    startHref: "/handbook/docker/containers-images",
    prerequisites: terms(["container", "image", "layer", "volume", "compose", "socket"]),
    steps: [
      { section: "docker", slug: "containers-images", phase: "Docker core", reason: "Separate the running process from the artifact that starts it.", checkpoint: "You can explain image vs container." },
      { section: "docker", slug: "dockerfiles-layers", phase: "Builds", reason: "Learn how Dockerfile instructions become cached filesystem layers.", checkpoint: "You can reorder a Dockerfile to improve cache reuse." },
      { section: "docker", slug: "compose-networking-volumes", phase: "Local systems", reason: "Run an app plus database without losing data or network access.", checkpoint: "You can explain service names, ports, and volumes." },
      { section: "docker", slug: "build-cache-multistage", phase: "Builds", reason: "Keep images smaller and rebuilds faster.", checkpoint: "You can explain what gets copied from a build stage." },
      { section: "docker", slug: "dockerizing-spring-boot", phase: "Spring Boot bridge", reason: "Package a Java service with predictable runtime configuration.", checkpoint: "You can expose the app, pass env vars, and keep secrets out of the image." },
      { section: "docker", slug: "production-debugging", phase: "Production", reason: "Inspect logs, mounts, networks, resources, and image assumptions.", checkpoint: "You can debug a container that exits immediately." }
    ]
  },
  {
    slug: "websocket",
    title: "Study WebSocket",
    shortTitle: "WebSocket",
    description: "A focused path through HTTP upgrade, frames, lifecycle, server design, Spring Boot WebSocket/STOMP, scaling, and security.",
    promise: "By the end, you should be able to explain how a WebSocket connection starts, how messages move, how to design a server, and what breaks under scale.",
    startHref: "/handbook/websocket/handshake-upgrade",
    prerequisites: terms(["http", "tcp", "websocket-handshake", "websocket-frame", "backpressure", "stomp"]),
    steps: [
      { section: "protocol-engineering", slug: "http", phase: "Light foundation", reason: "WebSocket starts as an HTTP request before upgrading.", checkpoint: "You can explain request, response, headers, and status." },
      { section: "websocket", slug: "handshake-upgrade", phase: "WebSocket core", reason: "Understand the exact boundary where HTTP becomes a persistent connection.", checkpoint: "You can explain 101 Switching Protocols." },
      { section: "websocket", slug: "frames-lifecycle", phase: "WebSocket core", reason: "Learn text, binary, ping, pong, close, and connection state.", checkpoint: "You can describe normal close vs dropped connection." },
      { section: "websocket", slug: "server-design", phase: "Server design", reason: "Design connection registries, routing, and failure behavior.", checkpoint: "You can explain how a server knows who to send to." },
      { section: "websocket", slug: "spring-boot-websocket", phase: "Spring Boot bridge", reason: "Use raw WebSocket or STOMP without hiding messaging boundaries.", checkpoint: "You can choose raw WebSocket vs STOMP for a simple feature." },
      { section: "websocket", slug: "scaling-security", phase: "Production", reason: "Handle auth, origins, load balancing, sticky sessions, and broadcast pressure.", checkpoint: "You can name what changes when you add a second server." }
    ]
  }
];

const chapterPrerequisiteKeys = {
  "foundations/tcp-vs-udp": ["socket"],
  "foundations/blocking-io": ["socket", "thread"],
  "java-nio/channels": ["socket", "blocking-io"],
  "java-nio/buffers": ["socket", "buffer"],
  "java-nio/selectors": ["channel", "thread", "blocking-io"],
  "java-nio/scatter-gather": ["channel", "buffer"],
  "java-nio/zero-copy": ["channel", "buffer"],
  "netty-core/eventloop": ["socket", "thread", "selector", "blocking-io"],
  "netty-core/futures": ["event-loop", "future"],
  "netty-core/pipeline": ["tcp", "framing", "event-loop"],
  "netty-core/handlers": ["pipeline", "event-loop", "bytebuf"],
  "netty-core/bytebuf": ["buffer", "bytebuf"],
  "netty-core/spring-boot": ["http", "webflux", "event-loop", "blocking-io"],
  "protocol-engineering/framing": ["tcp", "buffer"],
  "protocol-engineering/decoders": ["framing", "bytebuf"],
  "protocol-engineering/encoders": ["framing", "pipeline"],
  "protocol-engineering/http": ["tcp", "framing"],
  "protocol-engineering/websocket": ["http", "tcp"],
  "performance/backpressure": ["thread", "buffer"],
  "performance/memory": ["buffer", "bytebuf"],
  "performance/epoll": ["selector", "socket"],
  "performance/tuning": ["event-loop", "backpressure"],
  "kafka/distributed-log": ["topic", "partition"],
  "kafka/brokers-topics-partitions": ["broker", "topic", "partition"],
  "kafka/replication-isr": ["broker", "partition", "replication"],
  "kafka/producers": ["topic", "partition", "schema"],
  "kafka/consumers-offsets": ["partition", "offset", "consumer-group"],
  "kafka/delivery-semantics": ["offset", "consumer-group", "transaction"],
  "kafka/transactions-idempotence": ["delivery-semantics", "transaction"],
  "kafka/schema-evolution": ["schema", "topic"],
  "kafka/stream-processing": ["topic", "partition", "backpressure"],
  "kafka/operations-performance": ["broker", "partition", "offset", "backpressure"],
  "mongodb/documents-collections": ["document", "collection"],
  "mongodb/schema-design": ["document", "collection"],
  "mongodb/queries-indexes": ["document", "index"],
  "mongodb/writes-transactions": ["document", "write-concern", "transaction"],
  "mongodb/replication-sharding": ["replication", "shard-key"],
  "mongodb/spring-boot-mongodb": ["document", "index", "write-concern"],
  "redis/data-types": ["cache", "stream"],
  "redis/caching-patterns": ["cache", "ttl", "backpressure"],
  "redis/expiration-eviction": ["ttl", "eviction", "cache"],
  "redis/persistence-replication": ["replication", "cache"],
  "redis/streams-pubsub": ["stream", "backpressure"],
  "redis/spring-boot-redis": ["cache", "ttl", "eviction"],
  "docker/containers-images": ["container", "image"],
  "docker/dockerfiles-layers": ["image", "layer"],
  "docker/compose-networking-volumes": ["compose", "volume", "container"],
  "docker/build-cache-multistage": ["image", "layer"],
  "docker/dockerizing-spring-boot": ["container", "image", "volume"],
  "docker/production-debugging": ["container", "image", "volume"],
  "websocket/handshake-upgrade": ["http", "tcp", "websocket-handshake"],
  "websocket/frames-lifecycle": ["websocket-handshake", "websocket-frame"],
  "websocket/server-design": ["websocket-frame", "backpressure"],
  "websocket/spring-boot-websocket": ["websocket-handshake", "stomp", "backpressure"],
  "websocket/scaling-security": ["http", "websocket-frame", "backpressure"],
  "mastery/production-debugging": ["socket", "backpressure"]
} as const;

export function getStudyTrack(slug: string) {
  return studyTracks.find((track) => track.slug === slug);
}

export function getStudyTrackForChapter(section: string, slug: string) {
  return studyTracks.find((track) => track.steps.some((step) => step.section === section && step.slug === slug));
}

export function getChapterPrerequisites(section: string, slug: string): Prerequisite[] {
  const key = `${section}/${slug}` as keyof typeof chapterPrerequisiteKeys;
  const keys = chapterPrerequisiteKeys[key];
  if (!keys) return [];

  return keys
    .map((termKey) => termCatalog[termKey as TermKey])
    .filter(Boolean)
    .slice(0, 4);
}
