"use client";

import { ReactNode } from "react";
import classnames from "classnames";
import Link from "next/link";
import styles from "./mzButton.module.scss";

interface MzButtonTypes {
  children: ReactNode;
  href?: string; // 링크 주소
  type?: "submit" | "reset" | "button" | undefined; // 버튼 타입
  size?: string; // 크기
  fill?: string; // 배경색
  stroke?: string; // 테두리
  icon?: boolean; // 아이콘 버튼 스타일
  className?: string; // 사용자 정의 클래스
  cta?: boolean;
  full?: boolean;
}

const MzButton = (props: any) => {
  const {
    children,
    href = undefined,
    type = "button",
    size,
    fill,
    stroke,
    icon,
    cta,
    className,
    full,
    ...rest
  }: MzButtonTypes = props;

  const classNames = classnames(
    styles.mzButton,
    size && styles[classNameMaker("size", size)],
    fill && styles[classNameMaker("fill", fill)],
    stroke && styles[classNameMaker("stroke", stroke)],
    icon && styles.icon,
    cta && styles.cta,
    full && styles.full,
    className
  );

  return (
    <>
      {href !== undefined ? (
        <Link href={href} className={classNames} {...rest}>
          {children}
        </Link>
      ) : className?.includes("mzUnderline") ? (
        <button type={type} className={`${styles.mzUnderline}`} {...rest}>
          {children}
        </button>
      ) : (
        <button type={type} className={classNames} {...rest}>
          {children}
        </button>
      )}
    </>
  );
};
export default MzButton;
const classNameMaker = (prefix: string, name: string) => {
  let transformString = "";
  name.split(" ").map((name: any) => {
    transformString += `${prefix}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
  });
  return transformString.replace(/\s$/, "");
};
