import React from "react";
import S from "./listNotice.module.scss";
import Link from "next/link";
import topFlagIcon from "@/public/images/common/icon_24_topFlag.svg";
import Image from "next/image";
import BoardTop from "../organism/boardTop";
import BoardEmpty from "../organism/boardEmpty";

type ListNoticeItem = {
  id: number;
  topflag?: boolean;
  category?: string;
  label?: boolean;
  content: string;
  date?: string;
};

type ListNoticeProps = {
  items: ListNoticeItem[];
  basePath: string;
  searchValue?: string;
  /** 부모에서 순서대로 전달하는 열 너비 배열. 예) ["20%", "70%", "10%"] */
  columnWidths?: string[];
};

export default function ListNotice({
  items,
  basePath,
  searchValue,
  columnWidths,
}: ListNoticeProps) {
  // 폭 설정: 미지정 시 기본값(카테고리/내용/날짜)
  const widths =
    columnWidths && columnWidths.length > 0
      ? columnWidths
      : ["20%", "70%", "10%"];
  const includeCategory = widths.length >= 3;

  return (
    <div className={S.listNotice}>
      <BoardTop searchValue={searchValue} length={items.length} />
      {items.length === 0 && (
        <BoardEmpty
          searchValue={searchValue}
          title="검색 결과가 없습니다."
          description=""
        />
      )}
      {items.length > 0 && (
        <table className={S.listNotice__table}>
          <colgroup>
            {widths.map((w, idx) => (
              <col key={idx} {...(w ? { width: w } : {})} />
            ))}
          </colgroup>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={S.listNotice__item}>
                {includeCategory && (
                  <td>
                    <div className={S.listNotice__category}>
                      {item.topflag ? (
                        <Image src={topFlagIcon} alt="상단고정" />
                      ) : (
                        <div className={S.listNotice__categoryEmpty}></div>
                      )}
                      <span>{item.category ?? ""}</span>
                    </div>
                  </td>
                )}
                <td>
                  <Link
                    href={`${basePath}/${item.id}`}
                    className={S.listNotice__contentLink}
                  >
                    {item.label && (
                      <span className={S.listNotice__label}>공지</span>
                    )}
                    <div className={S.listNotice__contentText}>
                      {item.content}
                    </div>
                  </Link>
                </td>
                <td>
                  <div className={S.listNotice__date}>{item.date ?? ""}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
