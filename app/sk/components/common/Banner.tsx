"use client";
import React from "react";
import { usePathname } from "next/navigation";
import S from "./banner.module.scss";

export type BannerItem = {
  path: string;
  title: string;
  desc: string;
  image?: string;
};

export default function Banner({ items }: { items: BannerItem[] }) {
  const pathname = usePathname();

  // 이 컴포넌트는 /sk 하위에서만 사용되므로, 비교 시 /sk prefix를 고려
  const current = React.useMemo(() => {
    if (!pathname) return undefined;
    // 정확히 일치하는 항목만 노출
    return items.find((b) => pathname === `/sk${b.path}`);
  }, [items, pathname]);

  if (!current) return null;

  return (
    <section className={S.banner} aria-label="페이지 배너">
      <div className={S.banner__inner}>
        <h2 className={S.banner__title}>{current.title}</h2>
        <p className={S.banner__desc}>{current.desc}</p>
      </div>
    </section>
  );
}
