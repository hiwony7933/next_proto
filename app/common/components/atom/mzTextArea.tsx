import React, { useState, useRef, useEffect } from "react";
import MzEditor from "../form/mzEditor";
import styles from "./mzTextArea.module.scss";

export interface MzTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement> | string) => void;
  type?: "normal" | "editor";
  count?: "YES" | "NO";
  maxBite?: number;
  minBite?: number;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  height?: string;
  resize?: "none" | "vertical";
}

// 바이트 계산 함수 (UTF-8 기준)
function getByteLength(str: string) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    byte += ch <= 0x007f ? 1 : ch <= 0x07ff ? 2 : 3;
  }
  return byte;
}

export default function MzTextArea({
  value,
  onChange,
  type = "normal",
  count = "NO",
  maxBite,
  minBite,
  placeholder = "",
  className = "",
  style = {},
  height = "300px",
  id,
  resize = "vertical",
}: MzTextAreaProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [byte, setByte] = useState(getByteLength(value));
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setInternalValue(value);
    setByte(getByteLength(value));
  }, [value]);

  // 바이트 제한 처리
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    let b = getByteLength(val);
    if (maxBite && b > maxBite) {
      // maxBite 초과 시 잘라냄
      let cut = "";
      let total = 0;
      for (let i = 0; i < val.length; i++) {
        const ch = val.charCodeAt(i);
        const add = ch <= 0x007f ? 1 : ch <= 0x07ff ? 2 : 3;
        if (total + add > maxBite) break;
        cut += val[i];
        total += add;
      }
      val = cut;
      b = getByteLength(val);
    }
    setInternalValue(val);
    setByte(b);
    onChange(e);
  };

  // normal 타입
  if (type === "normal") {
    return (
      <div className={`${className} ${styles.mzTextArea}`}>
        <textarea
          id={id}
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ height, ...style }}
          className={resize === "none" ? `${styles.resizeNone}` : ""}
        />
        {count === "YES" && (
          <div className={`${styles.byteCount}`}>
            <em className={byte < (minBite || 0) ? "" : `${styles.red}`}>
              {byte} byte
            </em>
            {maxBite ? ` / ${maxBite} byte` : ""}
          </div>
        )}
      </div>
    );
  }

  // editor 타입 (MzEditor)
  return (
    <div className={`${className} ${styles.mzTextArea}`}>
      <MzEditor
        content={internalValue}
        editorRef={editorRef}
        mode="edit"
        height={height}
      />
      {count === "YES" && (
        <div
          className={`${styles.byteCount} ${byte < (minBite || 0) ? "red" : undefined}`}
        >
          <em className={byte < (minBite || 0) ? "" : `${styles.red}`}>
            {byte} byte
          </em>
          {maxBite ? ` / ${maxBite} byte` : ""}
        </div>
      )}
    </div>
  );
}
