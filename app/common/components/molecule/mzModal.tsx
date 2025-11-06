"use client";

import React, { useEffect, useId, useMemo } from "react";
import ReactModal from "react-modal";
import classnames from "classnames";
import DOMPurify from "dompurify";
import styles from "./mzModal.module.scss";
import MzButton from "../atom/mzButton";
import useBreakpoint from "@/hooks/useBreakpoint";

type ModalVariant = "dialog" | "alert" | "bottomSheet";

type ModalActionIntent = "primary" | "secondary" | "danger" | "ghost";

type ModalAction = {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  intent?: ModalActionIntent;
};

export interface MzModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  // 레이아웃/표현
  title?: string;
  variant?: ModalVariant; // dialog | alert | bottomSheet
  isBottom?: boolean; // 하위 호환: bottomSheet 대체
  type?: string; // 하위 호환: "Alert" 등 스타일 클래스용
  isDimmed?: boolean;
  isWrapped?: boolean;
  wrapClassName?: string;
  overlayClassName?: string;
  hasFloating?: boolean;
  hasHeader?: boolean;
  // 제어
  onClose?: () => void;
  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEsc?: boolean;
  lockScroll?: boolean; // 모달 오픈 시 배경 스크롤 방지
  // 접근성
  titleId?: string;
  contentLabel?: string; // title이 없을 때 대체 이름
  // 포털/부모
  parentSelector?: string;
  parentHtmlElement?: HTMLElement | null; // 미사용(호환)
  // 기타
  id?: string;
  // 액션
  actions?: ModalAction[];
  primaryActionId?: string;
  size?: string;
}

export const MzModal = ({
  children,
  title,
  variant,
  isOpen,
  isWrapped = true,
  isDimmed = true,
  isBottom = false,
  wrapClassName,
  overlayClassName,
  type,
  onClose,
  hasFloating = false,
  parentSelector,
  shouldCloseOnOverlayClick,
  shouldCloseOnEsc = true,
  lockScroll = true,
  hasHeader = true,
  titleId,
  contentLabel,
  id,
  actions,
  primaryActionId,
  size,
}: MzModalProps) => {
  const { isMobile, isTablet } = useBreakpoint();
  const isMobileOrTablet = isMobile || isTablet;
  const reactId = useId();

  // variant 정규화(하위 호환: type/isBottom)
  const normalizedVariant: ModalVariant = useMemo(() => {
    if (variant) return variant;
    if (type === "Alert") return "alert";
    if (isBottom) return "bottomSheet";
    return "dialog";
  }, [variant, type, isBottom]);

  const overlayStyle = classnames(
    styles.overlay,
    !isDimmed && styles.overlayNone,
    isMobileOrTablet ? "" : styles.pcOverlay,
    overlayClassName && overlayClassName
  );

  const wrapClass = useMemo(
    () => (isMobileOrTablet ? styles.mcWrap : styles.pcWrap),
    [isMobileOrTablet]
  );

  // 타입 클래스(예: .typeAlert)
  const typeClassName = useMemo(() => {
    if (normalizedVariant === "alert")
      return styles[classNameMaker("type", "Alert")];
    return undefined;
  }, [normalizedVariant]);

  const wrapStyle = classnames(
    isWrapped ? wrapClass : undefined,
    wrapClassName && wrapClassName,
    normalizedVariant === "bottomSheet" && styles.bottomsheet,
    typeClassName
  );

  const containerStyle = classnames(
    isMobileOrTablet ? styles.mobileContainer : styles.desktopContainer,
    hasFloating && styles.hasFloating,
    parentSelector && styles.insideParentContainer
  );

  const isAlertDialog = normalizedVariant === "alert";

  // 배경 스크롤 락 보강: html/body overflow hidden + 데스크톱 스크롤바 폭 보정
  // TODO: 재검토 필요
  useEffect(() => {
    if (!lockScroll) return;
    const attr = "data-modal-open-count";
    const htmlEl = document.documentElement;
    const bodyEl = document.body as HTMLBodyElement & { dataset: any };

    const getCount = () => parseInt(bodyEl.getAttribute(attr) || "0", 10);
    const setCount = (n: number) => bodyEl.setAttribute(attr, String(n));

    if (isOpen) {
      const prevCount = getCount();
      if (prevCount === 0) {
        const scrollbarWidth = window.innerWidth - htmlEl.clientWidth;
        if (scrollbarWidth > 0) {
          bodyEl.style.paddingRight = `${scrollbarWidth}px`;
        }
        htmlEl.style.overflow = "hidden";
        bodyEl.style.overflow = "hidden";
      }
      setCount(prevCount + 1);
    } else {
      const prevCount = getCount();
      const next = Math.max(prevCount - 1, 0);
      setCount(next);
      if (next === 0) {
        htmlEl.style.overflow = "";
        bodyEl.style.overflow = "";
        bodyEl.style.paddingRight = "";
      }
    }

    return () => {
      // 언마운트 안전 복원
      const prevCount = getCount();
      if (prevCount <= 1) {
        htmlEl.style.overflow = "";
        bodyEl.style.overflow = "";
        bodyEl.style.paddingRight = "";
        setCount(0);
      } else {
        setCount(prevCount - 1);
      }
    };
  }, [isOpen, lockScroll]);

  const parentFullLayerId = id ?? "";
  // ReactModal className/overlayClassName: 모바일에서 슬라이드/페이드 애니메이션 적용
  const modalClassNameProp = isMobileOrTablet
    ? {
        base: classnames(wrapStyle, styles.slideUpBase),
        afterOpen: classnames(wrapStyle, styles.slideUpAfterOpen),
        beforeClose: classnames(wrapStyle, styles.slideUpBeforeClose),
      }
    : wrapStyle;

  const modalOverlayClassNameProp = isMobileOrTablet
    ? {
        base: classnames(overlayStyle, styles.overlayFadeBase),
        afterOpen: classnames(overlayStyle, styles.overlayFadeAfterOpen),
        beforeClose: classnames(overlayStyle, styles.overlayFadeBeforeClose),
      }
    : overlayStyle;

  return (
    <>
      <ReactModal
        id={parentFullLayerId}
        isOpen={isOpen}
        ariaHideApp={false}
        preventScroll={lockScroll}
        className={modalClassNameProp as any}
        overlayClassName={
          shouldCloseOnOverlayClick
            ? undefined
            : (modalOverlayClassNameProp as any)
        }
        closeTimeoutMS={200}
        onRequestClose={onClose}
        parentSelector={() =>
          (parentSelector && document.querySelector(parentSelector)) ||
          document.body
        }
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        shouldCloseOnEsc={shouldCloseOnEsc}
        role={isAlertDialog ? "alertdialog" : "dialog"}
        aria={titleId ? { labelledby: titleId, modal: "true" } : undefined}
        contentLabel={contentLabel}
        style={(() => {
          const styleObj: any = {};
          if (shouldCloseOnOverlayClick) {
            styleObj.overlay = {
              position: "fixed",
              width: "100%",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1005,
              background: "rgba(0, 0, 0, 0.5)",
            };
          }
          if (size && !isMobileOrTablet) {
            styleObj.content = {
              ...(styleObj.content || {}),
              width: size,
              maxWidth: "calc(100% - 80px)",
            };
          }
          return Object.keys(styleObj).length ? styleObj : undefined;
        })()}
      >
        <div className={containerStyle}>
          {hasHeader && (
            <div className={styles.modal__header}>
              <p id={titleId} className={styles.modal__header__title}>
                {title}
              </p>

              <MzButton
                icon
                onClick={onClose}
                aria-label="닫기"
                className={styles.modal__header__btnClose}
              >
                <i className="icon__20_close" />
              </MzButton>
            </div>
          )}

          <div className={styles.modal__content}>{children}</div>
        </div>
      </ReactModal>
    </>
  );
};

const classNameMaker = (prefix: string, name: string) => {
  let transformString = "";
  name.split(" ").forEach((token: string) => {
    transformString += `${prefix}${token.substr(0, 1).toUpperCase()}${token.substr(1)}`;
  });
  return transformString.replace(/\s$/, "");
};

export default MzModal;
