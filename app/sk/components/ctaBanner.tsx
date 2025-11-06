import React from "react";
import S from "./ctaBanner.module.scss";
import useBreakpoint from "@/hooks/useBreakpoint";

interface CtaBannerData {
  title: string;
  bottomDesc: string;
  buttonText: string;
  linkUrl: string;
  imagePath: string;
  target: boolean;
}

interface CtaBannerProps {
  data: CtaBannerData[];
}

const CtaBanner: React.FC<CtaBannerProps> = ({ data }) => {
  const { isMobile } = useBreakpoint();
  return (
    <div className={`row ${S.banner}`}>
      {data.map((item, index) => (
        <div className={` ${isMobile ? "col-12" : "col-6"}`} key={index}>
          <div
            className={`${S.banner__container}`}
            style={
              item.imagePath
                ? { backgroundImage: `url(${item.imagePath})` }
                : {}
            }
          >
            <div className={S.banner__content}>
              <div className={S.banner__title}>
                <strong>{item.title}</strong>
              </div>
              <div className={S.banner__bottomDesc}>
                <span>{item.bottomDesc}</span>
              </div>
            </div>
            <div className={S.banner__buttonWrapper}>
              <a
                id="go-estimation"
                href={item.linkUrl}
                className={S.banner__button}
                target={item.target ? "_blank" : undefined}
                rel={item.target ? "noopener noreferrer" : undefined}
              >
                <div>{item.buttonText}</div>
                <i className={`icon__20_right_arrow ${S.banner__buttonIcon}`} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CtaBanner;
