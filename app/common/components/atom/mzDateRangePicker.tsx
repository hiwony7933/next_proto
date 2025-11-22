"use client";

import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./mzDateRangePicker.module.scss";
import MzButton from "./mzButton";
import MzDatePicker from "./mzDatePicker";

// props 예시: value(날짜 또는 [from, to]), onChange(함수), showTime(시간선택여부)
interface MzDateRangePickerProps {
  value: [string, string]; // "YYYY.MM.DD" 형식
  onChange: (date: [string, string]) => void;
  showQuickButtons?: boolean;
  noticeText?: string;
  onValidationError?: (error: string) => void; // 유효성 검사 에러 콜백
  autoValidate?: boolean; // 자동 유효성 검사 여부 (기본값: true)
}

function maskDateInput(raw: string) {
  // 숫자만 남기고, YYYY.MM.DD로 마스킹
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

function validateDateRange(from: Date | null, to: Date | null) {
  // 1. 날짜 타입이 맞지 않을 때 (null이거나, 날짜가 이상할 때)
  if (!from || !to || isNaN(from.getTime()) || isNaN(to.getTime())) {
    return "조회 시작일자입력하십시오.";
  }

  // 2. 시작일이 종료일보다 뒤에 있으면
  if (from > to) {
    return "조회 시작일자는\n조회 종료일자 보다 클 수 없습니다.";
  }

  // 3. 달력에서 선택하지 않고 직접 입력한 경우, 2025.13.32 등 잘못된 날짜
  // (이미 Date 객체로 변환이 안 되면 위에서 걸러짐)
  // 추가로, 월/일 범위 체크는 Date 객체가 알아서 해줌

  return ""; // 유효
}

function validateSingleDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.length !== 10) return null;

  const [y, m, d] = dateStr.split(".").map(Number);
  const dt = new Date(y, m - 1, d);

  // 유효한 날짜인지 확인
  if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
    return dt;
  }

  return null;
}

export const MzDateRangePicker = ({
  value,
  onChange,
  showQuickButtons = true,
  noticeText,
  onValidationError,
  autoValidate = true,
}: MzDateRangePickerProps): React.ReactElement => {
  const [inputs, setInputs] = useState<{ from: string; to: string }>({
    from: value[0] || "",
    to: value[1] || "",
  });
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  // 추가: value에서 from, to 분리
  const [from, to] = value;

  // value가 변경되면 inputs도 동기화
  useEffect(() => {
    setInputs({
      from: value[0] || "",
      to: value[1] || "",
    });
  }, [value[0], value[1]]);

  function formatDate(date: Date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}.${m}.${d}`;
  }

  // 완전한 날짜 처리 함수 (부모에서 별도 함수 불필요)
  const handleCompleteInput = (inputValue: string, type: "from" | "to") => {
    const masked = maskDateInput(inputValue);

    // inputs 상태 업데이트
    setInputs((prev) => ({ ...prev, [type]: masked }));

    // 완전한 날짜 형식인 경우에만 유효성 검사 및 onChange 호출
    if (masked.length === 10) {
      const validDate = validateSingleDate(masked);

      if (validDate) {
        const formatted = formatDate(validDate);
        const newValue: [string, string] =
          type === "from" ? [formatted, value[1]] : [value[0], formatted];

        // 자동 유효성 검사가 활성화된 경우 범위 검사
        if (autoValidate && newValue[0] && newValue[1]) {
          const fromDate = validateSingleDate(newValue[0]);
          const toDate = validateSingleDate(newValue[1]);
          const validationError = validateDateRange(fromDate, toDate);

          if (validationError && onValidationError) {
            onValidationError(validationError);
            return; // 유효하지 않으면 onChange 호출하지 않음
          }
        }

        onChange(newValue);
      } else {
        // 잘못된 날짜 형식
        if (onValidationError) {
          onValidationError("올바른 날짜 형식이 아닙니다.");
        }
      }
    } else {
      // 불완전한 입력의 경우 빈 값으로 처리
      const newValue: [string, string] =
        type === "from" ? ["", value[1]] : [value[0], ""];
      onChange(newValue);
    }
  };

  // 입력 핸들러 (개선된 버전)
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "from" | "to"
  ) => {
    handleCompleteInput(e.target.value, type);
  };

  // 달력에서 선택 시
  const handleCalendarChange = (date: Date | null, type: "from" | "to") => {
    const dateStr = date ? formatDate(date) : "";
    const newValue: [string, string] =
      type === "from" ? [dateStr, value[1]] : [value[0], dateStr];

    setInputs((prev) => ({
      ...prev,
      [type]: dateStr,
    }));

    // 자동 유효성 검사
    if (autoValidate && newValue[0] && newValue[1]) {
      const fromDate = validateSingleDate(newValue[0]);
      const toDate = validateSingleDate(newValue[1]);
      const validationError = validateDateRange(fromDate, toDate);

      if (validationError && onValidationError) {
        onValidationError(validationError);
        return;
      }
    }

    onChange(newValue);
  };

  // 날짜 빠르게 선택하는 버튼 핸들러 (하나의 함수로 통일)
  const handleDate = (days: number) => {
    const end = new Date();
    const start = new Date();
    if (days === 1) {
      const todayStr = formatDate(end);
      setInputs({
        from: todayStr,
        to: todayStr,
      });
      onChange([todayStr, todayStr]);
    } else {
      start.setDate(end.getDate() - days + 1);
      const startStr = formatDate(start);
      const endStr = formatDate(end);
      setInputs({
        from: startStr,
        to: endStr,
      });
      onChange([startStr, endStr]);
    }
  };

  // value가 특정 버튼의 날짜와 일치하는지 체크 (isRange만 사용)
  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  const isRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    if (days === 1) {
      return isSameDay(new Date(from), end) && isSameDay(new Date(to), end);
    }
    start.setDate(end.getDate() - days + 1);
    return isSameDay(new Date(from), start) && isSameDay(new Date(to), end);
  };

  // 날짜 버튼 정보 배열 (1일, 7일, 30일, 90일, 180일)
  const quickRanges = [
    { label: "1일", days: 1 },
    { label: "7일", days: 7 },
    { label: "30일", days: 30 },
    { label: "90일", days: 90 },
    { label: "180일", days: 180 },
  ];

  // 빠른 날짜 버튼 렌더 함수
  const renderQuickButtons = () =>
    quickRanges.map(({ label, days }) => (
      <MzButton
        key={label}
        size="Small"
        onClick={() => handleDate(days)}
        fill={isRange(days) ? "black" : undefined}
      >
        {label}
      </MzButton>
    ));

  return (
    <div className={styles.MzDateRangePicker}>
      {/* 시작일 */}
      <div className={styles.inputWrap}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={10}
          placeholder="선택"
          value={inputs.from}
          onChange={(e) => handleInput(e, "from")}
          onFocus={() => setOpenFrom(true)}
          className="pickerInput"
        />
        <DatePicker
          locale={ko}
          selected={from ? new Date(from) : null}
          onChange={(date) => {
            handleCalendarChange(date, "from");
            setOpenFrom(false);
          }}
          open={openFrom}
          onClickOutside={() => setOpenFrom(false)}
          dateFormat="yyyy.MM.dd"
          popperClassName="pickerLayer"
          customInput={<div />}
        />
      </div>
      <span>~</span>
      {/* 종료일 */}
      <div className="inputWrap">
        <input
          type="text"
          inputMode="numeric"
          maxLength={10}
          placeholder="선택"
          value={inputs.to}
          onChange={(e) => handleInput(e, "to")}
          onFocus={() => setOpenTo(true)}
          className="pickerInput"
        />
        <DatePicker
          locale={ko}
          selected={to ? new Date(to) : null}
          onChange={(date) => {
            handleCalendarChange(date, "to");
            setOpenTo(false);
          }}
          open={openTo}
          onClickOutside={() => setOpenTo(false)}
          dateFormat="yyyy.MM.dd"
          popperClassName="pickerLayer"
          customInput={<div />}
        />
      </div>
      {showQuickButtons && <div className="dayBtn">{renderQuickButtons()}</div>}
      {noticeText && <span className="noticeText">{noticeText}</span>}
    </div>
  );
};

export default MzDateRangePicker;
