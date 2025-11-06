"use client";

import useBreakpoint from "@/hooks/useBreakpoint";

export type ColumnsConfig = {
  desktop: number;
  tablet?: number;
  mobile?: number;
};

export default function useResponsiveColumns(config: ColumnsConfig): number {
  const { isMobile, isTablet } = useBreakpoint();

  if (isMobile) return config.mobile ?? 1;
  if (isTablet) return config.tablet ?? config.desktop;
  return config.desktop;
}
