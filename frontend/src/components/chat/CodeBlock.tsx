import * as React from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import { Check, Copy, Terminal } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markup", markup);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("cpp", cpp);

const languageMap: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  yaml: "yaml",
  cs: "csharp",
  cpp: "cpp",
  html: "markup",
  bash: "bash",
};

export function CodeBlock({
  code,
  language,
  inline = false,
}: {
  code: string;
  language?: string;
  inline?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (inline) {
    return (
      <code className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-accent">
        {code}
      </code>
    );
  }

  const lang = (language ? languageMap[language.toLowerCase()] : undefined) ?? "text";

  return (
    <div className="group/code my-3 overflow-hidden rounded-xl border border-white/10 bg-[#0d1520]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
        <span className="flex items-center gap-2 text-xs font-medium text-text-secondary">
          <Terminal className="h-3.5 w-3.5 text-accent" />
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-text-secondary opacity-100 transition-all hover:bg-white/10 hover:text-text-primary sm:opacity-0 sm:group-hover/code:opacity-100"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "13px",
          lineHeight: "1.6",
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-mono, ui-monospace, monospace)" },
        }}
      >
        {code.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}
