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
    description: "Event loops, pipelines, memory ownership, and async completion.",
    domain: "Framework internals",
    level: "Applied",
    focus: "Production framework",
    icon: Layers3,
    chapters: [
      { title: "EventLoop", slug: "eventloop", description: "The single-threaded execution lane for a channel." },
      { title: "Pipeline", slug: "pipeline", description: "Inbound and outbound events as a protocol assembly line." },
      { title: "Handlers", slug: "handlers", description: "Reusable protocol behavior with sharp ownership rules." },
      { title: "ByteBuf", slug: "bytebuf", description: "Reference-counted memory for high-throughput systems." },
      { title: "Futures", slug: "futures", description: "Async completion without blocking the EventLoop." }
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
    title: "Performance Engineering",
    slug: "performance",
    description: "Measure bottlenecks across kernels, memory, backpressure, and queues.",
    domain: "Reliability and speed",
    level: "Advanced",
    focus: "Latency and scale",
    icon: Gauge,
    chapters: [
      { title: "epoll", slug: "epoll", description: "Linux readiness notification in production servers." },
      { title: "Backpressure", slug: "backpressure", description: "Protect the system when consumers slow down." },
      { title: "Memory", slug: "memory", description: "Direct buffers, pooling, and latency behavior." },
      { title: "Tuning", slug: "tuning", description: "Measure before changing knobs." }
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
      { title: "Producers", slug: "producers", description: "Batching, keys, acknowledgements, and retry behavior." },
      { title: "Consumers and Offsets", slug: "consumers-offsets", description: "Consumer groups, progress tracking, and replay." },
      { title: "Replication and ISR", slug: "replication-isr", description: "Leader replicas, followers, and durability under failure." },
      { title: "Delivery Semantics", slug: "delivery-semantics", description: "At-most-once, at-least-once, and exactly-once tradeoffs." },
      { title: "Transactions and Idempotence", slug: "transactions-idempotence", description: "Producer guarantees for duplicate-resistant workflows." },
      { title: "Schema Evolution", slug: "schema-evolution", description: "How event contracts survive version changes." },
      { title: "Stream Processing", slug: "stream-processing", description: "Stateful event processing, windows, joins, and changelogs." },
      { title: "Operations and Performance", slug: "operations-performance", description: "Lag, retention, compaction, partitions, and tuning." }
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
      { title: "Production Debugging", slug: "production-debugging", description: "Evidence-first debugging for live distributed systems." },
      { title: "Architecture", slug: "architecture", description: "Designing boundaries, protocols, and failure modes." },
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
  { value: "36", label: "chapters" },
  { value: "7", label: "active tracks" },
  { value: "8", label: "future lanes" }
];

export const chapterStructure = [
  "Intuition",
  "Real-world problem",
  "Mental model",
  "Visual explanation",
  "Runtime or operational behavior",
  "Code example",
  "Production implications",
  "Performance implications",
  "Common bugs",
  "Cheat sheet",
  "Summary"
];

export const learningPaths = [
  {
    title: "Runtime Systems",
    description: "Move from blocking IO to selectors, event loops, memory, and production debugging.",
    href: "/handbook/foundations/blocking-io",
    chapters: ["Blocking IO", "Selectors", "EventLoop", "ByteBuf", "Production Debugging"]
  },
  {
    title: "Protocol Builder",
    description: "Learn how byte streams become reliable, versioned, observable application protocols.",
    href: "/handbook/protocol-engineering/framing",
    chapters: ["Framing", "Decoders", "Encoders", "HTTP", "WebSocket"]
  },
  {
    title: "Event Platform",
    description: "Build the mental model behind Kafka, distributed logs, delivery semantics, and operations.",
    href: "/handbook/kafka/distributed-log",
    chapters: ["Distributed Log", "Partitions", "Consumers", "Replication", "Operations"]
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
