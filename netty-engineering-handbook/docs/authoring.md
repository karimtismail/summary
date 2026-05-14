# Authoring Guide

This handbook is a guided technical learning platform, not a loose collection of notes. Each chapter should help a reader build a usable runtime model, recognize the production failure mode, and revisit the topic later without rereading everything.

## Chapter Spine

Use the canonical section order from `lib/chapterSections.ts`:

1. Intuition
2. Real-world problem
3. Mental model
4. Visual explanation
5. Runtime behavior
6. Code example
7. Production implications
8. Performance implications
9. Common bugs
10. Summary

Do not add an authored `## Cheat sheet` section. Review cards are generated from the chapter body.

## Explanation Standard

Prefer this explanation shape for difficult concepts:

1. Misleading intuition
2. Corrected mental model
3. Concrete runtime trace
4. Production consequence
5. Recall prompt

Good explanations name the signal, not only the abstraction. For example:

- Use `readerIndex`, `writerIndex`, and `refCnt` when explaining `ByteBuf` ownership.
- Use offset commit, partition assignment, lag, and rebalance when explaining consumers.
- Use pending EventLoop tasks, write backlog, and blocked callbacks when explaining EventLoop health.

## Evidence-First Teaching Pattern

Every chapter should teach like an incident review that happened before the reader got paged:

1. Start with the pressure: load, waiting, failure, ownership, replay, compatibility, or cost.
2. Name the tempting wrong model before giving the correct one.
3. Trace one concrete runtime boundary: bytes, offsets, buffers, partitions, indexes, queues, memory, connections, or side effects.
4. Make advice conditional on evidence. Say what to measure before tuning, scaling, retrying, caching, indexing, partitioning, or changing a protocol.
5. End with a small recall prompt that proves the reader can explain the boundary without rereading the chapter.

Good chapters do not hand out magic knobs. They teach a diagnosis loop: define the workload or correctness goal, locate the slow or unsafe boundary, identify the saturated resource or broken contract, change one thing, and verify with an observable signal.

## Analogy Discipline

Analogies are temporary handles, not replacements for mechanisms.

Every analogy should eventually answer:

- Where does the analogy help?
- Where does it stop being true?
- Which exact runtime terms replace it?

Example:

```mdx
<StoryBlock title="A Consumer Is A Cursor">
Kafka does not remove a record when a consumer sees it. The consumer advances its own cursor through the log.

The cursor analogy has limits. The cursor is per consumer group and partition, retention can remove old records, and committing the cursor says nothing about whether your database write, API call, or email already succeeded.
</StoryBlock>
```

## Semantic MDX Blocks

Use semantic blocks when they make the explanation more precise.

### Misconception

Place near `## Mental model` when a wrong model would harm everything that follows.

```mdx
<Misconception
  soundsLike="A slice is a safe copy of the bytes."
  actually="A slice usually shares the same underlying memory."
  whyItMatters="If the parent buffer is released while a shared slice is still used, the bug looks like corrupted data even though parsing was correct."
/>
```

### TracePrompt

Place before diagrams when the reader needs a specific lens.

```mdx
<TracePrompt>
Trace ownership, not only bytes. Watch when the reference count changes and which handler becomes responsible for release.
</TracePrompt>
```

### RuntimeTrace

Use for causal mechanics that are too important for a single paragraph.

```mdx
<RuntimeTrace title="One EventLoop cycle">
Select | The loop asks the transport which channels are ready.
Run IO callbacks | Ready channels move through pipeline handlers on the loop thread.
Drain tasks | Tasks submitted from other threads run in loop order.
</RuntimeTrace>
```

### RecallPrompt

Use sparingly after code examples or before the summary.

```mdx
<RecallPrompt question="why are duplicates often safer than loss?">
Duplicates can be made harmless with idempotency keys, processed-event tables, or reconciliation. A lost event may never be seen again.
</RecallPrompt>
```

## Visual Explanation Rules

Use visuals only when they expose one hidden mechanism:

- movement: where bytes, records, frames, or events go
- ownership: who may mutate, release, commit, retry, or recover
- waiting: where the system blocks, queues, retries, or applies pressure
- state change: how indexes, offsets, ISR membership, or cursors change
- failure story: what succeeded, what failed, and what repeats

Avoid decorative diagrams. A diagram should make a runtime fact easier to reason about.

## Voice Rules

Keep the voice production-first and precise.

- Explain the failure mode before the API.
- Use concrete signals after abstract words.
- Avoid filler and generic motivation.
- Avoid overusing the pattern "not just X, it is Y."
- Do not invent product or version behavior.
- For version-sensitive claims, name the version and date.

## Quality Checklist

Before a chapter is considered ready:

- The real-world problem is concrete.
- The mental model can be explained in one sentence.
- The visual explanation has a trace focus.
- The code example reinforces the model.
- Production and performance sections name observable signals.
- Common bugs are specific and actionable.
- The summary is short enough to remember.
- `npm run lint`, `npm run typecheck`, and `npm run build` pass.
