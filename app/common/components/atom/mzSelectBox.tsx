"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import S from "./mzSelectBox.module.scss";

type Option = { label: string; value: string; disabled?: boolean };

type Props = {
  style?: React.CSSProperties;
  options: Option[];
  selected?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  errorText?: string; // 벨리데이션 로직 없이 스타일만 적용
  id?: string;
  name?: string;
  className?: string;
  borderless?: boolean;
  nood?: boolean;
};

export default function MzSelectBox({
  style,
  options,
  selected,
  onSelect,
  placeholder = "선택하세요",
  disabled = false,
  errorText,
  id,
  name,
  className = "",
  borderless = false,
  nood = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === selected),
    [options, selected]
  );
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const isPlaceholder = !selectedOption;

  const panelId = useMemo(
    () => `${id || name || "mzSelectBox"}-panel`,
    [id, name]
  );

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const optionsNodes = listRef.current?.querySelectorAll(
      `.${S.mzSelectBox__option}`
    );
    if (!optionsNodes || activeIndex < 0 || activeIndex >= optionsNodes.length)
      return;
    const el = optionsNodes[activeIndex] as HTMLElement;
    el?.focus();
  }, [open, activeIndex, S.mzSelectBox__option]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

  const handleSelect = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    onSelect(opt.value);
    setOpen(false);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((prev) => {
        if (prev === -1) return selectedIndex >= 0 ? selectedIndex : 0;
        const next = e.key === "ArrowDown" ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(options.length - 1, next));
      });
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => Math.min(options.length - 1, idx + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max(0, idx - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeIndex >= 0) handleSelect(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={style}
      className={
        `${S.mzSelectBox} ${className} ` +
        `${open ? S.mzSelectBoxOpen : ""} ` +
        `${disabled ? S.mzSelectBoxDisabled : ""} ` +
        `${errorText ? S.mzSelectBoxError : ""} ` +
        `${errorText ? S.mzSelectBoxRequired : ""} ` +
        `${borderless ? S.borderless : ""}` +
        `${nood ? S.nood : ""}`
      }
      aria-disabled={disabled || undefined}
    >
      <button
        id={id}
        name={name}
        type="button"
        className={`${S.mzSelectBox__button} ${isPlaceholder ? S.mzSelectBox__buttonPlaceholder : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        aria-invalid={errorText ? true : undefined}
        aria-required={errorText ? true : undefined}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleButtonKeyDown}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <i
          className={`${S.mzSelectBox__button__arrow} ${
            open
              ? S.mzSelectBox__button__arrowUp
              : S.mzSelectBox__button__arrowDown
          }`}
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="listbox"
          ref={listRef}
          className={S.mzSelectBox__panel}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {options.map((opt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                className={`${S.mzSelectBox__option} ${isSelected ? S.mzSelectBox__optionSelected : ""} ${opt.disabled ? S.mzSelectBox__optionDisabled : ""}`}
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className={S.mzSelectBox__optionLabel}>{opt.label}</span>
                {isSelected && <i className="icon__14_check" />}
              </div>
            );
          })}
        </div>
      )}

      {errorText && (
        <p className={S.mzSelectBox__errorText} role="alert">
          {errorText}
        </p>
      )}
    </div>
  );
}
