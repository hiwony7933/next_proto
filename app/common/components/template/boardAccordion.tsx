"use client";
import React, { useCallback, useMemo, useState } from "react";
import S from "./boardAccordion.module.scss";
import CSSTransition from "react-transition-group/CSSTransition";
import { useCollapseTransitionMap } from "@/hooks/useCollapseTransitionMap";
import MzPagination from "../molecule/mzPagination";
import MzRadioGroup from "../atom/mzRadioGroup";
import useBreakpoint from "@/hooks/useBreakpoint";
import BoardEmpty from "../organism/boardEmpty";
import BoardTop from "../organism/boardTop";

type FaqItem = { question: string; category: string; answer: string };

type Props = {
  items: FaqItem[];
  multiOpen?: boolean;
  searchValue?: string;
};

export default function BoardAccordion({
  items,
  multiOpen = false,
  searchValue,
}: Props) {
  const { isMobile, isTablet } = useBreakpoint();
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const collapse = useCollapseTransitionMap({
    timeout: 300,
    classNames: {
      enter: "answerAnimEnter",
      enterActive: "answerAnimEnterActive",
      enterDone: "answerAnimEnterDone",
      exit: "answerAnimExit",
      exitActive: "answerAnimExitActive",
    },
    mountOnEnter: true,
    unmountOnExit: true,
  });

  const isOpen = useCallback((index: number) => openSet.has(index), [openSet]);

  const handleToggle = useCallback(
    (index: number) => {
      setOpenSet((prev) => {
        if (multiOpen) {
          const next = new Set<number>(prev);
          if (next.has(index)) next.delete(index);
          else next.add(index);
          return next;
        }
        // single-open mode: toggle current; if open, close all; if closed, open only this
        return prev.has(index) ? new Set<number>() : new Set<number>([index]);
      });
    },
    [multiOpen]
  );

  // 높이 측정 로직 제거 (CSSTransition이 처리)
  const categories = [
    { label: "전체", value: "all" },
    { label: "컨설팅", value: "컨설팅" },
    { label: "랜섬웨어", value: "랜섬웨어" },
    { label: "개인정보보호", value: "개인정보보호" },
    { label: "관제", value: "관제" },
    { label: "AI", value: "AI" },
    { label: "중소기업보안", value: "중소기업보안" },
  ];
  const [selectedCategory, setSelectedCategory] = useState("all");
  const handleCategoryClick = (v: string) => {
    console.log("category:", v);
  };

  return (
    <div className={S.boardAccordion}>
      <div className={S.boardAccordion__categoryWrapper}>
        <MzRadioGroup
          value={selectedCategory}
          options={[
            ...categories.map((cat) => ({
              label: cat.label,
              value: cat.value,
            })),
          ]}
          onChange={(v) => {
            setSelectedCategory(v);
            handleCategoryClick(v);
          }}
          rounded
          ariaLabel="FAQ 카테고리 선택"
        />
      </div>
      <BoardTop searchValue={searchValue} length={items.length} />
      {items.length > 0 && (
        <ul className={S.boardAccordion__list}>
          {(items || []).map((item, idx) => {
            const panelId = `board-accordion-panel-${idx}`;
            const triggerId = `board-accordion-trigger-${idx}`;
            const open = isOpen(idx);
            const nodeRef = collapse.getNodeRef(idx);
            return (
              <li
                key={idx}
                className={`${S.boardAccordion__item} ${open ? S.boardAccordion__itemOpen : ""}`}
              >
                <button
                  id={triggerId}
                  type="button"
                  className={S.boardAccordion__questionWrap}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => handleToggle(idx)}
                >
                  {isMobile || isTablet ? (
                    <>
                      <div className={S.boardAccordion__rowStack}>
                        <span className={S.boardAccordion__category}>
                          {item.category}
                        </span>
                        <span
                          className={S.boardAccordion__icons}
                          aria-hidden="true"
                        >
                          <i
                            className={`icon__50_plus ${S.boardAccordion__icon} ${open ? S.boardAccordion__iconHidden : ""}`}
                          />
                          <i
                            className={`icon__50_minus_line ${S.boardAccordion__icon} ${open ? "" : S.boardAccordion__iconHidden}`}
                          />
                        </span>
                      </div>
                      <div className={S.boardAccordion__rowStack}>
                        <span className={S.boardAccordion__question}>
                          {item.question}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={S.boardAccordion__questionWrap__row}>
                        <span className={S.boardAccordion__category}>
                          {item.category}
                        </span>
                        <span className={S.boardAccordion__question}>
                          {item.question}
                        </span>
                        <span
                          className={S.boardAccordion__icons}
                          aria-hidden="true"
                        >
                          <i
                            className={`icon__50_plus ${S.boardAccordion__icon} ${open ? S.boardAccordion__iconHidden : ""}`}
                          />
                          <i
                            className={`icon__50_minus_line ${S.boardAccordion__icon} ${open ? "" : S.boardAccordion__iconHidden}`}
                          />
                        </span>
                      </div>
                    </>
                  )}
                </button>
                <CSSTransition {...collapse.getTransitionProps(idx, open)}>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    ref={nodeRef}
                    className={S.boardAccordion__answerTextInner}
                  >
                    <div
                      className={S.boardAccordion__answerText}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                </CSSTransition>
              </li>
            );
          })}
        </ul>
      )}
      {items.length === 0 && (
        <BoardEmpty
          searchValue={searchValue}
          title="검색 결과가 없습니다."
          description=""
        />
      )}
      <MzPagination />
    </div>
  );
}
