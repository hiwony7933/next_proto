import React from 'react';
import styles from './cornerCategory001.module.scss';

interface CategoryItem {
  title: string;
  subTitle: string;
  image: string;
  link: string;
}

interface CornerCategory001Props {
  items: CategoryItem[];
}

export default function CornerCategory001({ items }: CornerCategory001Props) {
  return (
    <ol className={styles.categoryList}>
      {items.map((item, idx) => (
        <li key={idx}>
          <a href={item.link} className={styles.link}>
            <img src={item.image} alt={item.title} className={styles.image} />
            <div className={styles.texts}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.subTitle}>{item.subTitle}</span>
            </div>
          </a>
        </li>
      ))}
    </ol>
  );
} 