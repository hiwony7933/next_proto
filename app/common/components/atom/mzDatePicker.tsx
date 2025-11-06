"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./mzDateRangePicker.module.scss";
import MzButton from "./mzButton";

interface MzDatePickerProps {
  value: string; // "YYYY-MM-DD" 또는 "YYYY-MM-DD HH:mm" 형식
  onChange: (date: string) => void;
  showQuickButtons?: boolean;
  showTime?: boolean; // 시간 표시 여부
  readOnly?: boolean; // 직접 입력 불가, 클릭으로만 picker 열기
  className?: string; // 추가 클래스 이름
  id?: string;
}

// 날짜 형식 함수 - showTime에 따라 다른 형식 반환
function formatDate(date: Date, showTime: boolean = false) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");

  if (showTime) {
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  }

  return `${y}-${m}-${d}`;
}

// 입력 마스킹 함수 - showTime에 따라 다른 마스킹
function maskDateInput(raw: string, showTime: boolean = false) {
  if (showTime) {
    // 숫자만 남기고, YYYY-MM-DD HH:mm로 마스킹
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    if (digits.length <= 8)
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    if (digits.length <= 10)
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)} ${digits.slice(8, 10)}:${digits.slice(10)}`;
  } else {
    // 숫자만 남기고, YYYY-MM-DD로 마스킹
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }
}

// 날짜 문자열을 Date 객체로 변환하는 헬퍼 함수
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // YYYY-MM-DD HH:mm 형식 파싱
  if (dateStr.includes(" ") && dateStr.includes(":")) {
    const [datePart, timePart] = dateStr.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [h, min] = timePart.split(":").map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d, h || 0, min || 0);
    }
  }

  // YYYY-MM-DD 형식 파싱
  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-").map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d);
    }
  }

  // YYYY.MM.DD 형식 파싱 (기존 데이터 호환성)
  if (dateStr.includes(".")) {
    const [y, m, d] = dateStr.split(".").map(Number);
    if (y && m && d) {
      return new Date(y, m - 1, d);
    }
  }

  // YYYY-MM-DD HH:mm:ss 형식 파싱 (데이터베이스에서 오는 타임스탬프)
  if (dateStr.includes(" ") && dateStr.split(":").length >= 2) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

export const MzDatePicker = ({
  value,
  onChange,
  showQuickButtons = false,
  showTime = false,
  readOnly = false,
  className = "",
  id = "",
}: MzDatePickerProps): React.ReactElement => {
  const [input, setInput] = useState<string>(value || "");
  const [open, setOpen] = useState(false);

  // 오늘/어제 날짜 계산
  const todayStr = formatDate(new Date(), showTime);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = formatDate(yesterdayDate, showTime);

  // value prop이 변경될 때 input 상태 업데이트
  React.useEffect(() => {
    // 입력값이 데이터베이스 형식인 경우 변환
    if (value) {
      const parsedDate = parseDate(value);
      if (parsedDate) {
        setInput(formatDate(parsedDate, showTime));
      } else {
        setInput(value);
      }
    } else {
      setInput("");
    }
  }, [value, showTime]);

  // 입력 핸들러
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDateInput(e.target.value, showTime);
    setInput(masked);

    const expectedLength = showTime ? 16 : 10; // "YYYY-MM-DD HH:mm" = 16, "YYYY-MM-DD" = 10

    if (masked.length === expectedLength) {
      if (showTime) {
        const [datePart, timePart] = masked.split(" ");
        const [y, m, d] = datePart.split("-").map(Number);
        const [h, min] = timePart.split(":").map(Number);
        const dt = new Date(y, m - 1, d, h, min);
        if (
          dt.getFullYear() === y &&
          dt.getMonth() === m - 1 &&
          dt.getDate() === d &&
          dt.getHours() === h &&
          dt.getMinutes() === min
        ) {
          onChange(formatDate(dt, showTime));
        }
      } else {
        const [y, m, d] = masked.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        if (
          dt.getFullYear() === y &&
          dt.getMonth() === m - 1 &&
          dt.getDate() === d
        ) {
          onChange(formatDate(dt, showTime));
        }
      }
    } else {
      onChange("");
    }
  };

  // 달력에서 선택 시
  const handleCalendarChange = (date: Date | null) => {
    if (date) {
      const formattedDate = formatDate(date, showTime);
      setInput(formattedDate);
      onChange(formattedDate);
    } else {
      setInput("");
      onChange("");
    }
    setOpen(false);
  };

  // 빠른 날짜 버튼 핸들러
  const handleQuick = (type: "today" | "yesterday") => {
    const now = new Date();
    if (type === "yesterday") now.setDate(now.getDate() - 1);
    const formattedDate = formatDate(now, showTime);
    setInput(formattedDate);
    onChange(formattedDate);
  };

  // fill prop 결정
  const currentValue = input || value;
  const isToday =
    currentValue === todayStr ||
    (currentValue && currentValue.startsWith(todayStr.split(" ")[0]));
  const isYesterday =
    currentValue === yesterdayStr ||
    (currentValue && currentValue.startsWith(yesterdayStr.split(" ")[0]));

  return (
    <div className={`${styles.MzDateRangePicker} ${className}`}>
      <div className="inputWrap">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          maxLength={showTime ? 16 : 10}
          placeholder={showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
          value={input}
          onChange={readOnly ? undefined : handleInput}
          onFocus={readOnly ? undefined : () => setOpen(true)}
          onClick={readOnly ? () => setOpen(true) : undefined}
          // readOnly={readOnly}
          readOnly
          className="pickerInput"
          style={readOnly ? { cursor: "pointer" } : undefined}
        />
        <DatePicker
          locale={ko}
          selected={parseDate(value)}
          onChange={handleCalendarChange}
          open={open}
          onClickOutside={() => setOpen(false)}
          dateFormat={showTime ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd"}
          showTimeSelect={showTime}
          timeFormat="HH:mm"
          timeIntervals={15}
          popperClassName="pickerLayer"
          customInput={<div />}
        />
      </div>
      {showQuickButtons && (
        <div className="dayBtn">
          <MzButton
            size="Small"
            onClick={() => handleQuick("today")}
            fill={isToday ? "black" : undefined}
          >
            오늘
          </MzButton>
          <MzButton
            size="Small"
            onClick={() => handleQuick("yesterday")}
            fill={isYesterday ? "black" : undefined}
          >
            어제
          </MzButton>
        </div>
      )}
    </div>
  );
};

export default MzDatePicker;
