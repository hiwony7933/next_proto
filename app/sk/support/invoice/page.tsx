"use client";
import React, { useState } from "react";
import MzTabs from "@/app/common/components/ui/mzTabs";
import { MzCheckBox } from "@/app/common/components/form/mzCheckBox";
import MzSelectBox from "@/app/common/components/form/mzSelectBox";
import MzButton from "@/app/common/components/ui/mzButton";
import MzInputText from "@/app/common/components/form/mzInputText";
import { getYearOptions, getMonthOptions } from "@/lib/dateOptions";

export default function InvoicePage() {
  const now = new Date();
  const initialYear = now.getFullYear();
  const initialMonth = now.getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState<string | number>("");
  const [selectedMonth, setSelectedMonth] = useState<string | number>("");
  const yearOptions = getYearOptions({
    startYear: initialYear - 5,
    endYear: initialYear,
    order: "desc",
  });
  const monthOptions = getMonthOptions({
    year: typeof selectedYear === "number" ? selectedYear : initialYear,
    disableFuture: typeof selectedYear === "number",
  });

  const reissueDocOptions = [
    { id: "taxInvoice", label: "세금 계산서" },
    { id: "billingDetails", label: "요금내역서" },
    { id: "bill", label: "청구서" },
    { id: "statement", label: "명세서" },
  ] as const;

  // Tab1: 문서 재발행 폼 상태
  const [contractInfo1, setContractInfo1] = useState("");
  const [companyName1, setCompanyName1] = useState("");
  const [name1, setName1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [email1, setEmail1] = useState("");
  const [showError1, setShowError1] = useState(false);

  const handleSubmitTab1 = () => {
    setShowError1(true);
    const invalid = [contractInfo1, companyName1, name1, phone1, email1].some(
      (v) => !String(v || "").trim()
    );
    if (!invalid) {
      console.log("[문서 재발행] 제출: ", {
        contractInfo1,
        companyName1,
        name1,
        phone1,
        email1,
        year: selectedYear,
        month: selectedMonth,
      });
      alert("접수 완료(모의)");
    }
  };

  // Tab2: 세금계산서 정보변경 폼 상태
  const [contractInfo2, setContractInfo2] = useState("");
  const [companyName2, setCompanyName2] = useState("");
  const [name2, setName2] = useState("");
  const [phone2, setPhone2] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [companyNameChange, setCompanyNameChange] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessItem, setBusinessItem] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [showError2, setShowError2] = useState(false);

  const handleSubmitTab2 = () => {
    setShowError2(true);
    const required = [
      contractInfo2,
      companyName2,
      name2,
      phone2,
      representativeName,
      companyNameChange,
      businessType,
      businessItem,
      address,
    ];
    const invalid = required.some((v) => !String(v || "").trim());
    if (!invalid) {
      console.log("[정보 변경] 제출: ", {
        contractInfo2,
        companyName2,
        name2,
        phone2,
        representativeName,
        companyNameChange,
        businessType,
        businessItem,
        address,
        addressDetail,
        year: selectedYear,
        month: selectedMonth,
      });
      alert("접수 완료(모의)");
    }
  };
  const tabData = [
    {
      label: "문서 재발행(세금계산서, 청구서)",
      content: (
        <div className="form-container">
          <div className="form-info">
            접수해주신 문의는 다음 업무일 4시간 이내 답변 드립니다.
          </div>
          <h3 className="form-title">계약정보</h3>
          <div className="row">
            <div className="col-6">
              <label className="form-label required" htmlFor="contractInfo">
                계약번호
              </label>
              <MzInputText
                type="text"
                id="contractInfo"
                value={contractInfo1}
                onChange={(e) => setContractInfo1(e.target.value)}
                errorText="계약번호를 입력해주세요."
                showError={showError1 && !contractInfo1.trim()}
              />
            </div>
            <div className="col-6">
              <label className="form-label required" htmlFor="companyName">
                상호명
              </label>
              <MzInputText
                type="text"
                id="companyName"
                value={companyName1}
                onChange={(e) => setCompanyName1(e.target.value)}
                errorText="상호명을 입력해주세요."
                showError={showError1 && !companyName1.trim()}
              />
            </div>
          </div>
          <h3 className="form-title">요청자정보</h3>
          <div className="row">
            <div className="col-6">
              <label className="form-label required" htmlFor="name">
                이름
              </label>
              <MzInputText
                type="text"
                id="name"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                errorText="이름을 입력해주세요."
                showError={showError1 && !name1.trim()}
              />
            </div>
            <div className="col-6">
              <label className="form-label required" htmlFor="phone">
                전화번호
              </label>
              <MzInputText
                type="text"
                id="phone"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                errorText="전화번호를 입력해주세요."
                showError={showError1 && !phone1.trim()}
              />
            </div>
          </div>
          <h3 className="form-title">재발행 요청 문서 번호</h3>
          <p>재발행 요청하실 문서를 선택해 주세요.(중복 선택가능)</p>
          <div className="row">
            <div className="col-12 flex">
              {reissueDocOptions.map((option) => (
                <MzCheckBox
                  key={option.id}
                  type="checkbox"
                  id={`reissue-${option.id}`}
                  shape="round"
                  checked={false}
                  onChange={() => {}}
                >
                  {option.label}
                </MzCheckBox>
              ))}
            </div>
          </div>
          재발행 원하시는 발행일을 선택해 주세요
          <label className="form-label" htmlFor="reissueYear">
            발행 연도
          </label>
          <MzSelectBox
            id="reissueYear"
            name="reissueYear"
            type="default"
            size="5"
            options={yearOptions}
            selected={selectedYear}
            className="dropdown"
            onSelect={(v) => setSelectedYear(v === "" ? "" : Number(v as any))}
          />
          <label className="form-label" htmlFor="reissueMonth">
            발행 월
          </label>
          <MzSelectBox
            id="reissueMonth"
            name="reissueMonth"
            type="default"
            size="5"
            options={monthOptions}
            selected={selectedMonth}
            className="dropdown"
            onSelect={(v) => setSelectedMonth(v === "" ? "" : Number(v as any))}
          />
          <MzButton fill="black">추가</MzButton>
          <MzButton fill="black">삭제</MzButton>
          <h3>재발행 된 문서 받으실 정보</h3>
          <div className="row">
            <div className="col-12">
              <label className="form-label required" htmlFor="email">
                이메일주소
              </label>
              <MzInputText
                id="email"
                value={email1}
                onChange={(e) => setEmail1(e.target.value)}
                errorText="이메일주소를 입력해주세요."
                showError={showError1 && !email1.trim()}
              />
            </div>
          </div>
          <div className="row">
            <label className="form-label" htmlFor="email">
              사업자 등록증 정보 바탕으로 수정되니 사본을 첨부해주세요.
            </label>
            <div className="col-12 flex">
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
            </div>
          </div>
          <h3 className="form-title">기타 요청사항</h3>
          <label className="form-label" htmlFor="content">
            내용
          </label>
          <MzInputText
            id="content"
            placeholder="상담 내용을 작성해 주세요."
          ></MzInputText>
          <MzButton fill="black" onClick={handleSubmitTab1}>
            접수하기
          </MzButton>
        </div>
      ),
    },
    {
      label: "세금계산서 정보변경(대표자, 상호, 업태 등)",
      content: (
        <div className="form-container">
          <h3 className="form-title">계약정보</h3>
          <div className="row">
            <div className="col-6">
              <label className="form-label required" htmlFor="contractInfo">
                계약정보
              </label>
              <MzInputText
                type="text"
                id="contractInfo"
                value={contractInfo2}
                onChange={(e) => setContractInfo2(e.target.value)}
                errorText="계약정보를 입력해주세요."
                showError={showError2 && !contractInfo2.trim()}
              />
            </div>
            <div className="col-6">
              <label className="form-label required" htmlFor="companyName">
                상호명
              </label>
              <MzInputText
                type="text"
                id="companyName"
                value={companyName2}
                onChange={(e) => setCompanyName2(e.target.value)}
                errorText="상호명을 입력해주세요."
                showError={showError2 && !companyName2.trim()}
              />
            </div>
          </div>

          <h3 className="form-title">요청자정보</h3>
          <div className="row">
            <div className="col-6">
              <label className="form-label required" htmlFor="name">
                이름
              </label>
              <MzInputText
                type="text"
                id="name"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                errorText="이름을 입력해주세요."
                showError={showError2 && !name2.trim()}
              />
            </div>
            <div className="col-6">
              <label className="form-label required" htmlFor="phone">
                전화번호
              </label>
              <MzInputText
                type="text"
                id="phone"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                errorText="전화번호를 입력해주세요."
                showError={showError2 && !phone2.trim()}
              />
            </div>
          </div>
          <h3 className="form-title">세금계산서 정보 변경 항목</h3>
          <p>변경하실 항목을 선택하고 수정해주세요.(중복 선택 가능)</p>
          <div className="row">
            <div className="col-6">
              <MzCheckBox
                type="checkbox"
                id="allCheck"
                shape="round"
                checked={false}
                onChange={() => {}}
              >
                대표자명
              </MzCheckBox>
              <MzInputText
                type="text"
                id="representativeName"
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                errorText="대표자명을 입력해주세요."
                showError={showError2 && !representativeName.trim()}
              />
            </div>
            <div className="col-6">
              <MzCheckBox
                type="checkbox"
                id="allCheck"
                shape="round"
                checked={false}
                onChange={() => {}}
              >
                상호명
              </MzCheckBox>
              <MzInputText
                type="text"
                id="companyName"
                value={companyNameChange}
                onChange={(e) => setCompanyNameChange(e.target.value)}
                errorText="상호명을 입력해주세요."
                showError={showError2 && !companyNameChange.trim()}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <MzCheckBox
                type="checkbox"
                id="allCheck"
                shape="round"
                checked={false}
                onChange={() => {}}
              >
                업태
              </MzCheckBox>
              <MzInputText
                type="text"
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                errorText="업태를 입력해주세요."
                showError={showError2 && !businessType.trim()}
              />
            </div>
            <div className="col-6">
              <MzCheckBox
                type="checkbox"
                id="allCheck"
                shape="round"
                checked={false}
                onChange={() => {}}
              >
                종목
              </MzCheckBox>
              <MzInputText
                type="text"
                id="businessType"
                value={businessItem}
                onChange={(e) => setBusinessItem(e.target.value)}
                errorText="종목을 입력해주세요."
                showError={showError2 && !businessItem.trim()}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <MzCheckBox
                type="checkbox"
                id="allCheck"
                shape="round"
                checked={false}
                onChange={() => {}}
              >
                주소
              </MzCheckBox>
              <MzInputText
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                errorText="주소를 입력해주세요."
                showError={showError2 && !address.trim()}
              />
            </div>
            <div className="col-6">
              <MzInputText
                type="text"
                id="addressDetail"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </div>
          </div>

          <h3 className="form-title">세금계산서 정보변경 적용시기</h3>
          <p>변경된 정보가 적용될 시기(월)을 선택해주세요</p>
          <label className="form-label" htmlFor="applyYear">
            적용 연도
          </label>
          <MzSelectBox
            id="applyYear"
            name="applyYear"
            type="default"
            size="5"
            options={yearOptions}
            selected={selectedYear}
            className="dropdown"
            onSelect={(v) => setSelectedYear(Number(v as any))}
          />
          <label className="form-label" htmlFor="applyMonth">
            적용 월
          </label>
          <MzSelectBox
            id="applyMonth"
            name="applyMonth"
            type="default"
            size="5"
            options={monthOptions}
            selected={selectedMonth}
            className="dropdown"
            onSelect={(v) => setSelectedMonth(Number(v as any))}
          />

          <h3>증명문서 첨부</h3>
          <p>사업자 등록증 정보 바탕으로 수정되니 사본을 첨부해주세요.</p>
          <MzButton fill="black">파일선택</MzButton>
          <MzInputText id="file"></MzInputText>

          <h3>기타 요청사항</h3>
          <label className="form-label" htmlFor="content">
            내용
          </label>
          <MzInputText id="content"></MzInputText>

          <MzButton fill="black" onClick={handleSubmitTab2}>
            접수하기
          </MzButton>
        </div>
      ),
    },
  ];
  return (
    <div>
      <MzTabs tabs={tabData} tabSize={true} solid={true} />
    </div>
  );
}
