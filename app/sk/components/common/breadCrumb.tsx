"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import S from "./breadCrumb.module.scss";
import { skHeaderMenus } from "../../layouts/menus";

type Crumb = { label: string; href: string };

function findBreadcrumbByPath(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "홈", href: "/sk" }];

  if (!pathname || pathname === "/" || pathname === "/sk") {
    return crumbs;
  }

  let bestChain: Crumb[] = [];

  for (const first of skHeaderMenus) {
    const firstHref = first.href || "";
    const firstMatch = firstHref && pathname.startsWith(firstHref);

    if (firstMatch) {
      let currentBest: Crumb[] = [{ label: first.label, href: firstHref }];

      for (const second of first.children ?? []) {
        const secondHref = second.href || "";
        const secondMatch = secondHref && pathname.startsWith(secondHref);
        if (secondMatch) {
          currentBest = [
            { label: first.label, href: firstHref },
            { label: second.label, href: secondHref },
          ];

          for (const third of second.children ?? []) {
            const thirdHref = (third as any).href || "";
            const thirdMatch = thirdHref && pathname.startsWith(thirdHref);
            if (thirdMatch) {
              currentBest = [
                { label: first.label, href: firstHref },
                { label: second.label, href: secondHref },
                { label: (third as any).label, href: thirdHref },
              ];
            }
          }
        }
      }

      if (currentBest.length > bestChain.length) {
        bestChain = currentBest;
      }
    }
  }

  return [...crumbs, ...bestChain];
}

export default function BreadCrumb() {
  const pathname = usePathname();
  const crumbs = findBreadcrumbByPath(pathname);

  // 홈 메인에서는 브레드크럼을 감춤
  if (crumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={S.breadCrumb} aria-label="breadcrumb">
      <ol className={S.breadCrumb__list}>
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${item.href}-${index}`} className={S.breadCrumb__item}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
              {!isLast && (
                <span className={S["breadCrumb__separator"]}>{" > "}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
