"use client";
import React, { ReactNode } from "react";
import MzButton from "../../../common/components/ui/mzButton";
import MzAlert from "../../../common/components/ui/mzAlert";

interface AdminTitleProps {
  title: string;
  subTitle?: string;
  right?: ReactNode;
  className?: string;
  showHide?: boolean;
  setIsFormShowHide?: React.Dispatch<React.SetStateAction<boolean>>; // setter 받기
  isFormShowHide?: boolean; // 추가
}

export const AdminTitle: React.FC<AdminTitleProps> = ({
  title,
  subTitle,
  right,
  className,
  showHide = false,
  setIsFormShowHide,
  isFormShowHide,
}) => {
  // 버튼 클릭 핸들러: 자식에서 직접 상태 변경
  const handleUnderlineClick = () => {
    if (setIsFormShowHide) setIsFormShowHide((prev) => !prev); // 토글
  };

  return (
    <div className="layoutTitle">
      <h2 className="title">
        {title} <span>{subTitle}</span>
      </h2>
      {showHide && (
        <div className="showHide">
          <MzButton
            className="mzUnderline"
            size="5"
            onClick={handleUnderlineClick}
          >
            {isFormShowHide ? "열기" : "닫기"}
          </MzButton>
        </div>
      )}
      {right && <div className="right">{right}</div>}
    </div>
  );
};

export default AdminTitle;
