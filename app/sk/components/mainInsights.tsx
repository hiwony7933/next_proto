import S from "./mainInsights.module.scss";
import Thumbnail from "@/app/common/components/molecule/thumbnail";
import useBreakpoint from "@/hooks/useBreakpoint";
import MzButton from "@/app/common/components/atom/mzButton";

interface MainInsightsProps {
  data: IssueFirstData[];
}

interface IssueFirstData {
  category: string;
  title: string;
  description: string;
  type: string;
  image: string;
  date: string;
  id: number;
  videoUrl: string;
}
const RenderItem = ({
  data,
  isMobile,
  isTablet,
}: {
  data: IssueFirstData;
  isMobile: boolean;
  isTablet: boolean;
}) => {
  return (
    <>
      <div
        className={`${S.insights__bottomItem__inner}  ${isMobile || isTablet ? "row" : ""}`}
      >
        <div
          className={`${S.insights__bottomItem__inner__thumbnail} ${isMobile || isTablet ? "col-4" : ""}`}
        >
          <Thumbnail
            data={data}
            type="sub"
            showTag={isMobile || isTablet ? false : true}
            showLabel={false}
            style={{
              width: "100%",
              height: isMobile || isTablet ? "70px" : "258px",
            }}
          />
        </div>
        <div
          className={`${S.insights__bottomItem__inner__content} ${isMobile || isTablet ? "col-8" : ""}`}
        >
          <div className={`${S.insights__bottomItem__title}`}>{data.title}</div>
        </div>
      </div>
    </>
  );
};

export default function MainInsights({ data }: MainInsightsProps) {
  const { isMobile, isTablet } = useBreakpoint();
  const mainStyleSize = {
    width: "100%",
    height: "343px",
  };
  return (
    <div className={`${S.insights} layout__container`}>
      <div className={S.insights__header}>
        <h2 className={S.insights__header__title}>
          {isMobile || isTablet
            ? `최신 보안 트렌드와\n인사이트를 확인하세요.`
            : "최신 보안 트렌드와 인사이트를 확인하세요."}
        </h2>
      </div>
      <div className={S.insights__inner}>
        <div className={`${S.insights__topItem} row`}>
          <div
            className={`${S.insights__topItem__thumbnail} col-${isMobile || isTablet ? 12 : 6}`}
          >
            <Thumbnail
              style={mainStyleSize}
              data={data[0]}
              type="main"
              showLabel={isMobile || isTablet ? false : true}
              showTag={isMobile || isTablet ? false : true}
            />
          </div>

          <div
            className={`${S.insights__topItem__content} col-${isMobile || isTablet ? 12 : 6}`}
          >
            <div className={S.insights__category}>{data[0]?.category}</div>
            <div className={S.insights__title}>{data[0].title}</div>
            <div className={S.insights__desc}>{data[0]?.description}</div>
          </div>
        </div>
        <div className={`${S.insights__bottomItem} row`}>
          <div className={`col-${isMobile || isTablet ? 12 : 4}`}>
            <RenderItem
              data={data[1]}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
          <div className={`col-${isMobile || isTablet ? 12 : 4}`}>
            <RenderItem
              data={data[2]}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
          <div className={`col-${isMobile || isTablet ? 12 : 4}`}>
            <RenderItem
              data={data[3]}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </div>
        </div>
      </div>
      <div className={S.insights__cta}>
        <MzButton size="Large" fill="white" className="button-more">
          보안이슈 & 인사이트 더보기
          <i className="icon__20_right_arrow" />
        </MzButton>
      </div>
    </div>
  );
}
