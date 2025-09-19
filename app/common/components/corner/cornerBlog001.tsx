import React from 'react';
import styles from './cornerBlog001.module.scss';

interface BlogItem {
  image: string;
  title: string;
  description: string;
}

interface CornerBlog001Props {
  items: BlogItem[];
}

export default function CornerBlog001({ items }: CornerBlog001Props) {
  return (
    <dl className={styles.blogList}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.blogItem}>
          <dt><img src={item.image} alt={item.title} className={styles.image} /></dt>
          <dd>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.description}>{item.description}</div>
          </dd>
        </div>
      ))}
    </dl>
  );
} 