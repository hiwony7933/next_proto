"use client";
import React from "react";
import S from "./header.module.scss";
import Link from "next/link";
import { skHeaderMenus } from "./menus";
import MzButton from "@/app/common/components/ui/mzButton";
import Image from "next/image";
import skLogo from "@/public/images/sk/sk_logo.svg";

export default function Header() {
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
  return (
    <header className={S.header} role="banner">
      <div className={S["header__inner-container"]}>
        <div className={S["header__inner"]}>
          <div className={S["header__inner-left"]}>
            <Image
              src={skLogo}
              alt="쉴더스 로고"
              width={100}
              height={100}
              priority
            />
            <nav
              className={S["header__menus"]}
              aria-label="주요 메뉴"
              onMouseEnter={handleOpen}
              onMouseLeave={handleClose}
            >
              {menus.map((menu, index) => (
                <Link
                  className={S["header__menu-link"]}
                  key={menu.label}
                  href={menu.href.startsWith("/") ? menu.href : `/${menu.href}`}
                  aria-label={menu.label}
                  onMouseEnter={() => handleActivate(index)}
                  onFocus={() => handleActivate(index)}
                  onClick={handleItemClick}
                  onKeyDown={handleItemKeyDown}
                >
                  {menu.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className={S["header__inner-right"]}>
            <MzButton>검색</MzButton>
            <MzButton>KR</MzButton>
            <MzButton>ADT캡스</MzButton>
            <MzButton>캡스홈</MzButton>
          </div>
        </div>
        <div
          className={`${S["header__menu-open"]} ${isMenuOpen ? S["header__menu-open--visible"] : ""}`}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div
            className={S["header__menu-open-inner"]}
            role="tree"
            aria-label="하위 메뉴"
          >
            {activeMenuIndex !== null && menus[activeMenuIndex]?.children && (
              <ul className={S["header__tree"]} role="group">
                {menus[activeMenuIndex].children.map((second) => {
                  const hasThird =
                    Array.isArray(second.children) &&
                    second.children.length > 0;
                  return (
                    <li
                      key={second.label}
                      className={S["header__tree-item"]}
                      role="treeitem"
                      aria-expanded={hasThird ? true : undefined}
                    >
                      <Link
                        className={S["header__menu-children-link"]}
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
                        <ul className={S["header__tree-group"]} role="group">
                          {second.children!.map((third) => (
                            <li
                              key={third.label}
                              className={S["header__tree-item"]}
                              role="treeitem"
                            >
                              <Link
                                className={S["header__menu-children-link"]}
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
