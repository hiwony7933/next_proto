'use client';

import { ReactNode } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
//import { isMobileDeviceType } from "util/build-time-env";
import styles from './mzButton.module.scss';
const isMobileDeviceType = () => process.env.NEXT_PUBLIC_DEVICE_TYPE === '1';

interface MzButtonTypes {
  children: ReactNode;
  href?: string; // 링크 주소
  type?: 'submit' | 'reset' | 'button' | undefined; // 버튼 타입
  size?: string; // 크기
  fill?: string; // 배경색
  stroke?: string; // 테두리
  className?: string; // 사용자 정의 클래스
}

const MzButton = (props: any) => {
  const {
    children,
    href = undefined,
    type = 'button',
    size = '3',
    fill,
    stroke,

    className,
    ...rest
  }: MzButtonTypes = props;

  const classNames = classnames(
    styles.mzButton,
    size &&
      (isMobileDeviceType()
        ? styles[classNameMaker('size', size)]
        : styles[classNameMaker('sizePC', size)]),
    fill && styles[classNameMaker('fill', fill)],
    stroke && styles[classNameMaker('stroke', stroke)],

    className,
  );

  return (
    <>
      {href !== undefined ? (
        <Link href={href} className={classNames} {...rest}>
          {children}
        </Link>
      ) : className?.includes('mzUnderline') ? (
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
  let transformString = '';
  name.split(' ').map((name: any) => {
    transformString += `${prefix}${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
  });
  return transformString.replace(/\s$/, '');
};
