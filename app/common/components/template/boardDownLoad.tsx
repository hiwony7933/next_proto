import S from "./boardDownLoad.module.scss";
import BoardTop from "@/app/common/components/organism/boardTop";
import BoardEmpty from "@/app/common/components/organism/boardEmpty";
import MzPagination from "@/app/common/components/molecule/mzPagination";
import MzButton from "@/app/common/components/atom/mzButton";
import MzSelectBox from "../atom/mzSelectBox";
import useBreakpoint from "@/hooks/useBreakpoint";
import { getYearOptions, getMonthOptions } from "@/lib/dateOptions";
import { useState } from "react";
import Link from "next/link";

interface BorderDownLoadProps {
  searchValue: string;
  basePath?: string;
}

export default function BorderDownLoad({
  searchValue,
  basePath,
}: BorderDownLoadProps) {
  const [selectedYear, setSelectedYear] = useState<string | number>("");
  const [selectedMonth, setSelectedMonth] = useState<string | number>("");
  const { isMobile, isTablet } = useBreakpoint();
  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth() + 1;
  const yearOptions = getYearOptions({
    startYear: initialYear - 5,
    endYear: initialYear,
    order: "desc",
  });
  const monthOptions = getMonthOptions({
    year: typeof selectedYear === "number" ? selectedYear : initialYear,
    disableFuture: typeof selectedYear === "number",
  });
  const items = [
    {
      id: 1,
      main: {
        date: "2025-01-01",
        thumb: "/images/sk/dummy_thumb.png",
        downloadPath: "https://example.com/download",
      },
      sub: [
        {
          id: 1,
          category: "EQST 월간리포트1",
          title: "EQST 월간리포트1",
          downloadPath: "https://example.com/download",
          date: "2025-03-01",
        },
        {
          id: 2,
          category: "EQST 월간리포트2",
          title: "EQST 월간리포트2",
          downloadPath: "https://example.com/download",
          date: "2025-05-01",
        },
        {
          id: 3,
          category: "EQST 월간리포트3",
          title: "EQST 월간리포트3",
          downloadPath: "https://example.com/download",
          date: "2025-06-01",
        },
      ],
    },
    {
      id: 2,
      main: {
        date: "2025-08-01",
        thumb: "/images/sk/dummy_thumb.png",
        downloadPath: "https://example.com/download",
      },
      sub: [
        {
          id: 1,
          category: "EQST 월간리포트1",
          title: "EQST 월간리포트1",
          downloadPath: "https://example.com/download",
          date: "2025-03-01",
        },
        {
          id: 2,
          category: "EQST 월간리포트2",
          title: "EQST 월간리포트2",
          downloadPath: "https://example.com/download",
          date: "2025-05-01",
        },
        {
          id: 3,
          category: "EQST 월간리포트3",
          title: "EQST 월간리포트3",
          downloadPath: "https://example.com/download",
          date: "2025-06-01",
        },
      ],
    },
  ];
  const onSelect = (value: string) => {
    console.log(value);
  };
  const renderRightContent = () => {
    return (
      <div className={S.borderDownLoad__rightContent}>
        <MzSelectBox
          style={{ width: "160px" }}
          borderless={true}
          options={yearOptions.map((option) => ({
            label: option.label,
            value: option.value.toString() as string,
          }))}
          selected={selectedYear?.toString() || ""}
          onSelect={(v) => setSelectedYear(v === "" ? "" : Number(v as any))}
          // className={`col-${isMobile ? 5 : 6}`}
        />
        <div className={S.borderDownLoad__divider} />
        <MzSelectBox
          style={{ width: "130px" }}
          borderless={true}
          options={monthOptions.map((option) => ({
            label: option.label,
            value: option.value.toString() as string,
          }))}
          selected={selectedMonth?.toString() || ""}
          onSelect={(v) => setSelectedMonth(v === "" ? "" : Number(v as any))}
          // className={`col-${isMobile ? 4 : 5}`}
        />
      </div>
    );
  };
  return (
    <div>
      <ul className={S.borderDownLoad}>
        <BoardTop
          searchValue={searchValue}
          length={items.length}
          rightContent={renderRightContent()}
        />
        {items.length === 0 && (
          <BoardEmpty
            searchValue={searchValue}
            title="검색 결과가 없습니다."
            description=""
          />
        )}
        {items.length > 0 && (
          <>
            {items.map((item) => (
              <li className={`${S.borderDownLoad__list} row`} key={item.id}>
                <div
                  className={`col-${isMobile || isTablet ? "12" : "3"} ${S.borderDownLoad__itemMain}`}
                >
                  <div className={S.borderDownLoad__wapper}>
                    <div
                      className={S.borderDownLoad__wapperThumb}
                      style={{ backgroundImage: `url(${item.main.thumb})` }}
                    >
                      <span className={S.borderDownLoad__wapperDate}>
                        <div className={S.borderDownLoad__wapperDateYear}>
                          {item.main.date.split("-")[0]}
                        </div>
                        <div className={S.borderDownLoad__wapperDateMonth}>
                          {item.main.date.split("-")[1]}
                        </div>
                      </span>
                      <span className={S.borderDownLoad__wapperTag}>New</span>
                    </div>
                    <div className={S.borderDownLoad__wapperButton}>
                      <MzButton
                        size="Medium"
                        fill="black"
                        href={item.main.downloadPath}
                        style={{ gap: 8 }}
                      >
                        전체 다운로드
                        <i className="icon__12_download" aria-hidden="true" />
                      </MzButton>
                    </div>
                  </div>
                </div>
                <div
                  className={`col-${isMobile || isTablet ? "12" : "9"} ${S.borderDownLoad__itemSub}`}
                >
                  {item.sub.map((sub, index) => (
                    <div className={S.borderDownLoad__itemSubInner} key={index}>
                      <Link
                        className={S.borderDownLoad__itemSubInnerLeft}
                        href={`${basePath}/${sub.id}`}
                        aria-label={`${sub.title} 상세 보기`}
                      >
                        <span className={S.borderDownLoad__itemCategory}>
                          <span>[</span>
                          {sub.category}
                          <span>] </span>
                        </span>
                        <span className={S.borderDownLoad__itemTitle}>
                          {sub.title}
                        </span>
                      </Link>
                      <div className={S.borderDownLoad__itemSubInnerRight}>
                        <MzButton
                          size="Medium"
                          fill="Gray"
                          href={sub.downloadPath}
                          full
                          style={{ gap: 8 }}
                        >
                          다운로드
                          <i
                            className="icon__12_download"
                            aria-hidden="true"
                            style={{ backgroundColor: "black" }}
                          />
                        </MzButton>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </>
        )}
      </ul>
      <MzPagination />
    </div>
  );
}
