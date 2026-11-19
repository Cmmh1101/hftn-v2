export function AdminTable({
  columns,
  gridTemplate,
  children,
}: {
  columns: string[];
  gridTemplate: string;
  children: React.ReactNode;
}) {
  return (
    // Narrow screens scroll the table sideways inside its card instead of squeezing
    // six columns into a phone, which would make every cell unreadable.
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <div className="min-w-[680px]">
        <div
          className="gap-2 border-b border-border bg-surface-soft px-5 py-3 text-[12.5px] font-bold tracking-wide text-label"
          style={{ display: "grid", gridTemplateColumns: gridTemplate }}
        >
          {columns.map((c, i) => (
            <span key={`${i}-${c}`}>{c}</span>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminTableRow({
  gridTemplate,
  children,
}: {
  gridTemplate: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="items-center gap-2 border-b border-border-softer px-5 py-3.5 text-[15px] last:border-b-0"
      style={{ display: "grid", gridTemplateColumns: gridTemplate }}
    >
      {children}
    </div>
  );
}
