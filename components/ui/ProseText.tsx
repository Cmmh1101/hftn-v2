import { cn } from "@/lib/cn";

type Block =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

// Line-based so a heading may sit directly above its paragraph (no blank line needed).
function parse(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ")) {
      flush();
      blocks.push({ kind: "heading", text: line.slice(3) });
    } else if (line.startsWith("- ")) {
      flush();
      const last = blocks[blocks.length - 1];
      if (last?.kind === "list") last.items.push(line.slice(2));
      else blocks.push({ kind: "list", items: [line.slice(2)] });
    } else paragraph.push(line);
  }
  flush();
  return blocks;
}

/**
 * Plain-text long descriptions written in the admin: blank line = new paragraph,
 * "## " starts a subheading, "- " starts a bullet. Rendered as text nodes only,
 * so nothing typed can inject markup.
 */
export function ProseText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 text-base leading-relaxed text-muted lg:text-[17px]", className)}>
      {parse(text).map((block, i) => {
        if (block.kind === "heading")
          return (
            <h3 key={i} className="mt-3 font-serif text-xl font-semibold text-ink">
              {block.text}
            </h3>
          );
        if (block.kind === "list")
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="whitespace-pre-line">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
