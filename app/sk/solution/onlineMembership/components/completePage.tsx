"use client";
import React from "react";
import MzButton from "@/app/common/components/atom/mzButton";
import useBreakpoint from "@/hooks/useBreakpoint";
import S from "./completePage.module.scss";

export default function CompletePage() {
  const { isDesktop } = useBreakpoint();

  const handleGoHome = () => {
    // TODO: 실제 메인 페이지로 이동
    console.log("홈으로 이동");
  };

  const handlePayment = () => {
    // TODO: 결제 정보 입력 페이지로 이동
    console.log("결제 정보 입력");
  };

  const handleViewContract = () => {
    // TODO: 전자계약서 확인
    console.log("전자계약서 확인");
  };

  const handleDownloadContract = () => {
    // TODO: 전자계약서 다운로드
    console.log("전자계약서 다운로드");
  };

  return (
    <div className="form__container">
      <div className={S.complete}>
        {/* 체크 아이콘 */}
        <div className={S.complete__icon}>
          <i className="icon__80_red_check" />
        </div>

        {/* 타이틀 영역 */}
        <div className={S.complete__header}>
          <h2 className={S.complete__title}>
            {!isDesktop ? (
              <>
                사이버가드 구독 신청이
                <br />
                완료되었습니다
              </>
            ) : (
              "사이버가드 구독 신청이 완료되었습니다"
            )}
          </h2>
          <p className={S.complete__subtitle}>
            마케팅 정보 제공을 위한 광고성 정보 수신에 동의하셨습니다.
            <br />
            SK쉴더스 2024년 10월 07일
          </p>
        </div>

        {/* 안내 박스 */}
        <div className={S.notice}>
          <div className={S.notice__header}>
            <i className="icon__24_info" />
            <span className={S.notice__title}>
              계약 증서{!isDesktop ? "와 계약약관" : ""}을 확인하세요.
            </span>
          </div>
          <p className={S.notice__description}>
            계약 내용은 구독 시 기재하신 이메일로 발송되며, 홈페이지의 '계약
            조회' 메뉴에서 확인 및 출력이 가능합니다. 가입 변경 또는 해지가
            필요한 경우 SK쉴더스 고객센터(1588-6400)로 문의 주세요
          </p>

          {/* 계약서 버튼 */}
          <div className={S.notice__buttons}>
            <MzButton
              size={!isDesktop ? "Medium" : "Large"}
              fill="white"
              onClick={handleViewContract}
            >
              전자계약서 확인
            </MzButton>
            <MzButton
              size={!isDesktop ? "Medium" : "Large"}
              fill="white"
              onClick={handleDownloadContract}
            >
              전자계약서 다운로드
            </MzButton>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={S.complete__actions}>
          {!isDesktop ? (
            <>
              <MzButton size="Large" cta fill="black" onClick={handlePayment}>
                결제 정보 입력
              </MzButton>
              <MzButton size="Large" fill="white" onClick={handleGoHome}>
                홈으로 이동
              </MzButton>
            </>
          ) : (
            <>
              <MzButton size="Large" fill="white" onClick={handleGoHome}>
                홈으로 이동
              </MzButton>
              <MzButton size="Large" cta fill="black" onClick={handlePayment}>
                결제 정보 입력
              </MzButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
