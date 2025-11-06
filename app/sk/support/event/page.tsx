"use client";
import React from "react";
import { eventData } from "@/sample/data/event";
import ImageCardList from "@/app/common/components/template/imageCardList";
import S from "./page.module.scss";
import useResponsiveColumns from "@/hooks/useResponsiveColumns";

export default function EventPage() {
  const items = eventData;
  const columns = useResponsiveColumns({
    desktop: 3,
    tablet: 2,
    mobile: 1,
  });
  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">이벤트</h2>
      </div>
      <ImageCardList
        items={items}
        basePath="/sk/support/event"
        columns={columns}
        gap={32}
        renderMetaArea={(item) => (
          <span className={S.imageNotice__date}>{item.date}</span>
        )}
      />
    </div>
  );
}
