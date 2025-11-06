"use client";
import React, { useState } from "react";
import S from "./stepHeader.module.scss";

interface Step {
  title: string; // 각 스텝의 타이틀
  label?: string; // 선택적: 스텝 레이블 (예: "정보 입력", "완료")
  content: React.ReactNode;
}

interface StepHeaderProps {
  steps: Step[];
  currentStep?: number; // 1-based index, 선택적 (기본값 1)
  onStepChange?: (stepIndex: number) => void; // 스텝 변경 시 콜백
}

export default function StepHeader({
  steps,
  currentStep: controlledStep,
  onStepChange,
}: StepHeaderProps) {
  const [internalStep, setInternalStep] = useState(1);

  // controlled vs uncontrolled
  const currentStep =
    controlledStep !== undefined ? controlledStep : internalStep;
  const isControlled = controlledStep !== undefined;

  const handleStepClick = (stepNumber: number) => {
    if (!isControlled) {
      setInternalStep(stepNumber);
    }
    onStepChange?.(stepNumber);
  };

  // 현재 스텝의 타이틀 가져오기
  const currentTitle = steps[currentStep - 1]?.title || "";

  return (
    <>
      <div className={S.header}>
        <h1 className={S.header__title}>{currentTitle}</h1>
        <div className={S.header__steps}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className={`${S.step} ${isActive ? S.step__active : ""} ${
                  isCompleted ? S.step__completed : ""
                }`}
                onClick={() => handleStepClick(stepNumber)}
                role="button"
                tabIndex={0}
                aria-label={`${stepNumber}단계${step.label ? `: ${step.label}` : ""}`}
                aria-current={isActive ? "step" : undefined}
              >
                <span>{stepNumber}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={S.step__content}>{steps[currentStep - 1]?.content}</div>
    </>
  );
}
