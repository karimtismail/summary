# Netty Engineering Handbook

An MDX-based technical learning platform for studying networking, Netty, Kafka, protocol engineering, performance, and production debugging.

The project is designed as a guided handbook, not a loose document dump. Chapters follow one shared learning spine, use semantic explanation blocks, and generate review material from the chapter body so the reading experience stays consistent as the content grows.

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The app uses Next.js App Router, MDX content under `content/`, shared navigation metadata in `lib/navigation.ts`, and canonical chapter section metadata in `lib/chapterSections.ts`.

## Project Structure

```text
app/                  Next.js routes and page shells
components/docs/      Handbook navigation, chapter brief, review, progress UI
components/mdx/       MDX rendering primitives and explanation blocks
content/              Authored handbook chapters
content/_templates/   Chapter authoring templates
docs/                 Contributor and authoring documentation
lib/                  Navigation, chapter parsing, MDX loading, content helpers
styles/               Prose and reading experience styles
```

## Authoring Model

Start from `content/_templates/chapter.mdx` when adding a chapter. The canonical chapter order is maintained in `lib/chapterSections.ts` and documented in `docs/authoring.md`.

Every chapter should help the reader answer three questions:

- What runtime mechanism is actually happening?
- Which production signal proves it is healthy or broken?
- What should I remember when I return later?

Review cards are generated from chapter content. Do not add an authored `## Cheat sheet` section inside MDX files.

## Quality Gate

Before shipping a content or platform change, run:

```bash
npm run lint
npm run typecheck
npm run build
```

For content changes, also scan the rendered page for heading order, mobile navigation, diagram usefulness, and whether the active-recall review still makes sense.
