import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import classnames from "classnames";
import styles from "./mzInputText.module.scss";

export interface MzInputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  mzSize?: string; // 크기 (ex: '1', '2', '3', ...)
  className?: string; // 사용자 정의 클래스
  numberFormat?: boolean; // 추가: 숫자 천단위 콤마 옵션
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
      numberFormat = false,
      onChange,
      value,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>("");

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
            target: { ...e.target, value: val }
          });
        }
      } else {
        setInternalValue(val);
        if (onChange) onChange(e);
      }
    };

    const classNames = classnames(
      styles.mzInputText,
      mzSize && styles[classNameMaker("size", mzSize)],
      className
    );

    return (
      <input
        type={numberFormat ? "text" : rest.type || "text"}
        ref={ref}
        className={classNames}
        value={numberFormat ? (value !== undefined ? formatNumber(String(value)) : internalValue) : value}
        onChange={handleChange}
        inputMode={numberFormat ? "numeric" : rest.inputMode}
        {...rest}
      />
    );
  }
);

export default MzInputText;
