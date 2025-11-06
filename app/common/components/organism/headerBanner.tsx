"use client";
import React from "react";
import MzButton from "@/app/common/components/atom/mzButton";
import { useHeaderStore } from "@/stores/headerStore";
import S from "./headerBanner.module.scss";

export default function HeaderBanner() {
  const [collapsed, setCollapsed] = React.useState(false);
  const setBannerHeight = useHeaderStore((s) => s.setBannerHeight);
  const bannerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!bannerRef.current) return;
    const el = bannerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      const h = el.offsetHeight || 0;
      setBannerHeight(h);
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--banner-height", `${h}px`);
      }
    });
    resizeObserver.observe(el);
    // 초기값 설정
    const init = el.offsetHeight || 0;
    setBannerHeight(init);
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--banner-height",
        `${init}px`
      );
    }
    return () => resizeObserver.disconnect();
  }, [setBannerHeight]);

  const handleClose = () => setCollapsed(true);

  return (
    <div
      className={`${S.header__topBanner} ${collapsed ? S.header__topBannerCollapsed : ""}`}
      role="banner"
      aria-hidden={collapsed}
      ref={bannerRef}
    >
      <div className={S.header__topBannerText}>
        <span>지금 신청하면 설치비 0원, 우리 공간의 안전을 시작하세요.</span>
      </div>
      <MzButton
        icon
        className={`${S.header__topBannerClose} ${collapsed ? S.header__topBannerCloseCollapsed : ""}`}
        aria-label="탑배너닫기"
        aria-expanded={!collapsed}
        onClick={handleClose}
      >
        <i className="icon__20_close" style={{ backgroundColor: "white" }} />
      </MzButton>
    </div>
  );
}
