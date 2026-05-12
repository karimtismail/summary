export type PracticeLab = {
  title: string;
  goal: string;
  build: string[];
  check: string;
};

const practiceLabsByTrack: Record<string, PracticeLab[]> = {
  netty: [
    {
      title: "Echo server with a boundary",
      goal: "Build one Netty server that proves you understand channels, handlers, and framing.",
      build: ["Start with a simple echo handler.", "Add a length-field frame decoder.", "Reject frames above a safe size."],
      check: "Send two messages in one TCP write and prove the server still reads two application messages."
    },
    {
      title: "EventLoop pressure drill",
      goal: "See what blocking work does before it reaches production.",
      build: ["Add an intentionally slow handler.", "Move the slow work to a separate executor.", "Return to the EventLoop only to write the response."],
      check: "Compare latency before and after moving the slow work away from the EventLoop."
    },
    {
      title: "Spring Boot WebFlux audit",
      goal: "Connect raw Netty rules to a real Spring Boot path.",
      build: ["Create one WebFlux endpoint.", "Call one blocking dependency safely.", "Add a log marker for reactor-http-nio threads."],
      check: "Explain which code runs on the event-loop path and which code must not."
    }
  ],
  kafka: [
    {
      title: "Replayable order events",
      goal: "Make Kafka feel like an ordered log, not a magic queue.",
      build: ["Produce order events with a customer key.", "Consume from a group.", "Reset offsets and replay a small range."],
      check: "Show which ordering is preserved and which ordering is not."
    },
    {
      title: "Lag investigation",
      goal: "Practice reading lag as evidence, not panic.",
      build: ["Slow one consumer intentionally.", "Observe group lag.", "Add another consumer and watch partition assignment."],
      check: "Explain why consumers cannot scale beyond partition count inside one group."
    },
    {
      title: "Schema change rehearsal",
      goal: "Practice evolving events without breaking readers.",
      build: ["Create v1 and v2 payloads.", "Add one optional field.", "Write a consumer that tolerates both shapes."],
      check: "Name the compatibility rule that made the rollout safe."
    }
  ],
  mongodb: [
    {
      title: "Model by access pattern",
      goal: "Choose documents by workflow, not by habit.",
      build: ["Model products with seller summaries.", "Model reviews separately.", "Write the two main read queries."],
      check: "Explain why one relationship is embedded and the other is referenced."
    },
    {
      title: "Index proof",
      goal: "Turn slow-query guessing into evidence.",
      build: ["Create a query with filter and sort.", "Run explain before indexing.", "Add the index that matches the query shape."],
      check: "Show that the winning plan uses the index you expected."
    },
    {
      title: "Transaction boundary",
      goal: "Know when one-document atomicity is enough.",
      build: ["Implement one single-document update.", "Implement one multi-document workflow.", "Decide whether a transaction is required."],
      check: "Explain the failure case that forces or avoids a transaction."
    }
  ],
  redis: [
    {
      title: "Cache-aside with TTL",
      goal: "Build the hit, miss, fill, and expiry path explicitly.",
      build: ["Read from Redis first.", "Load the source on miss.", "Set a TTL with a little jitter."],
      check: "Explain what happens when the cached value expires under traffic."
    },
    {
      title: "Stampede guard",
      goal: "Protect the database when one hot key expires.",
      build: ["Simulate many requests for one missing key.", "Add request coalescing or a lock.", "Keep one request responsible for refill."],
      check: "Show that most callers wait or receive stale data instead of hammering the source."
    },
    {
      title: "Streams consumer group",
      goal: "See replayable Redis messaging clearly.",
      build: ["Write events to a stream.", "Read with a consumer group.", "Acknowledge processed messages."],
      check: "Explain what happens to pending messages when a consumer dies."
    }
  ],
  docker: [
    {
      title: "Dockerize a Spring Boot service",
      goal: "Separate build-time image from runtime configuration.",
      build: ["Create a multi-stage Dockerfile.", "Expose the app port.", "Pass profile and database config as env vars."],
      check: "Rebuild the image and prove secrets are not baked into any layer."
    },
    {
      title: "Compose a local stack",
      goal: "Run app, database, and Redis as one local system.",
      build: ["Define services in Compose.", "Use service names for networking.", "Persist database data with a volume."],
      check: "Remove and recreate containers without losing database state."
    },
    {
      title: "Container exit drill",
      goal: "Debug runtime failures methodically.",
      build: ["Start a container that exits immediately.", "Inspect logs and exit code.", "Override the command to inspect files and env."],
      check: "Identify whether the failure is image, config, command, or dependency."
    }
  ],
  websocket: [
    {
      title: "Raw chat connection",
      goal: "Understand the upgrade and frame lifecycle directly.",
      build: ["Open a WebSocket from the browser.", "Send JSON messages.", "Handle close and reconnect policy."],
      check: "Explain what happens before and after status 101."
    },
    {
      title: "Spring Boot STOMP notifications",
      goal: "Use the Spring abstraction without losing protocol boundaries.",
      build: ["Create a STOMP endpoint.", "Subscribe to a destination.", "Send one server-side notification."],
      check: "Explain why STOMP destinations are not the same as REST routes."
    },
    {
      title: "Scale-out rehearsal",
      goal: "Find the moment one server is no longer enough.",
      build: ["Run two app instances.", "Route clients through a load balancer.", "Add shared pub/sub or broker fanout."],
      check: "Explain what breaks if each server only knows its own connections."
    }
  ]
};

export function getPracticeLabs(trackSlug: string) {
  return practiceLabsByTrack[trackSlug] ?? [];
}
