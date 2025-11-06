import React from "react";
import Image from "next/image";
import Link from "next/link";
import S from "./imageCardList.module.scss";
import MzPagination from "../molecule/mzPagination";

type IdLike = string | number;

export interface ImageCardListProps<ItemType> {
  items: ItemType[];
  getId?: (item: ItemType) => IdLike;
  getTitle?: (item: ItemType) => string;
  getDateText?: (item: ItemType) => string | null | undefined;
  getImageSrc?: (item: ItemType) => string;
  buildHref?: (item: ItemType) => string | null | undefined;
  basePath?: string;
  imageWidth?: number;
  imageHeight?: number;
  renderMetaArea?: (item: ItemType) => React.ReactNode;
  renderActions?: (item: ItemType) => React.ReactNode;
  renderHeader?: (item: ItemType) => React.ReactNode;
  renderFooter?: (item: ItemType) => React.ReactNode;
  className?: string;
  onItemClick?: (item: ItemType) => void;
  renderEmpty?: React.ReactNode;
  columns?: number;
  gap?: number | string;
}

export default function ImageCardList<ItemType>(
  props: ImageCardListProps<ItemType>
) {
  const {
    items,
    getId,
    getTitle,
    getDateText,
    getImageSrc,
    buildHref,
    basePath,
    imageWidth = 400,
    imageHeight = 230,
    renderMetaArea,
    renderActions,
    renderHeader,
    renderFooter,
    className,
  } = props;

  if (!items || items.length === 0) {
    return (
      <div className={[S.imageCardList, className].filter(Boolean).join(" ")}>
        {props.renderEmpty ?? <div>표시할 데이터가 없습니다.</div>}
      </div>
    );
  }

  const mapId = (item: any) => (getId ? getId(item) : (item?.id as IdLike));
  const mapTitle = (item: any) =>
    getTitle ? getTitle(item) : ((item?.title as string) ?? "");
  const mapDate = (item: any) =>
    getDateText ? getDateText(item) : ((item?.date as string) ?? null);
  const mapImage = (item: any) =>
    getImageSrc
      ? getImageSrc(item)
      : ((item?.imagePath as string) ?? (item?.iamgePath as string) ?? "");
  const mapHref = (item: ItemType) => {
    if (buildHref) return buildHref(item);
    const id = basePath ? mapId(item) : null;
    return basePath && id !== undefined && id !== null
      ? `${basePath}/${id}`
      : null;
  };

  const columns = props.columns ?? 3;
  const gap = props.gap ?? 12;
  const rootStyle: React.CSSProperties = {
    ["--cols" as any]: String(columns),
    ["--gap" as any]: typeof gap === "number" ? `${gap}px` : gap,
  };
  const sizes = `(max-width: 1024px) 100vw, ${Math.ceil(100 / columns)}vw`;

  return (
    <div
      className={[S.imageCardList, className].filter(Boolean).join(" ")}
      style={rootStyle}
    >
      <div className={S.imageCardList__grid} role="list">
        {items.map((item, idx) => {
          const idValue = mapId(item);
          const titleText = mapTitle(item);
          const dateText = mapDate(item);
          const src = mapImage(item);
          const href = mapHref(item);

          const key = `${idValue ?? idx}`;
          const handleClick = (e: React.MouseEvent) => {
            if (props.onItemClick) {
              e.preventDefault();
              props.onItemClick(item);
            }
          };
          const thumbStyle = {
            ["--thumb-ratio" as any]: `${imageWidth} / ${imageHeight}`,
          } as React.CSSProperties;

          const thumb = href ? (
            <Link
              href={href}
              className={S.imageCardList__thumb}
              onClick={handleClick}
              style={thumbStyle}
              aria-label={`${titleText} 상세 보기`}
            >
              <Image src={src} alt={titleText} fill sizes={sizes} />
            </Link>
          ) : (
            <div className={S.imageCardList__thumb} style={thumbStyle}>
              <Image src={src} alt={titleText} fill sizes={sizes} />
            </div>
          );

          return (
            <article
              key={key}
              className={S.imageCardList__item}
              role="listitem"
              onClick={!href ? handleClick : undefined}
            >
              {renderHeader ? renderHeader(item) : null}
              {thumb}
              <div className={S.imageCardList__body}>
                <h3 className={S.imageCardList__title}>{titleText}</h3>
                {renderMetaArea ? (
                  renderMetaArea(item)
                ) : dateText ? (
                  <span className={S.imageCardList__date}>{dateText}</span>
                ) : null}
                {renderActions ? renderActions(item) : null}
              </div>
              {renderFooter ? renderFooter(item) : null}
            </article>
          );
        })}
      </div>
      <MzPagination></MzPagination>
    </div>
  );
}
