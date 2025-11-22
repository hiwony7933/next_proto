import React from "react";
import S from "./banner.module.scss";

interface BannerData {
  topDesc: string;
  title: string;
  bottomDesc: string;
  buttonText: string;
  linkUrl: string;
  target: boolean;
  imagePath: string;
  direction: string;
}

interface BannerDataProps {
  data: BannerData;
}

export default function Banner({ data }: BannerDataProps) {
  const imagePath = data.imagePath
    ? { backgroundImage: `url(${data.imagePath})` }
    : {};
  return (
    <div
      className={`${S.banner__container} ${data.direction === "row" ? S.row : S.column}`}
      style={imagePath}
    >
      <div className={S.banner__content}>
        <div className={S.banner__topDesc}>
          <span>{data.topDesc}</span>
        </div>
        <div className={S.banner__title}>
          <span>{data.title}</span>
        </div>
        <div className={S.banner__bottomDesc}>
          <span>{data.bottomDesc}</span>
        </div>
      </div>
      <div className={S.banner__buttonWrapper}>
        <a
          id="go-estimation"
          href={data.linkUrl}
          className={S.banner__button}
          target={data.target ? "_blank" : undefined}
          rel={data.target ? "noopener noreferrer" : undefined}
        >
          <div>{data.buttonText}</div>
        </a>
      </div>
    </div>
  );
}
