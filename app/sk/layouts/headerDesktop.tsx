"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import S from "./header.module.scss";
import Link from "next/link";
import { skHeaderMenus } from "../components/data/mainPage";
import MzButton from "@/app/common/components/atom/mzButton";
import Image from "next/image";
import HeaderBanner from "@/app/common/components/organism/headerBanner";
import { useHeaderStore } from "@/stores/headerStore";
import skLogo from "@/public/images/sk/sk_logo.svg";
import headerLogoAdt from "@/public/images/common/header_logo_adt.svg";
import headerLogoHome from "@/public/images/common/header_logo_home.svg";
import MzSelectBox from "@/app/common/components/atom/mzSelectBox";
import MzInputText from "@/app/common/components/atom/mzInputText";

type MenuItem = {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
  width?: string;
};

export default function HeaderDesktop() {
  const menus = skHeaderMenus;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  const handleOpen = () => setIsMenuOpen(true);
  const handleClose = () => setIsMenuOpen(false);
  const handleActivate = (index: number) => {
    setActiveMenuIndex(index);
    setIsMenuOpen(true);
  };
  const handleItemClick = () => {
    setIsMenuOpen(false);
    setActiveMenuIndex(null);
  };
  const handleItemKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      setIsMenuOpen(false);
      setActiveMenuIndex(null);
    }
  };
  const handleSearch = () => {
    setIsSearchOpen(true);
  };
  const headerHidden = useHeaderStore((s) => s.headerHidden);

  const activeChildren = useMemo((): MenuItem[] | null => {
    if (activeMenuIndex === null) return null;
    const ch = (menus[activeMenuIndex] as MenuItem | undefined)?.children;
    return Array.isArray(ch) ? (ch as MenuItem[]) : null;
  }, [activeMenuIndex, menus]);
  const [selectedLanguage, setSelectedLanguage] = useState("KR");
  const navRef = useRef<HTMLDivElement | null>(null);
  const menuOpenInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateLeft = () => {
      const navEl = navRef.current;
      if (!navEl) return;
      const firstLink = navEl.querySelector(
        `.${S.header__menuLink}`
      ) as HTMLElement | null;
      if (!firstLink) return;
      const firstLeft = firstLink.getBoundingClientRect().left;
      const innerEl = menuOpenInnerRef.current;
      let offset = Math.max(0, Math.round(firstLeft));
      if (innerEl) {
        const innerLeft = innerEl.getBoundingClientRect().left;
        offset = Math.max(0, Math.round(firstLeft - innerLeft));
        innerEl.style.setProperty("--menu-open-left", `${offset}px`);
      } else if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          "--menu-open-left",
          `${offset}px`
        );
      }
    };
    updateLeft();
    window.addEventListener("resize", updateLeft);
    return () => window.removeEventListener("resize", updateLeft);
  }, [isMenuOpen]);

  const PopularSearch = () => {
    const popularSearch = [
      {
        label: "AI CCTV",
        href: "/",
      },
      {
        label: "스마트오더",
        href: "/",
      },
      {
        label: "무인주차솔루션",
        href: "/",
      },
      {
        label: "매장보안 개인정보보호법",
        href: "/",
      },

      {
        label: "테이블 오더",
        href: "/",
      },
      {
        label: "무인 매장 솔루션",
        href: "/",
      },
      {
        label: "스마트 냉난방",
        href: "/",
      },
      {
        label: "병원 솔루션",
        href: "/",
      },
      {
        label: "출동 경비",
        href: "/",
      },
      {
        label: "무인주차 고객센터번호",
        href: "/",
      },
    ];
    return popularSearch.map((item, index) => (
      <li key={index} className={S.header__searchOpen__popular__listItem}>
        <Link href={item.href}>{item.label}</Link>
      </li>
    ));
  };
  return (
    <header
      className={`${S.header} ${headerHidden ? S.headerHidden : ""}`}
      aria-hidden={headerHidden}
    >
      <HeaderBanner />
      <div className={S.header__innerContainer}>
        <Link href="/">
          <Image src={skLogo} alt="쉴더스 로고" width={85} priority />
        </Link>
        <div
          className={`${S.header__inner} ${isSearchOpen ? S.header__innerSearchOpen : ""}`}
        >
          <nav
            ref={navRef}
            className={S.header__menus}
            aria-label="주요 메뉴"
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            {menus.map((menu, index) => (
              <div
                className={S.header__menuLink}
                key={menu.label}
                aria-label={menu.label}
                onMouseEnter={() => handleActivate(index)}
                onFocus={() => handleActivate(index)}
                onClick={() => handleActivate(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleActivate(index);
                  }
                }}
              >
                {menu.label}
              </div>
            ))}
          </nav>

          <div className={S.header__innerRight}>
            <div className={S.header__innerRight__logo}>
              <MzButton
                size="Medium"
                style={{
                  backgroundColor: "#003594",
                  gap: "4px",
                  padding: "14px",
                }}
              >
                <Image
                  src={headerLogoAdt}
                  alt="ADT 로고"
                  width={73}
                  height={24}
                />
                <i className="icon__16_right_up" aria-hidden="true" />
              </MzButton>
              <MzButton
                size="Medium"
                style={{
                  backgroundColor: "#025AFC",
                  gap: "4px",
                  padding: "14px",
                }}
              >
                <Image
                  src={headerLogoHome}
                  alt="Home 로고"
                  width={56}
                  height={25}
                />
                <i className="icon__16_right_up" aria-hidden="true" />
              </MzButton>
            </div>
            <div className={S.header__innerRight__actions}>
              <MzButton
                onClick={handleSearch}
                icon
                aria-label="검색"
                className={`${"icon__24_search"} `}
                style={{ backgroundColor: "#333" }}
              />
              <MzSelectBox
                borderless={true}
                options={[
                  { label: "KR", value: "KR" },
                  { label: "EN", value: "EN" },
                ].map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                selected={selectedLanguage}
                onSelect={(v) => {
                  setSelectedLanguage(v);
                  console.log(v);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${S.header__menuOpen} ${isMenuOpen ? S.header__menuOpenVisible : ""}`}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <div
          ref={menuOpenInnerRef}
          className={S.header__menuOpenInner}
          role="tree"
          aria-label="하위 메뉴"
        >
          {activeChildren && (
            <ul className={S.header__tree} role="group">
              {activeChildren.map((second: MenuItem) => {
                const hasThird =
                  Array.isArray(second.children) && second.children.length > 0;
                return (
                  <li
                    key={second.label}
                    className={S.header__treeItem}
                    role="treeitem"
                    aria-expanded={hasThird ? true : undefined}
                  >
                    <Link
                      className={S.header__menuChildrenLink}
                      href={
                        second.href.startsWith("/")
                          ? second.href
                          : `/${second.href}`
                      }
                      aria-label={second.label}
                      onClick={handleItemClick}
                      onKeyDown={handleItemKeyDown}
                    >
                      {second.label}
                    </Link>
                    {hasThird && (
                      <ul className={S.header__treeGroup} role="group">
                        {second.children!.map((third: MenuItem) => (
                          <li
                            key={third.label}
                            className={S.header__treeItem}
                            role="treeitem"
                          >
                            <Link
                              style={third.width ? { width: third.width } : {}}
                              className={S.header__menuThirdLink}
                              href={
                                third.href.startsWith("/")
                                  ? third.href
                                  : `/${third.href}`
                              }
                              aria-label={third.label}
                              onClick={handleItemClick}
                              onKeyDown={handleItemKeyDown}
                            >
                              {third.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className={S.header__bannerArea}>
          <div className={S.header__bannerArea__item}>
            <div className={S.header__bannerArea__item__title}>
              뉴스레터 구독신청
            </div>
            <div className={S.header__bannerArea__item__description}>
              영상으로 보는 사이버보안 인사이트
              <br /> 공식 유튜브채널에서 만나보세요.
            </div>
          </div>
          <div className={S.header__bannerArea__item}>
            <div className={S.header__bannerArea__item__title}>
              뉴스레터 구독신청
            </div>
            <div className={S.header__bannerArea__item__description}>
              영상으로 보는 사이버보안 인사이트
              <br /> 공식 유튜브채널에서 만나보세요.
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${S.header__searchOpen} ${isSearchOpen ? S.header__searchOpenVisible : ""} `}
      >
        <div className={S.header__searchOpen__container}>
          <div className={S.header__searchOpen__close}>
            <MzButton size="Large" icon onClick={() => setIsSearchOpen(false)}>
              <i className="icon__20_close" aria-hidden="true" />
            </MzButton>
          </div>
          <div className={S.header__searchOpen__inner}>
            <div className={S.header__searchOpen__input}>
              <MzInputText
                placeholder="검색어를 입력해주세요."
                onChange={(e) => console.log(e.target.value)}
                search={true}
                onSearch={(q) => console.log(q)}
              />
            </div>
            <div className={S.header__searchOpen__popular}>
              <p className={S.header__searchOpen__popular__title}>
                지금 많이 찾는 검색어
              </p>
              <ul className={S.header__searchOpen__popular__list}>
                <PopularSearch></PopularSearch>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
