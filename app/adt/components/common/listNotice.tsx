import React, { useState } from "react";
import S from "./listNotice.module.scss";
import Link from "next/link";
import topFlagIcon from "@/public/images/common/icon_24_topFlag.svg";
import Image from "next/image";
import MzPaginationManaged from "@/app/common/components/ui/mzPaginationManaged";
import MzSelectBox from "@/app/common/components/form/mzSelectBox";
import { getYearOptions, getMonthOptions } from "@/lib/dateOptions";

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
  selectBoxVisible?: boolean; // 셀렉트박스 표시 여부
  /** 부모에서 순서대로 전달하는 열 너비 배열. 예) ["20%", "70%", "10%"] */
  columnWidths?: string[];
};

export default function ListNotice({
  items,
  basePath,
  totalVisible = false,
  selectBoxVisible = false,
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

  const itemsPerPage = 10;

  // 폭 설정: 미지정 시 기본값(카테고리/내용/날짜)
  const widths =
    columnWidths && columnWidths.length > 0
      ? columnWidths
      : ["20%", "70%", "10%"];
  // 열 개수 기준으로 카테고리 열 포함 여부 결정(3칸 이상이면 [카테고리, 내용, 날짜] 가정)
  const includeCategory = widths.length >= 3;

  const initialYear = new Date().getFullYear();
  const initialMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState<string | number>("");
  const [selectedMonth, setSelectedMonth] = useState<string | number>("");
  const yearOptions = getYearOptions({
    startYear: initialYear - 5,
    endYear: initialYear,
    order: "desc",
  });
  const monthOptions = getMonthOptions({
    year: typeof selectedYear === "number" ? selectedYear : initialYear,
    disableFuture: typeof selectedYear === "number",
  });
  return (
    <div className={S.listNotice}>
      <div className={S.listNotice__header}>
        {totalVisible && (
          <div className={S.listNotice__total}>총 {items.length}건</div>
        )}
        {selectBoxVisible && (
          <div className={S.listNotice__selectBox}>
            <MzSelectBox
              type="default"
              size="5"
              options={yearOptions}
              selected={selectedYear}
              onSelect={(v) =>
                setSelectedYear(v === "" ? "" : Number(v as any))
              }
            />
            <MzSelectBox
              type="default"
              size="5"
              options={monthOptions}
              selected={selectedMonth}
              onSelect={(v) =>
                setSelectedMonth(v === "" ? "" : Number(v as any))
              }
            />
          </div>
        )}
      </div>
      {items.length === 0 && <div>검색 결과가 없습니다.</div>}
      {items.length > 0 && (
        <MzPaginationManaged
          items={items}
          itemsPerPage={itemsPerPage}
          render={({ currentItems }) => (
            <table className={S.listNotice__table}>
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
                              <div
                                className={S.listNotice__categoryEmpty}
                              ></div>
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
                        <div className={S.listNotice__date}>
                          {item.date ?? ""}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        />
      )}
    </div>
  );
}
