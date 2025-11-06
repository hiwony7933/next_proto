"use client";
import React, { use } from "react";
import { notFound } from "next/navigation";
import { listNoticeData } from "@/sample/data/listNotice";
import MzButton from "@/app/common/components/atom/mzButton";
import S from "./page.module.scss";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function AnnouncementIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const numericId = Number(id);
  const item = listNoticeData.find((ev) => ev.id === numericId);

  if (!item) {
    notFound();
  }

  const { isMobile } = useBreakpoint();
  console.log(isMobile);
  return (
    <div className="layout__container">
      <div className={S.detail__container}>
        <div className={S.detail__titleArea}>
          <span className={S.detail__titleText}>{item.content}</span>
          {item.label && (
            <span className={S.detail__label} aria-label="New">
              New
            </span>
          )}
        </div>
        <div className={S.detail__date}>{item.date ?? ""}</div>
        <div className={S.detail__attachments}>
          <span className={S.detail__attachmentsFileName}>파일명</span>
          <MzButton size="Small" style={{ gap: 8, color: "#8E8E8E" }}>
            다운로드
            <i
              className={`icon__12_download ${S.detail__attachmentsDownloadIcon}`}
              aria-hidden="true"
              style={{ backgroundColor: "black" }}
            />
          </MzButton>
        </div>
        <div className={S.detail__content}>
          <div
            className={S.detail__contentText}
            dangerouslySetInnerHTML={{ __html: item.deepContent ?? "" }}
          />
        </div>
        <div className={S.detail__bottomArea}>
          <button type="button" className={S.detail__row}>
            <div className={S.detail__moveItem}>
              이전글
              <i className="icon__20_up_arrow" />
            </div>
            <div className={S.detail__moveTitleArea}>
              이전글 타이틀이전글 타이틀이전글 타이틀이전글 타이틀이전글
              타이틀타이틀이전글 타이틀이전글 타이
            </div>
            <div className={S.detail__moveDate}>2025.09.05</div>
          </button>
          <button type="button" className={S.detail__row}>
            <div className={S.detail__moveItem}>
              다음글
              <i className="icon__20_down_arrow" />
            </div>
            <div className={S.detail__moveTitleArea}>다음글 타이틀</div>
            <div className={S.detail__moveDate}>2025.09.05</div>
          </button>
        </div>
        <div className={S.detail__cta}>
          <MzButton cta size="Large" fill="black" href="/sk/about/announcement">
            목록
          </MzButton>
        </div>
      </div>
    </div>
  );
}
