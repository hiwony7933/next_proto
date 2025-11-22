"use client";
import React, { useState } from "react";
import MzButton from "@/app/common/components/atom/mzButton";
import { MzCheckBox } from "@/app/common/components/atom/mzCheckBox";
import PaymentCard from "./components/paymentCard";
import BankPaymentForm from "./components/bankPaymentForm";
import S from "./page.module.scss";

export default function PaymentInfoPage() {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card">("bank");

  // 약관 동의
  const [allAgreed, setAllAgreed] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  // 전체 동의 핸들러
  const handleAllAgreedChange = (checked: boolean) => {
    setAllAgreed(checked);
    setAgree1(checked);
    setAgree2(checked);
  };

  // 개별 약관 변경 시 전체 체크박스 업데이트
  React.useEffect(() => {
    if (agree1 && agree2) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }, [agree1, agree2]);

  const handleCancel = () => {
    console.log("취소");
  };

  const handleSubmit = () => {
    console.log("입력완료");
  };

  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">온라인 가입신청</h2>
      </div>

      <div className={S.payment}>
        {/* 페이지 설명 */}
        <p className={S.payment__description}>
          결제 정보를 입력하지 않으실 경우, 결제는 지로(GIRO) 청구 방식으로
          진행됩니다.
        </p>

        {/* 섹션 타이틀 */}
        <div className={S.payment__section}>
          <div className={S.section__header}>
            <h3 className={S.section__title}>결제 정보 입력</h3>
            <div className={S.section__divider} />
            <span className={S.section__subtitle}>
              제휴카드 할인 및 결제 안내
            </span>
          </div>

          {/* 계좌 자동결제 */}
          <PaymentCard
            type="radio"
            title="계좌 자동결제"
            isActive={paymentMethod === "bank"}
            onSelect={() => setPaymentMethod("bank")}
          >
            <BankPaymentForm />
          </PaymentCard>

          {/* 카드 자동결제 */}
          <PaymentCard
            type="radio"
            title="카드 자동결제"
            isActive={paymentMethod === "card"}
            onSelect={() => setPaymentMethod("card")}
            disabled
          >
            {/* TODO: 카드 결제 폼 구현 */}
          </PaymentCard>
        </div>

        {/* 안내 박스 */}
        <div className={S.info__box}>
          <i className="icon__24_info" />
          <p className={S.info__text}>
            계약서와 약관은 이메일로 발송되며, 가입 변경 또는 해지는 SK쉴더스
            고객센터(1588-6400)로 문의해주세요
          </p>
        </div>

        {/* 약관 동의 */}
        <div className={S.agreement}>
          <div className={S.agreement__header}>
            <MzCheckBox
              type="checkbox"
              id="allAgreed"
              shape="square"
              checked={allAgreed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAllAgreedChange(e.target.checked)
              }
            >
              <span>필수 약관에 모두 동의합니다</span>
            </MzCheckBox>
          </div>
          <div className={S.agreement__divider} />

          <div className={S.agreement__list}>
            <div className={S.agreement__item}>
              <MzCheckBox
                type="checkbox"
                id="agree1"
                shape="square"
                checked={agree1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAgree1(e.target.checked)
                }
              >
                <span className={S.required}>[필수]</span>
                <span>주요 계약약관에 동의합니다</span>
              </MzCheckBox>
              <button type="button" className={S.view__button}>
                보기
              </button>
            </div>

            <div className={S.agreement__item}>
              <MzCheckBox
                type="checkbox"
                id="agree2"
                shape="square"
                checked={agree2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAgree2(e.target.checked)
                }
              >
                <span className={S.required}>[필수]</span>
                <span>개인정보 수집 및 이용에 동의합니다</span>
              </MzCheckBox>
              <button type="button" className={S.view__button}>
                보기
              </button>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={S.payment__actions}>
          <MzButton size="Large" fill="white" onClick={handleCancel}>
            취소
          </MzButton>
          <MzButton size="Large" cta fill="black" onClick={handleSubmit}>
            입력완료
          </MzButton>
        </div>
      </div>
    </div>
  );
}
