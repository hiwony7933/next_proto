"use client";
import React, { useState } from "react";
import MzTabs from "@/app/common/components/ui/mzTabs";
import { MzCheckBox } from "@/app/common/components/form/mzCheckBox";
import MzSelectBox from "@/app/common/components/form/mzSelectBox";
import MzButton from "@/app/common/components/ui/mzButton";
import MzInputText from "@/app/common/components/form/mzInputText";

export default function InvoicePage() {
  const optionsYear = [
    "2025년",
    "2024년",
    "2023년",
    "2022년",
    "2021년",
    "2020년",
  ];
  const optionsMonth = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const [selectedYear, setSelectedYear] = useState(optionsYear[0]);
  const [selectedMonth, setSelectedMonth] = useState(optionsMonth[0]);
  const tabData = [
    {
      label: "문서 재발행(세금계산서, 청구서)",
      content: (
        <div>
          <h3>계약정보</h3>
          <label htmlFor="contractInfo">계약정보</label>
          <MzInputText type="text" id="contractInfo" />
          <label htmlFor="companyName">상호명</label>
          <MzInputText type="text" id="companyName" />
          <h3>요청자정보</h3>
          <label htmlFor="name">이름</label>
          <MzInputText type="text" id="name" />
          <label htmlFor="phone">전화번호</label>
          <MzInputText type="text" id="phone" />
          <h3>재발행 요청 문서 번호</h3>
          <p>재발행 요청하실 문서를 선택해 주세요.(중복 선택가능)</p>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            세금 계산서
          </MzCheckBox>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            요금내역서
          </MzCheckBox>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            청구서
          </MzCheckBox>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            명세서
          </MzCheckBox>
          재발행 원하시는 발행일을 선택해 주세요
          <MzSelectBox
            type="default"
            size="5"
            options={optionsYear}
            selected={selectedYear}
            className="dropdown"
            onSelect={(v) => setSelectedYear(typeof v === "string" ? v : v[0])}
          />
          <MzSelectBox
            type="default"
            size="5"
            options={optionsMonth}
            selected={selectedMonth}
            className="dropdown"
            onSelect={(v) => setSelectedMonth(typeof v === "string" ? v : v[0])}
          />
          <MzButton fill="black">추가</MzButton>
          <MzButton fill="black">삭제</MzButton>
          <h3>재발행 된 문서 받으실 정보</h3>
          <label htmlFor="email">이메일주소</label>
          <MzInputText id="email"></MzInputText>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            네, 보내주세요.
          </MzCheckBox>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            아니요. 등록된 이메일로 보내주세요.
          </MzCheckBox>
          <h3>기타 요청사항</h3>
          <label htmlFor="content">내용</label>
          <MzInputText id="content"></MzInputText>
          <MzButton fill="black">접수하기</MzButton>
        </div>
      ),
    },
    {
      label: "세금계산서 정보변경(대표자, 상호, 업태 등)",
      content: (
        <div>
          <h3>계약정보</h3>
          <label htmlFor="contractInfo">계약정보</label>
          <MzInputText type="text" id="contractInfo" />
          <label htmlFor="companyName">상호명</label>
          <MzInputText type="text" id="companyName" />
          <h3>요청자정보</h3>
          <label htmlFor="name">이름</label>
          <MzInputText type="text" id="name" />
          <label htmlFor="phone">전화번호</label>
          <MzInputText type="text" id="phone" />
          <h3>세금계산서 정보 변경 항목</h3>
          <p>변경하실 항목을 선택하고 수정해주세요.(중복 선택 가능)</p>
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            대표자명
          </MzCheckBox>
          <MzInputText type="text" id="representativeName" />
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            상호명
          </MzCheckBox>
          <MzInputText type="text" id="companyName" />
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            업태
          </MzCheckBox>
          <MzInputText type="text" id="businessType" />
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            종목
          </MzCheckBox>
          <MzInputText type="text" id="businessType" />
          <MzCheckBox
            type="checkbox"
            id="allCheck"
            shape="round"
            checked={false}
            onChange={() => {}}
          >
            주소
          </MzCheckBox>
          <MzInputText type="text" id="address" />
          <MzInputText type="text" id="addressDetail" />
          <h3>세금계산서 정보변경 적용시기</h3>
          <p>변경된 정보가 적용될 시기(월)을 선택해주세요</p>
          <MzSelectBox
            type="default"
            size="5"
            options={optionsYear}
            selected={selectedYear}
            className="dropdown"
            onSelect={(v) => setSelectedYear(typeof v === "string" ? v : v[0])}
          />
          <MzSelectBox
            type="default"
            size="5"
            options={optionsMonth}
            selected={selectedMonth}
            className="dropdown"
            onSelect={(v) => setSelectedMonth(typeof v === "string" ? v : v[0])}
          />

          <h3>증명문서 첨부</h3>
          <p>사업자 등ㄹ옥증 정보 바탕으로 수정되니 사본을 첨부해주세요.</p>
          <MzButton fill="black">파일선택</MzButton>
          <MzInputText id="file"></MzInputText>

          <h3>기타 요청사항</h3>
          <label htmlFor="content">내용</label>
          <MzInputText id="content"></MzInputText>

          <MzButton fill="black">접수하기</MzButton>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div>접수해주신 문의는 다음 업무일 4시간 이내 답변 드립니다.</div>
      <MzTabs tabs={tabData} tabSize={true} />
    </div>
  );
}
