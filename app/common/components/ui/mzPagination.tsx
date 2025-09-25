"use client";

import React from "react";
import useIsMobile from "@/hooks/useIsMobile";
import S from "./mzPagination.module.scss";

type PaginationMode = "auto" | "pages" | "loadMore";

type MzPaginationProps = {
  currentPage: number;
  onChange: (nextPage: number) => void;
  totalPages?: number; // 기본 10페이지 고정 요구사항
  className?: string;
  mode?: PaginationMode; // auto: PC는 pages, Mobile은 loadMore
  loadMoreLabel?: string; // 모바일 더보기 라벨
};

export default function MzPagination({
  currentPage,
  onChange,
  totalPages = 10,
  className,
  mode = "auto",
  loadMoreLabel = "더보기",
}: MzPaginationProps) {
  const isMobile = useIsMobile();
  const effectiveMode: PaginationMode =
    mode === "auto" ? (isMobile ? "loadMore" : "pages") : mode;
  const goFirst = () => onChange(1);
  const goPrev = () => onChange(Math.max(1, currentPage - 1));
  const goNext = () => onChange(Math.min(totalPages, currentPage + 1));
  const goLast = () => onChange(totalPages);

  if (effectiveMode === "loadMore") {
    const hasMore = currentPage < totalPages;
    return (
      <div
        className={`${S.pagination} ${S.paginationLoadMore} ${className || ""}`}
      >
        <button
          type="button"
          className={`${S.pagination__button} ${
            S.pagination__loadMore
          } ${!hasMore ? S.pagination__buttonDisabled : ""}`}
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={!hasMore}
          aria-label={hasMore ? "더보기" : "더 이상 항목 없음"}
        >
          {loadMoreLabel}
        </button>
      </div>
    );
  }

  return (
    <nav
      className={`${S.pagination} ${className || ""}`}
      aria-label="페이지네이션"
    >
      <button
        type="button"
        className={`${S.pagination__button} ${
          currentPage === 1 ? S.pagination__buttonDisabled : ""
        }`}
        onClick={goFirst}
        disabled={currentPage === 1}
        aria-label="첫 페이지"
      >
        «
      </button>
      <button
        type="button"
        className={`${S.pagination__button} ${
          currentPage === 1 ? S.pagination__buttonDisabled : ""
        }`}
        onClick={goPrev}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      <ul className={S.pagination__list}>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          const isActive = currentPage === pageNumber;
          return (
            <li key={pageNumber} className={S.pagination__item}>
              <button
                type="button"
                className={`${S.pagination__button} ${
                  isActive ? S.pagination__buttonActive : ""
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={`${S.pagination__button} ${
          currentPage === totalPages ? S.pagination__buttonDisabled : ""
        }`}
        onClick={goNext}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
      <button
        type="button"
        className={`${S.pagination__button} ${
          currentPage === totalPages ? S.pagination__buttonDisabled : ""
        }`}
        onClick={goLast}
        disabled={currentPage === totalPages}
        aria-label="마지막 페이지"
      >
        »
      </button>
    </nav>
  );
}
