"use client";
import React from "react";
import S from "./page.module.scss";
import { eventData } from "@/sample/data/event";
import ImageNotice from "@/app/common/components/custom/imageNotice";

export default function EventPage() {
  const items = eventData;
  console.log(items);
  return (
    <div className={S.eventPage}>
      <ImageNotice items={items} />
    </div>
  );
}
