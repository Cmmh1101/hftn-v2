export function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-strong text-xs font-bold text-accent-ink">
      {initials}
    </div>
  );
}
