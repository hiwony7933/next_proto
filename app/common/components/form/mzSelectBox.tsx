import React, { useRef, useEffect, useState } from "react";
import styles from "./mzSelectBox.module.scss";
/**
 * HwCustomDropdown
 * ----------------
 * 공통 커스텀 드롭다운 컴포넌트입니다.
 * 
 * [Props]
 * - options: string[]         // 드롭다운에 표시할 옵션 목록
 * - selected: string          // 현재 선택된 값
 * - onSelect: (value) => void // 옵션 선택 시 호출되는 콜백
 * - className?: string        // (선택) 추가 커스텀 클래스
 * - type?: 'default' | 'radio' | 'checkbox'
 * 
 * [사용 예시]
 * <HwCustomDropdown
 *   options={['A', 'B', 'C']}
 *   selected={selected}
 *   onSelect={setSelected}
 * />
 * 
 * [특징]
 * - 라디오 버튼 기반 접근성 지원
 * - 외부에서 상태 제어(선택/콜백) 가능
 * - 어디서든 import 하여 재사용 가능
 */
type CustomDropdownProps = {
  id?: string;
  type?: 'default' | 'search' | 'dropdown' | 'checkbox';
  options: string[];
  selected: string | string[];
  onSelect: (value: string | string[]) => void;
  className?: string;
  size?: '1' | '2' | '3' | '4' | '5';
  align?: 'left' | 'right';
  style?: React.CSSProperties;
};

export default function MzSelectBox({
  id,
  type = 'default',
  options,
  selected,
  onSelect,
  className = '',
  size = '3',
  align = 'left',
  style,
}: CustomDropdownProps) {
  // options가 undefined일 때 빈 배열 사용
  const safeOptions = options || [];

  /**
   * open
   * ----
   * 드롭다운 리스트의 노출 여부를 관리하는 상태값입니다.
   * true면 리스트가 열리고, false면 닫힙니다.
   */
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // 체크박스 선택 상태 관리 (selected를 string[]로 받을 수도 있음)
  const [checkedValues, setCheckedValues] = useState<string[]>(
    Array.isArray(selected) ? selected : []
  );

  const handleCheckboxChange = (opt: string) => {
    let newChecked;
    if (checkedValues.includes(opt)) {
      newChecked = checkedValues.filter(v => v !== opt);
    } else {
      newChecked = [...checkedValues, opt];
    }
    setCheckedValues(newChecked);
    onSelect(newChecked); // 부모로 배열 전달
    console.log(newChecked);
  };

  return (
    <>
      {type === 'checkbox' ? (
        <div className={` ${styles[`${className}`]}`} ref={dropdownRef} style={style}>
          <button
            type="button"
            className={styles.btnSelectBox}
            onClick={() => setOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={style}
          >
            선택
          </button>
          {open && (
            <div
              className={`${styles.customDropdownListWrap} ${align === 'right' ? styles.right : ''}`}
              style={align === 'right' ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }}
            >
              <ul role="listbox">
                {safeOptions.map((opt, idx) => {
                  const inputId = `customDropdownCheckbox_${idx}`;
                  return (
                    <li key={opt} role="option">
                      <input
                        type="checkbox"
                        id={inputId}
                        name="customDropdown"
                        value={opt}
                        checked={checkedValues.includes(opt)}
                        onChange={() => handleCheckboxChange(opt)}
                        className={styles.checkbox}
                      />
                      <label htmlFor={inputId}>{opt}</label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : type === 'default' ? (
        <div className={`${styles.mzSelectBoxDefault}  ${styles[`size${size}`]}  ${className}`} style={style}>
          <select value={selected} onChange={(e) => onSelect(e.target.value)}>
            {safeOptions.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ) : (
        <div
          className={`${styles.mzSelectBox} ${styles[`size${size}`]}  ${styles[`${className}`]}`}
          ref={dropdownRef}
          style={{ cursor: 'pointer', ...style }}
        >
          <button
            type="button"
            className={styles.customDropdownBtn}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={style}
            onClick={() => setOpen(o => !o)}
          >
            {selected}
          </button>
          {open && (
            <div
              className={`${styles.customDropdownListWrap} ${align === 'right' ? styles.right : ''}`}
              style={{
                ...(align === 'right' ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' })
              }}
              onClick={e => e.stopPropagation()}
            >
              <ul role="listbox">
                {safeOptions.map((opt, idx) => {
                  const inputId = `customDropdownRadio_${idx}`;
                  return (
                    <li key={opt} role="option">
                      <input
                        type="radio"
                        id={inputId}
                        name="customDropdown"
                        value={opt}
                        checked={selected === opt}
                        onChange={() => {
                          onSelect(opt);
                          setOpen(false); // 옵션 선택 시 드롭다운 닫기
                          console.log('customDropdown', opt);
                        }}
                        className={`${type}_radio`}
                      />
                      <label htmlFor={inputId}>{opt}</label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}