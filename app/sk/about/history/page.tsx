"use client";
import React from "react";
import MzTabs from "@/app/common/components/molecule/mzTabs";

const tabs = [
  { label: "현재~2020", content: <div>2025</div> },
  { label: "2019~2010", content: <div>archive</div> },
  { label: "2009~2000", content: <div>archive</div> },
  { label: "~1999 이전", content: <div>archive</div> },
];

export default function HistoryPage() {
  return (
    <div>
      HistoryPage
      <MzTabs tabs={tabs} />
    </div>
  );
}
