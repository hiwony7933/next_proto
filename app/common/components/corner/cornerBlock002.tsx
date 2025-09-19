import React from 'react';
import styles from './cornerBlock002.module.scss';

interface BlockItem {
  title: string;
  desc: string;
  imgUrl: string;
  subImgUrl: string;
}

interface CornerBlock002Props {
  data: {
    title: string;
    desc: string;
    imageList: BlockItem[];
  };
}

const CornerBlock002 = ({ data }: CornerBlock002Props) => {
  const item = data.imageList[0];
  return (
    <div className={styles.cornerBlock001}>
      <h4>{item.title}</h4>
      <div className={styles.dec}>{item.desc}</div>
      <picture>
        <source media="(max-width: 767px)" srcSet={item.subImgUrl} />
        <img src={item.imgUrl} alt={item.title} className={styles['cctv-process-image']} />
      </picture>
    </div>
  );
};

export default CornerBlock002;
