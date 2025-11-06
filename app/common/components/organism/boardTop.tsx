import S from "./boardTop.module.scss";

type BoardTopProps = {
  searchValue?: string;
  length: number;
  rightContent?: React.ReactNode;
};

export default function BoardTop({
  searchValue,
  length,
  rightContent,
}: BoardTopProps) {
  return (
    <>
      {searchValue && (
        <div className={S.boardTop}>
          <div>
            <span
              className={S.boardTop__unit}
            >{`${searchValue} ${"검색 결과"}`}</span>
            <span className={S.boardTop__length}>{`${length}`}</span>
            <span className={S.boardTop__unit}>건</span>
          </div>
          {rightContent}
        </div>
      )}
    </>
  );
}
