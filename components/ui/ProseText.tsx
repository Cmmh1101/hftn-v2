import { cn } from "@/lib/cn";

/**
 * Plain-text long descriptions written in the admin: blank line = new paragraph,
 * "## " starts a subheading, and a block whose lines all start with "- " is a
 * bullet list. Rendered as text nodes only, so nothing typed can inject markup.
 */
export function ProseText({ text, className }: { text: string; className?: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={cn("flex flex-col gap-4 text-base leading-relaxed text-muted lg:text-[17px]", className)}>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h3 key={i} className="mt-3 font-serif text-xl font-semibold text-ink">
              {block.slice(3)}
            </h3>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}
