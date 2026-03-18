import { useEffect, useState } from "react";

type CodeProps = {
  /** The code to render. Can be a single string or an array of lines. */
  code: string | string[];
  /** Render inline (no line breaks) */
  inline?: boolean;
};

const TOKEN_REGEX =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/.*$)|\b(?:import|from|const|let|var|function|return|new|class|extends|implements|interface|type|as|async|await|if|else|switch|case|break|default|for|while|do|try|catch|finally|throw|null|undefined|true|false|in|of|typeof|instanceof|void|delete|export|default)\b|[0-9]+(?:\.[0-9]+)?\b|=>|===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|[+\-*/%]|\.|,|;|:|\(|\)|\{|\}|\[|\]|=/g;

function tokenClass(token: string) {
  if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`"))
    return "text-amber-600 dark:text-amber-400";
  if (token.startsWith("//"))
    return "text-slate-500 dark:text-slate-400 italic";
  if (
    /^(?:import|from|const|let|var|function|return|new|class|extends|implements|interface|type|as|async|await|if|else|switch|case|break|default|for|while|do|try|catch|finally|throw|null|undefined|true|false|in|of|typeof|instanceof|void|delete|export|default)$/.test(
      token,
    ) ||
    /<\w+>/.test(token) // TS generics
  )
    return "text-sky-600 dark:text-sky-300 font-semibold";
  if (/^[0-9]+(?:\.[0-9]+)?$/.test(token))
    return "text-emerald-600 dark:text-emerald-400";
  if (token === ">>")
    return "text-indigo-600 dark:text-indigo-400 font-semibold";
  if (token === "=>") return "text-rose-600 dark:text-rose-400 font-semibold";
  if (token === "===" || token === "!==" || token === "==" || token === "!=")
    return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (token === "<=" || token === ">=")
    return "text-emerald-600 dark:text-emerald-400 font-semibold";
  if (token === "&&" || token === "||")
    return "text-purple-600 dark:text-purple-400 font-semibold";
  if (
    token === "+" ||
    token === "-" ||
    token === "*" ||
    token === "/" ||
    token === "%"
  )
    return "text-amber-600 dark:text-amber-400 font-semibold";
  if (token === "=") return "text-sky-600 dark:text-sky-300 font-semibold";
  if (token === ".") return "text-sky-500 dark:text-sky-300";
  if (token === ",") return "text-emerald-500 dark:text-emerald-300";
  if (token === ";") return "text-pink-500 dark:text-pink-300";
  if (token === ":") return "text-fuchsia-500 dark:text-fuchsia-300";
  if (
    token === "(" ||
    token === ")" ||
    token === "{" ||
    token === "}" ||
    token === "[" ||
    token === "]"
  )
    return "text-slate-600 dark:text-slate-300";
  return "text-slate-700 dark:text-slate-200";
}

function tokenizeLine(line: string) {
  const tokens: Array<{ text: string; className?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: line.slice(lastIndex, match.index),
      });
    }

    const token = match[0];
    tokens.push({ text: token, className: tokenClass(token) });
    lastIndex = match.index + token.length;
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
    "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-900 dark:bg-slate-900 dark:text-slate-100";
  const blockClassName =
    "relative rounded bg-slate-100 p-3 font-mono text-[10px] text-slate-900 dark:bg-slate-800 dark:text-slate-100 overflow-x-auto";

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
        className="absolute cursor-pointer right-2 top-2 z-10 rounded bg-slate-900/80 px-2 py-1 text-xs font-medium text-slate-100 shadow-sm backdrop-blur transition hover:bg-slate-800"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={blockClassName}>
        <code>{lineElements}</code>
      </pre>
    </div>
  );
}
