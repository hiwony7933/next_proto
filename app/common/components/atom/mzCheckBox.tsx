import React, { useState, ReactNode } from "react";
import classnames from "classnames";
import styles from "./mzCheckBox.module.scss";

export type InputValue = string | number | ReadonlyArray<string>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface MzCheckBoxTypes {
  children?: ReactNode; // 레이블
  type: string;
  id: string;
  checked?: boolean;
  value?: InputValue;
  onChange?: (e: InputChangeEvent) => void;
  stroke?: string;
  fill?: string;
  shape?: string;
  className?: string; // 사용자 정의 클래스
}

export const MzCheckBox = (props: any) => {
  const {
    children,
    type,
    id,
    checked,
    value = "",
    onChange,
    stroke,
    fill,
    shape,
    className,
    ...rest
  }: MzCheckBoxTypes = props;

  const [inputValue, setInputValue] = useState<InputValue>(value);
  const changeHandler = (e: InputChangeEvent) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  const classNameDefault = ["mzCheckBoxCheck", "mzCheckBoxRadio"];
  let defaultIdx: number = 0;
  if (type === "checkbox") {
    defaultIdx = 0;
  } else if (type === "radio") {
    defaultIdx = 1;
  }

  const classNames = classnames(
    styles[classNameDefault[defaultIdx]],
    stroke && styles[classNameMaker("stroke", stroke)],
    fill && styles[classNameMaker("fill", fill)],
    shape && styles[classNameMaker("shape", shape)],
    className
  );

  return (
    <>
      <div className={classNames}>
        <input
          type={type}
          id={id}
          checked={checked}
          className={styles.input}
          value={value}
          onChange={changeHandler}
          {...rest}
        />
        <label htmlFor={id} className={styles.label}>
          {children}
        </label>
      </div>
    </>
  );
};

const classNameMaker = (prefix: string, name: string) => {
  let transformString = "";
  name.split(" ").map((name: any) => {
    transformString += `${prefix}${name
      .substr(0, 1)
      .toUpperCase()}${name.substr(1)}`;
  });
  return transformString.replace(/\s$/, "");
};
