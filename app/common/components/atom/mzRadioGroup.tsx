"use client";

import { ChangeEvent, ReactNode, useId } from "react";
import classnames from "classnames";
import styles from "./mzRadioGroup.module.scss";

export type MzRadioOption = {
  label: ReactNode;
  value: string;
  ariaLabel?: string;
  disabled?: boolean;
};

interface MzRadioGroupProps {
  name?: string;
  options: MzRadioOption[];
  value: string;
  onChange: (value: string) => void;
  rounded?: boolean; // false: 0px, true: 40px
  hideScrollbar?: boolean; // 모바일 가로 스크롤바 숨김
  fadeRight?: boolean; // 모바일 우측 페이드 오버레이 표시
  className?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

const MzRadioGroup = ({
  name,
  options,
  value,
  onChange,
  rounded = false,
  hideScrollbar = true,
  fadeRight = true,
  className,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
}: MzRadioGroupProps) => {
  const generatedId = useId();
  const groupName = name ?? `mz-radio-group-${generatedId}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const groupClassNames = classnames(
    styles.radio,
    rounded && (styles as any).radio__rounded,
    hideScrollbar && (styles as any).radio__hideScrollbar,
    className
  );

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      className={groupClassNames}
    >
      {options.map((option) => {
        const id = `${groupName}-${option.value}`;
        const isChecked = value === option.value;
        return (
          <label
            key={option.value}
            className={(styles as any).radio__option}
            htmlFor={id}
          >
            <input
              id={id}
              className={(styles as any).radio__input}
              type="radio"
              name={groupName}
              value={option.value}
              checked={isChecked}
              onChange={handleChange}
              aria-label={option.ariaLabel}
              disabled={option.disabled}
            />
            <span className={(styles as any).radio__pill}>{option.label}</span>
          </label>
        );
      })}
      {fadeRight && (
        <span className={(styles as any).radio__fade} aria-hidden="true" />
      )}
    </div>
  );
};

export default MzRadioGroup;
