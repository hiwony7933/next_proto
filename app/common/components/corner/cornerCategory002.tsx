import React from 'react';
import styles from './cornerCategory002.module.scss';

interface CategoryItem {
  title: string;
  subTitle: string;
  image: string;
  link: string;
}

interface CornerCategory002Props {
  items: CategoryItem[];
}

export default function CornerCategory002({ items }: CornerCategory002Props) {
  return (
    <ol className={styles.categoryList}>
      {items.map((item, idx) => (
        <li key={idx}>
          <a href={item.link} className={styles.link}>
            <div className={styles.texts}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.subTitle}>{item.subTitle}</span>
            </div>
            <img src={item.image} alt={item.title} className={styles.image} />
          </a>
        </li>
      ))}
    </ol>
  );
} 