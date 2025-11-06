"use client";
import S from "./heroBanner.module.scss";
import Thumbnail from "../molecule/thumbnail";
import useBreakpoint from "@/hooks/useBreakpoint";

interface HeroBannerProps {
  data: {
    id: number;
    category: string;
    title: string;
    description: string;
    image: string;
    date: string;
    type: string;
  }[];
}
const RenderItem = ({
  data,
  style,
  isMobile,
  isTablet,
}: {
  data: any;
  style?: any;
  isMobile: boolean;
  isTablet: boolean;
}) => {
  return (
    <>
      <div
        className={`${S.heroBanner__rightItem__inner} ${isMobile || isTablet ? "" : "row"}`}
      >
        <div
          className={`${isMobile || isTablet ? `${S.heroBanner__rightItem__inner__thumbnail}` : "col-4"}`}
        >
          <Thumbnail
            style={style}
            data={data}
            type="sub"
            showTag={isMobile || isTablet ? false : true}
            showLabel={false}
          />
        </div>
        <div
          className={`${isMobile || isTablet ? `${S.heroBanner__rightItem__inner__content}` : "col-8"}`}
        >
          <div className={`${S.heroBanner__category}`}>{data.category}</div>
          <div className={`${S.heroBanner__title}`}>{data.title}</div>
          <div className={`${S.heroBanner__desc}`}>{data.description}</div>
        </div>
      </div>
    </>
  );
};
export default function HeroBanner({ data }: HeroBannerProps) {
  const { isMobile, isTablet } = useBreakpoint();
  const mainStyleSize = {
    width: "100%",
    height: "343px",
  };
  return (
    <div className={S.heroBanner}>
      <div className={`${S.heroBanner__inner} row`}>
        <div
          className={`${S.heroBanner__leftItem} ${isMobile || isTablet ? "" : "col-5"}`}
        >
          <Thumbnail
            style={mainStyleSize}
            data={data[0]}
            type="main"
            showLabel={isMobile || isTablet ? false : true}
            showTag={isMobile || isTablet ? false : true}
          />
          <div
            className={`${S.heroBanner__title} ${S.heroBanner__leftItem__title}`}
          >
            {data[0].title}
          </div>
          <div
            className={`${S.heroBanner__desc} ${S.heroBanner__leftItem__desc}`}
          >
            {data[0].description}
          </div>
        </div>
        <div
          className={`${S.heroBanner__rightItem} ${isMobile || isTablet ? "row" : "col-7"}`}
        >
          <RenderItem data={data[1]} isMobile={isMobile} isTablet={isTablet} />
          <RenderItem data={data[2]} isMobile={isMobile} isTablet={isTablet} />
          <RenderItem data={data[3]} isMobile={isMobile} isTablet={isTablet} />
        </div>
      </div>
    </div>
  );
}
