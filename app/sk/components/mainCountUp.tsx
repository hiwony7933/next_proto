"use client";
import React, { useEffect, useRef, useState } from "react";

type MainCountUpProps = {
  end: number;
  start?: number;
  durationMs?: number;
  className?: string;
  startOnView?: boolean;
  threshold?: number;
  useGrouping?: boolean;
  format?: (value: number) => string;
  once?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function MainCountUp({
  end,
  start = 0,
  durationMs = 1500,
  className,
  startOnView = true,
  threshold = 0.2,
  useGrouping = false,
  format,
  once = true,
  ...rest
}: MainCountUpProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const [display, setDisplay] = useState<number>(start);

  useEffect(() => {
    if (!elementRef.current) return;

    const animate = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setDisplay(start);

      const fromValue = start;
      const toValue = end;
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1);
        const current = Math.floor(
          fromValue + (toValue - fromValue) * progress
        );
        setDisplay(current);
        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(step);
        } else {
          setDisplay(toValue);
          if (!once) {
            startedRef.current = false;
          }
          if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
        }
      };

      rafIdRef.current = requestAnimationFrame(step);
    };

    if (!startOnView) {
      animate();
      return () => {
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (once) {
            observer.unobserve(entry.target);
          }
          animate();
        });
      },
      { root: null, threshold }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [end, start, durationMs, startOnView, threshold, once]);

  const isProgressbar = (rest as any).role === "progressbar";
  const progressA11y: React.AriaAttributes = isProgressbar
    ? {
        "aria-valuemin": start,
        "aria-valuenow": display,
        "aria-valuemax": end,
      }
    : {};

  const text =
    typeof format === "function"
      ? format(display)
      : useGrouping
        ? display.toLocaleString("ko-KR")
        : String(display);

  return (
    <span ref={elementRef} className={className} {...rest} {...progressA11y}>
      {text}
    </span>
  );
}
