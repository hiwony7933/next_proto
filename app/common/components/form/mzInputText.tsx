import React, {
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import styles from "./mzInputText.module.scss";

export interface MzInputTextProps
  extends InputHTMLAttributes<HTMLInputElement> {
  mzSize?: string; // 크기 (ex: '1', '2', '3', ...)
  className?: string; // 사용자 정의 클래스
  numberFormat?: boolean; // 추가: 숫자 천단위 콤마 옵션
  onSearch?: (keyword: string) => void; // 검색 콜백
}

const classNameMaker = (prefix: string, name: string) => {
  let transformString = "";
  name.split(" ").map((n: any) => {
    transformString += `${prefix}${n.substr(0, 1).toUpperCase()}${n.substr(1)}`;
  });
  return transformString.replace(/\s$/, "");
};

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
    const [internalValue, setInternalValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 숫자만 입력 + 천단위 콤마
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

    const effectiveValue = numberFormat
      ? value !== undefined
        ? formatNumber(String(value))
        : internalValue
      : value !== undefined
        ? String(value)
        : internalValue;

    const hasValue =
      (value !== undefined ? String(value) : internalValue).length > 0;

    const isInteractive = !rest.disabled && !rest.readOnly;

    const getRawValue = () => {
      if (value !== undefined) return String(value).replace(/,/g, "");
      return numberFormat ? internalValue.replace(/,/g, "") : internalValue;
    };

    const wrapperClassName = classnames(
      styles.mzInputText,
      mzSize && styles[classNameMaker("size", mzSize)],
      className
    );

    const inputClassNames = classnames(styles["mzInputText__input"]);

    const setCombinedRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

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

    const handleSearch = () => {
      if (!onSearch) return;
      onSearch(getRawValue());
    };

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
