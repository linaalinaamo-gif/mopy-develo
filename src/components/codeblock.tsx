import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "python", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[hsl(220_10%_10%)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-discord-elevated border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-discord-danger/70" />
            <div className="w-3 h-3 rounded-full bg-discord-warning/70" />
            <div className="w-3 h-3 rounded-full bg-discord-success/70" />
          </div>
          {filename && (
            <span className="text-xs text-muted-foreground font-mono">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-secondary hover:bg-accent"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-discord-success" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="code-block text-foreground/90 whitespace-pre-wrap break-words">
          {code.split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none w-10 text-right text-muted-foreground/40 mr-4 flex-shrink-0 text-xs leading-relaxed">
                {i + 1}
              </span>
              <span className="flex-1">{colorize(line)}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function colorize(line: string) {
  // Handle comments
  const commentIdx = line.indexOf("#");
  if (commentIdx !== -1) {
    const before = line.slice(0, commentIdx);
    const comment = line.slice(commentIdx);
    return (
      <>
        {colorizeTokens(before)}
        <span style={{ color: "#6A737D" }}>{comment}</span>
      </>
    );
  }

  return colorizeTokens(line);
}

function colorizeTokens(line: string) {
  // Simple tokenizer
  const stringRegex = /(f?"[^"]*"|f?'[^']*')/g;
  const keywordRegex = /\b(import|from|class|def|async|await|return|if|elif|else|for|in|not|and|or|True|False|None|self|super|pass|try|except|raise|with|as|yield)\b/g;
  const decoratorRegex = /@[\w.]+/g;

  const matches: { index: number; length: number; type: "string" | "keyword" | "decorator"; text: string }[] = [];

  let m: RegExpExecArray | null;
  const sr = new RegExp(stringRegex.source, "g");
  while ((m = sr.exec(line)) !== null) matches.push({ index: m.index, length: m[0].length, type: "string", text: m[0] });

  const dr = new RegExp(decoratorRegex.source, "g");
  while ((m = dr.exec(line)) !== null) {
    if (!matches.some(x => m!.index >= x.index && m!.index < x.index + x.length))
      matches.push({ index: m.index, length: m[0].length, type: "decorator", text: m[0] });
  }

  const kr = new RegExp(keywordRegex.source, "g");
  while ((m = kr.exec(line)) !== null) {
    if (!matches.some(x => m!.index >= x.index && m!.index < x.index + x.length))
      matches.push({ index: m.index, length: m[0].length, type: "keyword", text: m[0] });
  }

  matches.sort((a, b) => a.index - b.index);

  const result: React.ReactNode[] = [];
  let cursor = 0;
  for (const seg of matches) {
    if (seg.index > cursor) result.push(<span key={cursor}>{line.slice(cursor, seg.index)}</span>);
    const color = seg.type === "string" ? "#9ECE6A" : seg.type === "keyword" ? "#BB9AF7" : "#E0AF68";
    result.push(<span key={seg.index} style={{ color }}>{seg.text}</span>);
    cursor = seg.index + seg.length;
  }
  if (cursor < line.length) result.push(<span key={cursor}>{line.slice(cursor)}</span>);
  return <>{result}</>;
}
