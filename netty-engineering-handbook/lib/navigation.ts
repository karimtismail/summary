import {
  Blocks,
  BookOpen,
  Brain,
  Cloud,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  RadioTower,
  Route,
  ShieldCheck
} from "lucide-react";
import { chapterStructure } from "@/lib/chapterSections";

export type Chapter = {
  title: string;
  slug: string;
  description: string;
};

export type Section = {
  title: string;
  slug: string;
  description: string;
  domain: string;
  level: "Core" | "Applied" | "Advanced";
  focus: string;
  icon: typeof Network;
  chapters: Chapter[];
};

export type UpcomingTrack = {
  title: string;
  description: string;
  domain: string;
  icon: typeof Network;
};

export const sections: Section[] = [
  {
    title: "Systems Foundations",
    slug: "foundations",
    description: "The mental models behind latency, IO, protocols, and failure.",
    domain: "Foundational systems",
    level: "Core",
    focus: "Start here",
    icon: Network,
    chapters: [
      { title: "Networking Fundamentals", slug: "networking-fundamentals", description: "Packets, sockets, latency, throughput, and failure." },
      { title: "OSI Model", slug: "osi-model", description: "A pragmatic map for debugging real systems." },
      { title: "TCP vs UDP", slug: "tcp-vs-udp", description: "Two transport philosophies and their tradeoffs." },
      { title: "Blocking IO", slug: "blocking-io", description: "Why one thread per connection stops scaling." }
    ]
  },
  {
    title: "Java Runtime IO",
    slug: "java-nio",
    description: "How Java talks to the kernel without hiding the cost of bytes.",
    domain: "JVM and runtime",
    level: "Core",
    focus: "Runtime mechanics",
    icon: Cpu,
    chapters: [
      { title: "Channels", slug: "channels", description: "Connection endpoints without stream-shaped assumptions." },
      { title: "Buffers", slug: "buffers", description: "The memory contract at the center of NIO." },
      { title: "Selectors", slug: "selectors", description: "One thread watches many sockets." },
      { title: "Scatter Gather", slug: "scatter-gather", description: "Move structured messages without needless copies." },
      { title: "Zero Copy", slug: "zero-copy", description: "Avoid copying bytes through user space." }
    ]
  },
  {
    title: "Netty Internals",
    slug: "netty-core",
    description: "Event loops, pipelines, memory ownership, async completion, and Spring Boot integration.",
    domain: "Framework internals",
    level: "Applied",
    focus: "Production framework",
    icon: Layers3,
    chapters: [
      { title: "EventLoop", slug: "eventloop", description: "The single-threaded execution lane for a channel." },
      { title: "Futures", slug: "futures", description: "Async completion without blocking the EventLoop." },
      { title: "Pipeline", slug: "pipeline", description: "Inbound and outbound events as a protocol assembly line." },
      { title: "Handlers", slug: "handlers", description: "Reusable protocol behavior with sharp ownership rules." },
      { title: "ByteBuf", slug: "bytebuf", description: "Reference-counted memory for high-throughput systems." },
      { title: "Netty in Spring Boot", slug: "spring-boot", description: "How WebFlux uses Reactor Netty and where the Netty rules still matter." }
    ]
  },
  {
    title: "Protocols and APIs",
    slug: "protocol-engineering",
    description: "Design message boundaries, encoders, decoders, and evolvable contracts.",
    domain: "Interface design",
    level: "Applied",
    focus: "Correctness",
    icon: GitBranch,
    chapters: [
      { title: "Framing", slug: "framing", description: "The boundary problem every TCP protocol must solve." },
      { title: "Decoders", slug: "decoders", description: "Parsing partial input without corrupting state." },
      { title: "Encoders", slug: "encoders", description: "Writing protocols that stay compatible over time." },
      { title: "HTTP", slug: "http", description: "Request-response semantics on top of streams." },
      { title: "WebSocket", slug: "websocket", description: "Full-duplex messages after an HTTP upgrade." }
    ]
  },
  {
    title: "Kafka and Event Streaming",
    slug: "kafka",
    description: "From log intuition to partitions, delivery guarantees, schemas, and operations.",
    domain: "Distributed data",
    level: "Applied",
    focus: "Event systems",
    icon: Route,
    chapters: [
      { title: "Distributed Log", slug: "distributed-log", description: "The core idea that makes Kafka different from a queue." },
      { title: "Brokers, Topics, and Partitions", slug: "brokers-topics-partitions", description: "How Kafka spreads ordered logs across machines." },
      { title: "Replication and ISR", slug: "replication-isr", description: "Leader replicas, followers, and durability under failure." },
      { title: "Producers", slug: "producers", description: "Batching, keys, acknowledgements, and retry behavior." },
      { title: "Consumers and Offsets", slug: "consumers-offsets", description: "Consumer groups, progress tracking, and replay." },
      { title: "Delivery Semantics", slug: "delivery-semantics", description: "At-most-once, at-least-once, and exactly-once tradeoffs." },
      { title: "Transactions and Idempotence", slug: "transactions-idempotence", description: "Producer guarantees for duplicate-resistant workflows." },
      { title: "Schema Evolution", slug: "schema-evolution", description: "How event contracts survive version changes." },
      { title: "Stream Processing", slug: "stream-processing", description: "Stateful event processing, windows, joins, and changelogs." },
      { title: "Operations and Performance", slug: "operations-performance", description: "Lag, retention, compaction, partitions, and tuning." }
    ]
  },
  {
    title: "MongoDB",
    slug: "mongodb",
    description: "Documents, schema design, indexes, writes, replication, sharding, and Spring Boot usage.",
    domain: "Document database",
    level: "Applied",
    focus: "Operational data",
    icon: Database,
    chapters: [
      { title: "Documents and Collections", slug: "documents-collections", description: "How MongoDB stores application state as BSON documents." },
      { title: "Schema Design", slug: "schema-design", description: "Embedding, references, and modeling for read and write patterns." },
      { title: "Queries and Indexes", slug: "queries-indexes", description: "Find data quickly without guessing at performance." },
      { title: "Writes and Transactions", slug: "writes-transactions", description: "Atomicity, write concern, and when transactions are the right tool." },
      { title: "Replication and Sharding", slug: "replication-sharding", description: "Durability, failover, scale-out, and shard-key risk." },
      { title: "Spring Boot with MongoDB", slug: "spring-boot-mongodb", description: "Repositories, templates, connection config, and production boundaries." }
    ]
  },
  {
    title: "Redis",
    slug: "redis",
    description: "Data structures, caching, expiration, eviction, persistence, streams, and Spring Boot usage.",
    domain: "In-memory data",
    level: "Applied",
    focus: "Latency and coordination",
    icon: Database,
    chapters: [
      { title: "Data Types", slug: "data-types", description: "Strings, hashes, lists, sets, sorted sets, streams, and the shape of Redis data." },
      { title: "Caching Patterns", slug: "caching-patterns", description: "Cache-aside, write-through thinking, invalidation, and stampede control." },
      { title: "Expiration and Eviction", slug: "expiration-eviction", description: "TTL, memory limits, and what Redis removes when memory is tight." },
      { title: "Persistence and Replication", slug: "persistence-replication", description: "RDB, AOF, replicas, failover expectations, and data-loss boundaries." },
      { title: "Streams and Pub/Sub", slug: "streams-pubsub", description: "Real-time messaging choices and when streams beat fire-and-forget pub/sub." },
      { title: "Spring Boot with Redis", slug: "spring-boot-redis", description: "Cache manager, RedisTemplate, serializers, and operational footguns." }
    ]
  },
  {
    title: "Docker",
    slug: "docker",
    description: "Containers, images, Dockerfiles, Compose, networking, volumes, builds, and production debugging.",
    domain: "Runtime packaging",
    level: "Applied",
    focus: "Local to production",
    icon: Blocks,
    chapters: [
      { title: "Containers and Images", slug: "containers-images", description: "The difference between a runnable process and the image it starts from." },
      { title: "Dockerfiles and Layers", slug: "dockerfiles-layers", description: "How build instructions become cached image layers." },
      { title: "Compose, Networks, and Volumes", slug: "compose-networking-volumes", description: "Run multi-service stacks without losing data or connectivity." },
      { title: "Build Cache and Multi-stage Builds", slug: "build-cache-multistage", description: "Make images smaller and builds faster without hiding complexity." },
      { title: "Dockerizing Spring Boot", slug: "dockerizing-spring-boot", description: "Package a Java service with predictable config, ports, and health checks." },
      { title: "Production Debugging", slug: "production-debugging", description: "Inspect containers, logs, mounts, resources, and image assumptions." }
    ]
  },
  {
    title: "WebSocket",
    slug: "websocket",
    description: "Handshake, frames, lifecycle, server design, Spring Boot support, scaling, and security.",
    domain: "Realtime protocol",
    level: "Applied",
    focus: "Bidirectional apps",
    icon: RadioTower,
    chapters: [
      { title: "Handshake and Upgrade", slug: "handshake-upgrade", description: "How HTTP becomes a persistent WebSocket connection." },
      { title: "Frames and Lifecycle", slug: "frames-lifecycle", description: "Text, binary, ping, pong, close, and connection state." },
      { title: "Server Design", slug: "server-design", description: "Connection registries, message routing, backpressure, and failure paths." },
      { title: "Spring Boot WebSocket", slug: "spring-boot-websocket", description: "Raw WebSocket, STOMP, broker choices, and application boundaries." },
      { title: "Scaling and Security", slug: "scaling-security", description: "Auth, origin checks, load balancers, sticky sessions, and broadcast pressure." }
    ]
  },
  {
    title: "Performance Engineering",
    slug: "performance",
    description: "Measure bottlenecks across kernels, memory, backpressure, and queues.",
    domain: "Reliability and speed",
    level: "Advanced",
    focus: "Latency and scale",
    icon: Gauge,
    chapters: [
      { title: "Backpressure", slug: "backpressure", description: "Protect the system when consumers slow down." },
      { title: "Memory", slug: "memory", description: "Direct buffers, pooling, and latency behavior." },
      { title: "epoll", slug: "epoll", description: "Linux readiness notification in production servers." },
      { title: "Tuning", slug: "tuning", description: "Measure before changing knobs." }
    ]
  },
  {
    title: "Production Mastery",
    slug: "mastery",
    description: "Debugging, architecture, tradeoffs, and project paths for ownership.",
    domain: "Engineering judgment",
    level: "Advanced",
    focus: "Operating systems",
    icon: RadioTower,
    chapters: [
      { title: "Architecture", slug: "architecture", description: "Designing boundaries, protocols, and failure modes." },
      { title: "Production Debugging", slug: "production-debugging", description: "Evidence-first debugging for live distributed systems." },
      { title: "Real Projects", slug: "real-projects", description: "Practice paths that force runtime understanding." }
    ]
  }
];

export const allChapters = sections.flatMap((section) =>
  section.chapters.map((chapter) => ({
    ...chapter,
    section: section.slug,
    sectionTitle: section.title,
    href: `/handbook/${section.slug}/${chapter.slug}`
  }))
);

export function findChapter(sectionSlug: string, chapterSlug: string) {
  return allChapters.find((chapter) => chapter.section === sectionSlug && chapter.slug === chapterSlug);
}

export function getAdjacentChapters(sectionSlug: string, chapterSlug: string) {
  const index = allChapters.findIndex((chapter) => chapter.section === sectionSlug && chapter.slug === chapterSlug);
  return {
    previous: index > 0 ? allChapters[index - 1] : null,
    next: index >= 0 && index < allChapters.length - 1 ? allChapters[index + 1] : null
  };
}

export const firstChapter = allChapters[0];

export const contentCurrentAsOf = "May 2026";

export const handbookName = "Engineering Systems Handbook";

export const handbookStats = [
  { value: "60", label: "chapters" },
  { value: "6", label: "study paths" },
  { value: "11", label: "reference groups" }
];

export { chapterStructure };

export const learningPaths = [
  {
    title: "Runtime Systems",
    description: "Move from sockets and blocking IO to selectors, event loops, memory, and backpressure.",
    href: "/handbook/foundations/networking-fundamentals",
    chapters: ["Networking", "Blocking IO", "Selectors", "EventLoop", "Backpressure"]
  },
  {
    title: "Protocol Builder",
    description: "Learn how byte streams become reliable, versioned, observable application protocols.",
    href: "/handbook/protocol-engineering/framing",
    chapters: ["Framing", "Decoders", "Encoders", "HTTP", "WebSocket"]
  },
  {
    title: "Event Platform",
    description: "Build the mental model behind Kafka storage, replication, clients, guarantees, and operations.",
    href: "/handbook/kafka/distributed-log",
    chapters: ["Distributed Log", "Partitions", "Replication", "Consumers", "Operations"]
  }
];

export const upcomingTracks: UpcomingTrack[] = [
  {
    title: "System Design",
    description: "Capacity planning, boundaries, consistency, fault isolation, and architecture reviews.",
    domain: "Architecture",
    icon: Blocks
  },
  {
    title: "JVM Concurrency",
    description: "Threads, virtual threads, structured concurrency, locks, atomics, and memory visibility.",
    domain: "Runtime",
    icon: Brain
  },
  {
    title: "Databases",
    description: "Indexes, transactions, replication, query plans, storage engines, and data modeling.",
    domain: "Data",
    icon: Database
  },
  {
    title: "Cloud and Kubernetes",
    description: "Containers, service discovery, deployment safety, networking, and platform operations.",
    domain: "Platform",
    icon: Cloud
  },
  {
    title: "Security Engineering",
    description: "Threat modeling, auth boundaries, secrets, transport security, and secure-by-default design.",
    domain: "Security",
    icon: ShieldCheck
  }
];
