import { BookOpen, Cpu, Gauge, GitBranch, Layers3, Network, RadioTower, Route } from "lucide-react";

export type Chapter = {
  title: string;
  slug: string;
  description: string;
};

export type Section = {
  title: string;
  slug: string;
  description: string;
  icon: typeof Network;
  chapters: Chapter[];
};

export const sections: Section[] = [
  {
    title: "Foundations",
    slug: "foundations",
    description: "The network model beneath every high-performance server.",
    icon: Network,
    chapters: [
      { title: "Networking Fundamentals", slug: "networking-fundamentals", description: "Packets, sockets, latency, throughput, and failure." },
      { title: "OSI Model", slug: "osi-model", description: "A pragmatic map for debugging real systems." },
      { title: "TCP vs UDP", slug: "tcp-vs-udp", description: "Two transport philosophies and their tradeoffs." },
      { title: "Blocking IO", slug: "blocking-io", description: "Why one thread per connection stops scaling." }
    ]
  },
  {
    title: "Java NIO",
    slug: "java-nio",
    description: "Channels, buffers, selectors, and kernel-friendly IO.",
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
    title: "Netty Core",
    slug: "netty-core",
    description: "The runtime model that makes Netty predictable.",
    icon: Layers3,
    chapters: [
      { title: "EventLoop", slug: "eventloop", description: "The single-threaded execution lane for a channel." },
      { title: "Pipeline", slug: "pipeline", description: "Inbound and outbound events as a protocol assembly line." },
      { title: "Handlers", slug: "handlers", description: "Reusable protocol behavior with sharp ownership rules." },
      { title: "ByteBuf", slug: "bytebuf", description: "Reference-counted memory for serious network systems." },
      { title: "Futures", slug: "futures", description: "Async completion without blocking the EventLoop." }
    ]
  },
  {
    title: "Protocol Engineering",
    slug: "protocol-engineering",
    description: "Turn byte streams into correct, evolvable messages.",
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
    title: "Performance",
    slug: "performance",
    description: "Kernel APIs, backpressure, memory, and tuning discipline.",
    icon: Gauge,
    chapters: [
      { title: "epoll", slug: "epoll", description: "Linux readiness notification in production servers." },
      { title: "Backpressure", slug: "backpressure", description: "Protect the system when consumers slow down." },
      { title: "Memory", slug: "memory", description: "Direct buffers, pooling, and latency behavior." },
      { title: "Tuning", slug: "tuning", description: "Measure before changing knobs." }
    ]
  },
  {
    title: "Kafka",
    slug: "kafka",
    description: "From event-log intuition to production streaming systems.",
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
    title: "Mastery",
    slug: "mastery",
    description: "Operational patterns for real production ownership.",
    icon: RadioTower,
    chapters: [
      { title: "Production Debugging", slug: "production-debugging", description: "Evidence-first debugging for live network systems." },
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

export const handbookName = "Network Systems Handbook";

export const handbookStats = [
  { value: "36", label: "chapters" },
  { value: "7", label: "tracks" },
  { value: "1", label: "connected mental model" }
];

export const chapterStructure = [
  "Intuition",
  "Real-world problem",
  "Mental model",
  "Visual explanation",
  "Runtime behavior",
  "Code example",
  "Production implications",
  "Performance implications",
  "Common bugs",
  "Summary"
];
