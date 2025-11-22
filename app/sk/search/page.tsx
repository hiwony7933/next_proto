"use client";
import S from "./page.module.scss";
import MzInputText from "@/app/common/components/atom/mzInputText";
import MzTabs from "@/app/common/components/molecule/mzTabs";
import BoardSearch from "@/app/common/components/template/boardSearch";

export default function SearchPage() {
  const tabs = [
    {
      label: "솔루션",
      content: <BoardSearch path={["솔루션"]} searchValue="" />,
    },
    {
      label: "보안이슈&인사이트",
      content: (
        <BoardSearch
          path={["사이버보안 인사이트 >", " 보안이슈&인사이트"]}
          searchValue=""
        />
      ),
    },
    {
      label: "전문가리포트",
      content: (
        <BoardSearch
          path={["사이버보안 인사이트 >", " 전문가리포트"]}
          searchValue=""
        />
      ),
    },
    {
      label: "사이버보안뉴스",
      content: (
        <BoardSearch
          path={["사이버보안 인사이트 >", " 사이버보안뉴스"]}
          searchValue=""
        />
      ),
    },
    {
      label: "자주하는질문",
      content: (
        <BoardSearch path={["고객지원 >", " 자주하는질문"]} searchValue="" />
      ),
    },
    {
      label: "공지사항",
      content: (
        <BoardSearch path={["고객지원 >", " 공지사항"]} searchValue="" />
      ),
    },
  ];
  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">검색결과</h2>
      </div>
      <div className="notice-wrapper">
        <MzInputText
          style={{ width: 700 }}
          placeholder="검색어를 입력해주세요."
          onChange={(e) => console.log(e.target.value)}
          search={true}
          onSearch={(q) => console.log(q)}
        />
      </div>
      <MzTabs tabs={tabs} tabSize={true} solid={true} />
    </div>
  );
}
