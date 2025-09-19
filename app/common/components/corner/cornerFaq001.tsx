import React, { useState } from 'react';
import styles from './cornerFaq001.module.scss';

type FaqItem = { title: string; html: string; };

type Props = {
  items: FaqItem[];
  wrapClassName?: string;
  itemClassName?: string;
  questionClassName?: string;
  answerClassName?: string;
  multiOpen?: boolean; // true: 여러개, false: 하나만
};

export default function CornerFaq001({
  items,
  wrapClassName = 'faqType01',
  itemClassName = styles.faqItem,
  questionClassName = styles.question,
  answerClassName = styles.answer,
  multiOpen = false,
}: Props) {
  // multiOpen: 여러개 열기, 아니면 하나만
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const handleClick = (idx: number) => {
    if (multiOpen) {
      setOpenIndexes(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndexes(prev => (prev[0] === idx ? [] : [idx]));
    }
  };

  console.log('FAQ items', items);

  return (
    <div className={styles.faqContainer}>
      <h4>FAQ</h4>
      <ol className={`${styles[wrapClassName]} ${styles.faqWrap}`}>
        {items.map((item, idx) => (
          <li key={idx} className={itemClassName}>
            <button
              className={`${questionClassName} ${openIndexes.includes(idx) ? styles.open : ''}`}
              onClick={() => handleClick(idx)}
            >
              {item.title}
            </button>
            {openIndexes.includes(idx) && (
              <div className={`${styles.answerText}`} dangerouslySetInnerHTML={{ __html: item.html }} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
} 