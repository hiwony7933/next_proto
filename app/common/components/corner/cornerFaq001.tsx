import React, { useState } from "react";
import styles from "./cornerFaq001.module.scss";

type FaqItem = { question: string; category: string; answer: string };

type Props = {
  items: FaqItem[];
  wrapClassName?: string;
  itemClassName?: string;
  questionClassName?: string;
  categoryClassName?: string;
  answerClassName?: string;
  multiOpen?: boolean; // true: 여러개, false: 하나만
  totalVisible?: boolean; // 총 개수 표시 여부
  totalPrefix?: string; // 총 앞 텍스트(예: '총', '보안검색결과')
  totalUnit?: string; // 단위 텍스트(예: '개', '건', '회')
};

export default function CornerFaq001({
  items,
  wrapClassName = "faqType01",
  itemClassName = styles.faqItem,
  questionClassName = styles.question,
  categoryClassName = styles.category,
  answerClassName = styles.answerText,
  multiOpen = false,
  totalVisible = true,
  totalPrefix = "총",
  totalUnit = "개",
}: Props) {
  // multiOpen: 여러개 열기, 아니면 하나만
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const handleClick = (idx: number) => {
    if (multiOpen) {
      setOpenIndexes((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndexes((prev) => (prev[0] === idx ? [] : [idx]));
    }
  };

  console.log("FAQ items", items);

  return (
    <div className={styles.faqContainer}>
      <h4>FAQ</h4>
      {/* Total에 대한 대표 스타일 적용필요할듯.. */}
      {totalVisible && (
        <div className={styles.faqTotal}>
          {totalPrefix} {items.length}
          {totalUnit}
        </div>
      )}
      <ol className={`${styles[wrapClassName]} ${styles.faqWrap}`}>
        {items.map((item, idx) => (
          <li key={idx} className={itemClassName}>
            <div className={styles.questionWrap}>
              {item.category && item.category.trim() !== "" && (
                <div className={categoryClassName}>{item.category}</div>
              )}
              <button
                className={`${questionClassName} ${openIndexes.includes(idx) ? styles.open : ""}`}
                onClick={() => handleClick(idx)}
              >
                {item.question}
              </button>
            </div>
            {openIndexes.includes(idx) && (
              <div
                className={`${answerClassName}`}
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
