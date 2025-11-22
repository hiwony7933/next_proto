import S from "./imageListNotice.module.scss";
import Thumbnail from "../molecule/thumbnail";
import MzPagination from "../molecule/mzPagination";
import useBreakpoint from "@/hooks/useBreakpoint";
import Link from "next/link";
import BoardEmpty from "../organism/boardEmpty";
import BoardTop from "../organism/boardTop";

type ImageListNoticeProps = {
  basePath: string;
  searchValue?: string;
  data?: any[];
};

export default function ImageListNotice({
  basePath,
  searchValue,
  data,
}: ImageListNoticeProps) {
  const { isMobile, isTablet } = useBreakpoint();

  const dataLength = data?.length ?? 0;
  return (
    <div className={S.imageListNotice}>
      <BoardTop searchValue={searchValue} length={dataLength} />
      {dataLength === 0 && (
        <BoardEmpty
          searchValue={searchValue}
          title="검색 결과가 없습니다."
          description=""
        />
      )}
      {dataLength > 0 && (
        <>
          {data?.map((item) => (
            <ul className={`${S.imageListNotice__list} row`} key={item.id}>
              <div className={`col-${isMobile || isTablet ? "12" : "3 "}`}>
                <Thumbnail
                  data={item.thumbnailData}
                  type="sub"
                  style={{
                    width: "100%",
                    minHeight: "190px",
                    height: "auto",
                  }}
                  label={item.label}
                  showLabel={isMobile || isTablet ? true : false}
                  showTag={true}
                />
              </div>
              <li
                className={`${S.imageListNotice__content_wrap} col-${isMobile || isTablet ? "12" : "9 "}`}
              >
                <Link
                  className={S.imageListNotice__content}
                  href={`${basePath}/${item.id}`}
                  aria-label={`${item.title} 상세 보기`}
                >
                  <div className={S.imageListNotice__content__category}>
                    {item.category ?? ""}
                  </div>

                  <div className={S.imageListNotice__content__title}>
                    <div className={S.imageListNotice__content__title__text}>
                      {item.title}
                    </div>
                    {!isMobile && (
                      <>
                        {item.label && (
                          <span className={S.imageListNotice__label}>
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {item.desc && (
                    <div className={S.imageListNotice__content__desc}>
                      {item.desc}
                    </div>
                  )}
                  <div className={S.imageListNotice__content__date}>
                    {item.date}
                  </div>

                  <div className={S.imageListNotice__content__filter}>
                    {item.filter?.map((filter: string) => (
                      <div
                        key={filter}
                        className={S.imageListNotice__content__filter__item}
                      >
                        {filter}
                      </div>
                    ))}
                  </div>
                </Link>
              </li>
            </ul>
          ))}
        </>
      )}
      <MzPagination className={S.pagination} />
    </div>
  );
}
