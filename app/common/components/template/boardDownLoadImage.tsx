"use client";
import React from "react";
import Image from "next/image";
import S from "./boardDownLoadImage.module.scss";
import MzButton from "@/app/common/components/atom/mzButton";
import BoardEmpty from "../organism/boardEmpty";
import BoardTop from "../organism/boardTop";
import { dataData } from "@/sample/data/data";

interface BoardDownLoadImageProps {
  columns?: number;
  gap?: number | string;
  className?: string;
  searchValue?: string;
}

export default function BoardDownLoadImage({
  columns = 3,
  gap = 12,
  className,
  searchValue,
}: BoardDownLoadImageProps) {
  const rootStyle: React.CSSProperties = {
    ["--cols" as any]: String(columns),
    ["--gap" as any]: typeof gap === "number" ? `${gap}px` : gap,
  };

  const sizes = `(max-width: 1024px) 100vw, ${Math.ceil(100 / columns)}vw`;

  return (
    <div
      className={[S.imageNotice, className].filter(Boolean).join(" ")}
      style={rootStyle}
    >
      <BoardTop searchValue={searchValue} length={dataData.length} />
      {dataData.length === 0 && (
        <BoardEmpty
          searchValue={searchValue}
          title="검색 결과가 없습니다."
          description=""
        />
      )}
      {dataData.length > 0 && (
        <div className={S.imageNotice__list}>
          {dataData.map((item, idx) => (
            <article className={S.imageNotice__item} key={idx}>
              <div className={S.imageNotice__thumb}>
                <Image
                  src={item.imagePath}
                  alt={item.title}
                  fill
                  sizes={sizes}
                />
              </div>
              <div className={S.imageNotice__body}>
                <p className={S.imageNotice__title}>{item.title}</p>
                <MzButton
                  size="Large"
                  full
                  fill="black"
                  href={item.downloadPath}
                  style={{ gap: 8 }}
                >
                  다운로드
                  <i className="icon__12_download" aria-hidden="true" />
                </MzButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
