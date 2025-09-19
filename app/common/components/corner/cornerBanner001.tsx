import React from 'react';
import styles from './cornerBanner001.module.scss';

interface CornerBanner001Props {
  type: 'image' | 'text';
  title: string;
  subTitle: string;
  image: string;
}

export default function CornerBanner001({ type, title, subTitle, image }: CornerBanner001Props) {
  return (
    <div className={styles.cornerBanner} style={{ backgroundImage: `url(${image})` }}>
      <div className={styles.dimmed} />
      <div className={styles.texts}>
        {type === 'image' && <h2 className={styles.title}><img src={title} alt={title} /></h2>}
        {type === 'text' && <h2 className={styles.title}>{title}</h2>}
        <p
          className={styles.subTitle}
          dangerouslySetInnerHTML={{
            __html: subTitle.replace(/\n/g, '<br />')
          }}
        />
      </div>
    </div>
  );
} 