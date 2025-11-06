import S from "./boardDownLoadList.module.scss";
import BoardTop from "@/app/common/components/organism/boardTop";
import BoardEmpty from "@/app/common/components/organism/boardEmpty";
import MzPagination from "@/app/common/components/molecule/mzPagination";
import MzButton from "@/app/common/components/atom/mzButton";
import MzSelectBox from "../atom/mzSelectBox";
import useBreakpoint from "@/hooks/useBreakpoint";
import { getYearOptions, getMonthOptions } from "@/lib/dateOptions";
import { useState } from "react";
import Image from "next/image";

interface BorderDownLoadProps {
  searchValue: string;
}

export default function BorderDownLoad({ searchValue }: BorderDownLoadProps) {
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
  const dataList = [
    {
      id: 1,
      date: "2025-01-01",
      thumb: "/images/sk/dummy_thumb.png",
      title:
        "EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2EQST 월간리포트2",
      label: true,
      downloadPath: "https://example.com/download",
    },
    {
      id: 2,
      date: "2025-12-01",
      thumb: "/images/sk/dummy_thumb.png",
      title: "EQST 월간리포트3",
      label: false,
      downloadPath: "https://example.com/download",
    },
    {
      id: 3,
      date: "2025-12-01",
      thumb: "/images/sk/dummy_thumb.png",
      title: "EQST 월간리포트3",
      label: false,
      downloadPath: "https://example.com/download",
    },
    {
      id: 4,
      date: "2025-12-01",
      thumb: "/images/sk/dummy_thumb.png",
      title: "EQST 월간리포트3",
      label: false,
      downloadPath: "https://example.com/download",
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
          length={dataList.length}
          rightContent={renderRightContent()}
        />
        {dataList.length === 0 && (
          <BoardEmpty
            searchValue={searchValue}
            title="검색 결과가 없습니다."
            description=""
          />
        )}
        {dataList.length > 0 && (
          <>
            {dataList.map((item) => (
              <li className={`${S.borderDownLoad__list} row`} key={item.id}>
                <div
                  className={`col-${isMobile || isTablet ? "12" : "3"} ${S.borderDownLoad__itemMain}`}
                >
                  <div className={S.borderDownLoad__wapperThumb}>
                    <Image
                      src={item.thumb}
                      alt={item.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
                <div
                  className={`col-${isMobile || isTablet ? "12" : "9"} ${S.borderDownLoad__itemSub}`}
                >
                  <div className={S.borderDownLoad__itemSubInner}>
                    <div className={S.borderDownLoad__itemSubInnerLeft}>
                      <div>
                        <span className={S.borderDownLoad__itemTitle}>
                          {item.title}
                        </span>
                        {item.label && (
                          <span className={S.borderDownLoad__itemLabel}>
                            New
                          </span>
                        )}
                      </div>
                      <span className={S.borderDownLoad__itemDate}>
                        {item.date}
                      </span>
                    </div>
                    <div className={S.borderDownLoad__itemSubInnerRight}>
                      <MzButton
                        size="Medium"
                        fill="black"
                        href={item.downloadPath}
                        full
                        style={{ gap: 8 }}
                      >
                        전체 다운로드
                        <i className="icon__12_download" aria-hidden="true" />
                      </MzButton>
                    </div>
                  </div>
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
