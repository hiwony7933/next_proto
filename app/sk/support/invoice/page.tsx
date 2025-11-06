"use client";
import React, { useRef, useState } from "react";
import MzTabs from "@/app/common/components/molecule/mzTabs";
import { MzCheckBox } from "@/app/common/components/atom/mzCheckBox";
import MzButton from "@/app/common/components/atom/mzButton";
import MzInputText from "@/app/common/components/atom/mzInputText";
import MzTextArea from "@/app/common/components/atom/mzTextArea";
import { getYearOptions, getMonthOptions } from "@/lib/dateOptions";
import useBreakpoint from "@/hooks/useBreakpoint";
import MzSelectBox from "@/app/common/components/atom/mzSelectBox";
import AddressSearch from "@/app/common/components/molecule/addressSearch";
import S from "./page.module.scss";
import FormTitle from "./components/formTitle";
import Image from "next/image";
import MzModal from "@/app/common/components/molecule/mzModal";

export default function InvoicePage() {
  const now = new Date();
  const { isMobile } = useBreakpoint();
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
  const [content1, setContent1] = useState("");
  const [showError1, setShowError1] = useState(false);
  const onChangeContent1 = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string
  ) => {
    setContent1(typeof e === "string" ? e : e.target.value);
  };

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
  const [content2, setContent2] = useState("");
  const onChangeContent2 = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string
  ) => {
    setContent2(typeof e === "string" ? e : e.target.value);
  };

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

  const ModalContent1 = () => {
    const iconStyle = {
      backgroundColor: "#EA002C",
      width: "20px",
      height: "20px",
    };
    return (
      <>
        <div className={S.modal__type__1__item}>
          <div className={S.modal__type__1__top}>
            <i className="icon__24_info" style={iconStyle} />
            계약번호와 상호명은 세금계산서의 왼쪽 아래에서 확인 가능합니다.
          </div>
          {isMobile ? (
            <Image
              src="/images/sk/contract_number_tip_mo.png"
              alt="계약번호, 상호명 찾는 법"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <Image
              src="/images/sk/contract_number_tip.png"
              alt="계약번호, 상호명 찾는 법"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </div>
        <div className={S.modal__footer}>
          <MzButton
            size="Large"
            fill="black"
            cta
            onClick={() => setIsOpenModal1(false)}
          >
            확인
          </MzButton>
        </div>
      </>
    );
  };
  const ModalContent2 = () => {
    return (
      <>
        <div className={S.modal__type__2__item}>
          <i className="icon__80_info" />
          <div className={S.modal__type__2__title}>
            문서는 접수 완료 후 이메일로 발송됩니다.
          </div>
          <div className={S.modal__type__2__desc}>
            청구서는 요금영수증 형식의 문서로 발송되며, 납부가 완료된
            <br />
            금액의 청구서 재발생 시 청구 명세서 양식으로 발송됩니다.
          </div>
        </div>
        <div className={S.modal__footer}>
          <MzButton
            size="Large"
            fill="black"
            cta
            onClick={() => setIsOpenModal2(false)}
          >
            확인
          </MzButton>
        </div>
      </>
    );
  };
  const ModalContent3 = () => {
    const iconStyle = {
      backgroundColor: "#EA002C",
      width: "20px",
      height: "20px",
    };
    return (
      <>
        <div className={S.modal__type__1__item}>
          <div className={S.modal__type__1__top}>
            <i className="icon__24_info" style={iconStyle} />
            업태와 종목은 세금계산서 오른쪽 상단에서 확인 가능합니다.
          </div>
          {isMobile ? (
            <Image
              src="/images/sk/contract_class_tip_mo.png"
              alt="업태, 종목 찾는 법"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <Image
              src="/images/sk/contract_class_tip.png"
              alt="업태, 종목 찾는 법"
              width={672}
              height={417}
            />
          )}
        </div>
        <div className={S.modal__footer}>
          <MzButton
            size="Large"
            fill="black"
            cta
            onClick={() => setIsOpenModal3(false)}
          >
            확인
          </MzButton>
        </div>
      </>
    );
  };
  const [isOpenModal1, setIsOpenModal1] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isOpenModal3, setIsOpenModal3] = useState(false);
  const tabData = [
    {
      label: "문서 재발행\n(세금계산서, 청구서)",
      content: (
        <div className="form__container">
          <div className="form__info">
            접수해주신 문의는 다음 업무일 4시간 이내 답변 드립니다.
          </div>
          <div className="form__wrap">
            <FormTitle
              title="계약정보"
              question
              modalTitle="계약번호, 상호명 찾는 법"
              hasHeader={true}
              modalContent={<ModalContent1 />}
              modalSize="720px"
              isOpen={isOpenModal1}
              onOpenChange={setIsOpenModal1}
            />
            <div className="form__row row">
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="contractInfo">
                  계약번호
                </label>
                <MzInputText
                  disabled
                  type="text"
                  id="contractInfo"
                  value={contractInfo1}
                  placeholder="계약번호를 입력해주세요."
                  onChange={(e) => setContractInfo1(e.target.value)}
                  errorText="계약번호를 입력해주세요."
                  showError={showError1 && !contractInfo1.trim()}
                />
              </div>
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="companyName">
                  상호명
                </label>
                <MzInputText
                  type="text"
                  id="companyName"
                  value={companyName1}
                  placeholder="상호명을 입력해주세요."
                  onChange={(e) => setCompanyName1(e.target.value)}
                  errorText="상호명을 입력해주세요."
                  showError={showError1 && !companyName1.trim()}
                />
              </div>
            </div>
          </div>
          <div className="form__wrap">
            <p className="form__title">요청자정보</p>
            <div className="form__row row">
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="name">
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
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="phone">
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
          </div>
          <div className="form__wrap">
            <FormTitle
              title="재발행 요청 문서 번호"
              question
              hasHeader={false}
              isOpen={isOpenModal2}
              onOpenChange={setIsOpenModal2}
              modalContent={<ModalContent2 />}
              modalSize="560px"
            />
            <div className="form__process">
              <label
                className="form__label form__comment required"
                htmlFor="reissueDocOptions"
              >
                재발행 요청하실 문서를 선택해 주세요.(중복 선택가능)
              </label>
              <div className="row">
                <div className="col-12 flex">
                  {reissueDocOptions.map((option) => (
                    <MzCheckBox
                      id={`reissue-${option.id}`}
                      key={option.id}
                      type="checkbox"
                      shape="round"
                      checked={false}
                      onChange={() => {}}
                    >
                      {option.label}
                    </MzCheckBox>
                  ))}
                </div>
              </div>
            </div>
            <div className="form__process">
              <label className="form__label required" htmlFor="reissueYear">
                재발행 원하시는 발행일을 선택해 주세요
              </label>
              <div className="form__process__row row">
                <MzSelectBox
                  options={yearOptions.map((option) => ({
                    label: option.label,
                    value: option.value.toString() as string,
                  }))}
                  selected={selectedYear?.toString() || ""}
                  onSelect={(v) =>
                    setSelectedYear(v === "" ? "" : Number(v as any))
                  }
                  className={`col-${isMobile ? 5 : 6}`}
                />

                <MzSelectBox
                  options={monthOptions.map((option) => ({
                    label: option.label,
                    value: option.value.toString() as string,
                  }))}
                  selected={selectedMonth?.toString() || ""}
                  onSelect={(v) =>
                    setSelectedMonth(v === "" ? "" : Number(v as any))
                  }
                  className={`col-${isMobile ? 4 : 5}`}
                />

                <MzButton
                  size="Form"
                  fill="black"
                  className={`col-${isMobile ? 3 : 1}`}
                >
                  추가
                </MzButton>
              </div>
              <div className="form__process__row row">
                <MzSelectBox
                  options={yearOptions.map((option) => ({
                    label: option.label,
                    value: option.value.toString() as string,
                  }))}
                  selected={selectedYear?.toString() || ""}
                  onSelect={(v) =>
                    setSelectedYear(v === "" ? "" : Number(v as any))
                  }
                  className={`col-${isMobile ? 5 : 6}`}
                />

                <MzSelectBox
                  options={monthOptions.map((option) => ({
                    label: option.label,
                    value: option.value.toString() as string,
                  }))}
                  selected={selectedMonth?.toString() || ""}
                  onSelect={(v) =>
                    setSelectedMonth(v === "" ? "" : Number(v as any))
                  }
                  className={`col-${isMobile ? 4 : 5}`}
                />

                <MzButton
                  size="Form"
                  fill="white"
                  className={`col-${isMobile ? 3 : 1}`}
                >
                  삭제
                </MzButton>
              </div>
            </div>
            <div className="form__process">
              <label className="form__label required" htmlFor="allCheck">
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
            <div className="form__row row" style={{ paddingTop: 0 }}>
              <div className="col-12">
                <label className="form__label required" htmlFor="email">
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
          </div>
          <div className="form-wrap">
            <p className="form__title">기타 요청사항</p>
            <div className="form__row">
              <label className="form__label" htmlFor="content">
                내용
              </label>
              <MzTextArea
                type="normal"
                value={content1}
                onChange={onChangeContent1}
                placeholder="요청하시는 사항을 텍스트로 자유롭게 입력해 주세요."
                height="260px"
                resize="none"
              ></MzTextArea>
            </div>
          </div>
          <div className="form__bottom">
            <MzButton
              size="Large"
              cta
              fill="black"
              onClick={() => setIsSuccess(true)}
            >
              접수하기
            </MzButton>
          </div>
        </div>
      ),
    },
    {
      label: "세금계산서 정보변경\n(대표자, 상호, 업태 등)",
      content: (
        <div className="form__container">
          <div className="form__info">
            접수해주신 문의는 다음 업무일 4시간 이내 답변 드립니다.
          </div>
          <div className="form__wrap">
            <FormTitle
              title="계약정보"
              question
              modalTitle="계약번호, 상호명 찾는 법"
              hasHeader={true}
              modalContent={<ModalContent1 />}
              modalSize="720px"
              isOpen={isOpenModal1}
              onOpenChange={setIsOpenModal1}
            />
            <div className="form__row row">
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="contractInfo">
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
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="companyName">
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
          </div>
          <div className="form__wrap">
            <p className="form__title">요청자정보</p>
            <div className="form__row row">
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="name">
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
              <div className={`col-${isMobile ? 12 : 6}`}>
                <label className="form__label required" htmlFor="phone">
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
          </div>
          <div className="form__wrap">
            <FormTitle
              title="세금계산서 정보 변경 항목"
              question
              modalTitle="업태, 종목 찾는 법"
              hasHeader={true}
              modalContent={<ModalContent3 />}
              modalSize="720px"
              isOpen={isOpenModal3}
              onOpenChange={setIsOpenModal3}
            />
            <div className="form__process">
              <p className="form__comment">
                변경하실 항목을 선택하고 수정해주세요.(중복 선택 가능)
              </p>

              <div className="row">
                <div className={`col-${isMobile ? 12 : 6} box-wrapper`}>
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
                <div className={`col-${isMobile ? 12 : 6} box-wrapper`}>
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
                <div className={`col-${isMobile ? 12 : 6} box-wrapper`}>
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
                <div className={`col-${isMobile ? 12 : 6} box-wrapper`}>
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
                <div className="col-12 box-wrapper">
                  <MzCheckBox
                    type="checkbox"
                    id="allCheck"
                    shape="round"
                    checked={false}
                    onChange={() => {}}
                  >
                    주소
                  </MzCheckBox>
                  <AddressSearch />
                </div>
              </div>
            </div>
          </div>
          <div className="form__wrap">
            <p className="form__title">세금계산서 정보변경 적용시기</p>
            <div className="form__row">
              <label className="form__label required">
                변경된 정보가 적용될 시기(연/월)을 선택해주세요.
              </label>
              <div className="row">
                <div className="col-6">
                  <MzSelectBox
                    style={{ width: "100%" }}
                    options={yearOptions.map((option) => ({
                      label: option.label,
                      value: option.value.toString() as string,
                    }))}
                    selected={selectedYear?.toString() || ""}
                    onSelect={(v) =>
                      setSelectedYear(v === "" ? "" : Number(v as any))
                    }
                  />
                </div>
                <div className="col-6">
                  <MzSelectBox
                    style={{ width: "100%" }}
                    options={monthOptions.map((option) => ({
                      label: option.label,
                      value: option.value.toString() as string,
                    }))}
                    selected={selectedMonth?.toString() || ""}
                    onSelect={(v) =>
                      setSelectedMonth(v === "" ? "" : Number(v as any))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form__wrap">
            <p className="form__title">증명문서 첨부</p>
            <div className="form__row">
              <label className="form__label required">
                사업자 등록증 정보 바탕으로 수정되니 사본을 첨부해주세요.
              </label>
              <div className="row">
                <MzInputText
                  id="file"
                  className={`col-${isMobile ? 7 : 10}`}
                ></MzInputText>
                <MzButton
                  fill="black"
                  size="Form"
                  className={`col-${isMobile ? 5 : 2}`}
                >
                  파일선택
                </MzButton>
              </div>
              <span className="form__file__comment">
                파일은 최대 10MB까지 업로드할 수 있습니다. GIF, JPG, PNG, BMP,
                PDF 파일만 첨부하실 수 있습니다.
              </span>
            </div>
          </div>

          <div className="form__wrap">
            <p className="form__title">기타 요청사항</p>
            <div className="form__row">
              <label className="form__label" htmlFor="content">
                내용
              </label>
              <div className="row">
                <div className="col-12">
                  <MzTextArea
                    type="normal"
                    value={content2}
                    onChange={onChangeContent2}
                    placeholder="요청하시는 사항을 텍스트로 자유롭게 입력해 주세요."
                    height="260px"
                    resize="none"
                  ></MzTextArea>
                </div>
              </div>
            </div>
          </div>

          <div className="form__bottom">
            <MzButton
              size="Large"
              cta
              fill="black"
              onClick={() => setIsSuccess(true)}
            >
              접수하기
            </MzButton>
          </div>
        </div>
      ),
    },
  ];
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpenModal4, setIsOpenModal4] = useState(false);
  const openConfirm = (from: number, to: number) => {
    setIsOpenModal4(true);
  };

  const closeConfirm = () => {
    setIsOpenModal4(false);
  };

  const handleApprove = () => {
    closeConfirm();
  };

  const handleReject = () => {
    closeConfirm();
  };
  const handleBeforeChange = (from: number, to: number): boolean => {
    openConfirm(from, to);
    return true;
  };
  const ModalContent4 = () => {
    return (
      <>
        <div className={S.modal__type__2__item}>
          <i className="icon__80_info" />
          <div className={S.modal__type__2__title}>페이지에서 나갈까요?</div>
          <div className={S.modal__type__2__desc}>
            지금 나가면 작성중인 내용은 저장되지 않아요
          </div>
        </div>
        <div className={S.modal__footer}>
          <MzButton
            size="Large"
            fill="white"
            cta
            onClick={() => closeConfirm()}
          >
            나가기
          </MzButton>
          <MzButton
            size="Large"
            fill="black"
            cta
            onClick={() => handleApprove()}
          >
            계속 진행할게요
          </MzButton>
        </div>
      </>
    );
  };
  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">청구세금계산서</h2>
      </div>

      {isSuccess ? (
        <>
          <div className={`${S.success__container} mt-80`}>
            <div className={S.success__title}>
              <i className="icon__80_red_check" />
              정상적으로 접수 되었습니다.
            </div>
            <div className={S.success__content__wrapper}>
              <div className={S.success__content}>
                <i className="icon__24_info" />
                접수 처리 안내
              </div>
              <div className={S.success__content__text}>
                접수된 문의는 다음 업무일 4시간 이내 처리됩니다. 추가적인 확인이
                필요할 경우, SK쉴더스 고객센터(1588-6400) 번호로 연락드릴 수
                있습니다.
                <br /> SK쉴더스를 이용해주셔서 감사합니다.
              </div>
            </div>
            <div className={S.success__buttons}>
              <MzButton size="Large" cta fill="white">
                다른 문의 접수하기
              </MzButton>
              <MzButton size="Large" cta fill="black">
                메인화면으로 돌아가기
              </MzButton>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-80">
            <MzTabs
              tabs={tabData}
              tabSize={true}
              solid={true}
              onBeforeChange={handleBeforeChange}
            />
          </div>
        </>
      )}
      <MzModal
        isOpen={isOpenModal4}
        onClose={handleReject}
        hasHeader={false}
        contentLabel="탭 이동 확인"
        shouldCloseOnOverlayClick={false}
        variant="alert"
        size="560px"
      >
        <ModalContent4 />
      </MzModal>
    </div>
  );
}
