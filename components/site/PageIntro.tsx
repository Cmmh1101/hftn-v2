export function PageIntro({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mb-11">
      <span className="text-xs font-bold uppercase tracking-[2px] text-blue">{eyebrow}</span>
      <h1 className="mt-3.5 font-serif text-[42px] font-semibold">{title}</h1>
      {intro ? <p className="mt-4 max-w-[640px] text-base leading-relaxed text-muted">{intro}</p> : null}
    </div>
  );
}
