"use client";
import React, { useState } from "react";
import StepHeader from "./components/stepHeader";
import Step1Form from "./components/step1Form";
import Step2Confirm from "./components/step2Confirm";
import CompletePage from "./components/completePage";

export default function OnlineMembership() {
  // 폼 상태 관리
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [installDate, setInstallDate] = useState("");
  const [request, setRequest] = useState("");

  // 약관 동의 상태
  const [allRequiredAgreed, setAllRequiredAgreed] = useState(false);
  const [required1, setRequired1] = useState(false);
  const [required2, setRequired2] = useState(false);
  const [required3, setRequired3] = useState(false);
  const [required4, setRequired4] = useState(false);
  const [required5, setRequired5] = useState(false);

  const [allOptionalAgreed, setAllOptionalAgreed] = useState(false);
  const [optional1, setOptional1] = useState(false);
  const [optional2, setOptional2] = useState(false);

  const [showError, setShowError] = useState(false);

  // 전체 필수 약관 동의 핸들러
  const handleAllRequiredChange = (checked: boolean) => {
    setAllRequiredAgreed(checked);
    setRequired1(checked);
    setRequired2(checked);
    setRequired3(checked);
    setRequired4(checked);
    setRequired5(checked);
  };

  // 전체 선택 약관 동의 핸들러
  const handleAllOptionalChange = (checked: boolean) => {
    setAllOptionalAgreed(checked);
    setOptional1(checked);
    setOptional2(checked);
  };

  // 개별 필수 약관 변경 시 전체 체크박스 업데이트
  React.useEffect(() => {
    if (required1 && required2 && required3 && required4 && required5) {
      setAllRequiredAgreed(true);
    } else {
      setAllRequiredAgreed(false);
    }
  }, [required1, required2, required3, required4, required5]);

  // 개별 선택 약관 변경 시 전체 체크박스 업데이트
  React.useEffect(() => {
    if (optional1 && optional2) {
      setAllOptionalAgreed(true);
    } else {
      setAllOptionalAgreed(false);
    }
  }, [optional1, optional2]);

  // 현재 스텝 관리
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStep1Submit = () => {
    setShowError(true);
    const requiredFields = [name, phone, idNumber, email, address];
    const hasEmptyField = requiredFields.some((v) => !String(v || "").trim());
    const hasAllRequiredAgreed =
      required1 && required2 && required3 && required4 && required5;

    if (!hasEmptyField && hasAllRequiredAgreed) {
      console.log("Step 1 완료, Step 2로 이동");
      setCurrentStep(2);
    } else {
      console.log("필수 항목을 입력해주세요.");
    }
  };

  const handleStep2Confirm = () => {
    console.log("최종 제출 완료");
    setIsCompleted(true);
  };

  // Step 1: 정보 입력 폼
  const step1Content = (
    <Step1Form
      name={name}
      setName={setName}
      phone={phone}
      setPhone={setPhone}
      idNumber={idNumber}
      setIdNumber={setIdNumber}
      email={email}
      setEmail={setEmail}
      address={address}
      setAddress={setAddress}
      addressDetail={addressDetail}
      setAddressDetail={setAddressDetail}
      installDate={installDate}
      setInstallDate={setInstallDate}
      request={request}
      setRequest={setRequest}
      allRequiredAgreed={allRequiredAgreed}
      handleAllRequiredChange={handleAllRequiredChange}
      required1={required1}
      setRequired1={setRequired1}
      required2={required2}
      setRequired2={setRequired2}
      required3={required3}
      setRequired3={setRequired3}
      required4={required4}
      setRequired4={setRequired4}
      required5={required5}
      setRequired5={setRequired5}
      allOptionalAgreed={allOptionalAgreed}
      handleAllOptionalChange={handleAllOptionalChange}
      optional1={optional1}
      setOptional1={setOptional1}
      optional2={optional2}
      setOptional2={setOptional2}
      showError={showError}
      onSubmit={handleStep1Submit}
    />
  );

  // Step 2: 정보 확인
  const step2Content = <Step2Confirm onConfirm={handleStep2Confirm} />;

  // Steps 데이터 구성 (2단계만)
  const steps = [
    {
      title: "사이버가드 구독을 위한 정보를 입력해 주세요.",
      label: "정보 입력",
      content: step1Content,
    },
    {
      title: "선택한 구독상품과 입력한 구독자 정보를 확인해 주세요.",
      label: "정보 확인",
      content: step2Content,
    },
  ];

  // 스텝 변경 핸들러
  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // 완료 화면이 표시되면 스텝 헤더 없이 완료 화면만 표시
  if (isCompleted) {
    return (
      <div className="layout__container">
        <CompletePage />
      </div>
    );
  }

  return (
    <div className="layout__container">
      <div className="top__inner">
        <h2 className="top__title">온라인 가입신청</h2>
      </div>

      <StepHeader
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
    </div>
  );
}
