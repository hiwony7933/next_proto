"use client";
import React, { useState } from "react";
import MzButton from "@/app/common/components/atom/mzButton";
import { MzCheckBox } from "@/app/common/components/atom/mzCheckBox";
import S from "./step2Confirm.module.scss";

interface Step2ConfirmProps {
  onConfirm: () => void;
}

export default function Step2Confirm({ onConfirm }: Step2ConfirmProps) {
  const [finalAgreed, setFinalAgreed] = useState(false);

  // 임시 데이터 (실제로는 props나 context로 받아와야 함)
  const subscriptionData = {
    totalPrice: 157700,
    items: [
      { name: "바이러스 백신", quantity: "1개", price: 2000 },
      { name: "랜섬웨어차단", quantity: "1개", price: 3300 },
      { name: "통합PC보안", quantity: "1개", price: 4500 },
      {
        name: "통합 네트워크 보안",
        description: "50대 이만",
        quantity: "1개",
        price: 119000,
      },
    ],
    userInfo: {
      name: "김**",
      phone: "010-****-5678",
      email: "caps****@adt.co.kr",
      address: "경기도 성남시 분당구 ***로 227번길 23, ****",
    },
  };

  const handleConfirm = () => {
    if (!finalAgreed) {
      alert("본인은 구독 내용을 확인하였고 계약을 체결합니다에 동의해주세요.");
      return;
    }
    onConfirm();
  };

  return (
    <div className="form__container">
      {/* 선택 정보 */}
      <div className={S.info__section}>
        <div className={S.info__header}>
          <span className={S.info__label}>선택 정보</span>
          <span className={S.info__total}>
            총 {subscriptionData.totalPrice.toLocaleString()}원
          </span>
        </div>
        <div className={S.info__content}>
          {subscriptionData.items.map((item, index) => (
            <div key={index} className={S.info__item}>
              <div className={S.info__item__left}>
                <span className={S.info__item__name}>{item.name}</span>
                {item.description && (
                  <span className={S.info__item__desc}>{item.description}</span>
                )}
                <span className={S.info__item__quantity}>{item.quantity}</span>
              </div>
              <span className={S.info__item__price}>
                {item.price.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 구독자 정보 */}
      <div className={S.info__section}>
        <div className={S.info__title}>구독자 정보</div>
        <div className={S.user__info}>
          <div className={S.user__info__row}>
            <span className={S.user__info__label}>이름</span>
            <span className={S.user__info__value}>
              {subscriptionData.userInfo.name}
            </span>
          </div>
          <div className={S.user__info__row}>
            <span className={S.user__info__label}>휴대폰번호</span>
            <span className={S.user__info__value}>
              {subscriptionData.userInfo.phone}
            </span>
          </div>
          <div className={S.user__info__row}>
            <span className={S.user__info__label}>이메일</span>
            <span className={S.user__info__value}>
              {subscriptionData.userInfo.email}
            </span>
          </div>
          <div className={S.user__info__row}>
            <span className={S.user__info__label}>주소</span>
            <span className={S.user__info__value}>
              {subscriptionData.userInfo.address}
            </span>
          </div>
        </div>
      </div>

      {/* 최종 약관 */}
      <div className={S.final__agreement}>
        <MzCheckBox
          type="checkbox"
          id="finalAgreed"
          shape="round"
          checked={finalAgreed}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFinalAgreed(e.target.checked)
          }
        >
          <span className={S.final__agreement__text}>
            <span className={S.required}>[필수]</span> 본인은 구독 내용을
            확인하였고 계약을 체결합니다.
          </span>
        </MzCheckBox>
      </div>

      <div className="form__bottom">
        <MzButton size="Large" cta fill="black" onClick={handleConfirm}>
          동의하고 구독 신청하기
        </MzButton>
      </div>
    </div>
  );
}
