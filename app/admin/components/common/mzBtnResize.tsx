import React, { useState, useRef, useEffect } from 'react';
import styles from './mzBtnResize.module.scss';

interface MzBtnResizeProps {
  title?: string;
  /** 리사이즈 방향 - horizontal: 가로, vertical: 세로 */
  direction?: 'horizontal' | 'vertical';
  /** 초기 width 값 (px) - direction이 horizontal일 때 */
  initialWidth?: number;
  /** 최소 width 값 (px) */
  minWidth?: number;
  /** 최대 width 값 (px) */
  maxWidth?: number;
  /** width 변경 시 호출되는 콜백 함수 */
  onWidthChange?: (width: number) => void;
  /** 초기 height 값 (px) - direction이 vertical일 때 */
  initialHeight?: number;
  /** 최소 height 값 (px) */
  minHeight?: number;
  /** 최대 height 값 (px) */
  maxHeight?: number;
  /** height 변경 시 호출되는 콜백 함수 */
  onHeightChange?: (height: number) => void;
  /** 버튼에 적용할 className */
  className?: string;
  /** 버튼에 적용할 추가 스타일 */
  style?: React.CSSProperties;
  /** 버튼 텍스트 표시 여부 */
  showText?: boolean;
  /** 커스텀 버튼 텍스트 */
  buttonText?: string;
}

export default function MzBtnResize({
  title = '드레그리사이즈',
  direction = 'horizontal',
  initialWidth,
  minWidth = 100,
  maxWidth = 600,
  onWidthChange,
  initialHeight,
  minHeight = 200,
  maxHeight = 800,
  onHeightChange,
  className = 'btnColResize',
  style = {},
  showText = true,
  buttonText
}: MzBtnResizeProps) {
  const [isDragging, setIsDragging] = useState(false);

  const isHorizontal = direction === 'horizontal';
  const currentValue = isHorizontal ? initialWidth : initialHeight;
  const minValue = isHorizontal ? minWidth : minHeight;
  const maxValue = isHorizontal ? maxWidth : maxHeight;
  const changeCallback = isHorizontal ? onWidthChange : onHeightChange;

  const dragStateRef = useRef({
    isDragging: false,
    startPos: 0,
    startValue: 0
  });

  // 드래그 중 핸들러
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStateRef.current.isDragging || !changeCallback) return;

    const currentPos = isHorizontal ? e.clientX : e.clientY;
    const delta = currentPos - dragStateRef.current.startPos;
    const newValue = Math.max(
      minValue,
      Math.min(maxValue, dragStateRef.current.startValue + delta)
    );

    changeCallback(newValue);
  };

  // 드래그 종료 핸들러
  const handleMouseUp = () => {
    if (!dragStateRef.current.isDragging) return;

    dragStateRef.current.isDragging = false;
    setIsDragging(false);

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    console.log('드래그 종료');
  };

  // 드래그 시작 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentValue || !changeCallback) return;

    console.log('드래그 시작', { currentValue, [isHorizontal ? 'clientX' : 'clientY']: isHorizontal ? e.clientX : e.clientY });

    dragStateRef.current.startPos = isHorizontal ? e.clientX : e.clientY;
    dragStateRef.current.startValue = currentValue;
    dragStateRef.current.isDragging = true;
    setIsDragging(true);

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });
  };

  // 컴포넌트 언마운트 시 이벤트 리스너 정리
  useEffect(() => {
    return () => {
      if (dragStateRef.current.isDragging) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);

  const displayText = buttonText || `${title} (현재: ${currentValue || 0}px)`;
  const cursor = isHorizontal ? 'ew-resize' : 'ns-resize';

  return (
    <button
      type="button"
      className={`${styles.mzBtnResize} ${isHorizontal ? `${styles.ewResize}` : `${styles.nsResize}`}`}
      onMouseDown={handleMouseDown}
      style={{
        cursor,
        userSelect: 'none',
        touchAction: 'none', // 터치 디바이스에서 스크롤 방지
        ...style
      }}
    >
      {showText ? displayText : ''}
    </button>
  );
}
