"use client";
import React from "react";
import S from "./header.module.scss";
import Link from "next/link";
import {
  skHeaderMenus,
  subPageBanner,
} from "@/app/sk/components/data/mainPage";
import { usePathname } from "next/navigation";
import MzButton from "@/app/common/components/atom/mzButton";
import Image from "next/image";
import skLogo from "@/public/images/sk/sk_logo.svg";
import HeaderBanner from "@/app/common/components/organism/headerBanner";
import { useHeaderStore } from "@/stores/headerStore";

export default function HeaderMobile() {
  const headerHidden = useHeaderStore((s) => s.headerHidden);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const currentTitle = React.useMemo(() => {
    if (!pathname) return "";
    const normalized = pathname.startsWith("/sk")
      ? pathname.slice(3)
      : pathname;
    const current = subPageBanner.find(
      (b) => normalized === b.path || normalized.startsWith(`${b.path}/`)
    );
    return current?.title ?? "";
  }, [pathname]);

  const handleSearch = () => {
    console.log("검색");
  };

  const handleMenu = () => {
    console.log("메뉴");
    setIsMenuOpen(true);
  };
  const MobileHeaderMenus = () => {
    return (
      <div className={S.header__mobile__menuOpenInner}>
        {skHeaderMenus.map((menu) => (
          <div className={S.header__menuLink} key={menu.label}>
            {menu.label}
          </div>
        ))}
      </div>
    );
  };
  return (
    <header
      className={`${S.header} ${headerHidden ? S.headerHidden : ""}`}
      aria-hidden={headerHidden}
    >
      {/* 1단: 상단 배너 */}
      <HeaderBanner />
      {/* 2단: 메인 바 (로고/메뉴/오른쪽 아이콘) - 스크롤 시 숨김 */}
      <div className={S.header__innerContainer}>
        <Link href="/">
          <Image src={skLogo} alt="쉴더스 로고" width={64} priority />
        </Link>
        <div className={S.header__inner}>
          <div className={S.header__innerLeft}></div>
          <div className={S.header__innerRight}>
            <MzButton onClick={handleSearch} icon aria-label="검색">
              <i className="icon__32_search" aria-hidden="true" />
            </MzButton>
            <MzButton onClick={handleMenu} icon aria-label="메뉴">
              <i className="icon__32_hamberger" aria-hidden="true" />
            </MzButton>
          </div>
        </div>
      </div>
      {/* 3단: 서브 타이틀 바 - 항상 표시, 고정 */}
      <div
        className={S.header__subTitleBar}
        role="region"
        aria-label="현재 페이지 제목"
      >
        <h2 className={S.header__subTitleText}>{currentTitle}</h2>
      </div>
      <div
        className={`${S.header__mobile__menuOpen} ${isMenuOpen ? S.header__mobile__menuOpenVisible : ""}`}
      >
        {/* <MobileHeaderMenus /> */}
      </div>
    </header>
  );
}
