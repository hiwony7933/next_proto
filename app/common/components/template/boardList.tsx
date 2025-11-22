import React from "react";
import Link from "next/link";
import S from "./boardList.module.scss";
import MzPagination from "../molecule/mzPagination";
import BoardEmpty from "../organism/boardEmpty";
import BoardTop from "../organism/boardTop";

type BoardItem = {
  id: number | string;
  topflag?: boolean;
  label?: boolean;
  question?: string;
  content?: string;
  date?: string;
};

type BoardListProps = {
  items: BoardItem[];
  basePath: string;
  searchValue?: string;
};

export default function BoardList({
  items,
  basePath,
  searchValue = "",
}: BoardListProps) {
  return (
    <div className={S.boardList}>
      <BoardTop searchValue={searchValue} length={items.length} />

      {items.length > 0 && (
        <ul className={S.boardList__list} role="list">
          {items.map((item) => {
            const title = item.content ?? "";
            return (
              <li
                key={item.id}
                className={`${S.boardList__item} ${item.topflag ? S.boardList__itemTop : ""}`}
                role="listitem"
              >
                <Link
                  href={`${basePath}/${item.id}`}
                  className={`${S.boardList__rowLink} row`}
                  aria-label={`${title} 상세 보기${item.topflag ? " (상단고정)" : ""}`}
                >
                  <div className={`col-10 ${S.boardList__content}`}>
                    <span className={S.boardList__titleText}>{title}</span>
                    {item.label && (
                      <span className={S.boardList__label} aria-label="New">
                        New
                      </span>
                    )}
                  </div>
                  <div className={`col-2 ${S.boardList__date}`}>
                    {item.date ?? ""}
                  </div>
                </Link>
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
