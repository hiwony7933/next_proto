"use client";
import React from "react";
import S from "./paymentCard.module.scss";

interface PaymentCardProps {
  type: "radio" | "checkbox";
  title: string;
  isActive: boolean;
  onSelect: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function PaymentCard({
  type,
  title,
  isActive,
  onSelect,
  disabled = false,
  children,
}: PaymentCardProps) {
  return (
    <div
      className={`${S.card} ${isActive ? S.card__active : ""} ${
        disabled ? S.card__disabled : ""
      }`}
    >
      {/* 헤더: 라디오/체크박스 + 타이틀 */}
      <div className={S.card__header}>
        <div className={S.card__selector} onClick={!disabled ? onSelect : undefined}>
          <input
            type={type}
            checked={isActive}
            onChange={onSelect}
            disabled={disabled}
            className={S.card__input}
          />
          <span className={S.card__label}>{title}</span>
        </div>
      </div>

      {/* 구분선 */}
      {isActive && children && <div className={S.card__divider} />}

      {/* 내용 */}
      {isActive && children && <div className={S.card__content}>{children}</div>}
    </div>
  );
}

