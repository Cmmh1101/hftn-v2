"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

type Tone = "success" | "error" | "info";
type ToastItem = { id: number; tone: Tone; message: string };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

// Errors stay longer than confirmations: they usually need to be read and acted on.
const DURATION: Record<Tone, number> = { success: 4500, info: 5000, error: 9000 };
const MAX_VISIBLE = 4;

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const STYLES: Record<Tone, { box: string; icon: string; Icon: typeof Info }> = {
  success: { box: "border-success-fg/30 bg-success-bg text-success-fg", icon: "text-success-fg", Icon: CheckCircle2 },
  error: { box: "border-red-300 bg-red-50 text-red-900", icon: "text-red-700", Icon: AlertCircle },
  info: { box: "border-border bg-surface text-ink", icon: "text-blue", Icon: Info },
};

function ToastView({ toast, onDismiss, dismissLabel }: { toast: ToastItem; onDismiss: () => void; dismissLabel: string }) {
  const [paused, setPaused] = useState(false);
  const { box, icon, Icon } = STYLES[toast.tone];

  // The timer pauses while the pointer or keyboard focus is on the toast, so
  // nobody loses a message they are still reading (or trying to close).
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(onDismiss, DURATION[toast.tone]);
    return () => clearTimeout(timer);
  }, [paused, onDismiss, toast.tone]);

  return (
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "toast-in pointer-events-auto flex w-full max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 shadow-[0_12px_32px_rgba(3,48,124,0.18)]",
        box,
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 h-5 w-5 shrink-0", icon)} />
      <p className="min-w-0 flex-1 text-[15px] font-semibold leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-70 hover:opacity-100"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("feedback");
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((x) => x.id !== id)), []);

  const push = useCallback((tone: Tone, message: string) => {
    if (!message) return;
    setToasts((list) => {
      // The same message twice in a row (double click, retry) replaces itself instead of stacking.
      const rest = list.filter((x) => !(x.tone === tone && x.message === message));
      return [...rest, { id: nextId.current++, tone, message }].slice(-MAX_VISIBLE);
    });
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="region"
        aria-label={t("notifications")}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2.5 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} dismissLabel={t("dismiss")} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
