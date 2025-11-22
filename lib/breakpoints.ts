export const mobileMax = 719; // ≤719px
export const tabletMin = 720; // 720–1023px
export const tabletMax = 1023;
export const desktopMin = 1024; // ≥1024px

export const mediaQueries = {
  mobile: `(max-width: ${mobileMax}px)`,
  tablet: `(min-width: ${tabletMin}px) and (max-width: ${tabletMax}px)`,
  desktop: `(min-width: ${desktopMin}px)`,
} as const;

export type BreakpointName = "mobile" | "tablet" | "desktop";
