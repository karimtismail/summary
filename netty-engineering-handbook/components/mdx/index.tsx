import type { MDXComponents } from "mdx/types";
import { ArchitectureDiagram } from "@/components/mdx/ArchitectureDiagram";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Danger, Highlight, StoryBlock, Warning } from "@/components/mdx/Callouts";
import { ComicStrip, ConceptSketch, Misconception, RecallPrompt, RuntimeTrace, TracePrompt } from "@/components/mdx/ExplanationTools";
import { FlowComparison } from "@/components/mdx/FlowComparison";
import { FlowDiagram } from "@/components/mdx/FlowDiagram";
import { H2, H3 } from "@/components/mdx/MdxHeading";

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  h2: H2,
  h3: H3,
  StoryBlock,
  TracePrompt,
  ComicStrip,
  ConceptSketch,
  Misconception,
  RuntimeTrace,
  RecallPrompt,
  Highlight,
  Warning,
  Danger,
  FlowComparison,
  FlowDiagram,
  ArchitectureDiagram
};
