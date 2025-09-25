"use client";

import React, { useEffect, useMemo, useState } from "react";
import MzPagination from "./mzPagination";
import useIsMobile from "@/hooks/useIsMobile";

type PaginationMode = "auto" | "pages" | "loadMore";

export type MzPaginationManagedProps<T> = {
  items: T[];
  itemsPerPage?: number; // e.g. 10 or 12
  className?: string;
  mode?: PaginationMode; // auto: PC=pages, Mobile=loadMore
  loadMoreLabel?: string;
  initialPage?: number;
  resetKey?: unknown; // 변경 시 1페이지로 리셋
  onPageChange?: (nextPage: number) => void;
  render: (args: {
    currentItems: T[];
    currentPage: number;
    totalPages: number;
    pageStartIndex: number;
    isMobile: boolean;
  }) => React.ReactNode;
};

export default function MzPaginationManaged<T>(
  props: MzPaginationManagedProps<T>
) {
  const {
    items,
    itemsPerPage = 10,
    className,
    mode = "auto",
    loadMoreLabel = "더보기",
    initialPage = 1,
    resetKey,
    onPageChange,
    render,
  } = props;

  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetKey]);

  const isMobile = useIsMobile();
  const effectiveMode: PaginationMode =
    mode === "auto" ? (isMobile ? "loadMore" : "pages") : mode;

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const pageStartIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = useMemo(() => {
    if (effectiveMode === "loadMore") {
      const end = Math.min(items.length, currentPage * itemsPerPage);
      return items.slice(0, end);
    }
    return items.slice(pageStartIndex, pageStartIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage, effectiveMode, pageStartIndex]);

  const handleChange = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    if (clamped !== currentPage) {
      setCurrentPage(clamped);
      onPageChange?.(clamped);
    }
  };

  return (
    <div className={className}>
      {render({
        currentItems,
        currentPage,
        totalPages,
        pageStartIndex,
        isMobile: effectiveMode === "loadMore",
      })}
      <MzPagination
        currentPage={currentPage}
        onChange={handleChange}
        totalPages={totalPages}
        mode={effectiveMode}
        loadMoreLabel={loadMoreLabel}
      />
    </div>
  );
}
