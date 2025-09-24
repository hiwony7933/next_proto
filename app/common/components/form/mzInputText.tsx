import React, {
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import styles from "./mzInputText.module.scss";

/**
 * MzInputText
 * - 스타일은 래퍼(.mzInputText)에 적용, 실제 입력은 내부 엘리먼트(.mzInputText__input).
 * - numberFormat=true일 때 숫자만 허용하고 표시상 콤마를 붙입니다. onChange에는 콤마 제거 값 전달.
 * - 클리어 버튼(X)은 값이 있을 때만 표시되며, 클릭 시 값 초기화 후 포커스를 복원합니다.
 * - ref는 실제 input 엘리먼트로 전달되며, 외부 style/className은 래퍼에 적용됩니다.
 */
export interface MzInputTextProps
  extends InputHTMLAttributes<HTMLInputElement> {
  mzSize?: string; // 크기 (ex: '1', '2', '3', ...)
  className?: string; // 사용자 정의 클래스
  numberFormat?: boolean; // 추가: 숫자 천단위 콤마 옵션
  onSearch?: (keyword: string) => void; // 검색 콜백
}

/**
 * SCSS 모듈 사이즈 변형 클래스 키 생성기
 * 예) prefix: "size", name: "5" => styles["size5"]
 */
const classNameMaker = (prefix: string, name: string) => {
  let transformString = "";
  name.split(" ").map((n: any) => {
    transformString += `${prefix}${n.substr(0, 1).toUpperCase()}${n.substr(1)}`;
  });
  return transformString.replace(/\s$/, "");
};

/** 표시용 천단위 콤마 포맷 */
const formatNumber = (value: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const MzInputText = forwardRef<HTMLInputElement, MzInputTextProps>(
  (
    {
      mzSize = "3",
      className,
      style,
      numberFormat = false,
      onChange,
      onKeyDown,
      onSearch,
      value,
      ...rest
    },
    ref
  ) => {
    // 외부 value 미제공 시 표시용 내부 상태
    const [internalValue, setInternalValue] = useState<string>("");
    // 실제 input 엘리먼트 참조 (초기화/포커스/네이티브 이벤트 디스패치 용도)
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 숫자 포맷 처리: 표시에는 콤마, onChange 값은 콤마 제거
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/,/g, "");
      if (numberFormat) {
        // 숫자만 허용
        val = val.replace(/[^0-9]/g, "");
        setInternalValue(formatNumber(val));
        if (onChange) {
          // 콤마 없는 값 전달
          onChange({
            ...e,
            target: { ...e.target, value: val },
          });
        }
      } else {
        setInternalValue(val);
        if (onChange) onChange(e);
      }
    };

    // 실제로 input에 표시될 값 계산
    const effectiveValue = numberFormat
      ? value !== undefined
        ? formatNumber(String(value))
        : internalValue
      : value !== undefined
        ? String(value)
        : internalValue;

    // 값 유무: 클리어 버튼 표시 조건
    const hasValue =
      (value !== undefined ? String(value) : internalValue).length > 0;

    // readOnly/disabled 상태에서는 인터랙션 제약
    const isInteractive = !rest.disabled && !rest.readOnly;

    // onSearch 등 외부로 전달할 원시 값(콤마 제거)
    const getRawValue = () => {
      if (value !== undefined) return String(value).replace(/,/g, "");
      return numberFormat ? internalValue.replace(/,/g, "") : internalValue;
    };

    // 래퍼 클래스: 컴포넌트 사이즈 변형 + 외부 className
    const wrapperClassName = classnames(
      styles.mzInputText,
      mzSize && styles[classNameMaker("size", mzSize)],
      className
    );

    // 내부 input 엘리먼트 클래스(래퍼와 분리)
    const inputClassNames = classnames(styles["mzInputText__input"]);

    // 전달받은 ref와 내부 ref를 병합하여 외부 접근을 보장
    const setCombinedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    // 값 초기화: 내부 상태 초기화 + 네이티브 input 이벤트로 상위 동기화 유도
    const handleClear = () => {
      setInternalValue("");
      if (onChange && inputRef.current) {
        const inputEl = inputRef.current;
        const valueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value"
        )?.set;
        valueSetter?.call(inputEl, "");
        const ev = new Event("input", { bubbles: true });
        inputEl.dispatchEvent(ev);
      }
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    };

    // 검색 트리거: 버튼 클릭 시 onSearch 호출
    const handleSearch = () => {
      if (!onSearch) return;
      onSearch(getRawValue());
    };

    // 엔터 키로 검색 수행, 사용자 onKeyDown과 공존
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) onKeyDown(e);
      if (e.key === "Enter" && onSearch) {
        onSearch(getRawValue());
      }
    };

    return (
      <div className={wrapperClassName} style={style}>
        <input
          type={numberFormat ? "text" : rest.type || "text"}
          ref={setCombinedRef}
          className={inputClassNames}
          value={effectiveValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputMode={numberFormat ? "numeric" : rest.inputMode}
          {...rest}
        />
        {hasValue && isInteractive && (
          <button
            type="button"
            aria-label="입력 초기화"
            className={styles["mzInputText__clear"]}
            onClick={handleClear}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 3l6 6M9 3L3 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        {onSearch && (
          <button
            type="button"
            aria-label="검색"
            className={styles["mzInputText__search"]}
            onClick={handleSearch}
            disabled={rest.disabled === true}
          >
            <img
              src="/images/common/icon_18_search.svg"
              alt=""
              width={18}
              height={18}
            />
          </button>
        )}
      </div>
    );
  }
);

export default MzInputText;
