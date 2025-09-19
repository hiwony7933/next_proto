'use client';

import React, { useMemo, RefObject } from 'react';
import ReactModal from 'react-modal';
import classnames from 'classnames';
import DOMPurify from 'dompurify';
import styles from './mzModal.module.scss';

const isMobileDeviceType = () => process.env.NEXT_PUBLIC_DEVICE_TYPE === '1';

export interface MzModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  isWrapped?: boolean; // 랩 클래스 적용 여부(미적용시 외부 클릭시 닫힘)
  isDimmed?: boolean; // 배경 딤
  title?: string; // 타이틀 문구
  isBottom?: boolean; // bottom sheet
  type?: string; // 모달 타입
  wrapClassName?: string; // 모달 클래스
  overlayClassName?: string;
  onClose?: () => void;
  hasFloating?: boolean; // 하단 플로팅 버튼
  parentHtmlElement?: HTMLElement | null;
  parentSelector?: string;
  shouldCloseOnOverlayClick?: boolean;
  hasClose?: boolean; // 닫기버튼
  showCloseBottom?: boolean; // 닫기버튼 노출여부 (derfault: true)
  id?: string;
}

export const MzModal = ({
  children,
  title,
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
  hasClose = false,
  showCloseBottom = true,
  id,
}: MzModalProps) => {
  const overlayStyle = classnames(
    styles.overlay,
    !isDimmed && styles.overlayNone,
    isMobileDeviceType() ? '' : styles.pcOverlay,
    overlayClassName && overlayClassName,
  );

  const wrapClass = useMemo(() => (isMobileDeviceType() ? styles.mcWrap : styles.pcWrap), []);

  const wrapStyle = classnames(
    isWrapped ? wrapClass : undefined,
    wrapClassName && wrapClassName,
    isBottom && styles.bottomsheet,
    type && styles[classNameMaker('type', type)],
  );

  const containerStyle = classnames(
    isMobileDeviceType() ? styles.mcContainer : styles.pcContainer,
    hasFloating && styles.hasFloating,
    parentSelector && styles.insideParentContainer,
    hasClose && styles.hasClose,
  );

  const parentFullLayerId = id ?? '';
  return (
    <>
      <ReactModal
        id={parentFullLayerId}
        isOpen={isOpen}
        ariaHideApp={false}
        preventScroll={false}
        className={wrapStyle}
        overlayClassName={shouldCloseOnOverlayClick ? undefined : overlayStyle}
        onRequestClose={onClose}
        parentSelector={() =>
          (parentSelector && document.querySelector(parentSelector)) || document.body
        }
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        style={
          shouldCloseOnOverlayClick
            ? {
                overlay: {
                  position: 'fixed',
                  width: '100%',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1005,
                  background: 'rgba(0, 0, 0, 0.5)',
                },
              }
            : undefined
        }
      >
        <div className={containerStyle}>
          {title && (
            <h3
              className={styles.modalTitle}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(title),
              }}
            ></h3>
          )}
          <div className={styles.modalContent}>{children}</div>
          {showCloseBottom && (
            <button className={styles.btnClose} type="button" onClick={onClose}>
              닫기
            </button>
          )}
        </div>
      </ReactModal>
    </>
  );
};

const classNameMaker = (prefix: string, name: string) => {
  let transformString = '';
  name.split(' ').forEach((token: string) => {
    transformString += `${prefix}${token.substr(0, 1).toUpperCase()}${token.substr(1)}`;
  });
  return transformString.replace(/\s$/, '');
};

export default MzModal;
