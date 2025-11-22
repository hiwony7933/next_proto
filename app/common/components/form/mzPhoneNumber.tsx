import React from "react";
import MzInputText from "../atom/mzInputText";
import MzSelectBox from "../atom/mzSelectBox";
import styles from "./mzPhoneNumber.module.scss";

export type PhoneType = "Phone" | "Mobile";

export type PhoneNumberValue = {
  prefix: string;
  middle: string;
  last: string;
};

interface MzPhoneNumberProps {
  inputSplit: "combined" | "separated";
  type: PhoneType;
  value: PhoneNumberValue;
  onChange: (value: PhoneNumberValue) => void;
}

const phoneOptions: Record<PhoneType, string[]> = {
  Phone: ["02", "031", "032", "051"],
  Mobile: ["010", "011", "016", "017", "018", "019"],
};

export const MzPhoneNumber: React.FC<MzPhoneNumberProps> = ({
  inputSplit,
  type,
  value,
  onChange,
}) => {
  const options = phoneOptions[type] ?? [];

  const handlePartChange =
    (key: keyof PhoneNumberValue) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val =
        key === "prefix"
          ? e.target.value
          : e.target.value.replace(/[^0-9]/g, "");
      onChange({ ...value, [key]: val });
    };

  const handleCombinedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 11);
    const prefix = onlyNumbers.slice(0, 3);
    const middle = onlyNumbers.slice(3, 7);
    const last = onlyNumbers.slice(7, 11);
    onChange({ prefix, middle, last });
  };

  const combinedValue = `${value.prefix}${value.middle}${value.last}`;

  return (
    <div className={styles.phoneNumberWrapper}>
      {inputSplit === "separated" ? (
        <>
          <MzSelectBox
            options={options.map((o) => ({ label: o, value: o }))}
            selected={value.prefix}
            onSelect={(v: string) =>
              handlePartChange("prefix")({
                target: { value: v },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          />
          <span className={styles.hyphen}>-</span>
          <MzInputText
            className={styles.separated}
            type="text"
            maxLength={4}
            value={value.middle}
            onChange={handlePartChange("middle")}
          />
          <span className={styles.hyphen}>-</span>
          <MzInputText
            className={styles.separated}
            type="text"
            maxLength={4}
            value={value.last}
            onChange={handlePartChange("last")}
          />
        </>
      ) : (
        <MzInputText
          className={styles.combined}
          type="text"
          placeholder="숫자만 입력 (예: 01012345678)"
          maxLength={11}
          value={combinedValue}
          onChange={handleCombinedChange}
        />
      )}
    </div>
  );
};

export default MzPhoneNumber;
