"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";

type JornadaEntry = {
  id: string;
  name: string;
  dateLabel: string;
  regionLabel: string;
  summary: string;
  photo_path: string | null;
};

type TypeGroup = {
  type: string;
  label: string;
  entries: JornadaEntry[];
};

export function JornadaTypesSection({ groups }: { groups: TypeGroup[] }) {
  const [openType, setOpenType] = useState<string | null>(null);
  const active = groups.find((g) => g.type === openType) ?? null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-5">
        {groups.map((g) => (
          <button key={g.type} type="button" onClick={() => setOpenType(g.type)} className="text-left">
            <Card className="cursor-pointer text-center transition-colors hover:border-blue">
              <div className="text-[13px] font-bold">{g.label}</div>
              <div className="mt-1 text-[11px] text-muted-2">{g.entries.length}</div>
            </Card>
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenType(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-soft p-5">
              <h3 className="font-serif text-xl font-semibold">{active.label}</h3>
              <button
                type="button"
                onClick={() => setOpenType(null)}
                className="cursor-pointer text-xl leading-none text-muted-2 hover:text-ink"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto p-5">
              {active.entries.map((entry) => (
                <div key={entry.id} className="flex gap-4 border-b border-border-soft pb-4 last:border-b-0 last:pb-0">
                  <Photo path={entry.photo_path} alt={entry.name} aspect="1" rounded="6px" className="w-20 shrink-0" />
                  <div>
                    <div className="font-semibold">{entry.name}</div>
                    <div className="mt-0.5 text-xs text-muted-2">
                      {[entry.dateLabel, entry.regionLabel].filter(Boolean).join(" · ")}
                    </div>
                    {entry.summary ? <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{entry.summary}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
