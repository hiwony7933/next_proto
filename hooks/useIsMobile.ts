"use client";

import { useEffect, useState } from "react";

/**
 * 의존성 없는 모바일 감지 훅
 * - 기본 임계값: 1270px 이하를 모바일로 간주
 * - SSR 초기 렌더에서는 false로 시작하고, 클라이언트에서 동기화됩니다.
 */
export default function useIsMobile(breakpoint: number = 1270) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    };

    // 초기 동기화
    handleChange(mql);

    // 이벤트 바인딩 (표준/구버전 호환)
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleChange as (ev: Event) => void);
      return () =>
        mql.removeEventListener("change", handleChange as (ev: Event) => void);
    } else if (typeof mql.addListener === "function") {
      mql.addListener(handleChange as (m: MediaQueryList) => void);
      return () =>
        mql.removeListener(handleChange as (m: MediaQueryList) => void);
    }
  }, [breakpoint]);

  return isMobile;
}
