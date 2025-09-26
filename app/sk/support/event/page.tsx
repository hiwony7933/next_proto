"use client";
import React from "react";
import S from "./page.module.scss";
import { eventData } from "@/sample/data/event";
import ImageNotice from "@/app/sk/components/common/imageNotice";

export default function EventPage() {
  const items = eventData;
  console.log(items);
  return (
    <div className={S.eventPage}>
      <ImageNotice
        items={items}
        basePath="/sk/support/event"
        columns={4}
        gap={12}
        itemsPerPage={12}
        renderMetaArea={(item) => (
          <span className={S.imageNotice__date}>{item.date}</span>
        )}
      />
    </div>
  );
}
