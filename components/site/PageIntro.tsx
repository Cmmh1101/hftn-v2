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
      <span className="text-[13px] font-bold uppercase tracking-[2px] text-blue">{eyebrow}</span>
      <h1 className="mt-3.5 font-serif text-[34px] font-semibold sm:text-[42px]">{title}</h1>
      {intro ? <p className="mt-4 max-w-[680px] text-lg leading-relaxed text-muted lg:text-xl">{intro}</p> : null}
    </div>
  );
}
