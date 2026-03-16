type CodeProps = {
  /** The code to render. Can be a single string or an array of lines. */
  code: string | string[];
  /** Render inline (no line breaks) */
  inline?: boolean;
};

const OPERATOR_REGEX =
  /(?:=>|===|!==|==|!=|<=|>=|&&|\|\||\+|\-|\*|\/|%|\?|:|\.|,|;|\(|\)|\{|\}|\[|\]|=)/g;

function tokenizeLine(line: string) {
  const tokens: Array<{ text: string; isOperator: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = OPERATOR_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: line.slice(lastIndex, match.index),
        isOperator: false,
      });
    }
    tokens.push({ text: match[0], isOperator: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), isOperator: false });
  }

  return tokens;
}

export default function Code({ code, inline }: CodeProps) {
  const lines = Array.isArray(code) ? code : code.split("\n");

  const inlineClassName =
    "rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs";
  const blockClassName =
    "rounded bg-slate-100 p-3 font-mono text-xs overflow-x-auto";

  const lineElements = lines.map((line, lineIndex) => (
    <div key={lineIndex} className="whitespace-pre">
      {tokenizeLine(line).map((token, tokenIndex) => (
        <span
          key={tokenIndex}
          className={token.isOperator ? "text-sky-600" : undefined}
        >
          {token.text}
        </span>
      ))}
    </div>
  ));

  if (inline) {
    return <code className={inlineClassName}>{lineElements}</code>;
  }

  return (
    <pre className={blockClassName}>
      <code>{lineElements}</code>
    </pre>
  );
}
