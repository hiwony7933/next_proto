"use client";
import React from "react";
import { useHeaderStore } from "@/stores/headerStore";
// apply same header hide interaction across all devices

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function ClientMain({ className, children }: Props) {
  const bannerHeight = useHeaderStore((s) => s.bannerHeight);
  const setHeaderHidden = useHeaderStore((s) => s.setHeaderHidden);
  // breakpoint no longer needed for header hide behavior

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    let lastScrollY = window.scrollY || 0;
    let ticking = false;
    const threshold = 20; // 헤더 숨김 시작 임계치
    const delta = 10; // 미세 스크롤 무시

    const update = () => {
      ticking = false;
      const current = window.scrollY || 0;
      const isScrollingDown = current > lastScrollY;
      const isOverThreshold = current > threshold;
      const movedEnough = Math.abs(current - lastScrollY) > delta;

      if (!movedEnough) {
        lastScrollY = current;
        return;
      }

      if (isScrollingDown && isOverThreshold) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }

      lastScrollY = current;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setHeaderHidden]);

  return (
    <main className={className} style={{ paddingTop: 100 + bannerHeight }}>
      {children}
    </main>
  );
}
