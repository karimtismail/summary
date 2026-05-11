"use client";

import { Check, Copy } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function subscribeHydration() {
  return () => undefined;
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
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

export function CodeBlockClient({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const hydrated = useSyncExternalStore(subscribeHydration, getClientSnapshot, getServerSnapshot);

  const copy = async () => {
    await writeClipboard(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="group relative my-8 overflow-hidden rounded-lg border border-border bg-[#0d1017] shadow-inset">
      <div className="flex items-center justify-between border-b border-border bg-panel/70 px-4 py-2">
        <span className="font-mono text-xs text-muted">{language}</span>
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
      {hydrated ? (
        <SyntaxHighlighter
          language={language}
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
      ) : (
        <pre className="m-0 overflow-x-auto bg-transparent p-[1.15rem] text-sm leading-7 text-[#abb2bf]">
          <code style={{ fontFamily: "var(--font-mono)" }}>{code}</code>
        </pre>
      )}
    </div>
  );
}
