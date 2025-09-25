"use client";
import React, { useMemo, useState } from "react";
import styles from "./cornerFaq001.module.scss";
import MzButton from "../ui/mzButton";
import MzPaginationManaged from "../ui/mzPaginationManaged";

type FaqItem = { question: string; category: string; answer: string };

type Props = {
  items: FaqItem[];
  wrapClassName?: string;
  itemClassName?: string;
  questionClassName?: string;
  categoryClassName?: string;
  answerClassName?: string;
  multiOpen?: boolean; // true: 여러개, false: 하나만
  totalVisible?: boolean; // 총 개수 표시 여부
  totalPrefix?: string; // 총 앞 텍스트(예: '총', '보안검색결과')
  totalUnit?: string; // 단위 텍스트(예: '개', '건', '회')
};

export default function CornerFaq001({
  items,
  wrapClassName = "faqType01",
  itemClassName = styles.faqItem,
  questionClassName = styles.question,
  categoryClassName = styles.category,
  answerClassName = styles.answerText,
  multiOpen = false,
  totalVisible = true,
  totalPrefix = "총",
  totalUnit = "개",
}: Props) {
  // multiOpen: 여러개 열기, 아니면 하나만
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const itemsPerPage = 10;

  const handleClick = (idx: number) => {
    if (multiOpen) {
      setOpenIndexes((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndexes((prev) => (prev[0] === idx ? [] : [idx]));
    }
  };

  const handleCategoryClick = (value: string) => {
    setSelectedCategory(value);
    // 카테고리 변경 시 열림 상태 초기화
    setOpenIndexes([]);
  };

  // 중복 제거된 카테고리 목록 (빈 문자열/공백 제외)
  const categories = Array.from(
    new Set(
      (items || [])
        .map((item) => item.category?.trim())
        .filter((cat): cat is string => Boolean(cat))
    )
  );

  // 선택된 카테고리에 따른 필터링 아이템
  const filteredItems = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? items
        : items.filter((item) => item.category?.trim() === selectedCategory);
    return base;
  }, [items, selectedCategory]);

  // resetKey: 카테고리 변경 시 페이지 초기화
  const resetKey = selectedCategory;

  return (
    <div className={styles.faqContainer}>
      {/* 
        props로 받은 items 데이터가 없으면 카테고리 버튼 숨김, 데이터가 있으면 노출 
      */}
      {categories.length > 0 &&
        (() => {
          return (
            <div className={styles.faqCategory}>
              <MzButton
                onClick={() => handleCategoryClick("all")}
                aria-pressed={selectedCategory === "all"}
              >
                전체
              </MzButton>
              {categories.map((cat) => (
                <MzButton
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat}
                </MzButton>
              ))}
            </div>
          );
        })()}
      {/* Total에 대한 대표 스타일 적용필요할듯.. */}
      {totalVisible && (
        <div className={styles.faqTotal}>
          {totalPrefix} {filteredItems.length}
          {totalUnit}
        </div>
      )}
      <MzPaginationManaged
        items={filteredItems}
        itemsPerPage={itemsPerPage}
        resetKey={resetKey}
        onPageChange={() => setOpenIndexes([])}
        render={({ currentItems, pageStartIndex }) => (
          <>
            {currentItems.length === 0 && <div>검색 결과가 없습니다.</div>}
            {currentItems.length > 0 && (
              <ol className={`${styles[wrapClassName]} ${styles.faqWrap}`}>
                {currentItems.map((item, idx) => {
                  const globalIndex = pageStartIndex + idx;
                  return (
                    <li key={globalIndex} className={itemClassName}>
                      <div className={styles.questionWrap}>
                        {item.category && item.category.trim() !== "" && (
                          <div className={categoryClassName}>
                            {item.category}
                          </div>
                        )}
                        <button
                          className={`${questionClassName} ${
                            openIndexes.includes(globalIndex) ? styles.open : ""
                          }`}
                          onClick={() => handleClick(globalIndex)}
                          aria-expanded={openIndexes.includes(globalIndex)}
                        >
                          {item.question}
                        </button>
                      </div>
                      {openIndexes.includes(globalIndex) && (
                        <div
                          className={`${answerClassName}`}
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        )}
      />
    </div>
  );
}
