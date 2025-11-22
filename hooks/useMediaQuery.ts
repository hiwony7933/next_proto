"use client";

import { useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const handleChangeStandard = (e: MediaQueryListEvent) =>
      setMatches(e.matches);
    const handleChangeLegacy = () => setMatches(mql.matches);

    // 초기 동기화
    setMatches(mql.matches);

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener(
        "change",
        handleChangeStandard as unknown as (ev: Event) => void
      );
      return () =>
        mql.removeEventListener(
          "change",
          handleChangeStandard as unknown as (ev: Event) => void
        );
    } else if (typeof mql.addListener === "function") {
      const legacy = (_ev: MediaQueryListEvent) => handleChangeLegacy();
      mql.addListener(
        legacy as unknown as (
          this: MediaQueryList,
          ev: MediaQueryListEvent
        ) => any
      );
      return () =>
        mql.removeListener(
          legacy as unknown as (
            this: MediaQueryList,
            ev: MediaQueryListEvent
          ) => any
        );
    }
  }, [query]);

  return matches;
}
