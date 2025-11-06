import S from "./boardSearch.module.scss";
import MzPagination from "../molecule/mzPagination";
import Link from "next/link";
import BoardEmpty from "../organism/boardEmpty";

export default function BoardSearch({
  path,
  searchValue,
}: {
  path: string[];
  searchValue: string;
}) {
  const items = [
    {
      category: "category",
      title: "title",
      content: "content",
    },
    {
      category: "category",
      title: "title",
      content: "content",
    },
    {
      category: "category",
      title: "title",
      content: "content",
    },
    {
      category: "category",
      title: "title",
      content: "content",
    },
    {
      category: "category",
      title: "title",
      content: "content",
    },
  ];
  return (
    <div className={S.boardSearch}>
      <div className={S.boardSearch__header}>
        <div className={S.boardSearch__header__title}>
          <div>
            ‘스마트오더’ 검색 결과
            <span className={S.boardSearch__header__title__length}>18</span>건
            있습니다.
          </div>
        </div>
      </div>
      {items.length === 0 && (
        <BoardEmpty
          searchValue=""
          title="검색 결과가 없습니다."
          description=""
        />
      )}
      {items.length > 0 && (
        <>
          <ul className={S.boardSearch__list}>
            {items.map((item, index) => (
              <li className={S.boardSearch__list__item} key={index}>
                <Link href={`/`}>
                  <div className={S.boardSearch__list__item__category}>
                    {path.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </div>
                  <div className={S.boardSearch__list__item__title}>
                    {item.title}
                  </div>
                  <div className={S.boardSearch__list__item__content}>
                    {item.content}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <MzPagination />
    </div>
  );
}
