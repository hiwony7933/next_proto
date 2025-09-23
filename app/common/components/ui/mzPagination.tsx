"use client";

import React from "react";
import styles from "./mzPagination.module.scss";

type MzPaginationProps = {
  currentPage: number;
  onChange: (nextPage: number) => void;
  totalPages?: number; // 기본 10페이지 고정 요구사항
  className?: string;
};

export default function MzPagination({
  currentPage,
  onChange,
  totalPages = 10,
  className,
}: MzPaginationProps) {
  const goFirst = () => onChange(1);
  const goPrev = () => onChange(Math.max(1, currentPage - 1));
  const goNext = () => onChange(Math.min(totalPages, currentPage + 1));
  const goLast = () => onChange(totalPages);

  return (
    <nav
      className={`${styles.pagination} ${className || ""}`}
      aria-label="페이지네이션"
    >
      <button
        type="button"
        className={`${styles["pagination__button"]} ${
          currentPage === 1 ? styles["pagination__button--disabled"] : ""
        }`}
        onClick={goFirst}
        disabled={currentPage === 1}
        aria-label="첫 페이지"
      >
        «
      </button>
      <button
        type="button"
        className={`${styles["pagination__button"]} ${
          currentPage === 1 ? styles["pagination__button--disabled"] : ""
        }`}
        onClick={goPrev}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      <ul className={styles["pagination__list"]}>
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          const isActive = currentPage === pageNumber;
          return (
            <li key={pageNumber} className={styles["pagination__item"]}>
              <button
                type="button"
                className={`${styles["pagination__button"]} ${
                  isActive ? styles["pagination__button--active"] : ""
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
        className={`${styles["pagination__button"]} ${
          currentPage === totalPages
            ? styles["pagination__button--disabled"]
            : ""
        }`}
        onClick={goNext}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
      <button
        type="button"
        className={`${styles["pagination__button"]} ${
          currentPage === totalPages
            ? styles["pagination__button--disabled"]
            : ""
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
