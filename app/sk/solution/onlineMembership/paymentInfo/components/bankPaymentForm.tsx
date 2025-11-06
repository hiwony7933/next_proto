"use client";
import React, { useState } from "react";
import MzInputText from "@/app/common/components/atom/mzInputText";
import S from "./bankPaymentForm.module.scss";

export default function BankPaymentForm() {
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transferDate, setTransferDate] = useState("");

  return (
    <div className={S.form}>
      {/* 경고 텍스트 */}
      <div className={S.form__section}>
        <p className={S.form__warning}>
          *본인 명의의 계좌정보만 등록 가능합니다.
        </p>
        <label className={S.form__label}>출금계좌은행 / 계좌번호</label>

        <div className={S.form__row}>
          <div className={S.form__field}>
            <select
              className={S.form__select}
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              <option value="">은행 선택</option>
              <option value="kb">국민은행</option>
              <option value="shinhan">신한은행</option>
              <option value="woori">우리은행</option>
              <option value="hana">하나은행</option>
              <option value="nh">농협은행</option>
            </select>
          </div>

          <div className={S.form__field}>
            <MzInputText
              type="text"
              value={accountNumber}
              placeholder="계좌번호를 입력해주세요"
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 자동이체일 */}
      <div className={S.form__section}>
        <label className={S.form__label}>자동이체일</label>

        <div className={S.form__row}>
          <div className={S.form__field}>
            <select
              className={S.form__select}
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
            >
              <option value="">자동이체일을 선택해주세요</option>
              <option value="1">매월 1일</option>
              <option value="5">매월 5일</option>
              <option value="10">매월 10일</option>
              <option value="15">매월 15일</option>
              <option value="20">매월 20일</option>
              <option value="25">매월 25일</option>
            </select>
          </div>

          <div className={S.form__field}>
            <div className={S.form__amount}>
              <span className={S.form__amount__label}>자동이체금액</span>
              <span className={S.form__amount__value}>12,000원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 신청자 정보 */}
      <div className={S.form__info}>
        <p>2024년 08월 20일 신청인 김쉴드</p>
      </div>
    </div>
  );
}

