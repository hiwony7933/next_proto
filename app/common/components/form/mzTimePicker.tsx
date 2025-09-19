import React, { useState, useRef, useEffect } from "react";
import styles from "./mzTimePicker.module.scss";

interface MzTimePickerProps {
  value: string; // "HH:MM" 형식
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const MzTimePicker = ({ 
  value, 
  onChange, 
  placeholder = "시간 선택",
  disabled = false,
  className = "",
  id = ""
}: MzTimePickerProps): React.ReactElement => {
  const [input, setInput] = useState<string>(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // value prop이 변경될 때 input 상태 업데이트
  useEffect(() => {
    setInput(value || "");
    if (value && value.includes(':')) {
      const [hour, minute] = value.split(":").map(Number);
      setSelectedHour(hour || 0);
      setSelectedMinute(minute || 0);
    }
  }, [value]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // 드롭다운이 열릴 때 선택된 시간과 분으로 스크롤
      setTimeout(() => {
        // 시간 컬럼에서 선택된 시간으로 스크롤
        const timeColumns = containerRef.current?.querySelectorAll(`.${styles.timeColumn}`);
        if (timeColumns && timeColumns.length >= 2) {
          // 첫 번째 컬럼 (시간)
          const hourColumn = timeColumns[0];
          const selectedHourElement = hourColumn.querySelector(`.${styles.timeItem}.${styles.selected}`);
          if (selectedHourElement) {
            selectedHourElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
          
          // 두 번째 컬럼 (분)
          const minuteColumn = timeColumns[1];
          const selectedMinuteElement = minuteColumn.querySelector(`.${styles.timeItem}.${styles.selected}`);
          if (selectedMinuteElement) {
            selectedMinuteElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);



  // 시간 선택 핸들러
  const handleTimeSelect = (hour: number, minute: number, isOpen: boolean) => {
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    setInput(timeStr);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange(timeStr);
    setIsOpen(isOpen);
  };

  // 시간 배열 생성 (1분 단위)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0, 1, 2, 3, ..., 59

  return (
    <div className={`${styles.mzTimePicker} ${className}`} ref={containerRef}>
      <div className={styles.inputWrap}>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={input}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          readOnly
          className="pickerInput"
        />
      </div>
      
      {isOpen && (
        <div className={styles.pickerLayer}>
          <div className={styles.timeSelector}>
            <div className={styles.timeColumn}>
              <div className={styles.columnHeader}>시</div>
              <div className={styles.timeList}>
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    className={`${styles.timeItem} ${selectedHour === hour ? styles.selected : ""}`}
                    onClick={() => handleTimeSelect(hour, selectedMinute, true)}
                  >
                    {hour.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.timeSeparator}>:</div>
            <div className={styles.timeColumn}>
              <div className={styles.columnHeader}>분</div>
              <div className={styles.timeList}>
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    className={`${styles.timeItem} ${selectedMinute === minute ? styles.selected : ""}`}
                    onClick={() => handleTimeSelect(selectedHour, minute, false)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.pickerActions}>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.cancel}`}
              onClick={() => setIsOpen(false)}
            >
              취소
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.confirm}`}
              onClick={() => {
                const timeStr = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;
                setInput(timeStr);
                onChange(timeStr);
                setIsOpen(false);
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MzTimePicker;