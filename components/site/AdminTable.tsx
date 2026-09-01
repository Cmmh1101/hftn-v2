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
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div
        className="gap-2 border-b border-border bg-surface-soft px-5 py-3 text-[11.5px] font-bold tracking-wide text-label"
        style={{ display: "grid", gridTemplateColumns: gridTemplate }}
      >
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      {children}
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
      className="items-center gap-2 border-b border-border-softer px-5 py-3.5 text-sm last:border-b-0"
      style={{ display: "grid", gridTemplateColumns: gridTemplate }}
    >
      {children}
    </div>
  );
}
