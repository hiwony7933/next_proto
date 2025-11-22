import React from "react";
import S from "./mzPagination.module.scss";
import useBreakpoint from "@/hooks/useBreakpoint";
import MzButton from "../atom/mzButton";

export default function MzPagination({
  className,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <nav
      className={[S.pagination, className].filter(Boolean).join(" ")}
      aria-label="페이지네이션"
    >
      {isMobile || isTablet ? (
        <>
          <MzButton size="Large" full fill="white" stroke="Black">
            더보기
          </MzButton>
        </>
      ) : (
        <>
          <button
            type="button"
            className={S.pagination__button}
            aria-label="첫 페이지"
          >
            <i className="icon__24_home_arrow" />
          </button>
          <button
            type="button"
            className={S.pagination__button}
            aria-label="이전 페이지"
          >
            <i className="icon__24_left_arrow" />
          </button>
          <ul className={S.pagination__list}>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className={S.pagination__item}>
                <button type="button" className={S.pagination__button}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={S.pagination__button}
            aria-label="다음 페이지"
          >
            <i className="icon__24_right_arrow" />
          </button>
          <button
            type="button"
            className={S.pagination__button}
            aria-label="마지막 페이지"
          >
            <i className="icon__24_end_arrow" />
          </button>
        </>
      )}
    </nav>
  );
}
