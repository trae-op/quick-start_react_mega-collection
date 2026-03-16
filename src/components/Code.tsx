import { useEffect, useState } from "react";

type CodeProps = {
  /** The code to render. Can be a single string or an array of lines. */
  code: string | string[];
  /** Render inline (no line breaks) */
  inline?: boolean;
};

const OPERATOR_REGEX =
  /(?:=>|===|!==|==|!=|<=|>=|&&|\|\||\+|\-|\*|\/|%|\?|:|\.|,|;|\(|\)|\{|\}|\[|\]|=)/g;

function operatorClass(op: string) {
  if (op === ">>") return "text-indigo-600"; // not used but reserved for future
  if (op === "=>") return "text-rose-600";
  if (op === "===" || op === "!==" || op === "==" || op === "!=")
    return "text-emerald-600";
  if (op === "<=" || op === ">=") return "text-emerald-600";
  if (op === "&&" || op === "||") return "text-purple-600";
  if (op === "+" || op === "-" || op === "*" || op === "/" || op === "%")
    return "text-amber-600";
  if (op === "=") return "text-sky-600";
  return "text-slate-500";
}

function tokenizeLine(line: string) {
  const tokens: Array<{ text: string; className?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = OPERATOR_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: line.slice(lastIndex, match.index),
      });
    }
    tokens.push({ text: match[0], className: operatorClass(match[0]) });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex) });
  }

  return tokens;
}

export default function Code({ code, inline }: CodeProps) {
  const [copied, setCopied] = useState(false);
  const codeString = Array.isArray(code) ? code.join("\n") : code;
  const lines = codeString.split("\n");

  const inlineClassName =
    "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs";
  const blockClassName =
    "relative rounded bg-slate-100 p-3 font-mono text-xs overflow-x-auto";

  const lineElements = lines.map((line, lineIndex) => (
    <div key={lineIndex} className="whitespace-pre">
      {tokenizeLine(line).map((token, tokenIndex) => (
        <span key={tokenIndex} className={token.className}>
          {token.text}
        </span>
      ))}
    </div>
  ));

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  if (inline) {
    return <code className={inlineClassName}>{lineElements}</code>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onCopy}
        className="absolute cursor-pointer right-2 top-2 z-10 rounded bg-white/80 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={blockClassName}>
        <code>{lineElements}</code>
      </pre>
    </div>
  );
}
