export type BadgeStatus = "Active" | "Published" | "Planned" | "Completed" | "Draft";

const statusClasses: Record<BadgeStatus, string> = {
  Active: "bg-success-bg text-success-fg",
  Published: "bg-success-bg text-success-fg",
  Planned: "bg-blue-soft text-blue",
  Completed: "bg-neutral-bg text-neutral-fg",
  Draft: "bg-neutral-bg text-neutral-fg",
};

export function Badge({ status, children }: { status: BadgeStatus; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block w-fit rounded-full px-2.5 py-1 text-[11.5px] font-bold ${statusClasses[status]}`}
    >
      {children}
    </span>
  );
}
