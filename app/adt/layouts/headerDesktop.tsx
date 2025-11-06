"use client";
import React from "react";
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

type MenuItem = { label: string; href: string; children?: MenuItem[] };

export default function HeaderDesktop() {
  const menus = skHeaderMenus;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = React.useState<number | null>(
    null
  );

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
    console.log("검색");
  };
  const headerHidden = useHeaderStore((s) => s.headerHidden);

  const activeChildren = React.useMemo((): MenuItem[] | null => {
    if (activeMenuIndex === null) return null;
    const ch = (menus[activeMenuIndex] as MenuItem | undefined)?.children;
    return Array.isArray(ch) ? (ch as MenuItem[]) : null;
  }, [activeMenuIndex, menus]);

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
        <div className={S.header__inner}>
          <div className={S.header__innerLeft}>
            <nav
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
                  onClick={handleItemClick}
                  onKeyDown={handleItemKeyDown}
                >
                  {menu.label}
                </div>
              ))}
            </nav>
          </div>

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
              <MzButton
                icon
                aria-label="언어"
                className={`${"icon__24_lang"} `}
                style={{ backgroundColor: "#333" }}
              />
            </div>
          </div>
        </div>
        <div
          className={`${S.header__menuOpen} ${isMenuOpen ? S.header__menuOpenVisible : ""}`}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div
            className={S.header__menuOpenInner}
            role="tree"
            aria-label="하위 메뉴"
          >
            {activeChildren && (
              <ul className={S.header__tree} role="group">
                {activeChildren.map((second: MenuItem) => {
                  const hasThird =
                    Array.isArray(second.children) &&
                    second.children.length > 0;
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
                                className={`${S.header__menuChildrenLink} ${S.thirdMenuLink}`}
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
        </div>
      </div>
    </header>
  );
}
