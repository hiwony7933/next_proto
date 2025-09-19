'use client';
import React, { useState } from 'react';
import styles from './mzFaq.module.scss';

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
      {items.map((item, idx) => (
        <div key={idx} className={styles.faqItem}>
          <div className={styles.question} onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
            {item.question}
          </div>
          {openIdx === idx && <div className={styles.answer}>{item.answer}</div>}
        </div>
      ))}
    </div>
  );
};

export default MzFaq;
