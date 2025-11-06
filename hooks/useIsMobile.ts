"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { mediaQueries } from "@/lib/breakpoints";

/**
 * 모바일 여부만 필요할 때 사용하세요.
 * @deprecated useBreakpoint().isMobile 또는 useMediaQuery(mediaQueries.mobile) 사용을 권장합니다.
 * - 기준: 719px 이하를 모바일로 간주(Mobile ≤719, Tablet 720–1023, PC ≥1024)
 */
export default function useIsMobile(): boolean {
  return useMediaQuery(mediaQueries.mobile);
}
