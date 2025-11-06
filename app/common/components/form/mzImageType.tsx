import React, { useState, useEffect } from "react";
import MzSelectBox from "../atom/mzSelectBox";
import styles from "./mzImageType.module.scss";

/**
 * 이미지 타입 선택 컴포넌트
 * - URL: 이미지 주소 입력
 * - upload: 파일 업로드
 */
export default function MzImageType({
  value,
  type: propType,
  onChange,
}: {
  value?: string;
  type?: "URL" | "upload";
  onChange?: (value: string) => void;
}) {
  const [type, setType] = useState<"URL" | "upload">(propType || "URL");
  const [url, setUrl] = useState(value || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value || "");

  // value, type prop이 바뀌면 내부 상태 동기화
  useEffect(() => {
    if (value !== undefined) {
      setUrl(value);
      setPreviewUrl(value);
      setFile(null);
    }
    if (propType) {
      setType(propType);
    }
  }, [value, propType]);

  // 타입 변경 핸들러
  const handleTypeChange = (v: string) => {
    setType(v as "URL" | "upload");
    // 타입 변경 시 값 초기화
    setUrl("");
    setFile(null);
    setPreviewUrl("");
    onChange?.("");
  };

  // URL 입력 핸들러
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setPreviewUrl(e.target.value);
    onChange?.(e.target.value);
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const blobUrl = URL.createObjectURL(f);
      setPreviewUrl(blobUrl);
      onChange?.(f.name);
    } else {
      setPreviewUrl("");
      onChange?.("");
    }
  };

  return (
    <div className={styles.mzImageType}>
      <div className={styles.form}>
        <MzSelectBox
          options={["URL", "upload"].map((o) => ({ label: o, value: o }))}
          selected={type}
          onSelect={(v: string) => handleTypeChange(v as "URL" | "upload")}
          style={{ width: 100 }}
        />
        {type === "URL" ? (
          <input
            type="text"
            placeholder="이미지 주소 입력"
            value={url}
            onChange={handleUrlChange}
            className="urlInput"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="fileInput"
          />
        )}
      </div>
      <div className={styles.preview}>
        {previewUrl && <img src={previewUrl} alt="preview" />}
      </div>
    </div>
  );
}
