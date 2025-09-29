"use client";
/**
 * BreadCrumb 컴포넌트
 * - 목적: 현재 경로(usePathname)를 기준으로 헤더 메뉴 트리(skHeaderMenus)에서
 *   가장 구체적으로 일치하는 경로 체인을 찾아 "홈 > 1depth > 2depth > 3depth" 형태로 표시합니다.
 * - 유지보수 포인트:
 *   1) 메뉴 데이터 의존: 각 테넌트의 메뉴 트리(예: skHeaderMenus) 각 depth에는 href가 반드시 채워져야 합니다.
 *      빈 문자열("")이거나 중복/충돌되는 href가 있으면 startsWith 매칭이 잘못될 수 있습니다.
 *   2) 매칭 방식: pathname.startsWith(href) 기반의 가장 긴(가장 구체적) 일치 체인을 선택합니다.
 *      예: "/sk/support" vs "/sk/support/faq" → 더 긴 "/sk/support/faq"가 우선됩니다.
 *   3) 확장: 현재는 최대 3depth까지 탐색합니다. 필요 시 4depth 이상은 동일 패턴으로 반복문을 확장하거나
 *      메뉴 탐색을 재귀 함수로 리팩터링하세요.
 *   4) 홈 화면 처리: 홈("/" 또는 테넌트 홈, 예: "/sk"/"/cap"/"/adt")에서는 브레드크럼을 렌더하지 않습니다(null 반환).
 *   5) 접근성: <nav aria-label="breadcrumb">, <ol>/<li>, 마지막 항목 aria-current="page" 적용.
 *   6) 멀티 테넌트: pathname에서 테넌트 키(sk/cap/adt)를 추출하여 테넌트별 메뉴를 선택합니다.
 *      메뉴가 준비되지 않은 테넌트의 경우 URL 세그먼트 기반의 대체 크럼을 생성합니다.
 */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import S from "./breadCrumb.module.scss";
import { skHeaderMenus } from "../../layouts/menus";
import { isTenantPath, TenantKey } from "@/lib/tenant";

/**
 * 표시용 크럼 단위 타입
 */
type Crumb = { label: string; href: string };

type HeaderMenuNode = {
  label: string;
  href: string;
  children?: HeaderMenuNode[];
};

/**
 * 현재 pathname과 메뉴 트리(skHeaderMenus)를 비교해 브레드크럼 체인을 계산합니다.
 * - 입력: pathname (예: "/sk/support/faq")
 * - 출력: [{label:"홈", href:"/sk"}, {label:"고객지원", href:"/sk/support"}, {label:"FAQ", href:"/sk/support/faq"}]
 * - 규칙: startsWith 기반으로 가장 긴 일치 체인을 선택(우선순위: 3depth > 2depth > 1depth)
 */
function findBreadcrumbByPath(
  pathname: string,
  tenant: TenantKey | null,
  menuTree: HeaderMenuNode[]
): Crumb[] {
  const homeHref = tenant ? `/${tenant}` : "/";
  const crumbs: Crumb[] = [{ label: "홈", href: homeHref }];

  if (!pathname || pathname === "/" || pathname === homeHref) {
    return crumbs;
  }

  let bestChain: Crumb[] = [];

  // 1depth → 2depth → 3depth 순회하며 가장 구체적으로 일치하는 체인을 선택
  for (const first of menuTree) {
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
            const thirdHref = third.href || "";
            const thirdMatch = thirdHref && pathname.startsWith(thirdHref);
            if (thirdMatch) {
              currentBest = [
                { label: first.label, href: firstHref },
                { label: second.label, href: secondHref },
                { label: third.label, href: thirdHref },
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

  // 메뉴 트리에 일치하는 항목이 없다면 URL 세그먼트 기반으로 대체 크럼 생성
  const segments = pathname
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean);
  const startIndex = tenant ? 1 : 0; // /{tenant}/... 인 경우 첫 세그먼트는 테넌트
  let accum = tenant ? `/${tenant}` : "";
  for (let i = startIndex; i < segments.length; i += 1) {
    accum += `/${segments[i]}`;
    const label = decodeURIComponent(segments[i]).replace(/-/g, " ");
    crumbs.push({ label, href: accum });
  }
  return crumbs;
}

export default function BreadCrumb() {
  const pathname = usePathname();
  // pathname에서 테넌트를 추출하여 테넌트별 메뉴 트리를 사용
  const tenantMatch = pathname?.match(/^\/(sk|cap|adt)\b/);
  const tenant = tenantMatch ? (tenantMatch[1] as TenantKey) : null;

  const menuRegistry: Partial<Record<TenantKey, HeaderMenuNode[]>> = {
    sk: skHeaderMenus as unknown as HeaderMenuNode[],
    // cap, adt 메뉴가 준비되면 아래에 연결하세요.
    cap: [],
    adt: [],
  };

  const crumbs = findBreadcrumbByPath(
    pathname,
    tenant,
    menuRegistry[tenant ?? "sk"] ?? []
  );

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
                <span className={S.breadCrumb__separator}>{" | "}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
