"use client";
import React, { useState } from "react";
import styles from "./mzFaq.module.scss";

interface FaqItem {
  question: string;
  answer: string;
}

interface MzFaqProps {
  items: FaqItem[];
}

const MzFaq: React.FC<MzFaqProps> = ({ items }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className={styles.faqWrapper}>
      <ol className={styles.faqList}>
        {items.map((item, idx) => (
          <li key={idx} className={styles.faqItem}>
            <button
              className={styles.question}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              {item.question}
            </button>
            {openIdx === idx && (
              <div className={styles.answer}>{item.answer}</div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default MzFaq;
