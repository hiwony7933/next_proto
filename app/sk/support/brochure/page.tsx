"use client";
import React from "react";
import MzInputText from "@/app/common/components/form/mzInputText";
import { brochureData } from "@/sample/data/brochure";
import ImageNotice from "@/app/sk/components/common/imageNotice";
import MzButton from "@/app/common/components/ui/mzButton";

export default function BrochurePage() {
  const onSearchHandler = (q: string) => {
    console.log("search:", q);
  };

  const items = brochureData;

  return (
    <div>
      <div className="notice-wrapper">
        <MzInputText
          mzSize="5"
          placeholder="제목이나 키워드로 검색해 보세요."
          onSearch={onSearchHandler}
          status="search"
        />
      </div>
      <ImageNotice
        items={items}
        renderActions={(item) =>
          item.downloadPath ? (
            <div>
              <MzButton
                type="button"
                size="3"
                fill="black"
                href={item.downloadPath}
                download
                target="_blank"
                rel="noreferrer noopener"
                onClick={(e: any) => e.stopPropagation()}
              >
                {/* 아마도 아이콘 들어가겠지? */}
                PDF 다운로드
              </MzButton>
            </div>
          ) : null
        }
      />
    </div>
  );
}
