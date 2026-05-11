import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import { CodeBlockClient } from "@/components/mdx/CodeBlockClient";

type CodeElementProps = {
  className?: string;
  children?: ReactNode;
};

function getCodeElement(children: ReactNode): ReactElement<CodeElementProps> | null {
  if (isValidElement<CodeElementProps>(children)) return children;
  if (Array.isArray(children)) {
    const match = children.find((child): child is ReactElement<CodeElementProps> => isValidElement<CodeElementProps>(child));
    return match ?? null;
  }
  return null;
}

function toCodeString(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(toCodeString).join("");
  if (isValidElement<CodeElementProps>(value)) return toCodeString(value.props.children);
  return "";
}

function resolveLanguage(className: string, code: string) {
  const explicitLanguage = className.match(/language-([a-z0-9+#-]+)/i)?.[1];
  if (explicitLanguage && explicitLanguage !== "text") return explicitLanguage;

  const trimmed = code.trim();
  if (/^(npm|npx|pnpm|yarn|curl|docker|kubectl|kafka-|java\s|mvn\s|gradle\s)/m.test(trimmed)) return "bash";
  if (/^[$#]\s/m.test(trimmed)) return "bash";
  if (
    ["ByteBuffer", "ChannelPipeline", "EventLoopGroup", "KafkaProducer", "KafkaConsumer", "ProducerRecord", "ConsumerRecord"].some((symbol) =>
      trimmed.includes(symbol)
    )
  ) {
    return "java";
  }
  if (/\b(class|interface|enum)\s+[A-Z]\w+/.test(trimmed)) return "java";
  if (/\b(public|private|protected)\s+(static\s+)?(void|final|class)\b/.test(trimmed)) return "java";
  if (/\b(new|extends|implements)\s+[A-Z]\w+/.test(trimmed)) return "java";
  if (/^[:.#\w\s,[\]="'>-]+\{[\s\S]*\}$/.test(trimmed) || /--[a-z0-9-]+:\s*#[0-9a-f]{3,8}/i.test(trimmed)) return "css";
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) return "json";

  return "text";
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const codeElement = getCodeElement(children);
  const className = codeElement?.props.className ?? "";
  const code = toCodeString(codeElement?.props.children ?? children).replace(/\n$/, "");
  const language = resolveLanguage(className, code);

  return <CodeBlockClient code={code} language={language} />;
}
