"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Photo } from "@/components/ui/Photo";

export type ProgramCardData = {
  id: string;
  name: string;
  categoryLabel: string;
  typeLabel: string;
  regionLabel: string;
  participants: number;
  summary: string;
  photo_path: string | null;
  websiteUrl: string | null;
};

export function ProgramCard({
  program,
  regionFieldLabel,
  participantsFieldLabel,
  visitWebsiteLabel,
}: {
  program: ProgramCardData;
  regionFieldLabel: string;
  participantsFieldLabel: string;
  visitWebsiteLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-left">
        <Card padding="none" className="cursor-pointer overflow-hidden transition-colors hover:border-blue">
          <Photo path={program.photo_path} alt={program.name} aspect="4/3" label={`PHOTO — ${program.name}`} rounded="0" />
          <div className="p-5">
            <span className="text-[11px] font-bold tracking-wide text-blue">{program.categoryLabel.toUpperCase()}</span>
            <h3 className="mt-2 font-serif text-[19px]">{program.name}</h3>
            <p className="mt-2 text-[13.5px] leading-normal text-muted">{program.summary}</p>
          </div>
        </Card>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border-soft p-5">
              <div>
                <span className="text-[11px] font-bold tracking-wide text-blue">
                  {program.categoryLabel.toUpperCase()} · {program.typeLabel.toUpperCase()}
                </span>
                <h3 className="mt-1.5 font-serif text-xl font-semibold">{program.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer text-xl leading-none text-muted-2 hover:text-ink"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <Photo path={program.photo_path} alt={program.name} aspect="16/9" rounded="8px" className="mb-4" />
              <div className="mb-3 flex gap-5 text-xs text-muted-2">
                <span>
                  {regionFieldLabel}: <strong className="text-ink">{program.regionLabel}</strong>
                </span>
                {program.participants > 0 ? (
                  <span>
                    {participantsFieldLabel}: <strong className="text-ink">{program.participants.toLocaleString()}</strong>
                  </span>
                ) : null}
              </div>
              <p className="text-[14.5px] leading-relaxed text-muted">{program.summary}</p>
              {program.websiteUrl ? (
                <a
                  href={program.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-bold text-blue hover:text-blue-hover"
                >
                  {visitWebsiteLabel} →
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
