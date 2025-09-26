"use client";
/**
 * imageNotice
 * - 범용 이미지 리스트 컴포넌트(게시판 형태)
 * - SSR 페이지(목록/상세)는 라우트에서 관리하고, 본 컴포넌트는 UI/클라이언트 상태만 담당합니다.
 * - 확장 포인트: 데이터 매핑(getId/getTitle/getDateText/getImageSrc), 링크 정책(buildHref/basePath), 페이지네이션(itemsPerPage)
 * - 성능 메모: 매퍼/링크 빌더는 useMemo로 고정하여 재렌더 비용을 줄였습니다.
 * - 접근성: 이미지에는 title 기반의 대체 텍스트를 제공합니다.
 */
import React from "react";
import Image from "next/image";
import Link from "next/link";
import S from "./imageNotice.module.scss";
import MzPaginationManaged from "../../../common/components/ui/mzPaginationManaged";

type IdLike = string | number;

/**
 * ImageNoticeProps
 * - items: 렌더링할 원본 데이터 배열
 * - getId/getTitle/getDateText/getImageSrc: 데이터 구조가 다를 때 필드 매핑 함수 제공(미지정 시 기본 키 id/title/date/imagePath|iamgePath 사용)
 * - buildHref: 항목별 링크를 직접 구성(우선순위 1). null/undefined를 반환하면 링크 없이 div로 렌더링
 * - basePath: 상세 링크 기본 경로(우선순위 2). 제공 시 `${basePath}/${id}`로 링크 구성
 * - itemsPerPage: 페이지당 아이템 수(기본 12)
 * - imageWidth/imageHeight: 썸네일 렌더 크기
 * - showDate: 날짜 표시 여부
 * - className: 루트 요소에 추가 클래스
 *
 * 유지보수 가이드
 * - 링크 정책은 buildHref → basePath → 링크 없음 순으로 결정됩니다.
 * - 대량 데이터(수천 건 이상)는 가상 스크롤 도입을 검토하세요(@tanstack/react-virtual 등).
 * - SEO/SSR가 필요한 상세 화면은 라우트(`[id]/page.tsx`)에서 처리하고, 본 컴포넌트는 목록 UI 역할에 집중합니다.
 */
export interface ImageNoticeProps<ItemType> {
  items: ItemType[];
  // 데이터 접근: 제공되면 우선 사용, 없으면 관용 필드(id/title/date/imagePath|iamgePath) 사용
  getId?: (item: ItemType) => IdLike;
  getTitle?: (item: ItemType) => string;
  getDateText?: (item: ItemType) => string | null | undefined;
  getImageSrc?: (item: ItemType) => string;
  // 링크 정책: buildHref 우선, 없으면 basePath로 `${basePath}/${id}`
  buildHref?: (item: ItemType) => string | null | undefined;
  basePath?: string;
  // UI 옵션
  itemsPerPage?: number;
  imageWidth?: number;
  imageHeight?: number;
  /**
   * 기본 표시 정책
   * - 현재는 모든 메타/액션/헤더/푸터는 슬롯으로만 표시합니다(기본 UI 없음).
   * - 공통 기준이 정해지면 일부 기본 UI를 제공할 수 있습니다.
   */
  /** 제목 아래 메타 영역 사용자 정의 렌더 슬롯 */
  renderMetaArea?: (item: ItemType) => React.ReactNode;
  /** 액션(버튼 등) 사용자 정의 렌더 슬롯 */
  renderActions?: (item: ItemType) => React.ReactNode;
  /** 카드 상단(썸네일 위/아래 등) 헤더 영역 사용자 정의 슬롯 */
  renderHeader?: (item: ItemType) => React.ReactNode;
  /** 카드 하단 푸터 영역 사용자 정의 슬롯 */
  renderFooter?: (item: ItemType) => React.ReactNode;
  className?: string;
  onItemClick?: (item: ItemType) => void;
  isLoading?: boolean;
  error?: string | null;
  renderLoading?: React.ReactNode;
  renderError?: React.ReactNode;
  renderEmpty?: React.ReactNode;
  columns?: number;
  gap?: number | string;
}

export default function ImageNotice<ItemType>(
  props: ImageNoticeProps<ItemType>
) {
  const {
    items,
    getId,
    getTitle,
    getDateText,
    getImageSrc,
    buildHref,
    basePath,
    itemsPerPage = 12,
    imageWidth = 400,
    imageHeight = 230,
    renderMetaArea,
    renderActions,
    renderHeader,
    renderFooter,
    className,
  } = props;

  const pageSize = props.itemsPerPage;

  // 간단한 필드 접근 헬퍼(매퍼 우선, 없으면 관용 필드 사용)
  // 유지보수 메모: 데이터 스키마가 고정되면 아래 헬퍼를 제거하고 직접 필드 접근으로 단순화 가능
  const mapId = (item: any) => (getId ? getId(item) : (item?.id as IdLike));
  const mapTitle = (item: any) =>
    getTitle ? getTitle(item) : ((item?.title as string) ?? "");
  const mapDate = (item: any) =>
    getDateText ? getDateText(item) : ((item?.date as string) ?? null);
  const mapImage = (item: any) =>
    getImageSrc
      ? getImageSrc(item)
      : ((item?.imagePath as string) ?? (item?.iamgePath as string) ?? "");
  // 링크 생성 규칙: buildHref > basePath+id > 링크 없음
  const mapHref = (item: ItemType) => {
    if (buildHref) return buildHref(item);
    const id = basePath ? mapId(item) : null;
    return basePath && id !== undefined && id !== null
      ? `${basePath}/${id}`
      : null;
  };

  // 페이지네이션은 관리형 컴포넌트로 이관

  // 상태 UI 우선 반환
  if (props.isLoading) {
    return (
      <div className={[S.imageNotice, className].filter(Boolean).join(" ")}>
        {props.renderLoading ?? <div>로딩 중...</div>}
      </div>
    );
  }
  if (props.error) {
    return (
      <div className={[S.imageNotice, className].filter(Boolean).join(" ")}>
        {props.renderError ?? <div>에러: {props.error}</div>}
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div className={[S.imageNotice, className].filter(Boolean).join(" ")}>
        {props.renderEmpty ?? <div>표시할 데이터가 없습니다.</div>}
      </div>
    );
  }

  // 레이아웃 제어용 CSS 변수
  const columns = props.columns ?? 3;
  const gap = props.gap ?? 12;
  const rootStyle: React.CSSProperties = {
    ["--cols" as any]: String(columns),
    ["--gap" as any]: typeof gap === "number" ? `${gap}px` : gap,
  };

  return (
    <div
      className={[S.imageNotice, className].filter(Boolean).join(" ")}
      style={rootStyle}
    >
      <MzPaginationManaged
        items={items}
        itemsPerPage={pageSize}
        render={({ currentItems }) => (
          <div className={S.imageNotice__list}>
            {currentItems.map((item, idx) => {
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

              // 마크업 단순화 정책
              // href가 있으면 Link로 감싸고(상세페이지), 없으면 div로 감싸기(썸네일이미지만 보이기)
              // - 썸네일만 Link로 감싸 레이어 중첩/겹침 제거
              // - 아이템 루트는 항상 div로 유지하여 클릭/탭 영역을 명확히 분리
              const thumb = href ? (
                <Link
                  href={href}
                  className={S.imageNotice__thumb}
                  onClick={handleClick}
                >
                  <Image
                    src={src}
                    alt={titleText}
                    width={imageWidth}
                    height={imageHeight}
                  />
                </Link>
              ) : (
                <div className={S.imageNotice__thumb}>
                  <Image
                    src={src}
                    alt={titleText}
                    width={imageWidth}
                    height={imageHeight}
                  />
                </div>
              );
              // 부모 페이지에서 예시 헤더/푸터 사용 예시
              // <ImageNotice
              //   items={eventData}
              //   renderHeader={() => <div className="badge">NEW</div>}
              //   renderFooter={(item) => (
              //     <button onClick={() => share(item)}>공유</button>
              //   )}
              // />;
              return (
                <div
                  className={S.imageNotice__item}
                  key={key}
                  onClick={!href ? handleClick : undefined}
                >
                  {renderHeader ? renderHeader(item) : null}
                  {thumb}
                  <div className={S.imageNotice__body}>
                    <h4 className={S.imageNotice__title}>{titleText}</h4>
                    {renderMetaArea ? renderMetaArea(item) : null}
                    {renderActions ? renderActions(item) : null}
                  </div>
                  {renderFooter ? renderFooter(item) : null}
                </div>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
