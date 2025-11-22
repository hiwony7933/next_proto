"use client";
/**
 * BreadCrumb 컴포넌트
 * - 목적: 현재 경로(usePathname)를 기준으로 헤더 메뉴 트리에서
 *   가장 구체적으로 일치하는 경로 체인을 찾아 "홈 > 1depth > 2depth > 3depth" 형태로 표시합니다.
 */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import S from "./breadCrumb.module.scss";
import { TenantKey } from "@/lib/tenant";

type HeaderThirdMenu = {
  label: string;
  href: string;
};

type HeaderSecondMenu = {
  label: string;
  href: string;
  children?: HeaderThirdMenu[];
};

type HeaderMenuItem = {
  label: string;
  href: string;
  children?: HeaderSecondMenu[];
};

type Crumb = { label: string; href: string };

type HeaderMenuNode = {
  items: HeaderMenuItem[];
  label: string;
  href: string;
  children?: HeaderMenuNode[];
};

function stripTenantPrefix(href: string): string {
  if (!href) return href;
  const noTenant = href.replace(/^\/(sk|cap|adt)(?=\b|\/)/, "");
  return noTenant || "/";
}

function findBreadcrumbByPath(
  pathname: string,
  tenant: TenantKey | null,
  menuTree: HeaderMenuNode[],
  pathnameHasTenantPrefix: boolean
): Crumb[] {
  const homeHref = pathnameHasTenantPrefix && tenant ? `/${tenant}` : "/";
  const crumbs: Crumb[] = [{ label: "홈", href: homeHref }];

  if (!pathname || pathname === "/" || pathname === homeHref) {
    return crumbs;
  }

  let bestChain: Crumb[] = [];

  for (const first of menuTree) {
    const firstHref = first.href || "";
    const firstHrefNoTenant = stripTenantPrefix(firstHref);
    const firstMatch =
      (firstHref && pathname.startsWith(firstHref)) ||
      (firstHrefNoTenant && pathname.startsWith(firstHrefNoTenant));

    if (firstMatch) {
      let currentBest: Crumb[] = [
        {
          label: first.label,
          href: pathnameHasTenantPrefix ? firstHref : firstHrefNoTenant,
        },
      ];

      for (const second of first.children ?? []) {
        const secondHref = second.href || "";
        const secondHrefNoTenant = stripTenantPrefix(secondHref);
        const secondMatch =
          (secondHref && pathname.startsWith(secondHref)) ||
          (secondHrefNoTenant && pathname.startsWith(secondHrefNoTenant));
        if (secondMatch) {
          currentBest = [
            {
              label: first.label,
              href: pathnameHasTenantPrefix ? firstHref : firstHrefNoTenant,
            },
            {
              label: second.label,
              href: pathnameHasTenantPrefix ? secondHref : secondHrefNoTenant,
            },
          ];

          for (const third of second.children ?? []) {
            const thirdHref = third.href || "";
            const thirdHrefNoTenant = stripTenantPrefix(thirdHref);
            const thirdMatch =
              (thirdHref && pathname.startsWith(thirdHref)) ||
              (thirdHrefNoTenant && pathname.startsWith(thirdHrefNoTenant));
            if (thirdMatch) {
              currentBest = [
                {
                  label: first.label,
                  href: pathnameHasTenantPrefix ? firstHref : firstHrefNoTenant,
                },
                {
                  label: second.label,
                  href: pathnameHasTenantPrefix
                    ? secondHref
                    : secondHrefNoTenant,
                },
                {
                  label: third.label,
                  href: pathnameHasTenantPrefix ? thirdHref : thirdHrefNoTenant,
                },
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

  if (bestChain.length > 0) {
    return [...crumbs, ...bestChain];
  }

  const segments = pathname
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean);
  const startIndex = pathnameHasTenantPrefix ? 1 : 0;
  let accum = pathnameHasTenantPrefix ? `/${tenant}` : "";
  for (let i = startIndex; i < segments.length; i += 1) {
    accum += `/${segments[i]}`;
    const label = decodeURIComponent(segments[i]).replace(/-/g, " ");
    crumbs.push({ label, href: accum });
  }
  return crumbs;
}

export default function BreadCrumb({ items }: { items: HeaderMenuItem[] }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const tenantMatch = pathname?.match(/^\/(sk|cap|adt)\b/);
  let tenant = tenantMatch ? (tenantMatch[1] as TenantKey) : null;
  const pathnameHasTenantPrefix = Boolean(tenantMatch);
  if (!tenant && typeof window !== "undefined") {
    const m = window.location.hostname.match(/^(sk|cap|adt)\./);
    if (m) tenant = m[1] as TenantKey;
  }

  const menuRegistry: Partial<Record<TenantKey, HeaderMenuNode[]>> = {
    sk: items as unknown as HeaderMenuNode[],
    cap: items as unknown as HeaderMenuNode[],
    adt: items as unknown as HeaderMenuNode[],
  };

  const crumbs = findBreadcrumbByPath(
    pathname,
    tenant,
    menuRegistry[tenant ?? "sk"] ?? [],
    pathnameHasTenantPrefix
  );

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
                <span className={S.breadCrumb__separator}>{" | "}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
