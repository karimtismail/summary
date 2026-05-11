"use client";

import { Check, Copy } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { isValidElement, useMemo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeElement = getCodeElement(children);
  const className = codeElement?.props.className ?? "";
  const language = className.replace("language-", "") || "text";
  const code = useMemo(() => toCodeString(codeElement?.props.children ?? children).replace(/\n$/, ""), [children, codeElement]);

  const copy = async () => {
    await writeClipboard(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="group relative my-8 overflow-hidden rounded-lg border border-border bg-[#0d1017] shadow-inset">
      <div className="flex items-center justify-between border-b border-border bg-panel/70 px-4 py-2">
        <span className="font-mono text-xs text-muted" suppressHydrationWarning>
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-muted transition hover:border-accent/50 hover:text-text"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent-secondary" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language="text"
        style={oneDark}
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "1.15rem",
          fontSize: "0.875rem",
          lineHeight: "1.75"
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
