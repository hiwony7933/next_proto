import React, { useState } from "react";
import S from "./listNotice.module.scss";
import Link from "next/link";
import topFlagIcon from "@/public/images/common/icon_24_topFlag.svg";
import Image from "next/image";
import MzPagination from "@/app/common/components/ui/mzPagination";

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
  totalVisible?: boolean; // 총 개수 표시 여부
  /** 부모에서 순서대로 전달하는 열 너비 배열. 예) ["20%", "70%", "10%"] */
  columnWidths?: string[];
};

export default function ListNotice({
  items,
  basePath,
  totalVisible = true,
  columnWidths,
}: ListNoticeProps) {
  items.map((item) => {
    return {
      id: item.id,
      topflag: item.topflag,
      category: item.category,
      label: item.label,
      content: item.content,
      date: item.date,
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 폭 설정: 미지정 시 기본값(카테고리/내용/날짜)
  const widths =
    columnWidths && columnWidths.length > 0
      ? columnWidths
      : ["20%", "70%", "10%"];
  // 열 개수 기준으로 카테고리 열 포함 여부 결정(3칸 이상이면 [카테고리, 내용, 날짜] 가정)
  const includeCategory = widths.length >= 3;

  return (
    <div className={S.listNotice}>
      {totalVisible && <div>총 {items.length}건</div>}
      {items.length === 0 && <div>검색 결과가 없습니다.</div>}
      {items.length > 0 && (
        <table>
          <colgroup>
            {widths.map((w, idx) => (
              <col key={idx} {...(w ? { width: w } : {})} />
            ))}
          </colgroup>
          <tbody>
            {currentItems.length > 0 &&
              currentItems.map((item) => (
                <tr key={item.id} className={S.listNotice__item}>
                  {includeCategory && (
                    <td>
                      <div className={S.listNotice__category}>
                        {item.topflag ? (
                          <Image src={topFlagIcon} alt="상단고정" />
                        ) : (
                          <div className={S.listNotice__category_empty}></div>
                        )}
                        <span>{item.category ?? ""}</span>
                      </div>
                    </td>
                  )}
                  <td>
                    <Link
                      href={`${basePath}/${item.id}`}
                      className={S.listNotice__content_link}
                      style={{ width: "600px" }}
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
      <MzPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
}
