"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Splits "$300K", "4,500+", "50+" into prefix / number / suffix so only the
// number animates. Anything that doesn't parse (e.g. "Many") renders as-is.
const PATTERN = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

function format(n: number, withCommas: boolean, decimals: number) {
  const fixed = n.toFixed(decimals);
  return withCommas ? Number(fixed).toLocaleString("en-US", { minimumFractionDigits: decimals }) : fixed;
}

export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const match = value.match(PATTERN);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useLayoutEffect(() => {
    if (!match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, , suffix] = match;
    setDisplay(`${prefix}0${suffix}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const [, prefix, numberText, suffix] = match;
    const target = Number(numberText.replace(/,/g, ""));
    const withCommas = numberText.includes(",");
    const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          setDisplay(`${prefix}${format(target * eased, withCommas, decimals)}${suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
          else setDisplay(value);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
