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
type OptionLike =
  | string
  | { label: string; value: string | number; disabled?: boolean };

type CustomDropdownProps = {
  id?: string;
  name?: string;
  type?: "default" | "search" | "dropdown" | "checkbox";
  options: OptionLike[];
  selected: string | number | Array<string | number>;
  onSelect: (value: string | number | Array<string | number>) => void;
  className?: string;
  size?: "1" | "2" | "3" | "4" | "5";
  align?: "left" | "right";
  style?: React.CSSProperties;
};

export default function MzSelectBox({
  id,
  name,
  type = "default",
  options,
  selected,
  onSelect,
  className = "",
  size = "3",
  align = "left",
  style,
}: CustomDropdownProps) {
  // options가 undefined일 때 빈 배열 사용
  const safeOptions = (options || []).map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
  const [checkedValues, setCheckedValues] = useState<Array<string | number>>(
    Array.isArray(selected) ? selected : []
  );

  const handleCheckboxChange = (optValue: string | number) => {
    let newChecked: Array<string | number>;
    if (checkedValues.includes(optValue)) {
      newChecked = checkedValues.filter((v) => v !== optValue);
    } else {
      newChecked = [...checkedValues, optValue];
    }
    setCheckedValues(newChecked);
    onSelect(newChecked);
    console.log(newChecked);
  };

  return (
    <>
      {type === "checkbox" ? (
        <div
          className={` ${styles[`${className}`]}`}
          ref={dropdownRef}
          style={style}
        >
          <button
            type="button"
            className={styles.btnSelectBox}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={style}
          >
            선택
          </button>
          {open && (
            <div
              className={`${styles.customDropdownListWrap} ${align === "right" ? styles.right : ""}`}
              style={
                align === "right"
                  ? { right: 0, left: "auto" }
                  : { left: 0, right: "auto" }
              }
            >
              <ul role="listbox">
                {safeOptions.map((opt, idx) => {
                  const inputId = `customDropdownCheckbox_${idx}`;
                  return (
                    <li key={String(opt.value)} role="option">
                      <input
                        type="checkbox"
                        id={inputId}
                        name="customDropdown"
                        value={String(opt.value)}
                        checked={checkedValues.includes(opt.value)}
                        onChange={() => handleCheckboxChange(opt.value)}
                        className={styles.checkbox}
                        disabled={opt.disabled}
                      />
                      <label htmlFor={inputId}>{opt.label}</label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : type === "default" ? (
        <div
          className={`${styles.mzSelectBoxDefault}  ${styles[`size${size}`]}  ${className}`}
          style={style}
        >
          <select
            id={id}
            name={name}
            value={
              typeof selected === "string" || typeof selected === "number"
                ? String(selected)
                : ""
            }
            onChange={(e) => {
              const matched = safeOptions.find(
                (o) => String(o.value) === e.target.value
              );
              onSelect(matched ? matched.value : e.target.value);
            }}
          >
            {safeOptions.map((opt, idx) => (
              <option
                key={idx}
                value={String(opt.value)}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div
          className={`${styles.mzSelectBox} ${styles[`size${size}`]}  ${styles[`${className}`]}`}
          ref={dropdownRef}
          style={{ cursor: "pointer", ...style }}
        >
          <button
            type="button"
            className={styles.customDropdownBtn}
            aria-haspopup="listbox"
            aria-expanded={open}
            style={style}
            onClick={() => setOpen((o) => !o)}
          >
            {(() => {
              const found = safeOptions.find(
                (o) =>
                  !Array.isArray(selected) &&
                  String(o.value) === String(selected)
              );
              return found
                ? found.label
                : Array.isArray(selected)
                  ? selected.join(", ")
                  : String(selected);
            })()}
          </button>
          {open && (
            <div
              className={`${styles.customDropdownListWrap} ${align === "right" ? styles.right : ""}`}
              style={{
                ...(align === "right"
                  ? { right: 0, left: "auto" }
                  : { left: 0, right: "auto" }),
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ul role="listbox">
                {safeOptions.map((opt, idx) => {
                  const inputId = `customDropdownRadio_${idx}`;
                  const isChecked =
                    !Array.isArray(selected) &&
                    String(selected) === String(opt.value);
                  return (
                    <li key={String(opt.value)} role="option">
                      <input
                        type="radio"
                        id={inputId}
                        name="customDropdown"
                        value={String(opt.value)}
                        checked={Boolean(isChecked)}
                        onChange={() => {
                          onSelect(opt.value);
                          setOpen(false);
                          console.log("customDropdown", opt.value);
                        }}
                        className={`${type}_radio`}
                        disabled={opt.disabled}
                      />
                      <label htmlFor={inputId}>{opt.label}</label>
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
