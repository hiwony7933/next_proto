"use client";
import React, { useState } from "react";
import S from "./footer.module.scss";
import Link from "next/link";
import MzSelectBox from "@/app/common/components/form/mzSelectBox";
import MzButton from "@/app/common/components/ui/mzButton";

export default function Footer() {
  // 총 4개의 그룹으로 familyLinkGroups를 정의합니다.
  const familyLinkGroups = {
    group01: [
      {
        icon: "",
        label: "개인정보처리방침",
        href: "",
      },
      {
        icon: "",
        label: "위치기반서비스 이용약관",
        href: "",
      },
      {
        icon: "",
        label: "영상정보처리방침",
        href: "",
      },
      {
        icon: "",
        label: "신용정보활용체제공시",
        href: "",
      },
    ],
    group02: [
      {
        icon: "",
        label: "회사소개",
        href: "",
      },
      {
        icon: "",
        label: "SK윤리경영",
        href: "",
      },
      {
        icon: "",
        label: "채용정보",
        href: "",
      },
      {
        icon: "",
        label: "ESG경영",
        href: "",
      },
    ],
    group03: [
      {
        icon: "",
        label: "NSOK 고객지원",
        href: "",
      },
      {
        icon: "",
        label: "사업자등록증",
        href: "",
      },
      {
        icon: "",
        label: "뷰가드 웹서비스",
        href: "",
      },
    ],
    group04: [
      {
        icon: "",
        label: "YouTube",
        href: "",
      },
      {
        icon: "",
        label: "Blog",
        href: "",
      },
      {
        icon: "",
        label: "Facebook",
        href: "",
      },
      {
        icon: "",
        label: "Instagram",
        href: "",
      },
    ],
  };
  const options = ["전체", "이미지", "텍스트", "HTML", "상품", "파일"];
  const [selected, setSelected] = useState(options[0]);
  return (
    <footer className={S.footer} role="banner">
      <div className={S.footer__inner}>
        <div className={S.footer__top}>
          <div className={S.footer__topLeft}>
            <div className={S.footer__title}>
              SK쉴더스의
              <br />
              전문가와 상담하세요
              <div className={S.footer__desc}>
                원하는 상담 내용과 간단한 정보를 남겨주시면 전문 상담사가
                도와드리겠습니다.
              </div>
            </div>
          </div>
          <div className={S.footer__topCenter}>
            <span>전화상담</span>
            <span>1800-6400</span>
            <span>평일 09:00~18:00 일요일/공휴일 휴무</span>
          </div>
          <div className={S.footer__topRight}>
            <MzButton>정보보안 전문상담</MzButton>
            <MzButton> ADT 캡스(물리보안)상담</MzButton>
          </div>
        </div>
        <div className={S.footer__bottom}>
          <div className={S.footer__bottomLeft}>
            <div className={S.footer__title}>에스케이쉴더스 주식회사</div>
            <div>
              <div>
                3486 경기도 성남시 분당구 판교로 227번길 23, 4&5층
                <br />
                사업자등록번호 : 120-86-07747
              </div>
              <div className={S.footer__title}>
                COPYRIGHT © 2026 SK SHIELDUS. ALL RIGHTS RESERVED.
              </div>
            </div>
            <div>
              <div>
                인증범위] SK쉴더스 대표홈페이지 및
                홈보안/물리보안/정보보안/융합보안/케어 서비스 운영 [유효기간]
                2023-08-02 ~ 2026-08-01
              </div>
            </div>
            <div>
              <div>Copyright 2025 SK쉴더스. All rights reserved.</div>
            </div>
          </div>
          <div className={S.footer__bottomCenter}>
            <div className={S.footer__familyList}>
              {Object.values(familyLinkGroups).map((item, index) => (
                <div className={S.footer__familyItem} key={index}>
                  {item.map((link, linkIdx) => (
                    <Link
                      className={S.footer__familyLink}
                      href={link.href}
                      key={linkIdx}
                      passHref
                    >
                      {link.icon ? (
                        <img src={link.icon} alt={link.label} />
                      ) : null}
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={S.footer__bottomRight}>
            <MzSelectBox
              type="default"
              size="5"
              options={options}
              selected={selected}
              style={{ color: "#fff" }}
              onSelect={(v) => setSelected(typeof v === "string" ? v : v[0])}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
