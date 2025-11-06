"use client";
import useBreakpoint from "@/hooks/useBreakpoint";
import HeaderDesktop from "./headerDesktop";
import HeaderMobile from "./headerMobile";

export default function Header() {
  const { isMobile, isTablet } = useBreakpoint();
  return isMobile || isTablet ? <HeaderMobile /> : <HeaderDesktop />;
}
