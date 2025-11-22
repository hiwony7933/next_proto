"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { mediaQueries } from "@/lib/breakpoints";

export type BreakpointState = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  current: "mobile" | "tablet" | "desktop";
};

export default function useBreakpoint(): BreakpointState {
  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);

  let current: BreakpointState["current"] = "desktop";
  if (isMobile) current = "mobile";
  else if (isTablet) current = "tablet";

  return { isMobile, isTablet, isDesktop, current };
}
